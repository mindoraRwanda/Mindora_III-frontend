import { cn } from "@/lib/utils";

interface Stat {
  value: string;
  label: string;
}

interface StatStripProps {
  stats: Stat[];
  className?: string;
}

export default function StatStrip({ stats, className }: StatStripProps) {
  return (
    <div
      className={cn("grid bg-brand-600", className)}
      style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center justify-center border-r border-ink/20 px-6 py-16 text-center last:border-r-0 md:py-20"
        >
          <div className="font-display text-5xl font-bold text-paper md:text-7xl">{stat.value}</div>
          <div className="mt-3 text-xs uppercase tracking-[0.2em] text-paper/90 md:text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
