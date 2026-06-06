import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(request: Request) {
  const { input } = await request.json();

  if (!input?.trim()) {
    return Response.json({ title: input, due_date: null });
  }

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Europe/London",
  });

  const message = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: `Today is ${today}. Parse this life admin task: "${input}"

Return JSON only, no other text:
{"title":"<clean task title without date references>","due_date":"<YYYY-MM-DD or null>"}

Examples:
"dentist appointment 15th July" → {"title":"Dentist appointment","due_date":"2026-07-15"}
"renew car insurance before September" → {"title":"Renew car insurance","due_date":"2026-09-01"}
"call the bank next week" → {"title":"Call the bank","due_date":"${new Date(Date.now() + 7 * 86400000).toLocaleDateString("en-CA", { timeZone: "Europe/London" })}"}
"buy milk" → {"title":"Buy milk","due_date":null}`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text.trim() : "";

  try {
    const parsed = JSON.parse(text);
    return Response.json({
      title: parsed.title || input,
      due_date: parsed.due_date || null,
    });
  } catch {
    return Response.json({ title: input, due_date: null });
  }
}
