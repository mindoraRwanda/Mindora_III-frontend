"use client";

import Link from "next/link";
import { CalendarClock, CalendarX, CheckCircle2, ClipboardList, Clock, Users } from "lucide-react";
import { useMyTherapistApplications } from "@/hooks/useTherapistApplication";

function LockedStatCard({ label, icon: Icon }: { label: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border px-5 py-4 opacity-40">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mindora-purple-pale text-mindora-purple">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[22px] font-bold leading-tight text-foreground">—</p>
        <p className="text-[12.5px] text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default function PendingTherapistDashboard() {
  const { data } = useMyTherapistApplications();
  const latest = data?.applications[0] ?? null;

  const statusMessage =
    !latest || latest.status === "DRAFT"
      ? "Complete your application to start the review process."
      : latest.status === "MORE_INFORMATION_REQUIRED"
        ? "Your application needs more information before it can be approved."
        : "Our team is reviewing your credentials. This usually takes 1-2 business days.";

  const showCompleteButton =
    latest?.status === "DRAFT" || latest?.status === "MORE_INFORMATION_REQUIRED";

  return (
    <div className="min-h-full bg-white px-6 py-8 lg:px-10 lg:py-10">
      {/* Status banner */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50">
        <div className="flex items-start gap-4 p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-[18px] font-bold text-amber-900">
              {!latest || latest.status === "DRAFT"
                ? "Application incomplete"
                : latest.status === "MORE_INFORMATION_REQUIRED"
                  ? "More information needed"
                  : "Application under review"}
            </h2>
            <p className="mt-1 text-[14px] text-amber-800">{statusMessage}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {showCompleteButton && (
                <Link
                  href="/therapist-application/new"
                  className="inline-flex h-9 items-center rounded-lg bg-amber-600 px-4 text-[13px] font-semibold text-white hover:bg-amber-700"
                >
                  {latest?.status === "DRAFT" ? "Complete application" : "Update application"}
                </Link>
              )}
              <Link
                href="/therapist-application"
                className="inline-flex h-9 items-center rounded-lg border border-amber-300 bg-white px-4 text-[13px] font-semibold text-amber-800 hover:bg-amber-50"
              >
                View application status
              </Link>
            </div>
          </div>
        </div>

        {/* Progress steps */}
        <div className="border-t border-amber-200 bg-amber-50/50 px-6 py-4">
          <div className="flex items-center gap-6 text-[12px]">
            <Step label="Account created" done />
            <Step label="Application submitted" done={!!latest && latest.status !== "DRAFT"} />
            <Step
              label="Under review"
              done={latest?.status === "UNDER_REVIEW" || latest?.status === "SUBMITTED"}
            />
            <Step label="Approved" done={false} />
          </div>
        </div>
      </div>

      {/* Locked dashboard preview */}
      <div className="mb-6">
        <h1 className="text-[28px] font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          Your practice at a glance — available once approved.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <LockedStatCard label="Pending requests" icon={ClipboardList} />
        <LockedStatCard label="Upcoming sessions" icon={CalendarClock} />
        <LockedStatCard label="Patients" icon={Users} />
      </div>

      <div>
        <h2 className="mb-3 text-[16px] font-bold text-foreground">Today&apos;s sessions</h2>
        <div className="flex flex-col items-center justify-center py-16 text-center opacity-40">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-mindora-lavender text-mindora-purple-light">
            <CalendarX className="h-6 w-6" />
          </div>
          <p className="mb-1 text-[15px] font-bold text-foreground">No sessions yet</p>
          <p className="text-[13.5px] text-muted-foreground">
            You&apos;ll see your sessions here once your application is approved.
          </p>
        </div>
      </div>
    </div>
  );
}

function Step({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      {done ? (
        <CheckCircle2 className="h-4 w-4 text-green-600" />
      ) : (
        <div className="h-4 w-4 rounded-full border-2 border-amber-300" />
      )}
      <span className={done ? "font-semibold text-green-800" : "text-amber-700"}>{label}</span>
    </div>
  );
}
