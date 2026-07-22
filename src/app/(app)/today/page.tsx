import Link from "next/link";
import { StreakBadge } from "@/components/layout/AppSidebar";
import { AppointmentCard, AppointmentList } from "@/components/home/AppointmentCard";
import { CommunityHighlights } from "@/components/home/CommunityPostCard";
import { HomeHero, MindoraAICard, MoodCheckInBar } from "@/components/home/HomeSections";
import { mockUpcomingAppointments, mockNextSession } from "@/lib/mock-data/appointments";
import { mockCommunityPosts } from "@/lib/mock-data/community";
import { mockCurrentUser } from "@/lib/mock-data/user";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function TodayPage() {
  const user = mockCurrentUser;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top white section — ~55% visual weight */}
      <section className="flex flex-1 flex-col bg-white px-6 pb-5 pt-7 lg:px-9 lg:pt-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[13px] font-medium text-mindora-purple">{getFormattedDate()}</p>
            <h1 className="mt-1 text-[26px] font-bold leading-tight tracking-tight lg:text-[32px]">
              {getGreeting()}, {user.name} 🌤️
            </h1>
            <p className="mt-1.5 max-w-md text-[13px] text-mindora-purple/70">
              You&apos;re doing beautifully. A gentle check-in today keeps your streak alive.
            </p>
          </div>
          <StreakBadge days={user.streakDays} />
        </div>

        <div className="relative mt-2 flex-1">
          <HomeHero />
          <div className="absolute left-0 top-1/2 z-20 -translate-y-1/2 lg:left-2">
            <AppointmentCard appointment={mockNextSession} compact />
          </div>
        </div>

        <div className="mt-4">
          <MoodCheckInBar />
        </div>
      </section>

      {/* Bottom lavender section */}
      <section className="bg-mindora-section-lavender px-6 py-7 lg:px-9">
        <div className="grid gap-5 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_300px]">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-white drop-shadow-sm">
                Upcoming Appointments
              </h2>
              <Link
                href="/therapy"
                className="text-[12px] font-medium text-white/80 hover:text-white hover:underline"
              >
                View all
              </Link>
            </div>
            <AppointmentList appointments={mockUpcomingAppointments} />
          </div>

          <div className="lg:row-span-1">
            <MindoraAICard />
          </div>
        </div>

        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-white drop-shadow-sm">
              Community Highlights
            </h2>
            <Link
              href="/circle"
              className="text-[12px] font-medium text-white/80 hover:text-white hover:underline"
            >
              Go to community
            </Link>
          </div>
          <CommunityHighlights posts={mockCommunityPosts} />
        </div>
      </section>
    </div>
  );
}
