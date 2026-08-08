"use client";

import { MoodSlider } from "@/components/check-in/MoodSlider";
import { EmotionTags } from "@/components/check-in/EmotionTags";

const JOURNAL_MAX_LENGTH = 5000;

export interface MoodFieldsValue {
  mood: number;
  stress: number;
  sleep: number;
  energy: number;
  emotions: string[];
  journalNote: string;
}

// Bottom of each slider's own range, not a guessed "typical" value - a fresh
// check-in shouldn't look like it already has an opinion about how the user
// is doing before they've touched anything.
export const DEFAULT_MOOD_FIELDS: MoodFieldsValue = {
  mood: 1,
  stress: 1,
  sleep: 0,
  energy: 1,
  emotions: [],
  journalNote: "",
};

interface MoodEntryFieldsProps {
  value: MoodFieldsValue;
  onChange: (value: MoodFieldsValue) => void;
}

// Shared slider/emotion/journal block reused by the main check-in form (new
// entries), its edit mode, and the backfill dialog - keeps all three visually
// and behaviourally identical instead of drifting apart.
export function MoodEntryFields({ value, onChange }: MoodEntryFieldsProps) {
  function set<K extends keyof MoodFieldsValue>(key: K, next: MoodFieldsValue[K]) {
    onChange({ ...value, [key]: next });
  }

  return (
    <>
      <div className="space-y-7">
        <MoodSlider
          label="Mood"
          value={value.mood}
          min={1}
          max={10}
          valueLabel={`${value.mood}/10`}
          lowLabel="Low"
          highLabel="Great"
          onChange={(v) => set("mood", v)}
        />
        <MoodSlider
          label="Stress"
          value={value.stress}
          min={1}
          max={5}
          valueLabel={`${value.stress}/5`}
          lowLabel="Calm"
          highLabel="Tense"
          onChange={(v) => set("stress", v)}
        />
        <MoodSlider
          label="Sleep"
          value={value.sleep}
          min={0}
          max={12}
          step={0.5}
          valueLabel={`${value.sleep} hrs`}
          lowLabel="0h"
          highLabel="12h"
          onChange={(v) => set("sleep", v)}
        />
        <MoodSlider
          label="Energy"
          value={value.energy}
          min={1}
          max={10}
          valueLabel={`${value.energy}/10`}
          lowLabel="Drained"
          highLabel="Energized"
          onChange={(v) => set("energy", v)}
        />
      </div>

      <EmotionTags selected={value.emotions} onChange={(e) => set("emotions", e)} />

      <div className="space-y-2">
        <label htmlFor="journal" className="text-[14px] font-medium text-foreground">
          Journal note <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="journal"
          rows={4}
          maxLength={JOURNAL_MAX_LENGTH}
          value={value.journalNote}
          onChange={(e) => set("journalNote", e.target.value)}
          placeholder="What's on your mind today?"
          className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground focus-visible:border-mindora-purple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mindora-purple/30"
        />
        <p className="text-right text-[11px] text-muted-foreground">
          {value.journalNote.length}/{JOURNAL_MAX_LENGTH}
        </p>
      </div>
    </>
  );
}
