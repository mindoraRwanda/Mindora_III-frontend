"use client";

import { useMemo, useState } from "react";
import { Globe, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTherapists } from "@/hooks/useTherapists";
import { THERAPISTS as MOCK_THERAPISTS } from "@/lib/mock-data/therapists";
import type { TherapistProfile } from "@/types/domain";
import Link from "next/link";

function initialsFor(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .filter((w) => w[0] === w[0].toUpperCase())
    .slice(-2)
    .map((w) => w[0])
    .join("");
}

function PublicTherapistCard({ therapist }: { therapist: TherapistProfile }) {
  return (
    <article className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row">
        {therapist.photoUrl ? (
          <img
            src={therapist.photoUrl}
            alt={therapist.userName ?? "Therapist"}
            className="h-14 w-14 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-mindora-purple text-sm font-bold text-white">
            {initialsFor(therapist.userName)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-[#1A1A1A]">{therapist.userName ?? "Therapist"}</h3>
          {therapist.specialisation && (
            <span className="mt-1 inline-block rounded-full bg-[#F9F6FF] px-3 py-1 text-xs font-medium text-mindora-purple">
              {therapist.specialisation}
            </span>
          )}
          {therapist.languages.length > 0 && (
            <p className="mt-2 flex items-center gap-2 text-sm text-[#6B7280]">
              <Globe className="h-4 w-4 text-mindora-purple" />
              {therapist.languages.join(", ")}
            </p>
          )}
          <p className="mt-2 flex items-center gap-2 text-sm text-[#6B7280]">
            <MapPin className="h-4 w-4 text-mindora-purple" />
            {therapist.isAcceptingPatients ? "Accepting patients" : "Not accepting patients"}
          </p>
        </div>
      </div>
    </article>
  );
}

/** Preview card rendered from mock data for unauthenticated visitors */
function PreviewTherapistCard({ therapist }: { therapist: (typeof MOCK_THERAPISTS)[number] }) {
  return (
    <article className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row">
        {therapist.photo ? (
          <img
            src={therapist.photo}
            alt={therapist.name}
            className="h-14 w-14 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-mindora-purple text-sm font-bold text-white">
            {initialsFor(therapist.name)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-[#1A1A1A]">{therapist.name}</h3>
          <span className="mt-1 inline-block rounded-full bg-[#F9F6FF] px-3 py-1 text-xs font-medium text-mindora-purple">
            {therapist.title}
          </span>
          {therapist.languages && therapist.languages.length > 0 && (
            <p className="mt-2 flex items-center gap-2 text-sm text-[#6B7280]">
              <Globe className="h-4 w-4 text-mindora-purple" />
              {therapist.languages.join(", ")}
            </p>
          )}
          {therapist.specialisations.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {therapist.specialisations.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-[#F3F0FF] px-2.5 py-0.5 text-xs text-mindora-purple"
                >
                  {s}
                </span>
              ))}
              {therapist.specialisations.length > 3 && (
                <span className="text-xs text-[#6B7280]">
                  +{therapist.specialisations.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function TherapistDirectory() {
  const [query, setQuery] = useState("");
  const { data, isLoading, isError } = useTherapists({});
  const therapists = useMemo(() => data?.therapists ?? [], [data]);

  const filtered = useMemo(() => {
    if (!query.trim()) return therapists;
    const q = query.toLowerCase();
    return therapists.filter(
      (t) =>
        (t.userName ?? "").toLowerCase().includes(q) ||
        (t.specialisation ?? "").toLowerCase().includes(q)
    );
  }, [therapists, query]);

  /* Unauthenticated: show preview therapists + sign-up CTA */
  if (isError) {
    return (
      <div>
        <div className="space-y-4">
          {MOCK_THERAPISTS.slice(0, 2).map((t) => (
            <PreviewTherapistCard key={t.id} therapist={t} />
          ))}
        </div>

        <div className="relative mt-4">
          {/* Gradient fade over last card to hint there are more */}
          <div className="pointer-events-none absolute inset-x-0 -top-20 h-20 bg-gradient-to-t from-[#f8f5ff] to-transparent" />
          <div className="rounded-xl border border-dashed border-border bg-[#F9F6FF] px-6 py-10 text-center">
            <p className="text-lg font-semibold text-[#1A1A1A]">Sign in to see all therapists</p>
            <p className="mt-1 text-sm text-[#6B7280]">
              Create a free account or sign in to browse our full therapist directory and book
              sessions.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <Button asChild size="sm">
                <Link href="/signup">Create an account</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or specialisation"
            className="h-11 pl-10"
          />
        </div>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-[#F9F6FF]" />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-[#F9F6FF] p-10 text-center">
          <p className="font-semibold">No therapists found</p>
          <p className="mt-1 text-sm text-[#6B7280]">Try a different search term.</p>
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((t) => (
            <PublicTherapistCard key={t.id} therapist={t} />
          ))}
        </div>
      )}
    </div>
  );
}
