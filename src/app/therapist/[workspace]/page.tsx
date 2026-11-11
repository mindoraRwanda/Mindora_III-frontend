"use client";

import Link from "next/link";
import { useState } from "react";
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
import { useTherapistDashboard, useTherapistPatients, useTherapistSchedule } from "@/hooks/useAppointments";
import { useCreateCarePlan, useTherapistCarePlans, useUpdateCarePlan } from "@/hooks/useCarePlans";
import {
  useArchivePrescriptionDraft,
  useCreatePrescriptionDraft,
  useMedicationReviews,
  usePrescriptionDrafts,
  useReviewMedicationUpdate,
  useUpdatePrescriptionDraft,
} from "@/hooks/useClinicalWorkspace";
import type { PrescriptionDraft } from "@/lib/clinical-workspace-api";
import {
  useCommunityGroups,
  useCommunityMembership,
  useCommunityPosts,
  useCreateCommunityPost,
  useJoinCommunity,
} from "@/hooks/useCommunity";

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
    status: "Encrypted care-plan drafts connected",
    warning:
      "This workspace stores agreed goals and review milestones only. It does not create diagnoses, medication instructions or prescriptions.",
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
    status: "Connected to Community Service",
    warning:
      "Groups, memberships and discussions are loaded from live Community Service records. New groups are created by authorised administrators.",
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


function postText(content: Record<string, unknown>): string {
  const parts: string[] = [];
  const visit = (value: unknown) => {
    if (!value || typeof value !== "object") return;
    const node = value as { text?: unknown; content?: unknown };
    if (typeof node.text === "string") parts.push(node.text);
    if (Array.isArray(node.content)) node.content.forEach(visit);
  };
  visit(content);
  return parts.join(" ").trim() || "This post has no text content.";
}

function parseMilestoneLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 20)
    .flatMap((line) => {
      const [rawTitle, ...dateParts] = line.split("|");
      const title = rawTitle.trim();
      if (!title) return [];
      const date = dateParts.join("|").trim();
      if (!date) return [{ title }];
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return [{ title }];
      return [{ title, dueDate: new Date(date + "T00:00:00+02:00").toISOString() }];
    });
}

