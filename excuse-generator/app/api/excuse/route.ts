import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type Tone = "formal" | "casual" | "funny";

const TONE_INSTRUCTIONS: Record<Tone, string> = {
  formal: "Use professional, polished language suitable for a work or official setting.",
  casual: "Use natural, conversational language as if texting a friend or colleague.",
  funny: "Add a light-hearted, humorous twist while still keeping the excuse believable.",
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body.situation !== "string" || !body.situation.trim()) {
    return NextResponse.json({ error: "A situation is required." }, { status: 400 });
  }

  const tone: Tone =
    body.tone && ["formal", "casual", "funny"].includes(body.tone)
      ? body.tone
      : "casual";

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured." },
      { status: 500 }
    );
  }

  const systemPrompt = `You are an expert excuse writer. The user will describe a situation. Your job is to:
- Infer the appropriate context automatically (professional, social, health-related, family, school, etc.) from what the user says.
- Write a believable, convincing excuse that fits that context perfectly.
- Output ONLY the excuse text, ready to be sent as-is — no labels, no preamble, no quotation marks.
- Keep the excuse under 80 words.
- Tone: ${tone}. ${TONE_INSTRUCTIONS[tone]}`;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.9,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: body.situation.trim() },
      ],
    });

    const excuse = completion.choices[0]?.message?.content?.trim() ?? "";

    if (!excuse) {
      return NextResponse.json({ error: "No response from AI." }, { status: 502 });
    }

    return NextResponse.json({ excuse });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to contact OpenAI.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
