export const emotionOptions = [
  "Calm",
  "Anxious",
  "Hopeful",
  "Tired",
  "Sad",
  "Energized",
  "Overwhelmed",
  "Content",
] as const;

export type EmotionTag = (typeof emotionOptions)[number];
