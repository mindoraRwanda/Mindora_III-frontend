import Link from "next/link";
import { StreakBadge } from "@/components/layout/AppSidebar";
import { AppointmentCard, AppointmentList } from "@/components/home/AppointmentCard";
import { CommunityHighlights } from "@/components/home/CommunityPostCard";
import { HomeHeroPortrait, MindoraAICard, MoodCheckInBar } from "@/components/home/HomeSections";
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
      {/* Hero — matches Figma: copy + cards left, portrait right flush to bottom */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute right-6 top-7 z-20 lg:right-9 lg:top-8">
          <StreakBadge days={user.streakDays} />
        </div>

        <div className="relative mx-auto min-h-[580px] lg:min-h-[640px]">
          {/* Portrait — centered in hero */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 z-0 hidden lg:block">
            <div className="absolute left-1/2 bottom-0 top-0 w-[min(720px,70%)] -translate-x-1/2">
              <HomeHeroPortrait />
            </div>
          </div>

          {/* Left: greeting + session + mood */}
          <div className="relative z-10 flex min-h-[580px] flex-col px-6 pb-6 pt-7 lg:min-h-[640px] lg:px-9 lg:pb-8 lg:pt-8 lg:w-[48%]">
            <div className="max-w-lg pr-4 lg:pr-8">
              <p className="text-[13px] font-medium text-mindora-purple">{getFormattedDate()}</p>
              <h1 className="mt-1 text-[26px] font-bold leading-tight tracking-tight lg:text-[32px]">
                {getGreeting()}, {user.name} 🌤️
              </h1>
              <p className="mt-1.5 max-w-md text-[13px] text-mindora-purple/70">
                You&apos;re doing beautifully. A gentle check-in today keeps your streak alive.
              </p>
            </div>

            <div className="mt-auto flex max-w-xl flex-col gap-4 pt-10 lg:pt-16">
              <AppointmentCard appointment={mockNextSession} compact />
              <MoodCheckInBar />
            </div>
          </div>
        </div>

        {/* Mobile portrait */}
        <div className="relative mx-auto h-[380px] w-full max-w-lg px-6 lg:hidden">
          <HomeHeroPortrait />
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
