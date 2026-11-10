"use client";

import { useParams } from "next/navigation";
import {
  AlertTriangle,
  ClipboardList,
  FileText,
  Pill,
  ShieldCheck,
  Users,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTherapistDashboard } from "@/hooks/useAppointments";

type ModuleInfo = {
  title: string;
  subtitle: string;
  status: string;
  warning: string;
  icon: LucideIcon;
  points: string[];
};

const modules: Record<string, ModuleInfo> = {
  "treatment-plans": {
    title: "Treatment plans",
    subtitle: "Create structured care plans and review agreed patient goals.",
    status: "Plan storage API not connected",
    warning:
      "The supplied MINDORA V3 frontend API does not expose a treatment-plan endpoint. This screen is a workflow preview; it does not create or save clinical plans.",
    icon: ClipboardList,
    points: [
      "Agree goals collaboratively with the patient",
      "Define milestones and review dates",
      "Review progress after a clinical session",
    ],
  },
  medication: {
    title: "Medication overview",
    subtitle: "A protected workspace for authorised medication review.",
    status: "Clinical workflow not connected",
    warning:
      "No verified V3 medication endpoint is available. No sample medication records are shown and no medication instructions can be changed here.",
    icon: Pill,
    points: [
      "Medication review queue is unavailable",
      "Allergy and interaction checks must be part of an approved clinical workflow",
      "Only authorised clinicians may change patient medication records",
    ],
  },
  prescriptions: {
    title: "Prescriptions",
    subtitle: "A protected prescription workflow for authorised clinical staff.",
    status: "Prescription service not connected",
    warning:
      "The current V3 API does not expose a verified prescription workflow. No prescription is issued, signed, saved or sent to a pharmacy from this page.",
    icon: FileText,
    points: [
      "Verify clinician permissions and patient identity",
      "Require medicine and dosage safety checks",
      "Keep authorisation and audit history before issuing",
    ],
  },
  communities: {
    title: "Professional communities",
    subtitle: "Connect with peers around clinical practice and learning.",
    status: "Community Service unavailable",
    warning:
      "The supplied frontend API notes that Community Service is not deployed in V1. These are planned areas, not active groups; no membership or posts are created.",
    icon: Users,
    points: ["Clinical practice circle", "Wellbeing at work", "Trauma-informed care"],
  },
  "video-sessions": {
    title: "Video sessions",
    subtitle: "Review scheduled teletherapy sessions and session-readiness checks.",
    status: "Video provider not connected",
    warning:
      "The video room in the HTML prototype was a visual preview only. No camera, microphone, meeting link or recording is started here.",
    icon: Video,
    points: [
      "Connect an approved video provider",
      "Use authenticated, time-limited session links",
      "Do not record without informed consent and authorisation",
    ],
  },
};

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[#ebe8f1] bg-white p-5">
      <p className="text-2xl font-extrabold text-[#28243a]">{value.toLocaleString()}</p>
      <p className="mt-1 text-xs text-[#77758a]">{label}</p>
    </div>
  );
}

export default function TherapistWorkspaceModulePage() {
  const params = useParams<{ workspace: string }>();
  const workspaceKey = params.workspace;
  const info = modules[workspaceKey];
  const { data, isLoading, isError } = useTherapistDashboard();

  if (!info && workspaceKey !== "reports") {
    return (
      <main className="min-h-full bg-[#f7f6fa] p-8">
        <h1 className="text-2xl font-bold text-[#28243a]">Page not found</h1>
      </main>
    );
  }

  if (workspaceKey === "reports") {
    return (
      <main className="min-h-full bg-[#f7f6fa] px-5 py-8 sm:px-7 lg:px-10">
        <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#8a789d]">
          Therapist workspace
        </p>
        <h1 className="mt-2 text-[27px] font-extrabold text-[#28243a]">Practice reports</h1>
        <p className="mt-1 text-sm text-[#77758a]">
          Live summary from the connected MINDORA V3 therapist dashboard.
        </p>
        {isError && (
          <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            Could not load live therapist metrics.
          </p>
        )}
        {isLoading ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-24 animate-pulse rounded-2xl bg-white" />
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Pending requests" value={data?.pendingCount ?? 0} />
            <Metric label="Upcoming sessions" value={data?.upcomingCount ?? 0} />
            <Metric label="Patients" value={data?.patientCount ?? 0} />
            <Metric label="Today's sessions" value={data?.todaysSessions?.length ?? 0} />
          </div>
        )}
        <p className="mt-5 rounded-xl border border-[#ebe8f1] bg-white p-4 text-xs leading-5 text-[#77758a]">
          The current API provides these live totals only. Monthly trends and clinical outcome
          charts from the prototype are not fabricated or presented as real patient data.
        </p>
      </main>
    );
  }

  if (!info) {
    return (
      <main className="min-h-full bg-[#f7f6fa] p-8">
        <h1 className="text-2xl font-bold text-[#28243a]">Page not found</h1>
      </main>
    );
  }

  const Icon = info.icon;

  return (
    <main className="min-h-full bg-[#f7f6fa] px-5 py-8 sm:px-7 lg:px-10">
      <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#8a789d]">
        Therapist workspace
      </p>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[27px] font-extrabold text-[#28243a]">{info.title}</h1>
          <p className="mt-1 text-sm text-[#77758a]">{info.subtitle}</p>
        </div>
        <span className="rounded-full bg-[#fff5e5] px-3 py-2 text-[10px] font-extrabold text-[#8d641f]">
          {info.status}
        </span>
      </div>
      <div className="mt-5 flex gap-3 rounded-2xl border border-[#f0dfbd] bg-[#fff8eb] p-4 text-xs leading-5 text-[#795b2b]">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        {info.warning}
      </div>
      <section className="mt-5 rounded-2xl border border-[#ebe8f1] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f1ecf7] text-[#7350a0]">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-[#28243a]">Prototype workflow</h2>
            <p className="text-xs text-[#77758a]">
              The section is included without creating fictional clinical records.
            </p>
          </div>
        </div>
        <ul className="mt-4 space-y-3 border-t border-[#f0edf3] pt-4">
          {info.points.map((point) => (
            <li key={point} className="flex items-start gap-2 text-xs leading-5 text-[#625d70]">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9b82b8]" />
              {point}
            </li>
          ))}
        </ul>
      </section>
      <div className="mt-5 flex gap-2 rounded-xl bg-[#e8f5ef] p-4 text-xs leading-5 text-[#39765e]">
        <ShieldCheck className="h-4 w-4 shrink-0" />
        Patient data and clinical actions remain protected by the existing V3 role and API
        permissions.
      </div>
    </main>
  );
}
