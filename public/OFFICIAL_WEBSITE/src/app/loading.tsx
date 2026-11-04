import SignalMark from "@/components/SignalMark";

export default function LoadingPage() {
  return (
    <>
      <style>{`
        @keyframes signal-ring {
          0% { transform: scale(0.6); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .signal-ring {
          animation: signal-ring 2.2s cubic-bezier(0.2, 0.6, 0.4, 1) infinite;
        }
      `}</style>

      <div className="flex h-screen flex-col items-center justify-center gap-8 bg-ink">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <span className="signal-ring absolute h-16 w-16 rounded-full border border-brand-500" style={{ animationDelay: "0s" }} />
          <span className="signal-ring absolute h-16 w-16 rounded-full border border-brand-500" style={{ animationDelay: "0.7s" }} />
          <span className="signal-ring absolute h-16 w-16 rounded-full border border-brand-500" style={{ animationDelay: "1.4s" }} />
          <SignalMark className="relative h-10 w-10 text-brand-500" />
        </div>

        <p className="font-display text-sm uppercase tracking-[0.2em] text-paper/70">
          We are preparing your space...
        </p>
      </div>
    </>
  );
}
