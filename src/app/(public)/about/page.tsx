import Link from "next/link";
import { ArrowRight, Clock3, Mail, Phone } from "lucide-react";
import { BackLink } from "@/components/public/BackLink";
import { Button } from "@/components/ui/button";
import { SUPPORT_CONTACT } from "@/lib/mock-data/public";

export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden px-4 py-14 sm:px-6 lg:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-8 h-64 w-64 rounded-full bg-[#F1F9F8]"
        />
        <div className="relative mx-auto max-w-6xl">
          <BackLink fallback="/" className="mb-6" />
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-[#6B7280]">
                ABOUT MINDORA
              </p>
              <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-[#1A1A1A] sm:text-5xl">
                Care that starts with listening
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#6B7280] sm:text-lg">
                MINDORA brings together mental wellbeing resources, professional therapy and
                reflective tools to help people take a supportive next step.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 rounded-xl px-7">
                  <Link href="/therapists">
                    Find a therapist
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 rounded-xl px-7">
                  <Link href="/support">Talk to MINDORA</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-3">
              <article className="rounded-2xl border border-[#D4EBE9] bg-[#F7FBFA] p-5">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280]">
                  Mental wellbeing resources
                </span>
                <p className="mt-2 text-sm leading-relaxed text-[#1A1A1A]">
                  Explore helpful tools and information as you consider the support that feels
                  right for you.
                </p>
              </article>
              <article className="rounded-2xl border border-[#D4EBE9] bg-[#F7FBFA] p-5">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280]">
                  Professional therapy
                </span>
                <p className="mt-2 text-sm leading-relaxed text-[#1A1A1A]">
                  Browse therapist profiles and explore options for beginning a conversation.
                </p>
              </article>
              <article className="rounded-2xl border border-[#D4EBE9] bg-[#F7FBFA] p-5">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280]">
                  Reflective tools
                </span>
                <p className="mt-2 text-sm leading-relaxed text-[#1A1A1A]">
                  Use check-ins and guided reflection to put thoughts and feelings into words.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-purple-panel px-4 py-12 sm:px-6 lg:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Talk to us directly
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Contact the MINDORA team for general questions, support or partnership enquiries.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href={SUPPORT_CONTACT.phoneHref}
              className="group rounded-2xl bg-white/10 p-6 transition-colors hover:bg-white/15"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
                <Phone className="h-6 w-6" strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-white">Phone</h3>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
                {SUPPORT_CONTACT.phoneDisplay}
              </p>
              <p className="mt-2 text-sm text-white/70">{SUPPORT_CONTACT.phoneHours}</p>
            </a>

            <a
              href={SUPPORT_CONTACT.emailHref}
              className="group rounded-2xl bg-white/10 p-6 transition-colors hover:bg-white/15"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
                <Mail className="h-6 w-6" strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-white">Email</h3>
              <p className="mt-2 break-words text-2xl font-semibold tracking-tight text-white">
                {SUPPORT_CONTACT.email}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-white/70">
                <Clock3 className="h-4 w-4" />
                {SUPPORT_CONTACT.emailNote}
              </p>
            </a>
          </div>

          <p className="mt-5 max-w-3xl text-xs leading-relaxed text-white/65">
            These are general support contacts, not an emergency hotline or a 24/7 crisis service.
            For an immediate emergency, contact local emergency services or go to the nearest
            emergency department.
          </p>
        </div>
      </section>
    </div>
  );
}
