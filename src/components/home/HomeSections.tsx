import Image from "next/image";
import { ArrowRight, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MoodCheckInBar() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-mindora-section-lavender px-5 py-4">
      <div className="flex items-center gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mindora-purple">
          <Heart className="h-5 w-5 text-white" fill="white" />
        </div>
        <div>
          <p className="text-[15px] font-semibold text-foreground">How are you feeling today?</p>
          <p className="text-[13px] text-muted-foreground">
            Two minutes to check in with yourself. It matters.
          </p>
        </div>
      </div>
      <Button variant="dark" className="h-10 shrink-0 rounded-xl px-5 text-[13px]">
        Log today&apos;s mood
        <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

export function MindoraAICard() {
  return (
    <div className="flex h-full min-h-[340px] flex-col rounded-2xl bg-mindora-sidebar p-5 text-white">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-mindora-purple">
          <Sparkles className="h-4 w-4" />
        </div>
        <p className="text-[15px] font-bold">Mindora AI</p>
      </div>

      <p className="mt-5 flex-1 text-[13px] leading-relaxed text-white/75">
        A safe space to untangle your thoughts, anytime. Not a replacement for care.
      </p>

      <ul className="mt-4 space-y-2 text-[13px] text-white/60">
        <li className="flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-white/40" />
          Talk it through
        </li>
        <li className="flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-white/40" />
          Guided reflections
        </li>
      </ul>

      <Button className="mt-5 h-11 w-full rounded-xl text-[13px]">
        Start Talking
        <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

export function HomeHero() {
  return (
    <div className="relative h-[min(42vw,380px)] min-h-[280px] w-full sm:h-[360px] lg:h-[400px]">
      <div className="absolute bottom-0 left-1/2 h-full w-[min(90%,520px)] -translate-x-[42%] sm:w-[480px] lg:w-[540px] lg:-translate-x-[38%]">
        <Image
          src="/images/doctor-image.png"
          alt="A friendly therapist holding a clipboard, ready to help"
          fill
          className="object-contain object-bottom"
          priority
          sizes="(max-width: 768px) 90vw, 540px"
        />
      </div>
    </div>
  );
}
