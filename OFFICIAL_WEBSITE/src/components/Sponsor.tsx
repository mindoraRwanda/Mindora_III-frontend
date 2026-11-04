import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, HandHelping, ShieldCheck, Coins } from "lucide-react";
import SignalMark from "@/components/SignalMark";

export default function Sponsor() {
  return (
    <section className="relative overflow-hidden bg-accent/20">
      <div className="container relative mx-auto px-4 py-20 text-center">
        <SignalMark className="mx-auto mb-4 h-8 w-8 text-brand-600" />
        <h1 className="text-4xl text-brand-600 dark:text-brand-400 mb-6">
          Donate to Mindora Health
        </h1>
        <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
          Every young person deserves access to mental health care. Your support
          helps us provide AI-powered mental health solutions to young people
          across Africa.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group rounded-md border-border/60 border-t-4 border-t-brand-600 shadow-none transition-colors hover:border-t-brand-500">
            <CardHeader className="flex flex-col items-center">
              <Heart className="w-8 h-8 text-brand-600 mb-4" />
              <CardTitle>AI-Powered Monitoring</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-center">
              Help develop AI tools to detect mental health issues early.
            </CardContent>
          </Card>

          <Card className="group rounded-md border-border/60 border-t-4 border-t-brand-600 shadow-none transition-colors hover:border-t-brand-500">
            <CardHeader className="flex flex-col items-center">
              <HandHelping className="w-8 h-8 text-brand-600 mb-4" />
              <CardTitle>Affordable Therapy</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-center">
              Support virtual therapy sessions for underserved youth.
            </CardContent>
          </Card>

          <Card className="group rounded-md border-border/60 border-t-4 border-t-brand-600 shadow-none transition-colors hover:border-t-brand-500">
            <CardHeader className="flex flex-col items-center">
              <ShieldCheck className="w-8 h-8 text-brand-600 mb-4" />
              <CardTitle>Self-Help Resources</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-center">
              Fund mental health resources like games, e-books, and exercises.
            </CardContent>
          </Card>

          <Card className="group rounded-md border-border/60 border-t-4 border-t-brand-600 shadow-none transition-colors hover:border-t-brand-500">
            <CardHeader className="flex flex-col items-center">
              <Coins className="w-8 h-8 text-brand-600 mb-4" />
              <CardTitle>Breaking Stigma</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-center">
              Help create a culture of acceptance around mental health.
            </CardContent>
          </Card>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl mb-4">Join the Movement – Donate Today</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Every contribution, big or small, has a lasting impact. Choose how you want to support mental health in Africa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="rounded-md bg-brand-600 hover:bg-brand-500 font-display uppercase tracking-wide">
              One-time Donation
            </Button>
            <Button className="rounded-md bg-brand-600 hover:bg-brand-500 font-display uppercase tracking-wide">
              Monthly Giving
            </Button>
            <Button className="rounded-md bg-brand-600 hover:bg-brand-500 font-display uppercase tracking-wide">
              Corporate Partnerships
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
