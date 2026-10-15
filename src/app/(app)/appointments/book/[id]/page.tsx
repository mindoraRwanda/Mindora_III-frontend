"use client";

import { use, useState } from "react";
import Link from "next/link";
import { BackLink } from "@/components/public/BackLink";
import { BookingDialog } from "@/components/therapy/BookingDialog";
import { Button } from "@/components/ui/button";
import { useTherapists } from "@/hooks/useTherapists";
import { findBookableTherapist } from "@/lib/booking";

// Landing point for "Book Now" (directly, or after signup/login via returnUrl).
// :id is the therapist's userId - the same id Appointment Service books
// against. The therapist is resolved from User Service's live directory
// (GET /users/therapists), which only contains approved, non-suspended
// therapists accepting patients, so anyone who can't be booked right now
// simply isn't found rather than being offered fake availability.
export default function BookAppointmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [dialogOpen, setDialogOpen] = useState(true);
  const { data, isLoading, isError, error } = useTherapists({});
  const therapist = findBookableTherapist(data?.therapists, id);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <BackLink fallback="/therapy" className="mb-4" />
      <p className="text-sm text-[#6B7280]">Booking</p>

      {isLoading ? (
        <div className="mt-4 h-16 animate-pulse rounded-xl bg-[#F9F6FF]" />
      ) : isError ? (
        <p className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error?.message ?? "Could not load this therapist."}
        </p>
      ) : !therapist ? (
        <div className="mt-6 rounded-xl bg-[#F9F6FF] p-4 text-sm leading-relaxed text-[#6B7280]">
          This therapist isn&apos;t available for online booking right now. You can browse
          therapists who are currently accepting patients instead.
        </div>
      ) : (
        <>
          <h1 className="mt-4 text-2xl font-bold">{therapist.userName ?? "Therapist"}</h1>
          {therapist.specialisation ? (
            <p className="text-sm text-[#6B7280]">{therapist.specialisation}</p>
          ) : null}
          <Button className="mt-6" onClick={() => setDialogOpen(true)}>
            Choose a time
          </Button>
          <BookingDialog
            therapist={dialogOpen ? therapist : null}
            onOpenChange={(open) => setDialogOpen(open)}
          />
        </>
      )}

      <Button asChild variant="outline" className="mt-6 ml-0 block w-fit">
        <Link href="/therapy">Browse therapists</Link>
      </Button>
    </div>
  );
}
