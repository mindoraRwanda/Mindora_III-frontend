import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import SignalMark from "@/components/SignalMark";

export default function JobDetailsPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex max-w-md flex-col items-center border border-border px-8 py-16 text-center">
        <SignalMark className="mb-6 h-8 w-8 text-brand-500" />
        <p className="mb-4 text-lg font-semibold text-foreground">We&apos;re preparing exciting new opportunities!</p>
        <p className="text-muted-foreground">Check back soon or join our talent community to be notified when positions open up.</p>
        <Button variant="ghost" asChild className="mt-8 gap-2 text-brand-600 hover:text-brand-500">
          <Link href="/career">
            <ArrowLeft className="w-4 h-4" /> Back to Careers
          </Link>
        </Button>
      </div>
    </div>
  );
}
