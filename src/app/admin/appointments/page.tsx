"use client";

import { useState } from "react";
import { useAdminAppointments } from "@/hooks/useAdmin";
import type { AppointmentStatus } from "@/types/domain";

const PAGE_SIZE = 20;

const statusOptions: { value: "ALL" | AppointmentStatus; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Kigali",
  });
}

function statusClass(status: AppointmentStatus): string {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700";
    case "CONFIRMED":
      return "bg-blue-50 text-blue-700";
    case "CANCELLED":
      return "bg-red-50 text-red-700";
    default:
      return "bg-amber-50 text-amber-700";
  }
}

export default function AdminAppointmentsPage() {
  const [status, setStatus] = useState<"ALL" | AppointmentStatus>("ALL");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useAdminAppointments({
    page,
    limit: PAGE_SIZE,
    status: status === "ALL" ? undefined : status,
  });

  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="min-h-full bg-[#eae6f4] px-6 py-8 lg:px-10 lg:py-10">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-foreground">
            Appointment register
          </h1>
          <p className="mt-1.5 text-[14px] text-muted-foreground">
            Read-only overview of appointments across the platform.
          </p>
        </div>
        <label className="flex flex-col gap-1 text-[12px] font-medium text-muted-foreground">
          Filter by status
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as "ALL" | AppointmentStatus);
              setPage(1);
            }}
            className="min-w-44 rounded-xl border border-[#d8d2e6] bg-white px-3 py-2.5 text-[13px] text-foreground outline-none focus:border-primary"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </header>

      <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-[8px_8px_18px_#cbc4de,-8px_-8px_18px_#fdfbff]">
          <p className="text-[12px] text-muted-foreground">Matching appointments</p>
          <p className="mt-1 text-[24px] font-bold text-foreground">
            {isLoading ? "…" : total.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-[8px_8px_18px_#cbc4de,-8px_-8px_18px_#fdfbff]">
          <p className="text-[12px] text-muted-foreground">Current page</p>
          <p className="mt-1 text-[24px] font-bold text-foreground">
            {page} / {pageCount}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-[8px_8px_18px_#cbc4de,-8px_-8px_18px_#fdfbff]">
          <p className="text-[12px] text-muted-foreground">Page size</p>
          <p className="mt-1 text-[24px] font-bold text-foreground">{PAGE_SIZE}</p>
        </div>
      </section>

      {isError && (
        <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">
          Appointment Service is unavailable. Please try again.
        </div>
      )}

      <section className="overflow-hidden rounded-2xl bg-white shadow-[8px_8px_18px_#cbc4de,-8px_-8px_18px_#fdfbff]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className="bg-[#f6f3fb] text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Appointment</th>
                <th className="px-4 py-3 font-semibold">Patient ID</th>
                <th className="px-4 py-3 font-semibold">Therapist ID</th>
                <th className="px-4 py-3 font-semibold">Date & time (Kigali)</th>
                <th className="px-4 py-3 font-semibold">Session</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeeaf5] text-[13px]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    Loading appointments…
                  </td>
                </tr>
              ) : data?.appointments.length ? (
                data.appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-[#faf9fc]">
                    <td className="px-4 py-3 font-mono text-[12px] text-foreground">
                      {appointment.id.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-muted-foreground">
                      {appointment.patientId}
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-muted-foreground">
                      {appointment.therapistId}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {formatDate(appointment.slotStart)}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {appointment.sessionType.replace("_", " ")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass(appointment.status)}`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    No appointments match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="flex items-center justify-between border-t border-[#eeeaf5] px-4 py-3">
          <p className="text-[12px] text-muted-foreground">
            Showing {data?.appointments.length ?? 0} of {total.toLocaleString()}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded-lg border border-[#d8d2e6] px-3 py-2 text-[12px] font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= pageCount || isLoading}
              onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
              className="rounded-lg border border-[#d8d2e6] px-3 py-2 text-[12px] font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </footer>
      </section>
    </main>
  );
}
