"use client";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { BackLink } from "@/components/public/BackLink";
import { TherapistCard } from "@/components/therapists/TherapistCard";
import { useTherapists } from "@/hooks/useTherapists";
import { toTherapistCard } from "@/lib/therapist-view";
import { THERAPISTS } from "@/lib/mock-data/therapists";
export default function TherapistProfilePage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, isError } = useTherapists({});
  const therapist = useMemo(() => {
    const liveProfile = data?.therapists
      .map(toTherapistCard)
      .find((item) => item.id === params.id || item.userId === params.id);
    return liveProfile ?? THERAPISTS.find((item) => item.id === params.id);
  }, [data, params.id]);
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <BackLink fallback="/therapists" className="mb-6" />
      {isLoading ? <div className="h-64 animate-pulse rounded-2xl bg-mindora-purple-bg" /> : null}
      {isError && !therapist ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800"
        >
          Could not load this therapist profile. Please try again later.
        </div>
      ) : null}
      {!isLoading && therapist ? (
        <>
          <h1 className="sr-only">{therapist.name}</h1>
          <TherapistCard therapist={therapist} onProfilePage />
          <section className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">About</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">
              {therapist.bio?.join("\n\n") || "This therapist has not added a biography yet."}
            </p>
            <h2 className="mt-6 text-lg font-bold">Areas of support</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {therapist.specialisations.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-mindora-purple-pale px-3 py-1.5 text-xs font-medium text-mindora-purple"
                >
                  {item}
                </span>
              ))}
            </div>
            <h2 className="mt-6 text-lg font-bold">Languages</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {therapist.languages?.join(", ") || "Contact the therapist to confirm languages."}
            </p>
          </section>
        </>
      ) : null}
      {!isLoading && !therapist ? (
        <div className="rounded-xl border border-border p-8 text-center">
          <p className="font-semibold">Therapist not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This profile may no longer be accepting patients.
          </p>
        </div>
      ) : null}
    </div>
  );
}
