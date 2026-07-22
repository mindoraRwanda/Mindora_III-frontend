import Link from "next/link";
import { cn } from "@/lib/utils";

interface MindoraLogoProps {
  className?: string;
  showTagline?: boolean;
  variant?: "default" | "light";
}

export function MindoraLogo({
  className,
  showTagline = true,
  variant = "default",
}: MindoraLogoProps) {
  const isLight = variant === "light";

  return (
    <Link href="/today" className={cn("flex items-center gap-3", className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mindora-purple">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
          <path d="M12 2C8.5 2 6 4.5 6 8c0 2 1 3.5 2.5 4.5C7 14 6 16 6 18c0 2 1.5 3.5 3.5 3.5.5 0 1-.1 1.5-.3C12 22 13 22.5 14 22.5c2.5 0 4-1.5 4-4 0-2-1-4-2.5-5.5C17 11.5 18 10 18 8c0-3.5-2.5-6-6-6z" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span
          className={cn(
            "text-lg font-bold leading-tight tracking-tight",
            isLight ? "text-white" : "text-foreground"
          )}
        >
          Mindora
        </span>
        {showTagline && (
          <span
            className={cn(
              "text-[10px] font-medium uppercase tracking-widest",
              isLight ? "text-white/60" : "text-muted-foreground"
            )}
          >
            Care, gently
          </span>
        )}
      </div>
    </Link>
  );
}
