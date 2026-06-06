import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

type ThreatLevel = "mild" | "moderate" | "defcon1" | "funny";

const THREAT_INSTRUCTIONS: Record<ThreatLevel, string> = {
  mild: "Keep the tone light and professional. The excuse should be low-drama and easy to accept.",
  moderate: "Use natural, conversational language. The excuse should feel real but not overly dramatic.",
  defcon1: "The excuse must sound urgent and serious — this is a last-resort escape. High drama, still plausible.",
  funny: "Make the excuse absurdly funny — over-the-top, ridiculous, but delivered with complete sincerity. Comedy gold.",
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body.situation !== "string" || !body.situation.trim()) {
    return NextResponse.json({ error: "A situation is required." }, { status: 400 });
  }

  const threatLevel: ThreatLevel =
    body.threatLevel && ["mild", "moderate", "defcon1", "funny"].includes(body.threatLevel)
      ? body.threatLevel
      : "moderate";

  const excuseFlavor = typeof body.excuseFlavor === "string" && body.excuseFlavor.trim() ? body.excuseFlavor.trim() : null;

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured." },
      { status: 500 }
    );
  }

  const flavorLine = excuseFlavor ? `\n- Excuse flavor/type: ${excuseFlavor}` : "";

  const systemPrompt = `You are an expert excuse writer. The user will describe a situation they want to bail out of. Your job is to:
- Write a believable, convincing excuse that fits the context perfectly.${flavorLine}
- Output ONLY the excuse text, ready to be sent as-is — no labels, no preamble, no quotation marks.
- Keep the excuse under 80 words.
- Urgency/tone: ${THREAT_INSTRUCTIONS[threatLevel]}`;

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
