"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TherapistCard } from "@/components/therapists/TherapistCard";
import {
  SPECIALISATION_OPTIONS,
  matchesSpecialisation,
  type Therapist,
} from "@/lib/public-therapists";
import { Button } from "@/components/ui/button";

// Filters only on what User Service's public directory actually returns:
// name, specialisation and languages. Availability, gender, ratings and
// prices aren't exposed by any backend service, so there's nothing to filter.
export function TherapistDirectory({
  therapists,
  loadError = false,
}: {
  therapists: Therapist[];
  loadError?: boolean;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const specialisation = searchParams.get("specialisation") ?? "";
  const language = searchParams.get("language") ?? "";

  const languageOptions = useMemo(
    () => [...new Set(therapists.flatMap((therapist) => therapist.languages))].sort(),
    [therapists]
  );

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(params.toString() ? `/therapists?${params}` : "/therapists");
  }

  function clearFilters() {
    setQuery("");
    router.replace("/therapists");
  }

  const filtered = useMemo(
    () =>
      therapists.filter((therapist) => {
        if (query && !therapist.name.toLowerCase().includes(query.toLowerCase())) return false;
        if (!matchesSpecialisation(therapist.specialisations, specialisation || null)) return false;
        // Exact match, same as the endpoint's `languages: { has }` filter.
        if (language && !therapist.languages.includes(language)) return false;
        return true;
      }),
    [language, query, specialisation, therapists]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="h-fit rounded-xl border border-border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-mindora-purple">Filters</h2>

        <section className="mt-6">
          <h3 className="text-sm font-semibold">Areas of interest</h3>
          <Select
            value={specialisation || "all"}
            onValueChange={(value) =>
              setParam("specialisation", !value || value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="mt-3 h-11">
              <SelectValue placeholder="Select Specialisation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Select Specialisation</SelectItem>
              {SPECIALISATION_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        <section className="mt-6">
          <h3 className="text-sm font-semibold">Language</h3>
          <Select
            value={language || "all"}
            onValueChange={(value) => setParam("language", !value || value === "all" ? "" : value)}
          >
            <SelectTrigger className="mt-3 h-11">
              <SelectValue placeholder="Any language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any language</SelectItem>
              {languageOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        <button
          type="button"
          onClick={clearFilters}
          className="mt-6 text-sm font-medium text-mindora-purple hover:underline"
        >
          Clear filters
        </button>
      </aside>

      <div>
        <div className="relative mb-6">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Therapist name"
            aria-label="Search therapists by name"
            className="h-11 pl-10"
          />
        </div>

        {loadError ? (
          <div
            role="alert"
            className="rounded-xl border border-dashed border-border bg-[#F9F6FF] p-10 text-center"
          >
            <p className="font-semibold">We couldn&apos;t load our therapists right now</p>
            <p className="mt-1 text-sm text-[#6B7280]">Please refresh the page in a moment.</p>
          </div>
        ) : therapists.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-[#F9F6FF] p-10 text-center">
            <p className="font-semibold">No therapists are listed yet</p>
            <p className="mt-1 text-sm text-[#6B7280]">Please check back soon.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-[#F9F6FF] p-10 text-center">
            <p className="font-semibold">No therapists match these filters</p>
            <p className="mt-1 text-sm text-[#6B7280]">
              Try clearing a filter or searching another name.
            </p>
            <Button className="mt-4" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((therapist) => (
              <TherapistCard key={therapist.id} therapist={therapist} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
