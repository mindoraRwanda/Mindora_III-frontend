import Link from "next/link";
import { Clock, FlaskConical } from "lucide-react";
import { TESTS } from "@/lib/mock-data/tests";

export default function AppTestsPage() {
  return (
    <div className="min-h-full bg-[#eae6f4] px-6 py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-[28px] font-bold tracking-tight text-foreground">Test</h1>
          <p className="mt-1.5 text-[14px] text-muted-foreground">
            Self-assessment tools to help you understand your mental state. Scientifically validated
            but not a replacement for professional advice.
          </p>
        </div>

        {TESTS.length === 0 ? (
          <div className="rounded-[26px] bg-white p-10 text-center text-muted-foreground shadow-[10px_10px_22px_#cbc4de,-10px_-10px_22px_#fdfbff]">
            No tests are available right now.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TESTS.map((test) => (
              <Link
                key={test.id}
                href={`/tests/${test.id}`}
                className="flex flex-col rounded-[22px] bg-white p-6 shadow-[10px_10px_22px_#cbc4de,-10px_-10px_22px_#fdfbff] transition-shadow hover:shadow-[14px_14px_30px_#c4bdda,-14px_-14px_30px_#fdfbff]"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-mindora-purple-pale text-mindora-purple shadow-[inset_3px_3px_7px_#d3caeb,inset_-3px_-3px_7px_#ffffff]">
                  <FlaskConical className="h-4.5 w-4.5" />
                </div>
                <h2 className="text-[16px] font-bold text-foreground">{test.name}</h2>
                <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-muted-foreground">
                  {test.description}
                </p>
                <div className="mt-4 flex items-center justify-between text-[12.5px] font-semibold text-mindora-purple">
                  <span>{test.frequency}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {test.durationMinutes} min
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
