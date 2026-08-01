"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAlerts, useResolveAlert } from "@/hooks/useAdmin";

const SEVERITY_VARIANT = {
  HIGH: "destructive",
  MEDIUM: "pending",
  LOW: "secondary",
} as const;

export default function AdminAlertsPage() {
  const { data, isLoading, isError } = useAlerts({ limit: 50 });
  const resolveMutation = useResolveAlert();

  const alerts = data?.alerts ?? [];

  return (
    <div className="min-h-full bg-white px-6 py-8 lg:px-10 lg:py-10">
      <div className="mb-6">
        <h1 className="text-[28px] font-bold tracking-tight text-foreground">System alerts</h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          Unresolved crisis and mood-concern alerts raised from AI and Mood Tracking events.
        </p>
      </div>

      {isError && (
        <div className="mb-4 rounded-[10px] bg-red-100 px-4 py-3 text-[13px] font-semibold text-red-700">
          Could not load alerts.
        </div>
      )}

      {isLoading ? (
        <p className="py-5 text-[13.5px] text-muted-foreground">Loading alerts…</p>
      ) : alerts.length === 0 ? (
        <p className="py-8 text-center text-[13.5px] text-muted-foreground">
          No unresolved alerts.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 last:border-b-0"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-semibold text-foreground">
                    {alert.eventType === "AI_CRISIS" ? "AI crisis detected" : "Mood concern"}
                  </p>
                  <Badge variant={SEVERITY_VARIANT[alert.severity]}>{alert.severity}</Badge>
                </div>
                <p className="mt-0.5 text-[12px] text-muted-foreground">
                  {new Date(alert.createdAt).toLocaleString()}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                disabled={resolveMutation.isPending}
                onClick={() => resolveMutation.mutate(alert.id)}
              >
                Resolve
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
