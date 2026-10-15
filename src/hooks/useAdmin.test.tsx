import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import {
  useApproveTherapistApplication,
  useReactivateTherapist,
  useSuspendTherapist,
  useSuspendUser,
} from "@/hooks/useAdmin";
import {
  approveTherapistApplication,
  reactivateTherapist,
  suspendTherapist,
  suspendUser,
} from "@/lib/admin-api";

jest.mock("@/lib/admin-api");
jest.mock("sonner", () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

function setup() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  const invalidate = jest.spyOn(queryClient, "invalidateQueries");
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { invalidate, wrapper };
}

function invalidatedKeys(invalidate: jest.SpyInstance) {
  return invalidate.mock.calls.map(([filters]) => (filters as { queryKey: unknown[] }).queryKey);
}

const THERAPIST_LIFECYCLE_KEYS = [
  ["admin", "therapist-applications"],
  ["admin", "users"],
  ["admin", "audit-log"],
  ["therapists"],
];

describe("therapist lifecycle mutations refresh every view they affect", () => {
  it.each([
    ["approve", useApproveTherapistApplication, approveTherapistApplication, "app-1"],
    ["suspend", useSuspendTherapist, suspendTherapist, { id: "user-1", reason: "r" }],
    ["reactivate", useReactivateTherapist, reactivateTherapist, { id: "user-1", reason: "r" }],
  ] as const)("%s", async (_name, useHook, apiFn, variables) => {
    (apiFn as jest.Mock).mockResolvedValueOnce({});
    const { invalidate, wrapper } = setup();
    const { result } = renderHook(() => useHook(), { wrapper });

    await act(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (result.current.mutateAsync as any)(variables);
    });

    expect(invalidatedKeys(invalidate)).toEqual(expect.arrayContaining(THERAPIST_LIFECYCLE_KEYS));
  });

  it("does not invalidate anything when the approval fails", async () => {
    (approveTherapistApplication as jest.Mock).mockRejectedValueOnce(new Error("503"));
    const { invalidate, wrapper } = setup();
    const { result } = renderHook(() => useApproveTherapistApplication(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync("app-1").catch(() => {});
    });

    expect(invalidate).not.toHaveBeenCalled();
  });
});

it("suspending a user also refreshes the audit log", async () => {
  (suspendUser as jest.Mock).mockResolvedValueOnce({});
  const { invalidate, wrapper } = setup();
  const { result } = renderHook(() => useSuspendUser(), { wrapper });

  await act(async () => {
    await result.current.mutateAsync({ id: "user-1", reason: "abuse" });
  });

  expect(invalidatedKeys(invalidate)).toEqual(
    expect.arrayContaining([
      ["admin", "users"],
      ["admin", "audit-log"],
    ])
  );
});
