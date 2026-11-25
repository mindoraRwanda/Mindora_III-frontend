import { TestQuizGate } from "@/components/tests/TestQuiz";
import { TESTS } from "@/lib/mock-data/tests";

export function generateStaticParams() {
  return TESTS.map((test) => ({ id: test.id }));
}

export default async function AppTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="min-h-full bg-[#eae6f4]">
      <TestQuizGate id={id} />
    </div>
  );
}
