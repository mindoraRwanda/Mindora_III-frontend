"use client";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingDialog } from "@/components/therapy/BookingDialog";
import { useTherapists } from "@/hooks/useTherapists";
import { toTherapistCard } from "@/lib/therapist-view";
import type { TherapistProfile } from "@/types/domain";
export default function BookAppointmentPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, isError } = useTherapists({});
  const card = useMemo(
    () =>
      data?.therapists
        .map(toTherapistCard)
        .find((t) => t.id === params.id || t.userId === params.id),
    [data, params.id]
  );
  const profile = useMemo<TherapistProfile | null>(
    () => data?.therapists.find((t) => t.userId === params.id || t.id === params.id) ?? null,
    [data, params.id]
  );
  const [open, setOpen] = useState(true);
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/therapists"
        className="inline-flex items-center gap-2 text-sm font-semibold text-mindora-purple"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to therapists
      </Link>
      {isLoading ? (
        <div className="mt-6 h-56 animate-pulse rounded-2xl bg-mindora-purple-bg" />
      ) : null}
      {isError ? (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 text-red-800"
        >
          Therapist information is temporarily unavailable.
        </div>
      ) : null}
      {card && profile ? (
        <div className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
          <CalendarCheck className="h-8 w-8 text-mindora-purple" />
          <h1 className="mt-3 text-2xl font-bold">Book a session with {card.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose a session type, date and available time. Your appointment is saved only after the
            booking service accepts it.
          </p>
          <BookingDialog therapist={open ? profile : null} onOpenChange={setOpen} />
          <Button className="mt-5" onClick={() => setOpen(true)}>
            Choose appointment time
          </Button>
        </div>
      ) : null}
      {!isLoading && !isError && !card ? (
        <div className="mt-6 rounded-xl border border-border p-8 text-center">
          <p className="font-semibold">This therapist is not available for booking.</p>
          <Button asChild className="mt-4">
            <Link href="/therapists">Find another therapist</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
