import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import TopSection from '@/components/TopSection';
import SignalMark from '@/components/SignalMark';
import { ArrowRight, Heart, Lightbulb, Users, Star, ChevronRight, MessageCircle } from 'lucide-react';

interface Value {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Milestone {
  year: string;
  title: string;
  description: string;
}

export const metadata = {
  title: 'About Us',
};

export default function About() {
  const values: Value[] = [
    {
      icon: <Lightbulb className="w-8 h-8 text-brand-500" />,
      title: 'Innovation',
      description: 'We continuously push boundaries with AI-powered solutions that make mental health support more effective and accessible.',
    },
    {
      icon: <Heart className="w-8 h-8 text-brand-500" />,
      title: 'Empathy',
      description: 'Our approach is rooted in compassion and understanding, catering to each individual’s mental health journey.',
    },
    {
      icon: <Users className="w-8 h-8 text-brand-500" />,
      title: 'Collaboration',
      description: 'We partner with mental health professionals and communities to create culturally relevant and impactful solutions.',
    },
  ];

  const milestones: Milestone[] = [
    {
      year: '2019',
      title: 'Foundation',
      description: 'Mindora Health was established with a vision to transform mental health support for Africa’s youth.',
    },
    {
      year: '2021',
      title: 'AI Integration',
      description: 'We launched our first AI-powered mental health assessment platform, revolutionizing early detection and prevention.',
    },
    {
      year: '2024',
      title: 'Global Expansion',
      description: 'We proudly reached over 100,000 users across multiple African countries, impacting lives positively.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopSection
        backgroundImage="/images/aboutbg.jpg"
        title="About Us"
        description="Learn about Mindora Health’s mission to empower Africa’s youth through innovative mental health solutions."
      />

      {/* Our Story Section */}
      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl">
            <SignalMark className="mb-6 h-8 w-8 text-brand-500" />
            <h2 className="mb-10 text-4xl font-bold text-foreground md:text-5xl">Our Story</h2>
            <p className="max-w-3xl border-l-2 border-brand-600 pl-6 text-lg leading-relaxed text-muted-foreground md:pl-8 md:text-xl">
              Mindora Health was founded to tackle the growing mental health crisis among adolescents and young people across Africa.
              By leveraging technology and empathy, we aim to provide stigma-free, accessible mental health care
              tailored to the unique cultural and social challenges faced by Africa’s youth.
            </p>
          </div>
        </div>
      </section>

      {/*<TeamSection />*/}

      {/* Values Section */}
      <section className="bg-ink py-24 text-paper md:py-32">
        <div className="container mx-auto px-6">
          <h2 className="mb-16 text-4xl font-bold text-paper md:text-5xl">Our Core Values</h2>
          <div className="grid grid-cols-1 border-t border-paper/15 md:grid-cols-3">
            {values.map((value, index) => (
              <div
                key={value.title}
                className={`border-b border-paper/15 px-2 py-10 md:px-8 ${
                  index !== 0 ? 'md:border-l md:border-t-0' : ''
                }`}
              >
                <span className="font-display text-sm uppercase tracking-wide text-brand-500">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="mb-6 mt-6">{value.icon}</div>
                <h3 className="mb-4 text-2xl font-bold text-paper">{value.title}</h3>
                <p className="text-paper/70">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto px-6">
          <h2 className="mb-16 text-4xl font-bold text-foreground md:text-5xl">Our Journey</h2>
          <div className="grid grid-cols-1 border-t border-border md:grid-cols-3">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                className={`border-b border-border px-2 py-10 md:px-8 ${
                  index !== 0 ? 'md:border-l md:border-t-0' : ''
                }`}
              >
                <div className="font-display text-5xl font-bold text-brand-600 md:text-6xl">
                  {milestone.year}
                </div>
                <h3 className="mt-4 text-xl font-bold text-foreground">{milestone.title}</h3>
                <p className="mt-3 text-muted-foreground">{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="bg-ink py-24 text-paper md:py-32">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Star className="mx-auto mb-8 h-10 w-10 text-brand-500" />
            <h2 className="mb-8 text-4xl font-bold text-paper md:text-5xl">Our Vision</h2>
            <p className="mb-12 text-xl text-paper/70">
              We envision a world where mental health support is accessible and stigma-free. Mindora Health aims to
              empower Africa’s youth through AI-driven, culturally relevant solutions that build resilience and foster growth.
            </p>
            <Button className="bg-brand-600 px-8 py-6 font-display text-base uppercase tracking-wide text-paper hover:bg-brand-500">
              Join Us on Our Journey
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="bg-brand-600 py-24 text-paper md:py-32">
        <div className="container mx-auto px-6 text-center">
          <MessageCircle className="mx-auto mb-8 h-10 w-10 text-paper/90" />
          <h2 className="mb-6 text-4xl font-bold text-paper">Want to Learn More?</h2>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-paper/80">
            Get in touch with us today and discover how we can help you take charge of your mental well-being.
          </p>
          <Button
            asChild
            className="bg-ink px-8 py-6 font-display text-base uppercase tracking-wide text-paper hover:bg-ink/80"
          >
            <Link href="/contact">
              Contact Us
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
