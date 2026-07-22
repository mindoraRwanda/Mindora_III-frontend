"use client";

import { cn } from "@/lib/utils";

interface MoodSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  valueLabel: string;
  lowLabel: string;
  highLabel: string;
  onChange: (value: number) => void;
}

export function MoodSlider({
  label,
  value,
  min,
  max,
  step = 1,
  valueLabel,
  lowLabel,
  highLabel,
  onChange,
}: MoodSliderProps) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[14px] font-medium text-foreground">{label}</label>
        <span className="text-[14px] font-semibold text-mindora-purple">{valueLabel}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          background: `linear-gradient(to right, #7c3aed 0%, #7c3aed ${percent}%, #e5e7eb ${percent}%, #e5e7eb 100%)`,
        }}
        className={cn("mood-slider accent-[#7c3aed]")}
        aria-label={label}
      />
      <div className="flex justify-between text-[12px] text-muted-foreground">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
