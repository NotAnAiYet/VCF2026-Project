export interface ExcuseFlavorDef {
  label: string;
  /** Injected into the AI system prompt to shape the style of excuse generated */
  instruction: string;
}

export const EXCUSE_FLAVORS: ExcuseFlavorDef[] = [
  {
    label: "Vaguely Medical (Non-contagious)",
    instruction: "Frame the excuse around a vague, unspecified health issue. It should sound legitimate but never name a specific illness — just enough detail to be believable without inviting follow-up questions.",
  },
  {
    label: "Family Emergency (Unspecified)",
    instruction: "Cite an urgent but unspecified family situation. Keep it vague enough that no one would press for details out of politeness.",
  },
  {
    label: "Technical Difficulties",
    instruction: "Blame technology — connectivity issues, device failures, platform outages. Should sound plausible and modern.",
  },
  {
    label: "Prior Commitment",
    instruction: "Reference a pre-existing obligation that was simply overlooked or double-booked. Apologetic but firm.",
  },
  {
    label: "Natural Disaster Adjacent",
    instruction: "Invoke weather, infrastructure, or environmental disruption nearby. Dramatic enough to be unchallengeable, but not so extreme it sounds fictional.",
  },
  {
    label: "Horsing Around",
    instruction: "Make the excuse hilarious and over-the-top. The joke should be absurd and delivered with complete sincerity. Comedy gold.",
  },
  {
    label: "Theft",
    instruction: "Theft of personal belongings or electronic devices. The excuse should be believable and sound plausible.",
  },
  {
    label: "Weather",
    instruction: "Weather-related excuses. The excuse should be believable and sound plausible.",
  },
];
