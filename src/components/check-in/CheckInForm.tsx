"use client";

import { useState } from "react";
import { CalendarPlus } from "lucide-react";
import {
  MoodEntryFields,
  DEFAULT_MOOD_FIELDS,
  type MoodFieldsValue,
} from "@/components/check-in/MoodEntryFields";
import { TodaysCheckIns } from "@/components/check-in/TodaysCheckIns";
import { BackfillDialog } from "@/components/check-in/BackfillDialog";
import { WeeklyInsights } from "@/components/check-in/WeeklyInsights";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";
import { useLogMood, useMoodToday, useUpdateMoodEntry } from "@/hooks/useMood";
import type { MoodEntry } from "@/types/domain";

function fieldsFromEntry(entry: MoodEntry): MoodFieldsValue {
  return {
    mood: entry.moodScore,
    stress: entry.stressLevel ?? DEFAULT_MOOD_FIELDS.stress,
    sleep: entry.sleepHours ?? DEFAULT_MOOD_FIELDS.sleep,
    energy: entry.energyLevel ?? DEFAULT_MOOD_FIELDS.energy,
    emotions: entry.emotions,
    journalNote: entry.journalNote ?? "",
  };
}

export function CheckInForm() {
  const [value, setValue] = useState<MoodFieldsValue>(DEFAULT_MOOD_FIELDS);
  const [editingEntry, setEditingEntry] = useState<MoodEntry | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [backfillOpen, setBackfillOpen] = useState(false);

  const { data: today } = useMoodToday();
  const logMoodMutation = useLogMood();
  const updateMutation = useUpdateMoodEntry();
  const activeMutation = editingEntry ? updateMutation : logMoodMutation;

  function startEdit(entry: MoodEntry) {
    setEditingEntry(entry);
    setValue(fieldsFromEntry(entry));
    setSubmitted(false);
    logMoodMutation.reset();
    updateMutation.reset();
  }

  function cancelEdit() {
    setEditingEntry(null);
    setValue(DEFAULT_MOOD_FIELDS);
    updateMutation.reset();
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(false);

    if (editingEntry) {
      updateMutation.mutate(
        {
          id: editingEntry.id,
          body: {
            moodScore: value.mood,
            stressLevel: value.stress,
            sleepHours: value.sleep,
            energyLevel: value.energy,
            emotions: value.emotions,
            // WYSIWYG: an emptied textarea means "clear the note", not "leave
            // it alone" - the field is visibly editable, so what's shown is
            // what gets saved. undefined (leave-as-is) only ever applies to
            // fields this form doesn't touch, which isn't the case here.
            journalNote: value.journalNote.trim() === "" ? null : value.journalNote,
          },
        },
        {
          onSuccess: () => {
            setSubmitted(true);
            setEditingEntry(null);
            setValue(DEFAULT_MOOD_FIELDS);
          },
        }
      );
    } else {
      logMoodMutation.mutate(
        {
          moodScore: value.mood,
          stressLevel: value.stress,
          sleepHours: value.sleep,
          energyLevel: value.energy,
          emotions: value.emotions,
          journalNote: value.journalNote || undefined,
        },
        { onSuccess: () => setSubmitted(true) }
      );
    }
  };

  // The daily-limit case isn't really a failure - the patient checked in 10
  // times today, which is engagement, not an error - so it gets its own calm
  // treatment instead of sharing the red error box with real failures.
  const dailyLimitReached =
    activeMutation.error instanceof ApiError && activeMutation.error.status === 429;

  const errorMessage =
    !dailyLimitReached && activeMutation.error instanceof ApiError
      ? activeMutation.error.message
      : !dailyLimitReached && activeMutation.isError
        ? "Could not save your check-in. Please try again."
        : null;

  const atDailyLimit = today ? today.remainingToday <= 0 : false;
  // Editing an existing entry doesn't consume a new write, so the cap only
  // blocks new check-ins and backfills, not saving edits to what's already there.
  const submitBlocked = !editingEntry && (dailyLimitReached || atDailyLimit);

  return (
    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.75fr)]">
      <div className="space-y-8">
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-[32px] font-bold tracking-tight">
                {editingEntry ? "Edit check-in" : "Today’s check-in"}
              </h1>
              <p className="mt-2 text-[14px] text-muted-foreground">
                {editingEntry
                  ? "Update this entry - editing re-runs the same wellbeing check the original logging did."
                  : "A gentle pause to notice how you’re feeling."}
              </p>
              {!editingEntry && today && (
                <p className="mt-1.5 text-[12.5px] text-muted-foreground">
                  {today.remainingToday > 0
                    ? `${today.remainingToday} check-in${today.remainingToday === 1 ? "" : "s"} left today`
                    : "You’ve reached today’s check-in limit"}
                </p>
              )}
            </div>
            {!editingEntry && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setBackfillOpen(true)}
                disabled={atDailyLimit}
              >
                <CalendarPlus className="h-3.5 w-3.5" />
                Log a missed day
              </Button>
            )}
          </div>

          <MoodEntryFields value={value} onChange={setValue} />

          {submitted ? (
            <div className="rounded-xl bg-mindora-success-bg px-4 py-3 text-[14px] font-medium text-mindora-success">
              {editingEntry === null
                ? "Mood logged - thank you for checking in today."
                : "Check-in updated."}
            </div>
          ) : null}

          {submitBlocked && !dailyLimitReached ? (
            <div className="rounded-xl bg-mindora-purple-pale px-4 py-3 text-[14px] font-medium text-mindora-purple-dark">
              You&apos;ve checked in 10 times today - that&apos;s today&apos;s limit. Come back
              tomorrow for your next one.
            </div>
          ) : null}

          {dailyLimitReached ? (
            <div className="rounded-xl bg-mindora-purple-pale px-4 py-3 text-[14px] font-medium text-mindora-purple-dark">
              You&apos;ve checked in 10 times today - that&apos;s today&apos;s limit. Come back
              tomorrow for your next one.
            </div>
          ) : null}

          {errorMessage ? (
            <div className="rounded-xl bg-red-100 px-4 py-3 text-[14px] font-medium text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex gap-3">
            {editingEntry && (
              <Button
                type="button"
                variant="outline"
                className="h-12 flex-1 text-[15px]"
                onClick={cancelEdit}
              >
                Cancel edit
              </Button>
            )}
            <Button
              type="submit"
              className="h-12 flex-1 text-[15px]"
              disabled={activeMutation.isPending || submitBlocked}
            >
              {activeMutation.isPending
                ? editingEntry
                  ? "Saving…"
                  : "Logging…"
                : submitBlocked
                  ? "Limit reached for today"
                  : editingEntry
                    ? "Save changes"
                    : "Log today’s mood"}
            </Button>
          </div>
        </form>

        <TodaysCheckIns editingId={editingEntry?.id ?? null} onEdit={startEdit} />
      </div>

      <aside className="lg:pt-14">
        <WeeklyInsights />
      </aside>

      <BackfillDialog open={backfillOpen} onOpenChange={setBackfillOpen} />
    </div>
  );
}
