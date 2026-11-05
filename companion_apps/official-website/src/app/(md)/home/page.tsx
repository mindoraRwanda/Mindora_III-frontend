import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import HeroCarousel from "@/components/HeroCarousel";
import PartnersSection from "@/components/Partener/PartnersSection";
import DownloadSection from "@/components/DownloadSection";
import Sponsor from "@/components/Sponsor";
import SignalMark from "@/components/SignalMark";
import StatStrip from "@/components/StatStrip";

export const metadata = {
  title: "Home"
};

export default function Home() {
  return (
    <>
      <HeroCarousel />

      <div className="container mx-auto px-6 py-20 md:py-28">
        <h2 className="text-4xl text-center mb-16">
          Our Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="group rounded-md border-border/60 border-t-4 border-t-brand-600 shadow-none transition-colors hover:border-t-brand-500">
            <CardHeader>
              <SignalMark className="mb-4 h-8 w-8 text-brand-600" />
              <CardTitle>Personalized Support</CardTitle>
              <CardDescription>
                AI-driven solutions tailored to your unique mental health needs, ensuring personalized care every step of the way.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group rounded-md border-border/60 border-t-4 border-t-brand-600 shadow-none transition-colors hover:border-t-brand-500">
            <CardHeader>
              <SignalMark className="mb-4 h-8 w-8 text-brand-600" />
              <CardTitle>24/7 Access</CardTitle>
              <CardDescription>
                Get access to mental health tools and support anytime, anywhere, right at your fingertips.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group rounded-md border-border/60 border-t-4 border-t-brand-600 shadow-none transition-colors hover:border-t-brand-500">
            <CardHeader>
              <SignalMark className="mb-4 h-8 w-8 text-brand-600" />
              <CardTitle>Data Security</CardTitle>
              <CardDescription>
                We prioritize your privacy. All your data is secure and encrypted to ensure your peace of mind.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      <PartnersSection />

      <section className="relative">
        <StatStrip stats={[{ value: "10,000+", label: "Active Users" }]} />

        <div className="bg-ink text-paper">
          <div className="container mx-auto grid grid-cols-1 gap-12 px-6 py-16 md:grid-cols-2 md:py-20">
            <div className="border-t border-paper/15 pt-8 md:border-t-0 md:border-r md:border-paper/15 md:pr-12 md:pt-0">
              <SignalMark className="mb-6 h-8 w-8 text-brand-500" />
              <div className="space-y-4">
                <p className="text-lg text-paper/85">Join thousands of users worldwide who trust Mindora</p>
                <p className="text-lg text-paper/85">Experience personalized mental health support</p>
              </div>
            </div>

            {/* Mindora Board Game */}
            <div className="md:pl-12">
              <h3 className="mb-2 text-3xl text-paper">Mindora Board Game</h3>
              <p className="mb-4 font-display text-sm uppercase tracking-wide text-brand-400">
                Interactive Mental Health Support
              </p>
              <p className="mb-8 text-paper/75">
                Discover our therapeutic board game that promotes mental health awareness while offering an engaging experience for all ages.
              </p>
              <Button className="group rounded-md bg-brand-600 font-display uppercase tracking-wide hover:bg-brand-500" asChild>
                <Link href="/about" className="inline-flex items-center gap-2">
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Sponsor />

      {/* Call to Action Section */}
      <section className="bg-brand-600 py-24 text-center text-paper">
        <div className="container mx-auto max-w-3xl px-6">
          <SignalMark className="mx-auto mb-6 h-9 w-9 text-paper" />
          <h2 className="mb-6 text-4xl text-paper">
            Ready to Take Control of Your Mental Well-being?
          </h2>
          <p className="mb-12 text-xl text-paper/85">
            Start your journey with Mindora Health and access personalized mental health support.
          </p>
          <Button
            size="lg"
            className="group rounded-md bg-ink font-display uppercase tracking-wide text-paper hover:bg-ink/85"
            asChild
          >
            <Link href="/demo" className="inline-flex items-center gap-2">
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>

      <DownloadSection />
    </>
  );
}