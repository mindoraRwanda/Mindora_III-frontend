import { Suspense } from "react";
import { TherapistDirectory } from "@/components/therapists/TherapistDirectory";
import { BackLink } from "@/components/public/BackLink";
import { TherapistAvatar } from "@/components/therapists/TherapistCard";
import { fetchAllPublicTherapists } from "@/lib/public-therapists-api";
import { toTherapist, type Therapist } from "@/lib/public-therapists";

// Regenerated at most once a minute (ISR), so approvals and suspensions in
// User Service reach this page without a redeploy.
export const revalidate = 60;

export default async function TherapistsPage() {
  let therapists: Therapist[] = [];
  let loadError = false;
  try {
    therapists = (await fetchAllPublicTherapists()).map(toTherapist);
  } catch {
    // Already logged by the API client; show an error state rather than an
    // empty directory that reads as "no therapists".
    loadError = true;
  }

  return (
    <div>
      <section className="bg-purple-panel px-4 py-6 text-white sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <BackLink fallback="/" light className="mb-4" />
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-semibold">
                If you need support now, we are here to help you
              </p>
              {therapists.length ? (
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {therapists.slice(0, 4).map((therapist) => (
                      <span
                        key={therapist.id}
                        className="rounded-full border-2 border-purple-panel text-[10px]"
                      >
                        <TherapistAvatar therapist={therapist} size={32} />
                      </span>
                    ))}
                  </div>
                  <span className="flex items-center gap-2 text-sm text-white/90">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    {therapists.length} {therapists.length === 1 ? "therapist" : "therapists"} on
                    Mindora
                  </span>
                </div>
              ) : null}
            </div>
            <a
              href="#directory"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-white px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Explore
            </a>
          </div>
        </div>
      </section>

      <section id="directory" className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <Suspense
            fallback={
              <div className="space-y-4">
                <div className="h-12 animate-pulse rounded-xl bg-[#F9F6FF]" />
                <div className="h-48 animate-pulse rounded-xl bg-[#F9F6FF]" />
              </div>
            }
          >
            <TherapistDirectory therapists={therapists} loadError={loadError} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
