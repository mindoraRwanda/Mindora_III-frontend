import { TestResultView } from "@/components/tests/TestResult";
import { TESTS } from "@/lib/mock-data/tests";

export function generateStaticParams() {
  return TESTS.map((test) => ({ id: test.id }));
}

export default async function AppTestResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="min-h-full bg-[#eae6f4]">
      <TestResultView id={id} />
    </div>
  );
}
