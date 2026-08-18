"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Moon, Smile, TrendingUp } from "lucide-react";
import { useMoodInsights } from "@/hooks/useMood";

export function WeeklyInsights() {
  const { data, isLoading, isError } = useMoodInsights();

  const buckets = data?.buckets ?? [];
  const weekly = buckets.map((b) => ({
    day: new Date(b.bucketStart).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    mood: b.avgMood,
  }));
  const avgMood = buckets.length
    ? buckets.reduce((sum, b) => sum + b.avgMood, 0) / buckets.length
    : 0;
  const avgSleep = buckets.length
    ? buckets.reduce((sum, b) => sum + b.avgSleep, 0) / buckets.length
    : 0;
  const trend = data?.trend ?? "stable";

  const trendLabel =
    trend === "improving" ? "Improving +" : trend === "declining" ? "Declining" : "Stable";

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
            <YAxis hide domain={[0, 10]} />
            <Tooltip
              cursor={{ fill: "rgba(124, 58, 237, 0.08)" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="mood"
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
        <StatRow
          icon={<TrendingUp className="h-4 w-4 text-mindora-purple" />}
          label="Trend"
          value={trendLabel}
          valueClassName="text-mindora-purple"
        />
      </div>
    </div>
  );
}

function StatRow({
  icon,
  label,
  value,
  valueClassName,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between border-t border-border pt-3 first:border-0 first:pt-0">
      <div className="flex items-center gap-2.5 text-[14px] text-muted-foreground">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mindora-purple-pale text-mindora-purple">
          {icon}
        </span>
        {label}
      </div>
      <span className={`text-[14px] font-semibold ${valueClassName ?? "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}
