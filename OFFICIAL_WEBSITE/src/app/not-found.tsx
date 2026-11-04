import Link from "next/link";
import SignalMark from "@/components/SignalMark";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-ink px-4 text-center text-paper">
      <SignalMark className="mb-8 h-10 w-10 text-brand-500" />
      <h1 className="text-8xl font-bold tracking-tight md:text-9xl">404</h1>
      <p className="mt-6 mb-10 max-w-md text-lg text-paper/70">
        The page you&apos;re looking for doesn&apos;t exist. <br />
        Maybe it got lost in the void!
      </p>

      <Link
        href="/"
        className="rounded-md bg-brand-600 px-6 py-3 font-display text-sm uppercase tracking-wide text-paper transition-colors hover:bg-brand-500"
      >
        Go Back Home
      </Link>
    </div>
  );
}
