import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, CheckCircle2, HeartHandshake, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Join as a Therapist — Mindora",
  description: "Join Mindora's network of licensed therapists supporting patients across Rwanda.",
};

export default function JoinAsTherapistPage() {
  return (
    <div className="bg-white">
      <HeroSection />
      <BenefitsSection />
      <HowToJoinSection />
      <CTASection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#F5F3FF]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-10 h-56 w-56 rounded-full bg-[#F9F6FF]"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-mindora-purple-pale px-4 py-1.5 text-xs font-semibold tracking-wide text-mindora-purple">
          <HeartHandshake className="h-4 w-4" />
          FOR THERAPISTS
        </span>

        <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-[#1A1A1A] sm:text-5xl">
          Grow your practice with Mindora
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[#6B7280]">
          Join Rwanda&apos;s leading mental health platform. Reach more patients, manage your
          schedule online, and make a real difference — all from one place.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-12 rounded-xl px-8">
            <Link href="/signup?returnUrl=%2Ftherapist-application">
              Apply now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 rounded-xl px-8">
            <Link href="/login">Already have an account? Sign in</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  const benefits = [
    {
      icon: Users,
      title: "Reach more patients",
      description:
        "Our platform connects you with patients actively seeking mental health support across Rwanda.",
    },
    {
      icon: Calendar,
      title: "Manage your schedule",
      description:
        "Set your availability, accept bookings, and manage appointments — all in your therapist dashboard.",
    },
    {
      icon: Shield,
      title: "Secure & confidential",
      description:
        "End-to-end encryption, HIPAA-aware infrastructure, and strict privacy controls protect every session.",
    },
  ];

  return (
    <section className="bg-[#F9FAFB] px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-[#1A1A1A]">
          Why therapists choose Mindora
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {benefits.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5F3FF]">
                  <Icon className="h-6 w-6 text-mindora-purple" strokeWidth={1.6} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#1A1A1A]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowToJoinSection() {
  const steps = [
    {
      step: 1,
      title: "Create an account",
      description: "Sign up with your email in under a minute.",
    },
    {
      step: 2,
      title: "Submit your application",
      description: "Tell us about your credentials, licensing, and experience.",
    },
    {
      step: 3,
      title: "Get verified",
      description: "Our team reviews every application to ensure quality care.",
    },
    {
      step: 4,
      title: "Start seeing patients",
      description: "Set your availability and begin accepting bookings.",
    },
  ];

  return (
    <section className="px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-[#1A1A1A]">
          How to join
        </h2>
        <div className="mt-10 space-y-6">
          {steps.map((item) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mindora-purple text-sm font-bold text-white">
                {item.step}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1A1A1A]">{item.title}</h3>
                <p className="mt-1 text-sm text-[#6B7280]">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-[#F5F3FF] px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-mindora-purple" />
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1A1A1A]">
          Ready to make a difference?
        </h2>
        <p className="mt-3 text-[#6B7280]">
          Join our growing network of licensed therapists helping people across Rwanda.
        </p>
        <Button asChild size="lg" className="mt-8 h-12 rounded-xl px-8">
          <Link href="/signup?returnUrl=%2Ftherapist-application">
            Apply now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
