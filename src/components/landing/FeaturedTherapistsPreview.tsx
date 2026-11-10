"use client";

import Link from "next/link";
import { useTherapists } from "@/hooks/useTherapists";
import { toTherapistCard } from "@/lib/therapist-view";
import { TherapistCard } from "@/components/therapists/TherapistCard";
import { Button } from "@/components/ui/button";

export function FeaturedTherapistsPreview() {
  const { data, isLoading, isError, error, refetch } = useTherapists({});
  const therapists = (data?.therapists ?? []).slice(0, 3).map(toTherapistCard);

  return (
    <section className="bg-[#F9FAFB] px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-[#6B7280]">
              OUR PROFESSIONALS
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1A1A1A]">
              Meet some of our therapists
            </h2>
            <p className="mt-2 max-w-2xl text-[#6B7280]">
              Browse the directory and explore available support.
            </p>
          </div>
          <Button asChild variant="outline" className="h-11 shrink-0 rounded-xl px-5">
            <Link href="/therapists">
              View all therapists
              <span aria-hidden="true" className="ml-2">→</span>
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading therapists">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-56 animate-pulse rounded-2xl bg-white" />
            ))}
          </div>
        ) : null}

        {isError ? (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="font-semibold text-red-800">Therapist profiles could not be loaded.</p>
            <p className="mt-1 text-sm text-red-700">
              {error instanceof Error ? error.message : "Please try again shortly."}
            </p>
            <Button className="mt-4" size="sm" onClick={() => void refetch()}>
              Try again
            </Button>
          </div>
        ) : null}

        {!isLoading && !isError && therapists.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center">
            <p className="font-semibold text-[#1A1A1A]">
              No approved therapist profiles are available right now.
            </p>
            <p className="mt-2 text-sm text-[#6B7280]">
              Visit the directory again later or contact the MINDORA team for general support.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/support">Contact support</Link>
            </Button>
          </div>
        ) : null}

        {!isLoading && !isError && therapists.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {therapists.map((therapist) => (
              <TherapistCard key={therapist.id} therapist={therapist} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
