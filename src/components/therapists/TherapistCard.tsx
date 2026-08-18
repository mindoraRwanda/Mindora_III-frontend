"use client";

import { Clock, Star } from "lucide-react";
import type { Therapist } from "@/lib/mock-data/therapists";
import { therapistInitials } from "@/lib/mock-data/therapists";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookNowButton } from "@/components/public/BookNowButton";
import Link from "next/link";

export function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${index < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

export function TherapistCard({ therapist }: { therapist: Therapist }) {
  return (
    <article className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-mindora-purple text-sm font-bold text-white">
          {therapistInitials(therapist.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-[#1A1A1A]">{therapist.name}</h3>
              <p className="text-sm text-[#6B7280]">{therapist.title}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="gap-1">{therapist.sessions} Sessions</Badge>
              {therapist.clientsChoice ? (
                <Badge variant="pending">Clients&apos; Choice</Badge>
              ) : null}
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <StarRating rating={therapist.rating} />
            <span className="font-semibold">{therapist.rating}</span>
            <span className="text-[#6B7280]">({therapist.reviews} reviews)</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {therapist.specialisations.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#F9F6FF] px-3 py-1 text-xs font-medium text-mindora-purple"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="mt-3 flex items-center gap-2 text-sm text-[#6B7280]">
            <Clock className="h-4 w-4 text-mindora-purple" />
            Nearest: {therapist.nearest}
          </p>

          <p className="mt-2 text-sm font-semibold text-[#1A1A1A]">
            ${therapist.price60} USD / 60 Min &nbsp;&nbsp; ${therapist.price30} USD / 30 Min
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button asChild variant="outline" size="sm" className="h-10 flex-1">
              <Link href={`/therapists/${therapist.id}`}>View Profile</Link>
            </Button>
            <BookNowButton therapistId={therapist.id} className="h-10 flex-1" />
          </div>
        </div>
      </div>
    </article>
  );
}
