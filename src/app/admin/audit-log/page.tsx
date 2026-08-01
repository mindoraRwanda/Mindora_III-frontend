"use client";

import { useAuditLog } from "@/hooks/useAdmin";

export default function AdminAuditLogPage() {
  const { data, isLoading, isError } = useAuditLog({ limit: 50 });
  const entries = data?.entries ?? [];

  return (
    <div className="min-h-full bg-white px-6 py-8 lg:px-10 lg:py-10">
      <div className="mb-6">
        <h1 className="text-[28px] font-bold tracking-tight text-foreground">Audit log</h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          Immutable record of every admin action — read-only.
        </p>
      </div>

      {isError && (
        <div className="mb-4 rounded-[10px] bg-red-100 px-4 py-3 text-[13px] font-semibold text-red-700">
          Could not load the audit log.
        </div>
      )}

      {isLoading ? (
        <p className="py-5 text-[13.5px] text-muted-foreground">Loading audit log…</p>
      ) : entries.length === 0 ? (
        <p className="py-8 text-center text-[13.5px] text-muted-foreground">
          No admin actions recorded yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border">
          {entries.map((entry) => (
            <div key={entry.id} className="border-b border-border px-5 py-4 last:border-b-0">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[14px] font-semibold text-foreground">{entry.actionType}</p>
                <p className="text-[12px] text-muted-foreground">
                  {new Date(entry.createdAt).toLocaleString()}
                </p>
              </div>
              {entry.targetId && (
                <p className="mt-0.5 text-[12px] text-muted-foreground">Target: {entry.targetId}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
