"use client";

import React from "react";

import { useParams } from "next/navigation";
import { useAdminAppointments, usePlatformAnalytics } from "@/hooks/useAdmin";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/hooks/useNotifications";
import { formatRelativeTime } from "@/lib/format-relative-time";

function Stat({ title, value }: { title: string; value: number | null | undefined }) {
  return (
    <div className="rounded-2xl border border-[#ebe8f1] bg-white p-5">
      <p className="text-[11px] text-[#77758a]">{title}</p>
      <p className="mt-2 text-2xl font-extrabold text-[#28243a]">
        {value == null ? "Unavailable" : value.toLocaleString()}
      </p>
    </div>
  );
}


function AdminAppointmentsSection() {
  const [page, setPage] = React.useState(1);
  const [status, setStatus] = React.useState("");
  const appointments = useAdminAppointments({
    page,
    limit: 20,
    status: status ? (status as "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED") : undefined,
  });
  const rows = appointments.data?.appointments ?? [];
  const totalPages = Math.max(1, Math.ceil((appointments.data?.total ?? 0) / 20));

  return (
    <main className="min-h-full bg-[#f7f6fa] px-5 py-8 sm:px-7 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[27px] font-extrabold text-[#28243a]">Appointments</h1>
          <p className="mt-1 text-sm text-[#77758a]">Platform-wide booking register from live appointment records.</p>
        </div>
        <label className="text-xs font-semibold text-[#77758a]">
          Filter by status
          <select
            value={status}
            onChange={(event) => { setStatus(event.target.value); setPage(1); }}
            className="mt-1 block rounded-xl border border-[#ebe8f1] bg-white px-3 py-2 text-sm text-[#28243a]"
          >
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </label>
      </div>
      {appointments.isError && (
        <div role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
          Appointment records could not be loaded.
          <button type="button" onClick={() => void appointments.refetch()} className="ml-2 font-bold underline">Try again</button>
        </div>
      )}
      <div className="mt-5 overflow-hidden rounded-2xl border border-[#ebe8f1] bg-white">
        {appointments.isLoading ? (
          <p className="p-8 text-center text-sm text-[#77758a]">Loading appointment records…</p>
        ) : rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-[#77758a]">No appointments match this filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead className="bg-[#faf9fc] text-[#77758a]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Booking ID</th>
                  <th className="px-4 py-3 font-semibold">Patient ID</th>
                  <th className="px-4 py-3 font-semibold">Therapist ID</th>
                  <th className="px-4 py-3 font-semibold">Session</th>
                  <th className="px-4 py-3 font-semibold">Date &amp; time</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => (
                  <tr key={item.id} className="border-t border-[#f0edf3] text-[#514c60]">
                    <td className="px-4 py-3 font-mono">{item.id.slice(0, 8)}</td>
                    <td className="px-4 py-3 font-mono">{item.patientId.slice(0, 8)}</td>
                    <td className="px-4 py-3 font-mono">{item.therapistId.slice(0, 8)}</td>
                    <td className="px-4 py-3">{item.sessionType.replace("_", " ")}</td>
                    <td className="px-4 py-3">{new Date(item.slotStart).toLocaleString()}</td>
                    <td className="px-4 py-3">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-[#77758a]">
        <span>{appointments.data?.total ?? 0} bookings · Page {page} of {totalPages}</span>
        <div className="flex gap-2">
          <button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="rounded-lg border border-[#ebe8f1] bg-white px-3 py-2 disabled:opacity-40">Previous</button>
          <button type="button" disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-[#ebe8f1] bg-white px-3 py-2 disabled:opacity-40">Next</button>
        </div>
      </div>
    </main>
  );
}

export default function AdminPrototypeSectionPage() {
  const params = useParams<{ section: string }>();
  const section = params.section;
  const analytics = usePlatformAnalytics();
  const notifications = useNotifications(1, 50);
  const markAll = useMarkAllNotificationsRead();
  const markOne = useMarkNotificationRead();
  const items = notifications.data?.  if (section === "appointments") {
    return <AdminAppointmentsSection />;
  }
   </main>
    );
  }

  if (section === "notifications") {
    return (
      <main className="min-h-full bg-[#f7f6fa] px-5 py-8 sm:px-7 lg:px-10">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-[27px] font-extrabold text-[#28243a]">Notification delivery</h1>
            <p className="mt-1 text-sm text-[#77758a]">
              Your authenticated admin in-app notification feed.
            </p>
          </div>
          <button
            type="button"
            onClick={() => markAll.mutate()}
            disabled={!notifications.data?.unreadCount || markAll.isPending}
            className="rounded-xl border border-[#ebe8f1] bg-white px-4 py-2 text-xs font-bold text-[#7350a0] disabled:opacity-50"
          >
            Mark all read
          </button>
        </div>
        {notifications.isError && (
          <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            Notifications could not be loaded.
          </p>
        )}
        <div className="mt-5 rounded-2xl border border-[#ebe8f1] bg-white p-3">
          {notifications.isLoading ? (
            <p className="p-6 text-center text-sm text-[#77758a]">Loading notifications…</p>
          ) : items.length === 0 ? (
            <p className="p-6 text-center text-sm text-[#77758a]">No notifications yet.</p>
          ) : (
            items.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => {
                  if (!item.readAt) markOne.mutate(item.id);
                }}
                className="flex w-full gap-3 border-b border-[#f0edf3] p-4 text-left last:border-0 hover:bg-[#faf9fc]"
              >
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    item.readAt ? "bg-[#ded2eb]" : "bg-[#7350a0]"
                  }`}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-[#28243a]">{item.title}</span>
                  <span className="mt-1 block text-xs leading-5 text-[#77758a]">{item.body}</span>
                  <span className="mt-2 block text-[10px] text-[#9993a2]">
                    {item.channel} · {item.status} · {formatRelativeTime(item.createdAt)}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>
        <p className="mt-4 rounded-xl bg-[#fff8eb] p-4 text-xs leading-5 text-[#795b2b]">
          This is the in-app feed for the signed-in admin account. It is not a system-wide
          Brevo/Resend email, SMS or voice delivery log, and it does not send test messages.
        </p>
      </main>
    );
  }

  if (section === "release-readiness") {
    const checks = [
      "Preserve existing authentication and role guards",
      "Keep patient and therapist data connected to the V3 APIs",
      "Run frontend lint, tests and production build",
      "Verify email and crisis escalation delivery with approved credentials",
      "Test patient, therapist and admin workflows in staging",
      "Confirm production deployment and domain health",
    ];

    return (
      <main className="min-h-full bg-[#f7f6fa] px-5 py-8 sm:px-7 lg:px-10">
        <h1 className="text-[27px] font-extrabold text-[#28243a]">Release readiness</h1>
        <p className="mt-1 text-sm text-[#77758a]">
          Checklist for a safe product release. This page does not claim a live Railway deployment
          state.
        </p>
        <div className="mt-6 space-y-3">
          {checks.map((item, index) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-[#ebe8f1] bg-white p-4 text-sm text-[#625d70]"
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#f1ecf7] text-xs font-bold text-[#7350a0]">
                {index + 1}
              </span>
              {item}
            </div>
          ))}
        </div>
        <p className="mt-5 rounded-xl bg-[#fff8eb] p-4 text-xs leading-5 text-[#795b2b]">
          Treatment plans, medication, prescriptions, community service and video meetings still
          require corresponding backend/provider workflows before they can be treated as production
          features.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-[#f7f6fa] p-8">
      <h1 className="text-2xl font-bold text-[#28243a]">Page not found</h1>
    </main>
  );
}
