"use client";

import { useMemo, useState } from "react";
import { Globe, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTherapists } from "@/hooks/useTherapists";
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
          <div className="mt-3">
            <Button asChild size="sm" className="h-9">
              <Link href="/register">Book a session</Link>
            </Button>
          </div>
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

  if (isError) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-[#F9F6FF] p-10 text-center">
        <p className="font-semibold">Sign up to browse our therapists</p>
        <p className="mt-1 text-sm text-[#6B7280]">
          Create a free account to see our full therapist directory.
        </p>
        <Button asChild className="mt-4" size="sm">
          <Link href="/register">Create an account</Link>
        </Button>
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
