import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MoodCheckInBar() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-mindora-section-lavender px-5 py-4">
      <div className="flex min-w-0 items-center gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mindora-purple">
          <Heart className="h-5 w-5 text-white" fill="white" />
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-foreground">How are you feeling today?</p>
          <p className="text-[13px] text-muted-foreground">
            Two minutes to check in with yourself. It matters.
          </p>
        </div>
      </div>
      <Button asChild className="h-10 shrink-0 rounded-xl px-5 text-[13px]">
        <Link href="/check-in">
          Log today&apos;s mood
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Button>
    </div>
  );
}

export function MindoraAICard() {
  return (
    <div className="flex h-full min-h-[340px] flex-col rounded-2xl bg-mindora-sidebar p-5 text-white">
      <div className="flex items-center gap-2.5">
        <Image
          src="/images/Mindora_Logo.png"
          alt="Mindora"
          width={42}
          height={42}
          className="rounded-full object-contain"
        />
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

      <Button asChild className="mt-5 h-11 w-full rounded-xl text-[13px]">
        <Link href="/reflect">
          Start Talking
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Button>
    </div>
  );
}

/** Doctor portrait for the home hero — bottom-aligned, scaled for Figma. */
export function HomeHeroPortrait() {
  return (
    <div className="relative h-full w-full">
      <Image
        src="/images/doctor-image.png"
        alt="A friendly therapist holding a clipboard, ready to help"
        fill
        className="scale-[1.0] object-contain object-bottom object-center"
        priority
        sizes="(max-width: 1024px) 90vw, 60vw"
      />
    </div>
  );
}
