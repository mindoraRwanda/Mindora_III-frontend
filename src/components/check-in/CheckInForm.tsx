"use client";

import { useState } from "react";
import { MoodSlider } from "@/components/check-in/MoodSlider";
import { EmotionTags } from "@/components/check-in/EmotionTags";
import { WeeklyInsights } from "@/components/check-in/WeeklyInsights";
import { Button } from "@/components/ui/button";
import { mockMoodInsights, type EmotionTag } from "@/lib/mock-data/mood";

export function CheckInForm() {
  const [mood, setMood] = useState(7);
  const [stress, setStress] = useState(2);
  const [sleep, setSleep] = useState(7);
  const [energy, setEnergy] = useState(6);
  const [emotions, setEmotions] = useState<EmotionTag[]>(["Calm", "Hopeful"]);
  const [journalNote, setJournalNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      moodScore: mood,
      stressLevel: stress,
      sleepHours: sleep,
      energyLevel: energy,
      emotions,
      journalNote,
    };

    // UI-only for now — swap for POST /api/v1/mood/log
    console.log("Would log mood:", payload);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

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
            Mood logged — thank you for checking in today.
          </div>
        ) : null}

        <Button type="submit" className="h-12 w-full text-[15px]" disabled={isSubmitting}>
          {isSubmitting ? "Logging…" : "Log today\u2019s mood"}
        </Button>
      </form>

      <aside className="lg:pt-14">
        <WeeklyInsights insights={mockMoodInsights} />
      </aside>
    </div>
  );
}
