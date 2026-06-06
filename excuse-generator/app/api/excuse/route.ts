import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { THREAT_LEVELS } from "@/data/threatLevels";
import { EXCUSE_FLAVORS } from "@/data/excuseFlavors";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body.situation !== "string" || !body.situation.trim()) {
    return NextResponse.json({ error: "A situation is required." }, { status: 400 });
  }

  const validThreatValues = THREAT_LEVELS.map((t) => t.value);
  const threatLevelDef =
    THREAT_LEVELS.find((t) => t.value === body.threatLevel) ??
    THREAT_LEVELS.find((t) => t.value === "moderate")!;

  const flavorDef =
    EXCUSE_FLAVORS.find((f) => f.label === body.excuseFlavor) ?? null;

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured." },
      { status: 500 }
    );
  }

  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

  // suppress unused-var warning while keeping the valid-values array for future validation
  void validThreatValues;

  const flavorLine = flavorDef
    ? `\n- Excuse flavor: ${flavorDef.instruction}`
    : "";

  const systemPrompt = `You are an expert excuse writer. The user will describe a situation they want to bail out of. Your job is to:
- Write a believable, convincing excuse that fits the context perfectly.${flavorLine}
- The excuse MUST directly reference specific details from the situation the user described — do not write a generic excuse that could apply to anyone.
- Output ONLY the excuse text, ready to be sent as-is — no labels, no preamble, no quotation marks.
- Keep the excuse under 80 words.
- Urgency/tone: ${threatLevelDef.instruction}`;

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
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
      err instanceof Error ? err.message : "Failed to contact Groq.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
