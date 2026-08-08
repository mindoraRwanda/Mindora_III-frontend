"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
// keep only the ones whose recordedAt falls on today's *local* calendar date,
// per the server-computed localDate (avoids re-deriving timezone math here).
function isOnLocalDate(iso: string, localDate: string, timezone: string): boolean {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: timezone }) === localDate;
}

export function TodaysCheckIns({ editingId, onEdit }: TodaysCheckInsProps) {
  const { data: today } = useMoodToday();
  const { data: history } = useMoodHistory({ limit: 10 });
  const [deleteTarget, setDeleteTarget] = useState<MoodEntry | null>(null);

  if (!today) return null;

  const todaysEntries = (history?.entries ?? []).filter((entry) =>
    isOnLocalDate(entry.recordedAt, today.localDate, today.timezone)
  );

  if (todaysEntries.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-[15px] font-bold text-foreground">Today&apos;s check-ins</h2>
      <div className="overflow-hidden rounded-2xl border border-border">
        {todaysEntries.map((entry) => (
          <div
            key={entry.id}
            className={cn(
              "flex items-center gap-4 border-b border-border px-5 py-3.5 last:border-b-0",
              editingId === entry.id && "bg-mindora-purple-pale/40"
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mindora-purple-pale text-[13px] font-bold text-mindora-purple">
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
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Edit check-in"
              onClick={() => onEdit(entry)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Delete check-in"
              onClick={() => setDeleteTarget(entry)}
            >
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
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
