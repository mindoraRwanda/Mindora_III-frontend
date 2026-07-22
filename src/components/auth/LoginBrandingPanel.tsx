import { loginTestimonial } from "@/lib/mock-data/auth";
import { BarChart3 } from "lucide-react";

export function LoginBrandingPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-mindora-purple-dark via-[#7a0da3] to-mindora-purple p-10 text-white lg:flex lg:p-14">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(255,255,255,0.15),transparent_60%)]" />

      <p className="relative z-10 text-xs font-medium uppercase tracking-[0.2em] text-white/60">
        A softer space
      </p>

      <blockquote className="relative z-10 max-w-lg text-4xl font-bold leading-snug tracking-tight lg:text-5xl">
        &ldquo;Take a breath. You already showed up — that&apos;s the hardest part.&rdquo;
      </blockquote>

      <div className="relative z-10 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
          <p className="text-sm leading-relaxed text-white/90">
            &ldquo;{loginTestimonial.quote}&rdquo;
          </p>
          <p className="mt-3 text-xs text-white/60">— {loginTestimonial.author}</p>
        </div>
        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
          <div>
            <p className="text-xs text-white/60">Today · your streak</p>
            <p className="mt-1 text-3xl font-bold">12 days</p>
          </div>
          <BarChart3 className="h-8 w-8 text-white/40" />
        </div>
      </div>
    </div>
  );
}
