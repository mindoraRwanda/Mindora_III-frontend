import { Button } from "@/components/ui/button";
import { Briefcase, ArrowRight, Users, Heart, GitBranch, Zap, Globe } from "lucide-react";
import Link from "next/link";
import SignalMark from "@/components/SignalMark";

export default function Careers() {
  const benefits = [
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Purpose-Driven Impact",
      description: "Work on projects that have a real impact on mental health for young Africans."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Diverse & Inclusive Culture",
      description: "Thrive in a welcoming, innovative, and inclusive environment where your ideas matter."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Reach",
      description: "Be part of a team working across Africa to transform mental healthcare access."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Meaningful Work",
      description: "Make a difference in people's lives through innovative healthcare solutions."
    },
    {
      icon: <GitBranch className="w-8 h-8" />,
      title: "Growth Opportunities",
      description: "Develop your skills and advance your career in a supportive environment."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Innovation Focus",
      description: "Work with AI and cutting-edge technology to solve real-world health challenges."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-ink">
        <div
          className="absolute inset-y-0 right-0 hidden w-[42%] overflow-hidden md:block"
          style={{ clipPath: "polygon(18% 0, 100% 0, 100% 100%, 0 100%)" }}
        >
          <div
            className="h-full w-full bg-cover bg-center grayscale contrast-125"
            style={{ backgroundImage: "url(/images/team.jpg)" }}
          />
          <div className="absolute inset-0 bg-brand-600 mix-blend-color" />
          <div className="absolute inset-0 bg-ink/20 mix-blend-multiply" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:py-32 md:px-12 lg:px-20">
          <SignalMark className="mb-8 h-8 w-8 text-brand-500" />
          <h1 className="max-w-2xl text-4xl font-bold leading-[1.05] text-paper md:text-6xl">
            Join Our Mission at Mindora Health
          </h1>
          <p className="mt-6 max-w-xl text-lg text-paper/70 md:text-xl">
            At Mindora Health, we are revolutionizing mental health care for young people across Africa.
            Be part of a team that&apos;s making a difference with AI-powered and culturally sensitive solutions.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button size="lg" asChild className="bg-brand-600 font-display uppercase tracking-wide text-paper hover:bg-brand-500">
              <Link href="/career/jobs" className="flex items-center gap-2">
                View Open Positions<ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border border-paper/30 bg-transparent font-display uppercase tracking-wide text-paper hover:bg-paper/10 hover:text-paper"
            >
              Our Culture
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-ink py-24 text-paper md:py-32">
        <div className="container mx-auto px-6">
          <h2 className="mb-16 text-3xl font-bold text-paper md:text-4xl">Why Join Mindora Health?</h2>
          <div className="grid grid-cols-1 border-t border-paper/15 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className={`border-b border-paper/15 px-2 py-10 md:px-8 ${
                  index % 3 !== 0 ? "md:border-l" : ""
                }`}
              >
                <span className="font-display text-sm uppercase tracking-wide text-brand-500">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="mb-6 mt-6 text-brand-500">{benefit.icon}</div>
                <h3 className="mb-4 text-xl font-bold text-paper">{benefit.title}</h3>
                <p className="text-paper/70">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Openings */}
      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-10 text-3xl font-bold text-foreground md:text-4xl">Current Openings</h2>
            <div className="border border-border px-8 py-16 md:px-16">
              <SignalMark className="mx-auto mb-6 h-8 w-8 text-brand-500" />
              <p className="mb-4 text-lg font-semibold text-foreground">We&apos;re preparing exciting new opportunities!</p>
              <p className="text-muted-foreground">Check back soon or join our talent community to be notified when positions open up.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Talent Community */}
      <section className="bg-brand-600 py-24 text-paper md:py-32">
        <div className="container mx-auto px-6 text-center">
          <SignalMark className="mx-auto mb-8 h-8 w-8 text-paper" />
          <h2 className="mb-6 text-3xl font-bold text-paper md:text-4xl">Join Our Talent Community</h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-paper/80">
            Even if there are no current openings that fit your skills, stay connected!
            Be the first to know about new opportunities at Mindora Health.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="bg-ink font-display uppercase tracking-wide text-paper hover:bg-ink/80">
              <Link href="/career/hall-of-fame" className="flex items-center gap-2">
                Visit Our Hall of Fame <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border border-paper/40 bg-transparent font-display uppercase tracking-wide text-paper hover:bg-paper/10 hover:text-paper"
            >
              Subscribe to Updates
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
