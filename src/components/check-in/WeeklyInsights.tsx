"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Moon, Smile } from "lucide-react";
import { useMoodSummary } from "@/hooks/useMood";

// bucketStart is only the first day of the (week-long) bucket - labeling the
// bar with just that date reads as a single day, not the week it summarizes.
// Spell out the full range instead, e.g. "Jul 6-12" or "Jul 30-Aug 5".
function weekRangeLabel(bucketStart: string): string {
  const start = new Date(bucketStart);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const startMonth = start.toLocaleDateString("en-US", { month: "short" });
  const endMonth = end.toLocaleDateString("en-US", { month: "short" });
  return startMonth === endMonth
    ? `${startMonth} ${start.getDate()}-${end.getDate()}`
    : `${startMonth} ${start.getDate()}-${endMonth} ${end.getDate()}`;
}

export function WeeklyInsights() {
  // /summary is the one endpoint that's documented as never zero-filling -
  // sparse ranges give sparse buckets, not fabricated entryCount: 0 weeks - so
  // this widget only ever shows weeks the user actually checked in for.
  const { data, isLoading, isError } = useMoodSummary({ granularity: "week" });

  const buckets = data?.buckets ?? [];
  const weekly = buckets.map((b) => ({
    day: weekRangeLabel(b.bucketStart),
    mood: b.avgMood,
  }));
  const avgMood = data?.avgMood ?? 0;
  const avgSleep = buckets.length
    ? buckets.reduce((sum, b) => sum + b.avgSleep, 0) / buckets.length
    : 0;

  if (isLoading) {
    return <div className="h-[420px] animate-pulse rounded-2xl border border-border bg-muted/40" />;
  }

  if (isError || buckets.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          This week
        </p>
        <h2 className="mt-1 text-[20px] font-bold tracking-tight">Weekly insights</h2>
        <p className="mt-4 text-[13.5px] text-muted-foreground">
          {isError
            ? "Could not load your insights right now."
            : "Log a few check-ins to see your weekly trend here."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        This week
      </p>
      <h2 className="mt-1 text-[20px] font-bold tracking-tight">Weekly insights</h2>

      <div className="mt-6 h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weekly} barCategoryGap="28%">
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
            />
            <YAxis
              domain={[0, 10]}
              axisLine={false}
              tickLine={false}
              width={36}
              tick={{ fill: "#9CA3AF", fontSize: 11 }}
              label={{
                value: "Avg mood",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                style: { fill: "#9CA3AF", fontSize: 11, textAnchor: "middle" },
              }}
            />
            <Tooltip
              cursor={{ fill: "rgba(124, 58, 237, 0.08)" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                fontSize: 12,
              }}
              formatter={(value) => [`${Number(value).toFixed(1)}/10`, "Avg mood"]}
            />
            <Bar
              dataKey="mood"
              name="Avg mood"
              fill="#7C3AED"
              radius={[8, 8, 0, 0]}
              activeBar={{ fill: "#5B21D0" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 space-y-4">
        <StatRow
          icon={<Smile className="h-4 w-4" />}
          label="Avg mood"
          value={`${avgMood.toFixed(1)}/10`}
        />
        <StatRow
          icon={<Moon className="h-4 w-4" />}
          label="Avg sleep"
          value={`${avgSleep.toFixed(1)} hrs`}
        />
      </div>
    </div>
  );
}

function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-t border-border pt-3 first:border-0 first:pt-0">
      <div className="flex items-center gap-2.5 text-[14px] text-muted-foreground">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mindora-purple-pale text-mindora-purple">
          {icon}
        </span>
        {label}
      </div>
      <span className="text-[14px] font-semibold text-foreground">{value}</span>
    </div>
  );
}
