import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(request: Request) {
  const { input } = await request.json();

  if (!input?.trim()) {
    return Response.json({ title: input, due_date: null });
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

Task: "${input}"`,
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
