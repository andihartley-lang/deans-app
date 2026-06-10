import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const client = new Anthropic();

const MAX_INPUT_LENGTH = 500;
const MIN_WORD_COUNT = 7;
const RATE_LIMIT_MAX_CALLS = 30;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

// In-memory per-server-instance rate limit. Resets on deployment/restart and
// is not shared across server instances — acceptable at current scale.
const rateLimitState = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitState.get(userId);

  if (!entry || now >= entry.resetAt) {
    rateLimitState.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX_CALLS) {
    return true;
  }

  entry.count += 1;
  return false;
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const {
    data: { user },
    error: userError,
  } = await supabaseAuth.auth.getUser(token);

  if (userError || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isRateLimited(user.id)) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  const { input } = await request.json();
  const trimmedInput = input?.trim() ?? "";

  if (!trimmedInput) {
    return Response.json({ title: input, due_date: null });
  }

  if (trimmedInput.length > MAX_INPUT_LENGTH) {
    return Response.json({ error: "Input is too long" }, { status: 400 });
  }

  if (trimmedInput.split(/\s+/).length < MIN_WORD_COUNT) {
    return Response.json({ error: "Input is too short to need shortening" }, { status: 400 });
  }

  const message = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 64,
    messages: [
      {
        role: "user",
        content: `Shorten this life admin task to a clean, concise title (3–5 words max). Remove filler words, date references, and unnecessary detail. Return JSON only, no other text:
{"title":"<short title>"}

Examples:
"I need to book a dentist appointment for the whole family" → {"title":"Book dentist appointment"}
"renew the car insurance before it expires at the end of September" → {"title":"Renew car insurance"}
"call the bank about the issue with my account" → {"title":"Call the bank"}

Task: "${trimmedInput}"`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text.trim() : "";

  try {
    const parsed = JSON.parse(text);
    return Response.json({ title: parsed.title || input });
  } catch {
    return Response.json({ title: input });
  }
}
