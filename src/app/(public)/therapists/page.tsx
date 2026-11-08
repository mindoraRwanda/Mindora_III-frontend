import { Suspense } from "react";
import { TherapistDirectory } from "@/components/therapists/TherapistDirectory";
import { BackLink } from "@/components/public/BackLink";

export default function TherapistsPage() {
  return (
    <div>
      <section className="bg-purple-panel px-4 py-10 text-white sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <BackLink fallback="/" light className="mb-4" />
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-semibold">
                If you need support now, we are here to help you
              </p>
              <p className="mt-2 text-sm text-white/80">
                Browse approved professionals and choose a therapist who fits your needs.
              </p>
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
                <div className="h-12 animate-pulse rounded-xl bg-[#F1F9F8]" />
                <div className="h-48 animate-pulse rounded-xl bg-[#F1F9F8]" />
              </div>
            }
          >
            <TherapistDirectory />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
