"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TherapistCard } from "@/components/therapists/TherapistCard";
import { SPECIALISATION_OPTIONS, matchesSpecialisation } from "@/lib/mock-data/therapists";
import { Button } from "@/components/ui/button";
import { useTherapists } from "@/hooks/useTherapists";
import { toTherapistCard } from "@/lib/therapist-view";

type SortKey = "recommended" | "name";

export function TherapistDirectory() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("all");
  const [sort, setSort] = useState<SortKey>("recommended");
  const specialisation = searchParams.get("specialisation") ?? "";
  const { data, isLoading, isError, error, refetch } = useTherapists({
    specialisation: specialisation || undefined,
    language: language === "all" ? undefined : language,
  });

  function clearFilters() {
    setQuery("");
    setLanguage("all");
    router.replace("/therapists");
  }

  const languageOptions = useMemo(() => {
    const options = new Set<string>();
    (data?.therapists ?? []).forEach((therapist) => {
      (therapist.languages ?? (therapist.languagePreference ? [therapist.languagePreference] : [])).forEach((item) => options.add(item));
    });
    return Array.from(options).sort((a, b) => a.localeCompare(b));
  }, [data]);

  const therapists = useMemo(() =>
    (data?.therapists ?? [])
      .map(toTherapistCard)
      .filter((therapist) => {
        const searchable = `${therapist.name} ${therapist.title} ${therapist.specialisations.join(" ")} ${(therapist.languages ?? []).join(" ")}`.toLowerCase();
        return (!query || searchable.includes(query.toLowerCase())) && matchesSpecialisation(therapist.specialisations, specialisation || null);
      })
      .sort((a, b) => sort === "name" ? a.name.localeCompare(b.name) : 0),
    [data, query, specialisation, sort],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="h-fit rounded-2xl border border-border bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-mindora-purple" />
          <h2 className="text-lg font-bold text-mindora-purple">Find your therapist</h2>
        </div>
        <section className="mt-6">
          <h3 className="text-sm font-semibold">Area of support</h3>
          <Select value={specialisation || "all"} onValueChange={(value) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value !== "all") params.set("specialisation", value);
            else params.delete("specialisation");
            router.replace(params.toString() ? `/therapists?${params.toString()}` : "/therapists");
          }}>
            <SelectTrigger className="mt-3 h-11"><SelectValue placeholder="All specialities" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All specialities</SelectItem>
              {SPECIALISATION_OPTIONS.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
            </SelectContent>
          </Select>
        </section>
        <section className="mt-6">
          <h3 className="text-sm font-semibold">Language</h3>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="mt-3 h-11"><SelectValue placeholder="Any language" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any language</SelectItem>
              {languageOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
            </SelectContent>
          </Select>
        </section>
        <Button variant="ghost" size="sm" className="mt-5" onClick={clearFilters}>Clear filters</Button>
      </aside>

      <section aria-label="Therapists">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by therapist, language or speciality" className="h-12 rounded-xl pl-10" />
          </div>
          <Select value={sort} onValueChange={(value) => setSort(value as SortKey)}>
            <SelectTrigger className="h-12 w-full rounded-xl sm:w-48"><SelectValue placeholder="Sort by" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {isLoading ? <div className="space-y-4" aria-label="Loading therapists"><div className="h-44 animate-pulse rounded-2xl bg-mindora-purple-bg" /><div className="h-44 animate-pulse rounded-2xl bg-mindora-purple-bg" /></div> : null}
        {isError ? <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6"><p className="font-semibold text-red-800">We could not load therapists right now.</p><p className="mt-1 text-sm text-red-700">{error instanceof Error ? error.message : "Please try again shortly."}</p><Button className="mt-4" onClick={() => void refetch()}>Try again</Button></div> : null}
        {!isLoading && !isError && therapists.length === 0 ? <div className="rounded-2xl border border-dashed border-border bg-mindora-purple-bg p-10 text-center"><p className="font-semibold">No approved therapists match these filters yet.</p><p className="mt-1 text-sm text-muted-foreground">Try another search or clear your filters.</p><Button className="mt-4" size="sm" onClick={clearFilters}>Clear filters</Button></div> : null}
        {!isLoading && !isError && therapists.length > 0 ? <div className="space-y-4">{therapists.map((therapist) => <TherapistCard key={therapist.id} therapist={therapist} />)}</div> : null}
        {data ? <p className="mt-5 text-xs text-muted-foreground">Showing {therapists.length} of {data.total} approved therapists accepting patients.</p> : null}
      </section>
    </div>
  );
}
