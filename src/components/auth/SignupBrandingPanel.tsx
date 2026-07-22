import { Check } from "lucide-react";
import { signupFeatures } from "@/lib/mock-data/auth";

export function SignupBrandingPanel() {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] p-10 text-white lg:p-14">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.12),transparent_60%)]" />

      <div className="relative z-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/60">
          Your gentle space begins here
        </p>
        <h1 className="mt-8 max-w-md font-serif text-4xl font-medium leading-tight lg:text-5xl">
          A calmer mind, one small kindness at a time.
        </h1>
        <p className="mt-4 text-sm text-white/70">
          Free to start · No credit card · Cancel anytime.
        </p>
      </div>

      <ul className="relative z-10 mt-12 space-y-4">
        {signupFeatures.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-white/90">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
