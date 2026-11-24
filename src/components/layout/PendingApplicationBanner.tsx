"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { useMyTherapistApplications } from "@/hooks/useTherapistApplication";

const SHOW_FOR = new Set(["SUBMITTED", "UNDER_REVIEW", "DRAFT", "MORE_INFORMATION_REQUIRED"]);

export function PendingApplicationBanner() {
  const { data } = useMyTherapistApplications();
  const latest = data?.applications[0] ?? null;

  if (!latest || !SHOW_FOR.has(latest.status)) return null;

  const message =
    latest.status === "DRAFT"
      ? "You have an unfinished therapist application."
      : latest.status === "MORE_INFORMATION_REQUIRED"
        ? "Your therapist application needs more information."
        : "Your therapist application is under review.";

  return (
    <Link
      href="/therapist-application"
      className="flex items-center gap-2 bg-mindora-purple-pale px-4 py-2.5 text-[13px] font-medium text-mindora-purple transition-colors hover:bg-[#ede5ff]"
    >
      <Clock className="h-4 w-4 shrink-0" />
      <span>{message}</span>
      <span className="ml-auto text-xs font-semibold underline">View status</span>
    </Link>
  );
}
