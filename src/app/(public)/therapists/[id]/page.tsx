import { notFound } from "next/navigation";
import { BackLink } from "@/components/public/BackLink";
import { TherapistCard } from "@/components/therapists/TherapistCard";
import { fetchPublicTherapist } from "@/lib/public-therapists-api";
import { toTherapist } from "@/lib/public-therapists";

// Same freshness as the directory: a suspended or unpublished therapist's
// page starts 404ing within a minute.
export const revalidate = 60;

export default async function TherapistProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Unlisted therapists 404 the same as unknown ids. Any other failure throws
  // to the error boundary instead of rendering a misleading profile.
  const profile = await fetchPublicTherapist(id);
  if (!profile) notFound();

  const therapist = toTherapist(profile);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <BackLink fallback="/therapists" className="mb-6" />
      <h1 className="sr-only">{therapist.name}</h1>
      <TherapistCard therapist={therapist} onProfilePage />

      {therapist.bio.length ? (
        <section className="mt-6 rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#1A1A1A]">About</h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-[#4B5563]">
            {therapist.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      ) : null}

      {therapist.specialisations.length || therapist.languages.length ? (
        <section className="mt-6 grid gap-6 rounded-xl border border-border bg-white p-6 shadow-sm sm:grid-cols-2">
          {therapist.specialisations.length ? (
            <div>
              <h2 className="text-lg font-bold text-[#1A1A1A]">Approaches</h2>
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-[#4B5563]">
                {therapist.specialisations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </div>
          ) : null}
          {therapist.languages.length ? (
            <div>
              <h2 className="text-lg font-bold text-[#1A1A1A]">Languages</h2>
              <p className="mt-2 text-sm text-[#4B5563]">{therapist.languages.join(", ")}</p>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
