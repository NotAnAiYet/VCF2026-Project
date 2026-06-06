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
    instruction: "Reference a horse-related situation. The excuse should be believable and sound plausible.",
  },
  {
    label: "I LOVE CATS",
    instruction: "Reference a Cat-related situation. The excuse should be believable and sound plausible.",
  },
  {
    label: "I LOVE DOGS",
    instruction: "Reference a Dog-related situation. The excuse should be believable and sound plausible.",
  },
  {
    label: "Theft",
    instruction: "Theft of personal belongings or electronic devices. The excuse should be believable and sound plausible.",
  },
  {
    label: "Weather",
    instruction: "Blame the weather for the situation. The excuse should be believable and sound plausible.",
  },
];
