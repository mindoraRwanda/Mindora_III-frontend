import Link from "next/link";
import Image from "next/image";
import { Activity, ArrowRight, Check, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RedirectIfAuthenticated } from "@/components/landing/RedirectIfAuthenticated";
import { FeaturedTherapistsPreview } from "@/components/landing/FeaturedTherapistsPreview";

const HERO_IMAGE = "/images/landing/diverse-people.jpg";

const SUPPORT_PATHS = [
  {
    title: "Find a therapist",
    description:
      "Explore therapist profiles and choose a professional whose experience fits your needs.",
    href: "/therapists",
    action: "Explore therapists",
    icon: Heart,
  },
  {
    title: "Reflect with AI",
    description:
      "Use guided reflection to organise your thoughts and explore supportive next steps.",
    href: "/reflect",
    action: "Open AI reflection",
    icon: Sparkles,
  },
  {
    title: "Track your wellbeing",
    description: "Check in with yourself and notice patterns in your mood over time.",
    href: "/check-in",
    action: "Try a check-in",
    icon: Activity,
  },
] as const;

export default function LandingPage() {
  return (
    <div className="bg-white">
      <RedirectIfAuthenticated />
      <Hero />
      <ExploreSupport />
      <FeaturedTherapistsPreview />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-14 sm:px-6 lg:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#F1F9F8]"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="inline-flex rounded-full bg-[#F1F9F8] px-3.5 py-2 text-xs font-semibold text-mindora-purple">
            Mental wellbeing, made more accessible
          </p>
          <h1 className="mt-5 max-w-xl text-4xl font-bold leading-[1.12] tracking-tight text-[#1A1A1A] sm:text-5xl lg:text-[58px]">
            Support for your mind, at every step.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#6B7280] sm:text-lg">
            Connect with qualified mental health professionals, reflect on how you feel, and find
            support that fits your life.
          </p>

          <form
            action="/therapists"
            method="get"
            className="mt-8 flex flex-col gap-2 rounded-2xl border border-[#E5E7EB] bg-white p-2 shadow-sm sm:flex-row"
          >
            <label className="flex min-w-0 flex-1 items-center px-3">
              <span className="sr-only">What would you like support with?</span>
              <select
                name="specialisation"
                defaultValue=""
                className="h-11 w-full min-w-0 bg-transparent text-sm text-[#51445f] outline-none"
              >
                <option value="">What would you like support with?</option>
                <option value="Anxiety">Anxiety &amp; stress</option>
                <option value="Couple therapy">Relationships</option>
                <option value="Depression">Depression</option>
                <option value="Trauma">Trauma support</option>
              </select>
            </label>
            <Button type="submit" size="lg" className="h-11 shrink-0 rounded-xl px-5">
              Find a therapist
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-[#6B7280]">
            {["Private and confidential", "Qualified professionals", "Flexible sessions"].map(
              (item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-mindora-purple" />
                  {item}
                </span>
              )
            )}
          </div>
        </div>

        <div className="relative">
          <div aria-hidden className="absolute -inset-4 rounded-[2rem] bg-[#E8F5F4] sm:-inset-6" />
          <div className="relative overflow-hidden rounded-[1.6rem] bg-[#F1F9F8] shadow-sm">
            <Image
              src={HERO_IMAGE}
              alt="People talking with a mental health professional"
              width={960}
              height={960}
              priority
              className="aspect-[5/4] w-full object-cover sm:aspect-square"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ExploreSupport() {
  return (
    <section className="border-t border-[#EEF0F1] px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-[#6B7280]">
              EXPLORE SUPPORT
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1A1A1A]">
              How can MINDORA support you?
            </h2>
            <p className="mt-2 text-[#6B7280]">Choose a path that feels right for you.</p>
          </div>
          <Button asChild variant="outline" className="h-11 shrink-0 rounded-xl px-5">
            <Link href="/about">
              Learn about MINDORA
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {SUPPORT_PATHS.map((path) => {
            const Icon = path.icon;
            return (
              <article
                key={path.title}
                className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1F9F8] text-mindora-purple">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 text-xl font-bold tracking-tight text-[#1A1A1A]">
                  {path.title}
                </h3>
                <p className="mt-2 min-h-14 text-sm leading-relaxed text-[#6B7280]">
                  {path.description}
                </p>
                <Button
                  asChild
                  variant="ghost"
                  className="mt-4 h-10 px-0 text-mindora-purple hover:bg-transparent hover:text-mindora-purple-dark"
                >
                  <Link href={path.href}>
                    {path.action}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
