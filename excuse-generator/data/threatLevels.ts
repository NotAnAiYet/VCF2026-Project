export type ThreatLevel = "mild" | "moderate" | "defcon1" | "funny";

export const THREAT_LEVELS: { value: ThreatLevel; label: string }[] = [
  { value: "mild", label: "Mild" },
  { value: "moderate", label: "Moderate" },
  { value: "defcon1", label: "DEFCON 1" },
  { value: "funny", label: "Funny" },
];

export const THREAT_ACTIVE_CLASS: Record<ThreatLevel, string> = {
  mild: "bg-[#FFE600] text-black",
  moderate: "bg-[#FF9900] text-black",
  defcon1: "bg-[#FF2A2A] text-white",
  funny: "bg-[#00C2FF] text-black",
};
