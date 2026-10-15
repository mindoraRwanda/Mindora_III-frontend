"use client";

import { ShieldOff } from "lucide-react";
import { ApiError } from "@/lib/api";
import { useModerationQueue } from "@/hooks/useAdmin";

export default function AdminModerationPage() {
  const { data, isLoading, isError, error } = useModerationQueue({ limit: 50 });
  const isServiceUnavailable = error instanceof ApiError && error.status === 503;
  const reports = data?.reports ?? [];

  return (
    <div className="min-h-full bg-[#eae6f4] px-6 py-8 lg:px-10 lg:py-10">
      <div className="mb-6">
        <h1 className="text-[28px] font-bold tracking-tight text-foreground">Moderation</h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          Pending community reports, proxied live from the Community Service.
        </p>
      </div>

      {isLoading && (
        <p className="py-5 text-[13.5px] text-muted-foreground">Loading moderation queue…</p>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center rounded-[34px] bg-white py-16 text-center shadow-[12px_12px_26px_#cbc4de,-12px_-12px_26px_#fdfbff]">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full text-muted-foreground shadow-[inset_4px_4px_9px_#cdc6e0,inset_-4px_-4px_9px_#fdfbff]">
            <ShieldOff className="h-6 w-6" />
          </div>
          <p className="mb-1 text-[15px] font-bold text-foreground">Moderation is unavailable</p>
          <p className="max-w-sm text-[13.5px] text-muted-foreground">
            {isServiceUnavailable
              ? "Community Service is unreachable right now. Try again shortly."
              : (error?.message ?? "Could not load the moderation queue.")}
          </p>
        </div>
      )}

      {!isLoading && !isError && reports.length === 0 && (
        <p className="py-8 text-center text-[13.5px] text-muted-foreground">No pending reports.</p>
      )}

      {!isLoading && !isError && reports.length > 0 && (
        <div className="overflow-hidden rounded-[26px] bg-white p-2 shadow-[10px_10px_22px_#cbc4de,-10px_-10px_22px_#fdfbff]">
          {reports.map((report) => (
            <div key={report._id} className="rounded-[18px] px-3.5 py-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[14px] font-semibold text-foreground">
                  Reported {report.contentType.toLowerCase()}
                </p>
                <p className="text-[12px] text-muted-foreground">
                  {new Date(report.createdAt).toLocaleString()}
                </p>
              </div>
              <p className="mt-1 text-[13.5px] text-foreground">{report.reason}</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                Content: {report.contentId}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
