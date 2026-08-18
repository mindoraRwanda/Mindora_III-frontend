import { BackLink } from "@/components/public/BackLink";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <BackLink fallback="/" className="mb-6" />
      <h1 className="text-4xl font-bold tracking-tight">Contact</h1>
      <p className="mt-4 leading-relaxed text-[#6B7280]">
        For product questions, email hello@mindora.health. If you need urgent support, please use
        the crisis line in the app or local emergency services.
      </p>
    </div>
  );
}
