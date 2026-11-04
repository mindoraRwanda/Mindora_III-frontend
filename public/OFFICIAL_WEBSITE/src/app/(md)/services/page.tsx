import React from "react";
import TopSection from "@/components/TopSection";
import SignalMark from "@/components/SignalMark";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Service {
  id: number;
  name: string;
  description: string;
}

const services: Service[] = [
  {
    id: 1,
    name: "AI-Powered Assessments",
    description: "AI-driven mental health assessments that support early detection and prevention, tailored to each individual's needs.",
  },
  {
    id: 2,
    name: "24/7 Personalized Support",
    description: "Round-the-clock, personalized mental health support and tools, accessible anytime, anywhere, right at your fingertips.",
  },
  {
    id: 3,
    name: "Virtual Therapy & Self-Help",
    description: "Affordable virtual therapy sessions for underserved youth, paired with self-help resources like guided exercises and e-books.",
  },
  {
    id: 4,
    name: "Mindora Board Game",
    description: "An interactive therapeutic board game that promotes mental health awareness while offering an engaging experience for all ages.",
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-background">
      <TopSection
        backgroundImage="/images/servicbg.jpg"
        title="Our Services"
        description="Empowering mental health with innovative, AI-driven solutions tailored to young Africans."
      />

      {/* Main Services Section */}
      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <SignalMark className="mx-auto mb-6 h-8 w-8 text-brand-500" />
            <h2 className="text-4xl font-bold text-foreground md:text-5xl">
              Discover Our Comprehensive Services
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              From early detection to community support, our wide range of services aims to provide accessible, culturally relevant, and effective mental health solutions.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {services.map((svc, index) => (
              <div
                key={svc.id}
                className="group bg-background p-8 transition-colors duration-300 hover:bg-brand-600"
              >
                <span className="font-display text-sm uppercase tracking-wide text-brand-500 transition-colors duration-300 group-hover:text-paper/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-paper">
                  {svc.name}
                </h3>
                <p className="mt-4 leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-paper/80">
                  {svc.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-brand-600 py-24 text-paper md:py-32">
        <div className="container mx-auto px-6 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-4xl font-bold text-paper md:text-5xl">
              Ready to Start Your Journey?
            </h2>
            <p className="mb-10 text-xl text-paper/80">
              Join our growing community of individuals committed to mental wellness.
              Take the first step toward a better you.
            </p>
            <Button className="group bg-ink px-8 py-6 font-display text-base uppercase tracking-wide text-paper hover:bg-ink/80">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
