"use client";

import { useState } from "react";
import { MoodSlider } from "@/components/check-in/MoodSlider";
import { EmotionTags } from "@/components/check-in/EmotionTags";
import { WeeklyInsights } from "@/components/check-in/WeeklyInsights";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";
import { useLogMood } from "@/hooks/useMood";
import { type EmotionTag } from "@/lib/mock-data/mood";

export function CheckInForm() {
  const [mood, setMood] = useState(7);
  const [stress, setStress] = useState(2);
  const [sleep, setSleep] = useState(7);
  const [energy, setEnergy] = useState(6);
  const [emotions, setEmotions] = useState<EmotionTag[]>(["Calm", "Hopeful"]);
  const [journalNote, setJournalNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const logMoodMutation = useLogMood();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(false);

    logMoodMutation.mutate(
      {
        moodScore: mood,
        stressLevel: stress,
        sleepHours: sleep,
        energyLevel: energy,
        emotions,
        journalNote: journalNote || undefined,
      },
      { onSuccess: () => setSubmitted(true) }
    );
  };

  const errorMessage =
    logMoodMutation.error instanceof ApiError
      ? logMoodMutation.error.status === 429
        ? "You've reached today's check-in limit - try again tomorrow."
        : logMoodMutation.error.message
      : logMoodMutation.isError
        ? "Could not log your mood. Please try again."
        : null;

  return (
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.75fr)]">
      <form onSubmit={onSubmit} className="space-y-8">
        <div>
          <h1 className="text-[32px] font-bold tracking-tight">Today&apos;s check-in</h1>
          <p className="mt-2 text-[14px] text-muted-foreground">
            A gentle pause to notice how you&apos;re feeling.
          </p>
        </div>

        <div className="space-y-7">
          <MoodSlider
            label="Mood"
            value={mood}
            min={1}
            max={10}
            valueLabel={`${mood}/10`}
            lowLabel="Low"
            highLabel="Great"
            onChange={setMood}
          />
          <MoodSlider
            label="Stress"
            value={stress}
            min={1}
            max={5}
            valueLabel={`${stress}/5`}
            lowLabel="Calm"
            highLabel="Tense"
            onChange={setStress}
          />
          <MoodSlider
            label="Sleep"
            value={sleep}
            min={0}
            max={12}
            step={0.5}
            valueLabel={`${sleep} hrs`}
            lowLabel="0h"
            highLabel="12h"
            onChange={setSleep}
          />
          <MoodSlider
            label="Energy"
            value={energy}
            min={1}
            max={10}
            valueLabel={`${energy}/10`}
            lowLabel="Drained"
            highLabel="Energized"
            onChange={setEnergy}
          />
        </div>

        <EmotionTags selected={emotions} onChange={setEmotions} />

        <div className="space-y-2">
          <label htmlFor="journal" className="text-[14px] font-medium text-foreground">
            Journal note <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <textarea
            id="journal"
            rows={4}
            value={journalNote}
            onChange={(e) => setJournalNote(e.target.value)}
            placeholder="What's on your mind today?"
            className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground focus-visible:border-mindora-purple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mindora-purple/30"
          />
        </div>

        {submitted ? (
          <div className="rounded-xl bg-mindora-success-bg px-4 py-3 text-[14px] font-medium text-mindora-success">
            Mood logged - thank you for checking in today.
          </div>
        ) : null}

        {errorMessage ? (
          <div className="rounded-xl bg-red-100 px-4 py-3 text-[14px] font-medium text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <Button
          type="submit"
          className="h-12 w-full text-[15px]"
          disabled={logMoodMutation.isPending}
        >
          {logMoodMutation.isPending ? "Logging…" : "Log today\u2019s mood"}
        </Button>
      </form>

      <aside className="lg:pt-14">
        <WeeklyInsights />
      </aside>
    </div>
  );
}