function formatMilestoneLines(milestones: Array<{ title: string; dueDate?: string }>) {
  return milestones
    .map((milestone) => {
      const date = milestone.dueDate ? new Date(milestone.dueDate).toISOString().slice(0, 10) : "";
      return milestone.title + (date ? " | " + date : "");
    })
    .join("\n");
}

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
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [communityDraft, setCommunityDraft] = useState("");
  const [communityDraftTitle, setCommunityDraftTitle] = useState("");
  const [anonymousPost, setAnonymousPost] = useState(false);
  const [carePlanPatientId, setCarePlanPatientId] = useState("");
  const [carePlanTitle, setCarePlanTitle] = useState("");
  const [carePlanGoals, setCarePlanGoals] = useState("");
  const [carePlanReviewDate, setCarePlanReviewDate] = useState("");
  const [carePlanMilestones, setCarePlanMilestones] = useState("");
  const [editingCarePlanId, setEditingCarePlanId] = useState<string | null>(null);
  const [editCarePlanTitle, setEditCarePlanTitle] = useState("");
  const [editCarePlanGoals, setEditCarePlanGoals] = useState("");
  const [editCarePlanMilestones, setEditCarePlanMilestones] = useState("");
  const [editCarePlanReviewDate, setEditCarePlanReviewDate] = useState("");
  const [showPrescriptionDraftForm, setShowPrescriptionDraftForm] = useState(false);
  const [editingPrescriptionId, setEditingPrescriptionId] = useState<string | null>(null);
  const [prescriptionStatus, setPrescriptionStatus] = useState<"ALL" | "DRAFT" | "ARCHIVED">("ALL");
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientId: "",
    medicationName: "",
    strength: "",
    frequency: "",
    instructions: "",
  });
  const [medicationStatus, setMedicationStatus] = useState<"ALL" | "PENDING" | "REVIEWED" | "FOLLOW_UP_REQUIRED">("ALL");
  const [medicationReviewNotes, setMedicationReviewNotes] = useState<Record<string, string>>({});
  const carePlanPatients = useTherapistPatients(1, 50);
  const carePlans = useTherapistCarePlans();
  const createCarePlan = useCreateCarePlan();
  const updateCarePlan = useUpdateCarePlan();
  const communityGroups = useCommunityGroups();
  const activeCommunityId = selectedCommunityId ?? communityGroups.data?.groups[0]?._id ?? null;
  const communityPosts = useCommunityPosts(activeCommunityId);
  const communityMembership = useCommunityMembership(activeCommunityId);
  const updateMembership = useJoinCommunity();
  const createPost = useCreateCommunityPost();
  const prescriptionQuery = usePrescriptionDrafts(params.workspace === "prescriptions");
  const createPrescription = useCreatePrescriptionDraft();
  const updatePrescription = useUpdatePrescriptionDraft();
  const archivePrescription = useArchivePrescriptionDraft();
  const medicationReviewQuery = useMedicationReviews(params.workspace === "medication");
  const reviewMedication = useReviewMedicationUpdate();
  const workspaceKey = params.workspace;
  const info = modules[workspaceKey];
  const { data, isLoading, isError } = useTherapistDashboard();
  const scheduleQuery = useTherapistSchedule();
  const [reportNow] = useState(() => Date.now());

  if (!info && workspaceKey !== "reports") {
    return (
      <main className="min-h-full bg-[#f7f6fa] p-8">
        <h1 className="text-2xl font-bold text-[#28243a]">Page not found</h1>
      </main>
    );
  }

  if (workspaceKey === "reports") {
    const appointments = scheduleQuery.data?.appointments ?? [];
    const completedCount = appointments.filter((item) => item.status === "COMPLETED").length;
    const cancelledCount = appointments.filter((item) => item.status === "CANCELLED").length;
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(reportNow);
      date.setDate(date.getDate() - (6 - index));
      const dateKey = date.toISOString().slice(0, 10);
      const completed = appointments.filter(
        (item) => item.status === "COMPLETED" && new Date(item.slotStart).toISOString().slice(0, 10) === dateKey
      ).length;
      return { key: dateKey, label: date.toLocaleDateString("en", { weekday: "short" }), completed };
    });
    const maxCompleted = Math.max(1, ...days.map((day) => day.completed));

    return (
      <main className="min-h-full bg-[#f7f6fa] px-5 py-8 sm:px-7 lg:px-10">
        <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#8a789d]">
          Therapist workspace
        </p>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-[27px] font-extrabold text-[#28243a]">Practice reports</h1>
            <p className="mt-1 text-sm text-[#77758a]">
              Live appointment activity from your own MINDORA schedule.
            </p>
          </div>
          <button type="button" onClick={() => { void scheduleQuery.refetch(); }} className="rounded-xl border border-[#ebe8f1] bg-white px-4 py-2 text-xs font-bold text-[#7350a0]">
            Refresh report
          </button>
        </div>
        {(isError || scheduleQuery.isError) && (
          <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            Could not load the complete live practice report. Retry before using these figures.
          </p>
        )}
        {isLoading || scheduleQuery.isLoading ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((n) => <div key={n} className="h-24 animate-pulse rounded-2xl bg-white" />)}
          </div>
        ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Pending requests" value={data?.pendingCount ?? 0} />
            <Metric label="Upcoming sessions" value={data?.upcomingCount ?? 0} />
            <Metric label="Patients" value={data?.patientCount ?? 0} />
            <Metric label="Completed in loaded records" value={completedCount} />
          </div>
        )}

        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-2xl border border-[#ebe8f1] bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-[#28243a]">Completed sessions · last 7 days</h2>
                <p className="mt-1 text-xs text-[#77758a]">Calculated from your loaded appointment records.</p>
              </div>
              <span className="rounded-full bg-[#f1ecf7] px-2.5 py-1 text-[10px] font-bold text-[#7350a0]">
                {scheduleQuery.data?.total ?? 0} total records
              </span>
            </div>
            <div className="mt-6 grid grid-cols-7 items-end gap-2">
              {days.map((day) => (
                <div key={day.key} className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold text-[#625d70]">{day.completed}</span>
                  <div className="flex h-36 w-full items-end rounded-t-lg bg-[#f5f2f8]">
                    <div
                      className="w-full rounded-t-lg bg-[#8061a8]"
                      style={{ height: `${Math.max(6, (day.completed / maxCompleted) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#8a789d]">{day.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[#ebe8f1] bg-white p-5">
            <h2 className="text-sm font-bold text-[#28243a]">Schedule summary</h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#77758a]">Completed records</span>
                <strong className="text-[#28243a]">{completedCount}</strong>
              </div>
              <div className="h-2 rounded-full bg-[#f1ecf7]">
                <div className="h-2 rounded-full bg-[#5d9b7c]" style={{ width: `${appointments.length ? (completedCount / appointments.length) * 100 : 0}%` }} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#77758a]">Cancelled records</span>
                <strong className="text-[#28243a]">{cancelledCount}</strong>
              </div>
              <div className="h-2 rounded-full bg-[#f1ecf7]">
                <div className="h-2 rounded-full bg-[#d39a63]" style={{ width: `${appointments.length ? (cancelledCount / appointments.length) * 100 : 0}%` }} />
              </div>
              <p className="text-[11px] leading-5 text-[#8a789d]">
                These percentages use the currently loaded schedule page, not a complete clinical outcome measure.
              </p>
            </div>
          </section>
        </div>
        <p className="mt-4 rounded-xl border border-[#ebe8f1] bg-white p-4 text-xs leading-5 text-[#77758a]">
          Reports only summarize scheduling activity. They do not score clinical outcomes or infer patient progress from appointment counts.
        </p>
      </main>
    );
  }

  if (workspaceKey === "medication") {
    const reviews = medicationReviewQuery.data?.medicationReviews ?? [];
    const filteredReviews = reviews.filter(
      (item) => medicationStatus === "ALL" || item.status === medicationStatus
    );
    const patients = carePlanPatients.data?.patients ?? [];
    const patientLabel = (patientId: string) => {
      const patient = patients.find((item) => item.patientId === patientId);
      return patient?.userName?.trim() || "Patient " + patientId.slice(0, 8);
    };

    return (
      <main className="min-h-full bg-[#f7f6fa] px-5 py-8 sm:px-7 lg:px-10">
        <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#8a789d]">Clinical tools</p>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-[27px] font-extrabold text-[#28243a]">Medication management</h1>
            <p className="mt-1 text-sm text-[#77758a]">Review patient-reported medication updates and record follow-up.</p>
          </div>
          <Link href="/therapist/prescriptions" className="rounded-xl bg-[#7350a0] px-4 py-2.5 text-xs font-bold text-white">
            Open prescription drafts
          </Link>
        </div>

        <div className="mt-5 flex gap-3 rounded-2xl border border-[#f0dfbd] bg-[#fff8eb] p-4 text-xs leading-5 text-[#795b2b]">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <div>
            <strong className="block">Medication safety notice</strong>
            This queue records patient-reported updates and your review outcome only. It does not change a medication list, issue treatment instructions or create a prescription.
          </div>
        </div>

        <section className="mt-5 overflow-hidden rounded-2xl border border-[#ebe8f1] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0edf3] px-5 py-4">
            <div>
              <h2 className="text-sm font-bold text-[#28243a]">Medication review queue</h2>
              <p className="mt-1 text-xs text-[#77758a]">Live patient requests assigned to your therapist account.</p>
            </div>
            <select
              value={medicationStatus}
              onChange={(event) => setMedicationStatus(event.target.value as typeof medicationStatus)}
              className="rounded-xl border border-[#e4deeb] bg-white px-3 py-2 text-xs font-semibold text-[#625d70]"
              aria-label="Filter medication requests by status"
            >
              <option value="ALL">All statuses</option>
              <option value="PENDING">Pending review</option>
              <option value="REVIEWED">Reviewed</option>
              <option value="FOLLOW_UP_REQUIRED">Follow-up required</option>
            </select>
          </div>

          {medicationReviewQuery.isError && (
            <div role="alert" className="flex flex-wrap items-center justify-between gap-3 bg-red-50 p-5 text-xs text-red-700">
              <span>{medicationReviewQuery.error instanceof Error ? medicationReviewQuery.error.message : "Medication updates could not be loaded."}</span>
              <button type="button" onClick={() => void medicationReviewQuery.refetch()} className="rounded-lg border border-red-200 bg-white px-3 py-2 font-bold">
                Retry
              </button>
            </div>
          )}

          {medicationReviewQuery.isLoading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3].map((item) => <div key={item} className="h-28 animate-pulse rounded-xl bg-[#f7f6fa]" />)}
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Pill className="mx-auto h-7 w-7 text-[#9a86b3]" />
              <h3 className="mt-3 text-sm font-bold text-[#28243a]">No medication updates in this view</h3>
              <p className="mx-auto mt-2 max-w-[430px] text-xs leading-5 text-[#77758a]">
                Patient-submitted updates will appear here when they are linked to an appointment relationship with you. No sample medication records are displayed.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#f0edf3]">
              {filteredReviews.map((item) => (
                <article key={item.id} className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-[#28243a]">{patientLabel(item.patientId)}</p>
                      <p className="mt-1 text-xs text-[#77758a]">
                        Submitted {new Date(item.createdAt).toLocaleString()} · {item.updateType.replaceAll("_", " ").toLowerCase()}
                      </p>
                    </div>
                    <span className={[
                      "rounded-full px-3 py-1.5 text-[10px] font-bold",
                      item.status === "PENDING" ? "bg-[#fff5e5] text-[#8d641f]" :
                      item.status === "REVIEWED" ? "bg-[#e8f5ef] text-[#39765e]" :
                      "bg-[#ebf2fb] text-[#47688f]",
                    ].join(" ")}>
                      {item.status.replaceAll("_", " ")}
                    </span>
                  </div>
                  <div className="mt-4 rounded-xl bg-[#faf9fc] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#8a789d]">Medication reported by patient</p>
                    <p className="mt-1 text-xs font-semibold text-[#28243a]">{item.medicationName}</p>
                    {item.note && <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-[#625d70]">{item.note}</p>}
                    {item.reviewNote && (
                      <div className="mt-3 border-t border-[#ebe8f1] pt-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#8a789d]">Previous review note</p>
                        <p className="mt-1 whitespace-pre-wrap text-xs leading-5 text-[#625d70]">{item.reviewNote}</p>
                      </div>
                    )}
                  </div>
                  {item.status !== "REVIEWED" && (
                    <div className="mt-4">
                      <label htmlFor={"med-review-" + item.id} className="block text-[11px] font-semibold text-[#625d70]">
                        Review note (optional)
                      </label>
                      <textarea
                        id={"med-review-" + item.id}
                        maxLength={2000}
                        rows={2}
                        value={medicationReviewNotes[item.id] ?? ""}
                        onChange={(event) => setMedicationReviewNotes((current) => ({ ...current, [item.id]: event.target.value }))}
                        placeholder="Record review context or next-step follow-up."
                        className="mt-2 w-full rounded-xl border border-[#e4deeb] bg-white p-3 text-xs text-[#28243a]"
                      />
                      <div className="mt-3 flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          disabled={reviewMedication.isPending}
                          onClick={() => reviewMedication.mutate({
                            id: item.id,
                            input: { status: "FOLLOW_UP_REQUIRED", reviewNote: medicationReviewNotes[item.id] ?? "" },
                          })}
                          className="rounded-xl border border-[#d7e3f1] bg-white px-3 py-2 text-[11px] font-bold text-[#47688f] disabled:opacity-50"
                        >
                          Follow-up required
                        </button>
                        <button
                          type="button"
                          disabled={reviewMedication.isPending}
                          onClick={() => reviewMedication.mutate({
                            id: item.id,
                            input: { status: "REVIEWED", reviewNote: medicationReviewNotes[item.id] ?? "" },
                          })}
                          className="rounded-xl bg-[#7350a0] px-3 py-2 text-[11px] font-bold text-white disabled:opacity-50"
                        >
                          Mark reviewed
                        </button>
                      </div>
                    </div>
                  )}
                  {item.reviewedAt && (
                    <p className="mt-3 text-[10px] text-[#8a789d]">
                      Review recorded {new Date(item.reviewedAt).toLocaleString()}.
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    );
  }

  if (workspaceKey === "prescriptions") {
    const drafts = (prescriptionQuery.data?.prescriptionDrafts ?? []).filter(
      (draft) => prescriptionStatus === "ALL" || draft.status === prescriptionStatus
    );
    const patients = carePlanPatients.data?.patients ?? [];
    const patientOptions = patients.map((patient) => ({
      value: patient.patientId,
      label: patient.userName?.trim() || "Patient " + patient.patientId.slice(0, 8),
    }));
    const patientLabel = (patientId: string) => {
      const patient = patients.find((item) => item.patientId === patientId);
      return patient?.userName?.trim() || "Patient " + patientId.slice(0, 8);
    };

    function resetPrescriptionForm() {
      setEditingPrescriptionId(null);
      setPrescriptionForm({ patientId: "", medicationName: "", strength: "", frequency: "", instructions: "" });
      setShowPrescriptionDraftForm(false);
    }

    function editPrescriptionDraft(draft: PrescriptionDraft) {
      setEditingPrescriptionId(draft.id);
      setPrescriptionForm({
        patientId: draft.patientId,
        medicationName: draft.medicationName,
        strength: draft.strength,
        frequency: draft.frequency,
        instructions: draft.instructions,
      });
      setShowPrescriptionDraftForm(true);
    }

    function submitPrescriptionDraft(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      if (!prescriptionForm.patientId || !prescriptionForm.medicationName.trim()) return;
      const input = {
        patientId: prescriptionForm.patientId,
        medicationName: prescriptionForm.medicationName.trim(),
        strength: prescriptionForm.strength.trim(),
        frequency: prescriptionForm.frequency.trim(),
        instructions: prescriptionForm.instructions.trim(),
      };
      if (editingPrescriptionId) {
        updatePrescription.mutate(
          { id: editingPrescriptionId, input: {
            medicationName: input.medicationName,
            strength: input.strength,
            frequency: input.frequency,
            instructions: input.instructions,
          }},
          { onSuccess: resetPrescriptionForm }
        );
      } else {
        createPrescription.mutate(input, { onSuccess: resetPrescriptionForm });
      }
    }

    return (
      <main className="min-h-full bg-[#f7f6fa] px-5 py-8 sm:px-7 lg:px-10">
        <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#8a789d]">Clinical tools</p>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-[27px] font-extrabold text-[#28243a]">Prescription drafts</h1>
            <p className="mt-1 text-sm text-[#77758a]">Create and maintain encrypted drafts for clinical review.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (showPrescriptionDraftForm) resetPrescriptionForm();
              else setShowPrescriptionDraftForm(true);
            }}
            className="rounded-xl bg-[#7350a0] px-4 py-2.5 text-xs font-bold text-white"
          >
            {showPrescriptionDraftForm ? "Close draft form" : "New prescription draft"}
          </button>
        </div>

        <div className="mt-5 flex gap-3 rounded-2xl border border-[#f0dfbd] bg-[#fff8eb] p-4 text-xs leading-5 text-[#795b2b]">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <div>
            <strong className="block">Clinical safety boundary</strong>
            These are encrypted preparation drafts only. Saving or archiving a draft does not sign, issue, dispense or send a prescription to a pharmacy or patient. Clinical authorisation and a separately approved prescribing workflow are still required.
          </div>
        </div>

        {showPrescriptionDraftForm && (
          <form onSubmit={submitPrescriptionDraft} className="mt-5 rounded-2xl border border-[#ebe8f1] bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-[#28243a]">{editingPrescriptionId ? "Edit prescription draft" : "New prescription draft"}</h2>
                <p className="mt-1 text-xs text-[#77758a]">Only available for patients with an appointment relationship to you.</p>
              </div>
              <FileText className="h-5 w-5 text-[#7350a0]" />
            </div>
            {carePlanPatients.isError && (
              <p role="alert" className="mt-3 text-xs text-red-700">Your patient list could not be loaded. Retry before creating a draft.</p>
            )}
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="text-xs font-semibold text-[#625d70] md:col-span-2">
                Patient
                <select
                  required
                  disabled={!!editingPrescriptionId || carePlanPatients.isLoading || patientOptions.length === 0}
                  value={prescriptionForm.patientId}
                  onChange={(event) => setPrescriptionForm((current) => ({ ...current, patientId: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-[#e4deeb] bg-white p-3 text-xs text-[#28243a]"
                >
                  <option value="">Select a patient</option>
                  {patientOptions.map((patient) => <option key={patient.value} value={patient.value}>{patient.label}</option>)}
                </select>
              </label>
              <label className="text-xs font-semibold text-[#625d70] md:col-span-2">
                Medication name
                <input
                  required
                  maxLength={160}
                  value={prescriptionForm.medicationName}
                  onChange={(event) => setPrescriptionForm((current) => ({ ...current, medicationName: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-[#e4deeb] p-3 text-xs text-[#28243a]"
                />
              </label>
              <label className="text-xs font-semibold text-[#625d70]">
                Strength / dose
                <input
                  maxLength={120}
                  value={prescriptionForm.strength}
                  onChange={(event) => setPrescriptionForm((current) => ({ ...current, strength: event.target.value }))}
                  placeholder="Enter only as an authorised clinician"
                  className="mt-2 w-full rounded-xl border border-[#e4deeb] p-3 text-xs text-[#28243a]"
                />
              </label>
              <label className="text-xs font-semibold text-[#625d70]">
                Frequency
                <input
                  maxLength={160}
                  value={prescriptionForm.frequency}
                  onChange={(event) => setPrescriptionForm((current) => ({ ...current, frequency: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-[#e4deeb] p-3 text-xs text-[#28243a]"
                />
              </label>
              <label className="text-xs font-semibold text-[#625d70] md:col-span-2">
                Clinical instructions for draft review
                <textarea
                  rows={4}
                  maxLength={2000}
                  value={prescriptionForm.instructions}
                  onChange={(event) => setPrescriptionForm((current) => ({ ...current, instructions: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-[#e4deeb] p-3 text-xs text-[#28243a]"
                />
              </label>
            </div>
            {patientOptions.length === 0 && !carePlanPatients.isLoading && (
              <p className="mt-3 rounded-xl bg-[#faf9fc] p-3 text-xs text-[#77758a]">
                No assigned patient relationships are available for this account. A draft cannot be created without an eligible patient.
              </p>
            )}
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button type="button" onClick={resetPrescriptionForm} className="rounded-xl border border-[#e4deeb] px-4 py-2.5 text-xs font-bold text-[#625d70]">
                Cancel
              </button>
              <button
                type="submit"
                disabled={!prescriptionForm.patientId || !prescriptionForm.medicationName.trim() || createPrescription.isPending || updatePrescription.isPending}
                className="rounded-xl bg-[#7350a0] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50"
              >
                {createPrescription.isPending || updatePrescription.isPending ? "Saving…" : editingPrescriptionId ? "Save changes" : "Save encrypted draft"}
              </button>
            </div>
          </form>
        )}

        <section className="mt-5 overflow-hidden rounded-2xl border border-[#ebe8f1] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0edf3] px-5 py-4">
            <div>
              <h2 className="text-sm font-bold text-[#28243a]">Recent prescription drafts</h2>
              <p className="mt-1 text-xs text-[#77758a]">Encrypted records from your therapist account.</p>
            </div>
            <select
              value={prescriptionStatus}
              onChange={(event) => setPrescriptionStatus(event.target.value as typeof prescriptionStatus)}
              className="rounded-xl border border-[#e4deeb] bg-white px-3 py-2 text-xs font-semibold text-[#625d70]"
              aria-label="Filter prescription drafts"
            >
              <option value="ALL">All drafts</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          {prescriptionQuery.isError && (
            <div role="alert" className="flex flex-wrap items-center justify-between gap-3 bg-red-50 p-5 text-xs text-red-700">
              <span>{prescriptionQuery.error instanceof Error ? prescriptionQuery.error.message : "Prescription drafts could not be loaded."}</span>
              <button type="button" onClick={() => void prescriptionQuery.refetch()} className="rounded-lg border border-red-200 bg-white px-3 py-2 font-bold">
                Retry
              </button>
            </div>
          )}
          {prescriptionQuery.isLoading ? (
            <div className="space-y-3 p-5">{[1, 2, 3].map((item) => <div key={item} className="h-16 animate-pulse rounded-xl bg-[#f7f6fa]" />)}</div>
          ) : drafts.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <FileText className="mx-auto h-7 w-7 text-[#9a86b3]" />
              <h3 className="mt-3 text-sm font-bold text-[#28243a]">No prescription drafts in this view</h3>
              <p className="mt-2 text-xs text-[#77758a]">New drafts you create will appear here. No sample or fabricated draft records are included.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#f0edf3]">
              {drafts.map((draft) => (
                <article key={draft.id} className="flex flex-wrap items-start justify-between gap-4 p-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-[#28243a]">{draft.medicationName}</h3>
                      <span className={draft.status === "DRAFT" ? "rounded-full bg-[#fff5e5] px-2.5 py-1 text-[10px] font-bold text-[#8d641f]" : "rounded-full bg-[#f0eff3] px-2.5 py-1 text-[10px] font-bold text-[#777483]"}>
                        {draft.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#77758a]">{patientLabel(draft.patientId)}</p>
                    <p className="mt-2 text-xs text-[#625d70]">
                      {[draft.strength, draft.frequency].filter(Boolean).join(" · ") || "No strength or frequency details"}
                    </p>
                    {draft.instructions && <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-[#77758a]">{draft.instructions}</p>}
                    <p className="mt-2 text-[10px] text-[#9691a0]">Updated {new Date(draft.updatedAt).toLocaleString()}</p>
                  </div>
                  {draft.status === "DRAFT" && (
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => editPrescriptionDraft(draft)} className="rounded-lg border border-[#e4deeb] px-3 py-2 text-[11px] font-bold text-[#7350a0]">
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={archivePrescription.isPending}
                        onClick={() => {
                          if (window.confirm("Archive this draft? This will not issue or send a prescription.")) archivePrescription.mutate(draft.id);
                        }}
                        className="rounded-lg border border-[#f0d7d9] px-3 py-2 text-[11px] font-bold text-[#b84d58] disabled:opacity-50"
                      >
                        Archive
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
        <p className="mt-4 rounded-xl border border-[#ebe8f1] bg-white p-4 text-[11px] leading-5 text-[#77758a]">
          A saved draft remains a draft. This workspace has no signing, issuing, dispensing or pharmacy-transmission action.
        </p>
      </main>
    );
  }

  if (workspaceKey === "communities") {
    const groups = communityGroups.data?.groups ?? [];
    const activeGroup = groups.find((group) => group._id === activeCommunityId) ?? null;
    const joined = communityMembership.data?.joined ?? false;

    return (
      <main className="min-h-full bg-[#f7f6fa] px-5 py-8 sm:px-7 lg:px-10">
        <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#8a789d]">
          Therapist workspace
        </p>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-[27px] font-extrabold text-[#28243a]">Professional communities</h1>
            <p className="mt-1 text-sm text-[#77758a]">
              Real MINDORA groups and discussions from the Community Service.
            </p>
          </div>
          <span className="rounded-full bg-[#e8f5ef] px-3 py-2 text-[10px] font-bold text-[#39765e]">
            Connected to Community Service
          </span>
        </div>

        {communityGroups.isError && (
          <div role="alert" className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            <span>Community groups could not be loaded.</span>
            <button type="button" onClick={() => communityGroups.refetch()} className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold">
              Retry
            </button>
          </div>
        )}

        {communityGroups.isLoading ? (
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {[1, 2, 3, 4].map((n) => <div key={n} className="h-28 animate-pulse rounded-2xl bg-white" />)}
          </div>
        ) : groups.length === 0 ? (
          <section className="mt-6 rounded-2xl border border-[#ebe8f1] bg-white p-8 text-center">
            <h2 className="text-sm font-bold text-[#28243a]">No communities have been created yet</h2>
            <p className="mt-2 text-xs text-[#77758a]">An administrator must create a group before it appears here.</p>
          </section>
        ) : (
          <>
            <section className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {groups.map((group) => (
                <button
                  type="button"
                  key={group._id}
                  onClick={() => setSelectedCommunityId(group._id)}
                  className={[
                    "rounded-2xl border bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-sm",
                    activeCommunityId === group._id ? "border-[#9072b2] ring-2 ring-[#9072b2]/15" : "border-[#ebe8f1]",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#f1ecf7] px-2.5 py-1 text-[10px] font-bold text-[#7350a0]">{group.category}</span>
                    <span className="text-[10px] text-[#8a789d]">{group.memberCount.toLocaleString()} members</span>
                  </div>
                  <h2 className="mt-3 text-sm font-bold text-[#28243a]">{group.name}</h2>
                  <p className="mt-2 line-clamp-3 text-xs leading-5 text-[#77758a]">{group.description}</p>
                </button>
              ))}
            </section>

            {activeGroup && (
              <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="min-w-0 space-y-4">
                  <div className="rounded-2xl border border-[#ebe8f1] bg-white p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#8a789d]">{activeGroup.category}</p>
                        <h2 className="mt-1 text-lg font-extrabold text-[#28243a]">{activeGroup.name}</h2>
                        <p className="mt-1 text-xs leading-5 text-[#77758a]">{activeGroup.description}</p>
                      </div>
                      <button
                        type="button"
                        disabled={communityMembership.isLoading || updateMembership.isPending || communityMembership.isError}
                        onClick={() => updateMembership.mutate({ groupId: activeGroup._id, join: !joined })}
                        className="rounded-xl bg-[#7350a0] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50"
                      >
                        {updateMembership.isPending ? "Saving…" : joined ? "Leave group" : "Join group"}
                      </button>
                    </div>
                    {communityMembership.isError && (
                      <p role="alert" className="mt-3 text-xs text-red-700">Membership status could not be checked. Refresh this group and try again.</p>
                    )}
                  </div>

                  {joined && (
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        if (!communityDraftTitle.trim() || !communityDraft.trim()) return;
                        createPost.mutate(
                          { groupId: activeGroup._id, title: communityDraftTitle, message: communityDraft, isAnonymous: anonymousPost },
                          { onSuccess: () => { setCommunityDraft(""); setCommunityDraftTitle(""); } }
                        );
                      }}
                      className="rounded-2xl border border-[#ebe8f1] bg-white p-5"
                    >
                      <label htmlFor="community-post" className="text-sm font-bold text-[#28243a]">Share with this community</label>
                      <label htmlFor="community-post-title" className="mt-3 block text-xs font-semibold text-[#625d70]">Post title</label>
                      <input
                        id="community-post-title"
                        maxLength={160}
                        value={communityDraftTitle}
                        onChange={(event) => setCommunityDraftTitle(event.target.value)}
                        placeholder="Start a discussion"
                        className="mt-2 w-full rounded-xl border border-[#e4deeb] bg-[#fcfbfd] p-3 text-sm text-[#28243a] outline-none focus:border-[#9072b2]"
                      />
                      <textarea
                        id="community-post"
                        value={communityDraft}
                        onChange={(event) => setCommunityDraft(event.target.value)}
                        rows={4}
                        maxLength={10000}
                        placeholder="Write a supportive, professional message…"
                        className="mt-3 w-full rounded-xl border border-[#e4deeb] bg-[#fcfbfd] p-3 text-sm text-[#28243a] outline-none focus:border-[#9072b2]"
                      />
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        <label className="flex items-center gap-2 text-xs text-[#625d70]">
                          <input type="checkbox" checked={anonymousPost} onChange={(event) => setAnonymousPost(event.target.checked)} />
                          Post anonymously
                        </label>
                        <button type="submit" disabled={!communityDraftTitle.trim() || !communityDraft.trim() || createPost.isPending} className="rounded-xl bg-[#7350a0] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50">
                          {createPost.isPending ? "Publishing…" : "Publish post"}
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="overflow-hidden rounded-2xl border border-[#ebe8f1] bg-white">
                    <div className="border-b border-[#f0edf3] px-5 py-4">
                      <h3 className="text-sm font-bold text-[#28243a]">Community discussion</h3>
                      <p className="mt-1 text-xs text-[#77758a]">Posts are loaded from the live group feed.</p>
                    </div>
                    {communityPosts.isLoading ? (
                      <div className="space-y-3 p-5">{[1, 2, 3].map((n) => <div key={n} className="h-20 animate-pulse rounded-xl bg-[#f5f3f8]" />)}</div>
                    ) : communityPosts.isError ? (
                      <div className="p-6 text-sm text-red-700">
                        <p>Posts could not be loaded.</p>
                        <button type="button" onClick={() => communityPosts.refetch()} className="mt-3 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold">Retry</button>
                      </div>
                    ) : (communityPosts.data?.posts.length ?? 0) === 0 ? (
                      <p className="p-7 text-center text-xs text-[#77758a]">No posts in this group yet. Be the first to share a supportive message.</p>
                    ) : (
                      communityPosts.data?.posts.map((post) => (
                        <article key={post._id} className="border-b border-[#f0edf3] p-5 last:border-0">
                          <div className="flex items-center justify-between gap-3">
                            <strong className="text-xs text-[#28243a]">{post.isAnonymous ? "Community member" : post.userName ?? "Member"}</strong>
                            <time className="text-[10px] text-[#9993a2]">{new Date(post.createdAt).toLocaleString()}</time>
                          </div>
                          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#625d70]">{postText(post.content)}</p>
                          <p className="mt-3 text-[10px] text-[#8a789d]">
                            {(post.reactions ?? []).reduce((sum, reaction) => sum + reaction.count, 0)} reactions · {post.commentCount} comments
                          </p>
                        </article>
                      ))
                    )}
                  </div>
                </div>

                <aside className="h-fit rounded-2xl border border-[#ebe8f1] bg-white p-5">
                  <h3 className="text-sm font-bold text-[#28243a]">Community guidelines</h3>
                  <ul className="mt-3 space-y-3 text-xs leading-5 text-[#77758a]">
                    <li>Protect patient and colleague confidentiality.</li>
                    <li>Do not share identifiable case details or private clinical records.</li>
                    <li>Keep discussions respectful, supportive and professional.</li>
                    <li>Report unsafe or inappropriate posts for moderator review.</li>
                  </ul>
                  <div className="mt-4 rounded-xl bg-[#fff8eb] p-3 text-[11px] leading-5 text-[#795b2b]">
                    Communities support peer discussion; they are not an emergency service or a substitute for clinical supervision.
                  </div>
                </aside>
              </section>
            )}
          </>
        )}
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
