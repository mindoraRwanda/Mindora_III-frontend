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

export interface MoodEntry {
  id: string;
  moodScore: number;
  stressLevel: number;
  sleepHours: number;
  energyLevel: number;
  emotions: EmotionTag[];
  journalNote: string;
  recordedAt: string;
}

export interface WeeklyMoodPoint {
  day: string;
  mood: number;
}

export interface MoodInsights {
  weekly: WeeklyMoodPoint[];
  avgMood: number;
  avgSleep: number;
  trend: "improving" | "stable" | "declining";
}

/** Mock weekly insights — swap for GET /api/v1/mood/insights later */
export const mockMoodInsights: MoodInsights = {
  weekly: [
    { day: "Mon", mood: 6 },
    { day: "Tue", mood: 7 },
    { day: "Wed", mood: 5 },
    { day: "Thu", mood: 8 },
    { day: "Fri", mood: 7 },
    { day: "Sat", mood: 9 },
    { day: "Sun", mood: 7 },
  ],
  avgMood: 7.2,
  avgSleep: 7.4,
  trend: "improving",
};
