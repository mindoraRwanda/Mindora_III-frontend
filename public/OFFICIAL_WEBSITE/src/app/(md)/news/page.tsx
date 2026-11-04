import React from 'react';
import Image from 'next/image';
import TopSection from "@/components/TopSection";
import SignalMark from "@/components/SignalMark";
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Calendar, BookOpen, Filter, Search } from 'lucide-react';

interface Article {
  title: string;
  description: string;
  image: string;
  link: string;
  category: string;
  date: string;
  readTime: string;
}

export default function News() {
  const articles: Article[] = [
    {
      title: 'Mindora Achieves New Heights in Mental Health Innovation',
      description: 'Discover how our AI-powered solutions are transforming mental health support across Africa, reaching new milestones in accessibility and effectiveness.',
      image: '/images/article1.jpg',
      link: '/news/1',
      category: 'Innovation',
      date: 'March 15, 2024',
      readTime: '5 min read'
    },
    {
      title: 'The Future of Mental Health Support: Insights from Experts',
      description: 'Leading mental health professionals discuss how AI and technology are revolutionizing therapeutic approaches and improving outcomes.',
      image: '/images/article2.jpg',
      link: '/news/2',
      category: 'Industry Insights',
      date: 'March 10, 2024',
      readTime: '7 min read'
    },
    {
      title: "Mindora's Impact: Reaching New Communities",
      description: 'How our platform is breaking down barriers to mental health support in underserved regions across the continent.',
      image: '/images/article3.jpg',
      link: '/news/3',
      category: 'Impact',
      date: 'March 5, 2024',
      readTime: '4 min read'
    }
  ];

  const categories = ['All', 'Innovation', 'Industry Insights', 'Impact', 'Company News'];

  return (
    <div className="min-h-screen bg-background">
      <TopSection
        backgroundImage="/images/newsbg.jpg"
        title="Community & Events "
        description="Stay updated with the latest developments in AI-powered mental health support and Mindora's impact across Africa."
      />

      {/* Search and Filter Section */}
      <section className="border-y border-border bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="mx-auto flex max-w-4xl flex-col gap-6 md:flex-row md:items-center md:divide-x md:divide-border">
            <div className="relative flex-1 md:pr-6">
              <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full border-b border-border bg-transparent py-3 pl-7 pr-4 text-foreground placeholder:text-muted-foreground focus:border-brand-600 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 md:pl-6">
              <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
              <select className="w-full border-b border-border bg-transparent py-3 pr-4 text-foreground focus:border-brand-600 focus:outline-none">
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="bg-ink py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 md:items-stretch">
            <div className="flex flex-col justify-center px-2 py-10 md:px-8 lg:px-12">
              <span className="mb-6 inline-flex w-fit items-center border border-brand-500 px-3 py-1 font-display text-xs uppercase tracking-wide text-brand-500">
                Featured
              </span>
              <h2 className="text-3xl font-bold text-paper md:text-4xl">
                Transforming Mental Health Support Through AI Innovation
              </h2>
              <p className="mt-6 max-w-xl text-lg text-paper/70">
                An in-depth look at how Mindora is leveraging artificial intelligence to make
                mental health support more accessible and effective across Africa.
              </p>
              <Button className="mt-8 w-fit bg-brand-600 font-display uppercase tracking-wide text-paper hover:bg-brand-500">
                Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div
              className="relative h-72 w-full overflow-hidden md:h-auto"
              style={{ clipPath: "polygon(0 6%, 100% 0, 100% 100%, 0 94%)" }}
            >
              <Image
                src="/images/featured-article.jpg"
                alt="Featured Article"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                priority
                className="object-cover grayscale"
              />
              <div className="absolute inset-0 bg-brand-600 mix-blend-color" />
              <div className="absolute inset-0 bg-ink/10 mix-blend-multiply" />
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles Grid */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <SignalMark className="mx-auto mb-4 h-6 w-6 text-brand-500" />
            <h2 className="text-3xl font-bold md:text-4xl">
              Latest Updates
            </h2>
          </div>
          <div className="grid grid-cols-1 border-t border-border md:grid-cols-3">
            {articles.map((article, index) => (
              <div
                key={index}
                className={`group border-b border-border md:border-b-0 ${index !== 0 ? 'md:border-l' : ''}`}
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <div className="mb-4 flex items-center gap-4 font-display text-xs uppercase tracking-wide text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" />
                      {article.readTime}
                    </span>
                  </div>
                  <span className="mb-3 inline-block border border-brand-600 px-2.5 py-1 font-display text-xs uppercase tracking-wide text-brand-600">
                    {article.category}
                  </span>
                  <h3 className="text-xl font-bold">{article.title}</h3>
                  <p className="mt-3 text-muted-foreground">{article.description}</p>
                  <Button
                    variant="outline"
                    className="mt-6 w-full border-foreground/20 font-display uppercase tracking-wide hover:bg-foreground hover:text-background"
                  >
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-brand-600 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center text-paper">
            <SignalMark className="mx-auto mb-6 h-10 w-10 text-paper" />
            <h2 className="text-3xl font-bold md:text-4xl">Stay Informed</h2>
            <p className="mt-4 text-paper/80">
              Subscribe to our newsletter for the latest updates on mental health innovation and impact stories.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="min-w-[300px] border-b border-paper/40 bg-transparent px-2 py-3 text-paper placeholder:text-paper/60 focus:border-paper focus:outline-none"
              />
              <Button className="bg-ink font-display uppercase tracking-wide text-paper hover:bg-ink/80">
                Subscribe <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Load More Section */}
      <section className="bg-background py-12 text-center">
        <Button className="bg-brand-600 font-display uppercase tracking-wide text-paper hover:bg-brand-700">
          Load More Articles <TrendingUp className="ml-2 h-4 w-4" />
        </Button>
      </section>
    </div>
  );
}
