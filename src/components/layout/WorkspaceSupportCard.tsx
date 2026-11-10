"use client";

import { AlertTriangle } from "lucide-react";

export function WorkspaceSupportCard() {
  return (
    <section className="rounded-[18px] border border-white/10 bg-white/[0.06] p-3.5">
      <h2 className="flex items-center gap-2 text-[12px] font-bold text-white">
        <AlertTriangle className="h-3.5 w-3.5 text-[#e9b8f5]" />
        Contact MINDORA
      </h2>
      <p className="mt-2 text-[10px] leading-relaxed text-white/55">
        Monday to Friday, 9am to 5pm.
      </p>
      <a
        href="tel:+250783974066"
        className="mt-2.5 flex min-h-9 items-center justify-center rounded-lg bg-white/10 px-2 text-[11px] font-semibold text-white transition-colors hover:bg-white/15"
      >
        +250 783 974-066
      </a>
      <a
        href="mailto:info@mindora.rw"
        className="mt-2 block text-center text-[10px] text-white/60 underline underline-offset-2 hover:text-white"
      >
        info@mindora.rw
      </a>
    </section>
  );
}
