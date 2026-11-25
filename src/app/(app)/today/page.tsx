"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { CheckInForm } from "@/components/check-in/CheckInForm";
import { WeeklyMoodCard } from "@/components/home/WeeklyMoodCard";
import { NextSessionCard } from "@/components/home/NextSessionCard";
import { useAuth } from "@/contexts/AuthContext";
import { useMyProfile } from "@/hooks/useMyProfile";
import { useMoodStreak } from "@/hooks/useMood";
import { useMyAppointments } from "@/hooks/useAppointments";
import { useTherapists } from "@/hooks/useTherapists";
import { selectNextSession } from "@/lib/appointments";
import type { TherapistProfile } from "@/types/domain";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getFormattedDate(): string {
  return new Date()
    .toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    .toUpperCase();
}

export default function TodayPage() {
  const { user } = useAuth();
  const { data: profile } = useMyProfile();
  const { data: streak, isLoading: streakLoading, isError: streakErrored } = useMoodStreak();
  const {
    data: appointmentData,
    isLoading: appointmentsLoading,
    isError: appointmentsErrored,
  } = useMyAppointments();
  const { data: therapistData } = useTherapists({});

  const displayName = profile?.profile?.userName ?? user?.email ?? "there";
  const firstName = displayName.split(" ")[0];

  const therapistByUserId = useMemo(() => {
    const map = new Map<string, TherapistProfile>();
    (therapistData?.therapists ?? []).forEach((t) => map.set(t.userId, t));
    return map;
  }, [therapistData]);

  function therapistNameFor(therapistId: string): string {
    return therapistByUserId.get(therapistId)?.userName ?? "Therapist";
  }

  const [now] = useState(() => Date.now());

  const nextSession = useMemo(
    () => selectNextSession(appointmentData?.appointments ?? [], now),
    [appointmentData, now]
  );

  const streakLabel = streak ? (streak.streak === 1 ? "1 day" : `${streak.streak} days`) : null;

  return (
    <div className="min-h-full bg-[#eae6f4] px-6 py-8 lg:px-11 lg:py-9">
      <div className="mx-auto max-w-3xl">
        {/* Header: greeting + streak */}
        <header className="mb-7 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-3.5 inline-flex items-center gap-2.5 rounded-full px-4 py-2 shadow-[inset_3px_3px_7px_#cdc6e0,inset_-3px_-3px_7px_#fdfbff]">
              <span className="text-[12px] font-bold uppercase tracking-wide text-mindora-purple">
                {getFormattedDate()}
              </span>
            </div>
            <h1 className="text-[32px] font-extrabold leading-[1.05] tracking-tight text-foreground lg:text-[42px]">
              {getGreeting()}, {firstName}
            </h1>
            <p className="mt-3 max-w-[46ch] text-[15.5px] leading-relaxed text-[#6a6383]">
              You&apos;re doing beautifully. A gentle check-in today keeps your streak alive.
            </p>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex items-center gap-3 rounded-full py-2.5 pl-3 pr-5 shadow-[7px_7px_16px_#cdc6e0,-7px_-7px_16px_#fdfbff]">
              <span className="grid h-[34px] w-[34px] place-items-center rounded-full shadow-[inset_3px_3px_7px_#cdc6e0,inset_-3px_-3px_7px_#fdfbff]">
                <Flame className="h-4 w-4 text-[#c67139]" />
              </span>
              <div className="leading-tight">
                <div className="text-[10px] font-bold tracking-wide text-[#8f87a4]">STREAK</div>
                <div className="text-[15px] font-bold text-foreground">
                  {streakLoading ? (
                    <span className="inline-block h-4 w-12 animate-pulse rounded-full bg-black/10" />
                  ) : streakErrored ? (
                    <span
                      className="text-[12.5px] font-semibold text-muted-foreground"
                      title="Could not load your streak right now - this doesn't mean it's gone."
                    >
                      Unavailable
                    </span>
                  ) : (
                    streakLabel
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Daily check-in banner — wide rectangle */}
        <section className="mb-6">
          <div className="relative flex items-center overflow-hidden rounded-[28px] bg-gradient-to-r from-[#efeafa] via-[#e6dff6] to-[#ded4f4] px-8 py-7 shadow-[12px_12px_26px_#cbc4de,-12px_-12px_26px_#fdfbff] lg:px-10 lg:py-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-[260px] w-[260px] rounded-full bg-[#e8e1f8] shadow-[inset_10px_10px_24px_#d2c9ea,inset_-10px_-10px_24px_#fdfbff]" />
            <div className="relative flex flex-1 flex-wrap items-center justify-between gap-6">
              <div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-[11.5px] font-bold tracking-wide text-[#5b21b6] shadow-[inset_3px_3px_7px_#d3caeb,inset_-3px_-3px_7px_#fdfbff]">
                  <span className="h-[7px] w-[7px] rounded-full bg-mindora-purple" />
                  DAILY CHECK-IN
                </span>
                <h2 className="mt-3 text-[24px] font-extrabold leading-tight tracking-tight text-[#2c1c55] lg:text-[28px]">
                  How are you feeling today?
                </h2>
                <p className="mt-2 text-[14px] leading-relaxed text-[#5d4d85]">
                  Two minutes to check in with yourself. It matters.
                </p>
              </div>
              <a
                href="#check-in-form"
                className="flex h-12 items-center gap-2.5 rounded-full bg-mindora-purple px-6 text-[15px] font-bold text-white shadow-[8px_8px_18px_#c6bade,-8px_-8px_18px_#fdfbff] hover:bg-mindora-purple-dark"
              >
                Log today&apos;s mood
                <ArrowRight className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>
        </section>

        {/* Check-in form */}
        <section id="check-in-form" className="mb-6">
          <CheckInForm />
        </section>

        {/* Weekly mood progress — full-width rectangle */}
        <section className="mb-6">
          <WeeklyMoodCard />
        </section>

        {/* Next session */}
        <section>
          <NextSessionCard
            appointment={nextSession}
            therapistName={nextSession ? therapistNameFor(nextSession.therapistId) : ""}
            isLoading={appointmentsLoading}
            isError={appointmentsErrored}
          />
        </section>
      </div>
    </div>
  );
}
