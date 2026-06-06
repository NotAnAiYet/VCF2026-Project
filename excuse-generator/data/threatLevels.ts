export type ThreatLevel = "mild" | "moderate" | "defcon1" | "funny";

export interface ThreatLevelDef {
  value: ThreatLevel;
  label: string;
  /** Shown in the UI as a subtitle under the button */
  description: string;
  /** Injected into the AI system prompt to shape urgency and tone */
  instruction: string;
  /** Tailwind classes applied to the active button */
  activeClass: string;
}

export const THREAT_LEVELS: ThreatLevelDef[] = [
  {
    value: "mild",
    label: "Mild",
    description: "Low-drama, easy to accept",
    instruction: "Keep the tone light and professional. The excuse should be low-drama and easy to accept.",
    activeClass: "bg-[#FFE600] text-black",
  },
  {
    value: "moderate",
    label: "Moderate",
    description: "Real but not over the top",
    instruction: "Use natural, conversational language. The excuse should feel real but not overly dramatic.",
    activeClass: "bg-[#FF9900] text-black",
  },
  {
    value: "defcon1",
    label: "DEFCON 1",
    description: "Last-resort emergency escape",
    instruction: "The excuse must sound urgent and serious — this is a last-resort escape. High drama, still plausible.",
    activeClass: "bg-[#FF2A2A] text-white",
  },
  {
    value: "funny",
    label: "Funny",
    description: "Absurd, delivered with sincerity",
    instruction: "Make the excuse absurdly funny — over-the-top, ridiculous, but delivered with complete sincerity. Comedy gold.",
    activeClass: "bg-[#00C2FF] text-black",
  },
];
