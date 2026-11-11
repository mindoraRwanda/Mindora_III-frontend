"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CalendarX, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TherapistCard } from "@/components/therapy/TherapistCard";
import { AppointmentRow } from "@/components/therapy/AppointmentRow";
import { BookingDialog } from "@/components/therapy/BookingDialog";
import { CancelDialog } from "@/components/therapy/CancelDialog";
import { RateDialog } from "@/components/therapy/RateDialog";
import { GetStartedDialog } from "@/components/therapy/GetStartedDialog";
import { useTherapists } from "@/hooks/useTherapists";
import { useMyAppointments } from "@/hooks/useAppointments";
import { useSubmitMedicationUpdate } from "@/hooks/useClinicalWorkspace";
import type { MedicationUpdateType } from "@/lib/clinical-workspace-api";
import { filterAppointmentsByTab, type AppointmentTab } from "@/lib/appointments";
import type { BookedAppointment, TherapistProfile } from "@/types/domain";
import { cn } from "@/lib/utils";

type BrowseTab = "browse" | "mine";
type MineStatus = AppointmentTab;

export default function TherapyPage() {
  const router = useRouter();
  const [tab, setTab] = useState<BrowseTab>("browse");
  const [search, setSearch] = useState("");
  const [mineStatus, setMineStatus] = useState<MineStatus>("upcoming");

  const [startTherapist, setStartTherapist] = useState<TherapistProfile | null>(null);
  const [bookingTherapist, setBookingTherapist] = useState<TherapistProfile | null>(null);
  const [cancelTarget, setCancelTarget] = useState<BookedAppointment | null>(null);
  const [rateTarget, setRateTarget] = useState<BookedAppointment | null>(null);
  const [medicationUpdateTarget, setMedicationUpdateTarget] =
    useState<BookedAppointment | null>(null);
  const [medicationUpdateForm, setMedicationUpdateForm] = useState({
    medicationName: "",
    updateType: "QUESTION" as MedicationUpdateType,
    note: "",
  });
  const submitMedicationUpdate = useSubmitMedicationUpdate();

  const {
    data: therapistData,
    isLoading: therapistsLoading,
    isError: therapistsErrored,
    error: therapistsError,
    refetch: refetchTherapists,
  } = useTherapists({});
  const therapists = useMemo(() => therapistData?.therapists ?? [], [therapistData]);

  const therapistByUserId = useMemo(() => {
    const map = new Map<string, TherapistProfile>();
    therapists.forEach((t) => map.set(t.userId, t));
    return map;
  }, [therapists]);

  const specialtyOptions = useMemo(() => {
    const set = new Set(therapists.map((t) => t.specialisation).filter((s): s is string => !!s));
    return Array.from(set).sort();
  }, [therapists]);
  const languageOptions = useMemo(() => {
    const set = new Set<string>();
    therapists.forEach((t) => t.languages.forEach((l) => set.add(l)));
    return Array.from(set).sort();
  }, [therapists]);

  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [filterLanguage, setFilterLanguage] = useState("all");

  const filteredTherapists = useMemo(() => {
    const q = search.trim().toLowerCase();
    return therapists.filter((t) => {
      const matchesSearch =
        !q ||
        (t.userName ?? "").toLowerCase().includes(q) ||
        (t.specialisation ?? "").toLowerCase().includes(q);
      const matchesSpecialty = filterSpecialty === "all" || t.specialisation === filterSpecialty;
      const matchesLanguage = filterLanguage === "all" || t.languages.includes(filterLanguage);
      return matchesSearch && matchesSpecialty && matchesLanguage;
    });
  }, [therapists, search, filterSpecialty, filterLanguage]);

  const {
    data: appointmentData,
    isLoading: appointmentsLoading,
    isError: appointmentsErrored,
    error: appointmentsError,
  } = useMyAppointments();
  const appointments = useMemo(() => appointmentData?.appointments ?? [], [appointmentData]);

  // Snapshot from mount, not a direct Date.now() call inside the memo below:
  // React's purity rules forbid calling impure functions during render.
  const [now] = useState(() => Date.now());

  const filteredAppointments = useMemo(
    () => filterAppointmentsByTab(appointments, mineStatus, now),
    [appointments, mineStatus, now]
  );

  function therapistNameFor(therapistId: string): string {
    return therapistByUserId.get(therapistId)?.userName ?? "Therapist";
  }

  function therapistPhotoFor(therapistId: string): string | null {
    return therapistByUserId.get(therapistId)?.photoUrl ?? null;
  }

  function openMedicationUpdate(appointment: BookedAppointment) {
    setMedicationUpdateTarget(appointment);
    setMedicationUpdateForm({ medicationName: "", updateType: "QUESTION", note: "" });
    submitMedicationUpdate.reset();
  }

  function handleMedicationUpdateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!medicationUpdateTarget || !medicationUpdateForm.medicationName.trim()) return;

    submitMedicationUpdate.mutate(
      {
        therapistId: medicationUpdateTarget.therapistId,
        medicationName: medicationUpdateForm.medicationName.trim(),
        updateType: medicationUpdateForm.updateType,
        note: medicationUpdateForm.note.trim(),
      },
      {
        onSuccess: () => {
          setMedicationUpdateTarget(null);
          setMedicationUpdateForm({ medicationName: "", updateType: "QUESTION", note: "" });
        },
      }
    );
  }

  function closeMedicationUpdate(open: boolean) {
    if (!open) {
      setMedicationUpdateTarget(null);
      setMedicationUpdateForm({ medicationName: "", updateType: "QUESTION", note: "" });
      submitMedicationUpdate.reset();
    }
  }

  const emptyMineCopy: Record<MineStatus, { title: string; subtitle: string }> = {
    upcoming: {
      title: "No upcoming appointments",
      subtitle: "Book a session with a therapist to see it here.",
    },
    past: { title: "No past sessions yet", subtitle: "Completed sessions will show up here." },
    cancelled: {
      title: "No cancelled appointments",
      subtitle: "Cancelled sessions will show up here.",
    },
  };

  return (
    <div className="min-h-full bg-[#eae6f4] px-6 py-8 lg:px-10 lg:py-10">
      <div className="mb-6">
        <h1 className="text-[30px] font-bold tracking-tight text-foreground">Appointments</h1>
        <p className="mt-1.5 text-[14.5px] text-muted-foreground">
          Find a therapist or manage your upcoming sessions.
        </p>
      </div>

      <div className="mb-5 inline-flex gap-0.5 rounded-[13px] p-1 shadow-[inset_3px_3px_7px_#cdc6e0,inset_-3px_-3px_7px_#fdfbff]">
        <button
          type="button"
          onClick={() => setTab("browse")}
          className={cn(
            "rounded-[10px] px-4.5 py-2.5 text-[13.5px] font-semibold",
            tab === "browse"
              ? "bg-white text-mindora-purple-dark shadow-[3px_3px_7px_#cdc6e0,-3px_-3px_7px_#fdfbff]"
              : "text-muted-foreground"
          )}
        >
          Browse
        </button>
        <button
          type="button"
          onClick={() => setTab("mine")}
          className={cn(
            "rounded-[10px] px-4.5 py-2.5 text-[13.5px] font-semibold",
            tab === "mine"
              ? "bg-white text-mindora-purple-dark shadow-[3px_3px_7px_#cdc6e0,-3px_-3px_7px_#fdfbff]"
              : "text-muted-foreground"
          )}
        >
          My appointments
        </button>
      </div>

      {tab === "browse" && (
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] max-w-[320px] flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or specialisation"
                className="border-0 bg-transparent pl-9 shadow-[inset_3px_3px_7px_#cdc6e0,inset_-3px_-3px_7px_#fdfbff] focus-visible:ring-2"
              />
            </div>
            <Select
              value={filterSpecialty}
              onValueChange={(value) => setFilterSpecialty(value ?? "all")}
            >
              <SelectTrigger className="h-12 rounded-xl border-0 bg-transparent px-4 shadow-[inset_3px_3px_7px_#cdc6e0,inset_-3px_-3px_7px_#fdfbff]">
                <SelectValue placeholder="All specialisations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All specialisations</SelectItem>
                {specialtyOptions.map((sp) => (
                  <SelectItem key={sp} value={sp}>
                    {sp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterLanguage}
              onValueChange={(value) => setFilterLanguage(value ?? "all")}
            >
              <SelectTrigger className="h-12 rounded-xl border-0 bg-transparent px-4 shadow-[inset_3px_3px_7px_#cdc6e0,inset_-3px_-3px_7px_#fdfbff]">
                <SelectValue placeholder="All languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All languages</SelectItem>
                {languageOptions.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {therapistsErrored && (
            <div
              role="alert"
              className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700 shadow-[inset_3px_3px_7px_#f3d9d9,inset_-3px_-3px_7px_#ffffff]"
            >
              <span>{therapistsError?.message ?? "Could not load therapists."}</span>
              <button
                type="button"
                onClick={() => void refetchTherapists()}
                className="shrink-0 font-bold underline"
              >
                Try again
              </button>
            </div>
          )}

          {therapistsLoading && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,272px))] gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse rounded-[20px] bg-white/60" />
              ))}
            </div>
          )}

          {!therapistsLoading && !therapistsErrored && (
            <>
              {filteredTherapists.length > 0 ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,272px))] gap-5">
                  {filteredTherapists.map((t, i) => (
                    <TherapistCard
                      key={t.id}
                      therapist={t}
                      index={i}
                      onBook={() => setStartTherapist(t)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full text-mindora-purple shadow-[inset_4px_4px_9px_#cdc6e0,inset_-4px_-4px_9px_#fdfbff]">
                    <Search className="h-6 w-6" />
                  </div>
                  <p className="mb-1 text-[15px] font-bold text-foreground">
                    No therapists match this search
                  </p>
                  <p className="max-w-sm text-[13.5px] text-muted-foreground">
                    Clear the search and filters to see all therapists currently available for
                    booking.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setFilterSpecialty("all");
                      setFilterLanguage("all");
                    }}
                    className="mt-4 rounded-full bg-mindora-purple px-5 py-2.5 text-[12.5px] font-bold text-white hover:bg-mindora-purple-dark"
                  >
                    Clear search and filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {tab === "mine" && (
        <div>
          <div className="mb-5 inline-flex gap-0.5 rounded-[13px] bg-white p-[3px] shadow-[6px_6px_14px_#cdc6e0,-6px_-6px_14px_#fdfbff]">
            {(["upcoming", "past", "cancelled"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setMineStatus(key)}
                className={cn(
                  "rounded-[9px] px-3.5 py-1.5 text-[12.5px] font-semibold capitalize",
                  mineStatus === key
                    ? "bg-mindora-purple-pale text-mindora-purple-dark shadow-[inset_2px_2px_5px_#d3caeb,inset_-2px_-2px_5px_#ffffff]"
                    : "text-muted-foreground"
                )}
              >
                {key}
              </button>
            ))}
          </div>

          {appointmentsErrored && (
            <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700 shadow-[inset_3px_3px_7px_#f3d9d9,inset_-3px_-3px_7px_#ffffff]">
              {appointmentsError?.message ?? "Could not load your appointments."}
            </div>
          )}

          {appointmentsLoading && (
            <p className="py-5 text-[13.5px] text-muted-foreground">Loading your appointments…</p>
          )}

          {!appointmentsLoading && !appointmentsErrored && (
            <>
              {filteredAppointments.length > 0 ? (
                <div className="overflow-hidden rounded-[26px] bg-white p-2 shadow-[10px_10px_22px_#cbc4de,-10px_-10px_22px_#fdfbff]">
                  {filteredAppointments.map((a) => (
                    <AppointmentRow
                      key={a.id}
                      appointment={a}
                      therapistName={therapistNameFor(a.therapistId)}
                      therapistPhotoUrl={therapistPhotoFor(a.therapistId)}
                      onCancel={() => setCancelTarget(a)}
                      onRate={() => setRateTarget(a)}
                      onMedicationUpdate={() => openMedicationUpdate(a)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full text-mindora-purple shadow-[inset_4px_4px_9px_#cdc6e0,inset_-4px_-4px_9px_#fdfbff]">
                    <CalendarX className="h-6 w-6" />
                  </div>
                  <p className="mb-1 text-[15px] font-bold text-foreground">
                    {emptyMineCopy[mineStatus].title}
                  </p>
                  <p className="text-[13.5px] text-muted-foreground">
                    {emptyMineCopy[mineStatus].subtitle}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <GetStartedDialog
        therapist={startTherapist}
        onOpenChange={(open) => !open && setStartTherapist(null)}
        onBookAppointment={() => {
          setBookingTherapist(startTherapist);
          setStartTherapist(null);
        }}
        onChat={() => {
          if (startTherapist) router.push(`/messages?therapistId=${startTherapist.userId}`);
          setStartTherapist(null);
        }}
      />
      <BookingDialog
        therapist={bookingTherapist}
        onOpenChange={(open) => !open && setBookingTherapist(null)}
      />
      <CancelDialog
        appointment={cancelTarget}
        therapistName={cancelTarget ? therapistNameFor(cancelTarget.therapistId) : ""}
        onOpenChange={(open) => !open && setCancelTarget(null)}
      />
      <RateDialog
        appointment={rateTarget}
        therapistName={rateTarget ? therapistNameFor(rateTarget.therapistId) : ""}
        onOpenChange={(open) => !open && setRateTarget(null)}
      />
      <Dialog open={!!medicationUpdateTarget} onOpenChange={closeMedicationUpdate}>
        <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-[470px]">
          <DialogHeader>
            <DialogTitle>Report a medication update</DialogTitle>
            <DialogDescription>
              Send a private report to {medicationUpdateTarget
                ? therapistNameFor(medicationUpdateTarget.therapistId)
                : "your therapist"}.
              This does not change your medication list or create a prescription.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleMedicationUpdateSubmit} className="space-y-4">
            <div>
              <label htmlFor="medication-update-name" className="mb-1.5 block text-xs font-semibold text-foreground">
                Medication name
              </label>
              <Input
                id="medication-update-name"
                required
                maxLength={160}
                value={medicationUpdateForm.medicationName}
                onChange={(event) =>
                  setMedicationUpdateForm((current) => ({
                    ...current,
                    medicationName: event.target.value,
                  }))
                }
                placeholder="Enter the medication name"
              />
            </div>
            <div>
              <label htmlFor="medication-update-type" className="mb-1.5 block text-xs font-semibold text-foreground">
                What changed?
              </label>
              <select
                id="medication-update-type"
                value={medicationUpdateForm.updateType}
                onChange={(event) =>
                  setMedicationUpdateForm((current) => ({
                    ...current,
                    updateType: event.target.value as MedicationUpdateType,
                  }))
                }
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
              >
                <option value="STARTED">I started taking it</option>
                <option value="STOPPED">I stopped taking it</option>
                <option value="CHANGED">The dose or routine changed</option>
                <option value="SIDE_EFFECT">I noticed a side effect</option>
                <option value="QUESTION">I have a question</option>
              </select>
            </div>
            <div>
              <label htmlFor="medication-update-note" className="mb-1.5 block text-xs font-semibold text-foreground">
                Additional details (optional)
              </label>
              <textarea
                id="medication-update-note"
                rows={4}
                maxLength={2000}
                value={medicationUpdateForm.note}
                onChange={(event) =>
                  setMedicationUpdateForm((current) => ({
                    ...current,
                    note: event.target.value,
                  }))
                }
                placeholder="Share details you want your therapist to review."
                className="w-full rounded-xl border border-input bg-background p-3 text-sm"
              />
            </div>
            <div className="rounded-xl border border-[#f0dfbd] bg-[#fff8eb] p-3 text-[11px] leading-5 text-[#795b2b]">
              Your report is stored securely for therapist review. Do not stop or change prescribed medication based only on this form; contact your clinician for medical advice.
            </div>
            {submitMedicationUpdate.isError && (
              <p role="alert" className="text-xs font-medium text-red-700">
                {submitMedicationUpdate.error instanceof Error
                  ? submitMedicationUpdate.error.message
                  : "Your update could not be sent."}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => closeMedicationUpdate(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !medicationUpdateForm.medicationName.trim() ||
                  submitMedicationUpdate.isPending
                }
              >
                {submitMedicationUpdate.isPending ? "Sending…" : "Send update"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
