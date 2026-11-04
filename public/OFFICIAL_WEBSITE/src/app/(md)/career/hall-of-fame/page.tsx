import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award } from "lucide-react";
import Link from "next/link";
import TopSection from "@/components/TopSection";

const contributors = [
  {
    name: "Kwizera Rulinda",
    role: "CEO & Founder",
    image: "/images/kwizera.jpg",
  },
  {
    name: "Takudzwa Tarutira",
    role: "CTO & Co-Founder",
    image: "/images/takudzwa.jpg",
  },
  {
    name: "Muhire Leon Pierre",
    role: "Marketing Director & Co-Founder",
    image: "/images/muhire.jpg",
  },
  {
    name: "Gahire Hubert",
    role: "Project & Planning Officer",
    image: "/images/gahire.jpg",
  },
  {
    name: "Nizigama Noella",
    role: "Disability Inclusion Officer",
    image: "/images/noella.jpg",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function HallOfFame() {
  return (
    <div className="min-h-screen bg-background">
      <TopSection
        backgroundImage="/images/team.jpg"
        title="Hall of Fame"
        description="Celebrating the dedicated contributors who have helped shape Mindora Health’s mission and impact."
      />

      {/* Contributors Grid */}
      <section className="bg-background py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 border-t border-border md:grid-cols-3">
            {contributors.map((person, index) => (
              <div
                key={person.name}
                className={`flex flex-col items-center border-b border-border px-2 py-12 text-center md:px-8 ${
                  index % 3 !== 0 ? "md:border-l" : ""
                }`}
              >
                <Avatar className="mb-5 h-24 w-24 border border-border">
                  <AvatarImage
                    src={person.image}
                    alt={person.name}
                    className="object-cover grayscale contrast-125"
                  />
                  <AvatarFallback className="bg-brand-600 font-display text-lg font-semibold text-paper">
                    {getInitials(person.name)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-bold text-foreground">{person.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{person.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Mission CTA */}
      <section className="bg-ink py-24 text-paper md:py-32">
        <div className="container mx-auto px-6 text-center">
          <Award className="mx-auto mb-6 h-8 w-8 text-brand-500" />
          <h2 className="mb-6 text-3xl font-bold text-paper md:text-4xl">Join Our Mission</h2>
          <p className="mx-auto max-w-2xl text-lg text-paper/70">
            Want to be part of something meaningful? Check out our{" "}
            <Link href="/career" className="text-brand-400 underline underline-offset-4 hover:text-brand-300">
              Careers
            </Link>{" "}
            page and join our growing team!
          </p>
        </div>
      </section>
    </div>
  );
}
