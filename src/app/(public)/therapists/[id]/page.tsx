import { notFound } from "next/navigation";
import { BackLink } from "@/components/public/BackLink";
import { getTherapistById, THERAPISTS } from "@/lib/mock-data/therapists";
import { TherapistCard } from "@/components/therapists/TherapistCard";

export function generateStaticParams() {
  return THERAPISTS.map((therapist) => ({ id: therapist.id }));
}

export default async function TherapistProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const therapist = getTherapistById(id);
  if (!therapist) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <BackLink fallback="/therapists" className="mb-6" />
      <TherapistCard therapist={therapist} />
    </div>
  );
}
