"use client";

import { useState } from "react";
import { Pencil, RefreshCw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMoodHistory, useMoodToday } from "@/hooks/useMood";
import { DeleteMoodEntryDialog } from "@/components/check-in/DeleteMoodEntryDialog";
import type { MoodEntry } from "@/types/domain";

interface TodaysCheckInsProps {
  editingId: string | null;
  onEdit: (entry: MoodEntry) => void;
}

// GET /today only returns the single most recent entry - to list every entry
// logged for today (for edit/delete), pull the recent page from /history and
// keep only the ones whose recordedAt falls on today's local calendar date.
function isOnLocalDate(iso: string, localDate: string, timezone: string): boolean {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: timezone }) === localDate;
}

export function TodaysCheckIns({ editingId, onEdit }: TodaysCheckInsProps) {
  const {
    data: today,
    isLoading: todayLoading,
    isError: todayError,
    refetch: refetchToday,
  } = useMoodToday();
  const {
    data: history,
    isLoading: historyLoading,
    isError: historyError,
    refetch: refetchHistory,
  } = useMoodHistory({ limit: 10 });
  const [deleteTarget, setDeleteTarget] = useState<MoodEntry | null>(null);

  if (todayLoading || historyLoading) {
    return (
      <div
        role="status"
        className="rounded-[24px] bg-white px-5 py-5 text-[13px] text-muted-foreground shadow-[10px_10px_22px_#cbc4de,-10px_-10px_22px_#fdfbff]"
      >
        Loading today&apos;s saved check-ins…
      </div>
    );
  }

  if (todayError || historyError || !today) {
    return (
      <div className="rounded-[24px] bg-white p-5 shadow-[10px_10px_22px_#cbc4de,-10px_-10px_22px_#fdfbff]">
        <h2 className="text-[15px] font-bold text-foreground">Today&apos;s check-ins</h2>
        <p className="mt-2 text-[13px] leading-5 text-muted-foreground">
          We couldn&apos;t load your saved check-ins just now. Your entries have not been deleted.
          Please try again.
        </p>
        <button
          type="button"
          onClick={() => {
            void Promise.all([refetchToday(), refetchHistory()]);
          }}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-mindora-purple px-4 py-2 text-[12px] font-semibold text-white hover:bg-mindora-purple-dark"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </button>
      </div>
    );
  }

  const todaysEntries = (history?.entries ?? []).filter((entry) =>
    isOnLocalDate(entry.recordedAt, today.localDate, today.timezone)
  );

  if (todaysEntries.length === 0) {
    return (
      <section
        aria-live="polite"
        className="rounded-[24px] bg-white p-5 shadow-[10px_10px_22px_#cbc4de,-10px_-10px_22px_#fdfbff]"
      >
        <h2 className="text-[15px] font-bold text-foreground">Today&apos;s check-ins</h2>
        <p className="mt-2 text-[13px] leading-5 text-muted-foreground">
          You haven&apos;t saved a check-in today yet. Once you save your mood above, it will appear
          here so you can review, edit or delete it.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-[15px] font-bold text-foreground">Today&apos;s check-ins</h2>
      <div className="overflow-hidden rounded-[26px] bg-white p-2 shadow-[10px_10px_22px_#cbc4de,-10px_-10px_22px_#fdfbff]">
        {todaysEntries.map((entry) => (
          <div
            key={entry.id}
            className={cn(
              "flex items-center gap-4 rounded-[18px] px-3.5 py-3.5",
              editingId === entry.id &&
                "shadow-[inset_3px_3px_7px_#cdc6e0,inset_-3px_-3px_7px_#fdfbff]"
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mindora-purple-pale text-[13px] font-bold text-mindora-purple shadow-[2px_2px_5px_#c6bade,-2px_-2px_5px_#fdfbff]">
              {entry.moodScore}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-medium text-foreground">
                {new Date(entry.recordedAt).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
              {entry.emotions.length > 0 && (
                <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                  {entry.emotions.join(", ")}
                </p>
              )}
            </div>
            <button
              type="button"
              aria-label="Edit check-in"
              onClick={() => onEdit(entry)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-foreground/70 shadow-[3px_3px_7px_#cdc6e0,-3px_-3px_7px_#fdfbff]"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label="Delete check-in"
              onClick={() => setDeleteTarget(entry)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-destructive shadow-[3px_3px_7px_#cdc6e0,-3px_-3px_7px_#fdfbff]"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      <DeleteMoodEntryDialog
        entry={deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      />
    </div>
  );
}
