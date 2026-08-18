"use client";

import { useMemo, useState } from "react";
import { CalendarX, Search } from "lucide-react";
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
import { useTherapists } from "@/hooks/useTherapists";
import { useMyAppointments } from "@/hooks/useAppointments";
import type { BookedAppointment, TherapistProfile } from "@/types/domain";
import { cn } from "@/lib/utils";

type BrowseTab = "browse" | "mine";
type MineStatus = "upcoming" | "past" | "cancelled";

export default function TherapyPage() {
  const [tab, setTab] = useState<BrowseTab>("browse");
  const [search, setSearch] = useState("");
  const [mineStatus, setMineStatus] = useState<MineStatus>("upcoming");

  const [bookingTherapist, setBookingTherapist] = useState<TherapistProfile | null>(null);
  const [cancelTarget, setCancelTarget] = useState<BookedAppointment | null>(null);
  const [rateTarget, setRateTarget] = useState<BookedAppointment | null>(null);

  const {
    data: therapistData,
    isLoading: therapistsLoading,
    isError: therapistsErrored,
    error: therapistsError,
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

  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      if (mineStatus === "upcoming") return a.status === "PENDING" || a.status === "CONFIRMED";
      if (mineStatus === "past") return a.status === "COMPLETED";
      return a.status === "CANCELLED";
    });
  }, [appointments, mineStatus]);

  function therapistNameFor(therapistId: string): string {
    return therapistByUserId.get(therapistId)?.userName ?? "Therapist";
  }

  function therapistPhotoFor(therapistId: string): string | null {
    return therapistByUserId.get(therapistId)?.photoUrl ?? null;
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
    <div className="min-h-full bg-white px-6 py-8 lg:px-10 lg:py-10">
      <div className="mb-6">
        <h1 className="text-[30px] font-bold tracking-tight text-foreground">Appointments</h1>
        <p className="mt-1.5 text-[14.5px] text-muted-foreground">
          Find a therapist or manage your upcoming sessions.
        </p>
      </div>

      <div className="mb-5 inline-flex gap-0.5 rounded-[11px] bg-muted p-1">
        <button
          type="button"
          onClick={() => setTab("browse")}
          className={cn(
            "rounded-lg px-4.5 py-2.5 text-[13.5px] font-semibold",
            tab === "browse"
              ? "bg-white text-mindora-purple-dark shadow-sm"
              : "text-muted-foreground"
          )}
        >
          Browse
        </button>
        <button
          type="button"
          onClick={() => setTab("mine")}
          className={cn(
            "rounded-lg px-4.5 py-2.5 text-[13.5px] font-semibold",
            tab === "mine" ? "bg-white text-mindora-purple-dark shadow-sm" : "text-muted-foreground"
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
                className="pl-9"
              />
            </div>
            <Select
              value={filterSpecialty}
              onValueChange={(value) => setFilterSpecialty(value ?? "all")}
            >
              <SelectTrigger>
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
              <SelectTrigger>
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
            <div className="mb-5 rounded-[10px] bg-red-100 px-4 py-3 text-[13px] font-semibold text-red-700">
              {therapistsError?.message ?? "Could not load therapists."}
            </div>
          )}

          {therapistsLoading && (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse rounded-[20px] bg-muted" />
              ))}
            </div>
          )}

          {!therapistsLoading && !therapistsErrored && (
            <>
              {filteredTherapists.length > 0 ? (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
                  {filteredTherapists.map((t, i) => (
                    <TherapistCard
                      key={t.id}
                      therapist={t}
                      index={i}
                      onBook={() => setBookingTherapist(t)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-mindora-lavender text-mindora-purple-light">
                    <Search className="h-6 w-6" />
                  </div>
                  <p className="mb-1 text-[15px] font-bold text-foreground">No therapists found</p>
                  <p className="text-[13.5px] text-muted-foreground">
                    Try adjusting your search or filters.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {tab === "mine" && (
        <div>
          <div className="mb-5 inline-flex gap-0.5 rounded-[10px] border border-border bg-white p-[3px]">
            {(["upcoming", "past", "cancelled"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setMineStatus(key)}
                className={cn(
                  "rounded-[7px] px-3.5 py-1.5 text-[12.5px] font-semibold capitalize",
                  mineStatus === key
                    ? "bg-mindora-purple-pale text-mindora-purple-dark"
                    : "text-muted-foreground"
                )}
              >
                {key}
              </button>
            ))}
          </div>

          {appointmentsErrored && (
            <div className="mb-4 rounded-[10px] bg-red-100 px-4 py-3 text-[13px] font-semibold text-red-700">
              {appointmentsError?.message ?? "Could not load your appointments."}
            </div>
          )}

          {appointmentsLoading && (
            <p className="py-5 text-[13.5px] text-muted-foreground">Loading your appointments…</p>
          )}

          {!appointmentsLoading && !appointmentsErrored && (
            <>
              {filteredAppointments.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-border">
                  {filteredAppointments.map((a) => (
                    <AppointmentRow
                      key={a.id}
                      appointment={a}
                      therapistName={therapistNameFor(a.therapistId)}
                      therapistPhotoUrl={therapistPhotoFor(a.therapistId)}
                      onCancel={() => setCancelTarget(a)}
                      onRate={() => setRateTarget(a)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-mindora-lavender text-mindora-purple-light">
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
    </div>
  );
}
