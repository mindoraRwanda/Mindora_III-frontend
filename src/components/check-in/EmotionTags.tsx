"use client";

import { cn } from "@/lib/utils";
import { emotionOptions, type EmotionTag } from "@/lib/mood-emotions";

interface EmotionTagsProps {
  // string[], not EmotionTag[] - entries loaded back from the API can carry
  // any free-form string the backend accepted, even though this picker only
  // ever adds from the curated `emotionOptions` list itself.
  selected: string[];
  onChange: (emotions: string[]) => void;
}

export function EmotionTags({ selected, onChange }: EmotionTagsProps) {
  const toggle = (tag: EmotionTag) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-[14px] font-medium text-foreground">
        How would you describe your feelings?
      </p>
      <div className="flex flex-wrap gap-2">
        {emotionOptions.map((tag) => {
          const isActive = selected.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              className={cn(
                "rounded-full px-4 py-2 text-[13px] font-medium transition-colors",
                isActive
                  ? "bg-mindora-purple text-white"
                  : "bg-gray-100 text-foreground/80 hover:bg-gray-200"
              )}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
