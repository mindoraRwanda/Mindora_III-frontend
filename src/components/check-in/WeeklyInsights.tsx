"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Moon, Smile, TrendingUp } from "lucide-react";
import type { MoodInsights } from "@/lib/mock-data/mood";

interface WeeklyInsightsProps {
  insights: MoodInsights;
}

export function WeeklyInsights({ insights }: WeeklyInsightsProps) {
  const trendLabel =
    insights.trend === "improving"
      ? "Improving +"
      : insights.trend === "declining"
        ? "Declining"
        : "Stable";

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        This week
      </p>
      <h2 className="mt-1 text-[20px] font-bold tracking-tight">Weekly insights</h2>

      <div className="mt-6 h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={insights.weekly} barCategoryGap="28%">
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
          value={`${insights.avgMood.toFixed(1)}/10`}
        />
        <StatRow
          icon={<Moon className="h-4 w-4" />}
          label="Avg sleep"
          value={`${insights.avgSleep.toFixed(1)} hrs`}
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
