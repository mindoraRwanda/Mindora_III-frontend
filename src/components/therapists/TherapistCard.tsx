"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Globe } from "lucide-react";
import type { Therapist } from "@/lib/public-therapists";
import { therapistInitials } from "@/lib/public-therapists";
import { Button } from "@/components/ui/button";
import { BookNowButton } from "@/components/public/BookNowButton";

export function TherapistAvatar({
  therapist,
  size = 56,
}: {
  therapist: Pick<Therapist, "name" | "photo">;
  size?: number;
}) {
  const [photoFailed, setPhotoFailed] = useState(false);

  if (therapist.photo && !photoFailed) {
    return (
      <Image
        src={therapist.photo}
        alt={therapist.name}
        width={size}
        height={size}
        // Photos come from User Service's photo host, not this app, so skip
        // Next's optimizer rather than allow-listing a backend host here.
        unoptimized
        onError={() => setPhotoFailed(true)}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-mindora-purple text-sm font-bold text-white"
      style={{ width: size, height: size }}
    >
      {therapistInitials(therapist.name)}
    </div>
  );
}

const CARD_TAG_LIMIT = 4;

export function TherapistCard({
  therapist,
  onProfilePage = false,
}: {
  therapist: Therapist;
  onProfilePage?: boolean;
}) {
  const tags = onProfilePage
    ? therapist.specialisations
    : therapist.specialisations.slice(0, CARD_TAG_LIMIT);
  const hiddenTags = therapist.specialisations.length - tags.length;

  return (
    <article className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row">
        <TherapistAvatar therapist={therapist} />
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-[#1A1A1A]">{therapist.name}</h3>

          {tags.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#F9F6FF] px-3 py-1 text-xs font-medium text-mindora-purple"
                >
                  {tag}
                </span>
              ))}
              {hiddenTags > 0 ? (
                <span className="rounded-full px-3 py-1 text-xs font-medium text-[#6B7280]">
                  +{hiddenTags} more
                </span>
              ) : null}
            </div>
          ) : null}

          {therapist.languages.length ? (
            <p className="mt-3 flex items-center gap-2 text-sm text-[#6B7280]">
              <Globe className="h-4 w-4 text-mindora-purple" />
              {therapist.languages.join(", ")}
            </p>
          ) : null}

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            {onProfilePage ? null : (
              <Button asChild variant="outline" size="sm" className="h-10 sm:flex-1">
                <Link href={`/therapists/${therapist.id}`}>View Profile</Link>
              </Button>
            )}
            <BookNowButton therapistId={therapist.id} className="h-10 sm:flex-1" />
          </div>
        </div>
      </div>
    </article>
  );
}
