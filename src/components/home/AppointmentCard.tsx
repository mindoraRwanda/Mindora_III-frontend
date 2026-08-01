import type { BookedAppointment } from "@/types/domain";
import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function formatAppointmentDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isTomorrow =
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear();

  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  if (isTomorrow) return `Tomorrow · ${time}`;
  return (
    date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) +
    ` · ${time}`
  );
}

function formatSessionType(type: BookedAppointment["sessionType"]): string {
  const label = type === "IN_PERSON" ? "In-person" : type.charAt(0) + type.slice(1).toLowerCase();
  return `${label} session`;
}

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

interface AppointmentCardProps {
  appointment: BookedAppointment;
  therapistName: string;
  compact?: boolean;
}

export function AppointmentCard({
  appointment,
  therapistName,
  compact = false,
}: AppointmentCardProps) {
  const statusVariant = appointment.status === "CONFIRMED" ? "success" : "pending";

  if (compact) {
    return (
      <div className="w-[220px] rounded-xl border border-border/60 bg-white px-4 py-3.5 shadow-md sm:w-[240px]">
        <div className="flex items-center gap-2 text-mindora-purple">
          <CalendarDays className="h-4 w-4" strokeWidth={1.75} />
          <p className="text-[11px] font-semibold uppercase tracking-wide">Next Session</p>
        </div>
        <p className="mt-2 text-[14px] font-bold leading-snug text-foreground">
          {formatAppointmentDate(appointment.slotStart)}
        </p>
        <p className="mt-0.5 text-[13px] text-muted-foreground">{therapistName}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3.5">
      <div className="flex items-center gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mindora-purple-pale text-[12px] font-bold text-mindora-purple">
          {initialsFor(therapistName)}
        </div>
        <div>
          <p className="text-[14px] font-semibold">{therapistName}</p>
          <p className="text-[12px] text-muted-foreground">
            {formatAppointmentDate(appointment.slotStart)} —{" "}
            {formatSessionType(appointment.sessionType)}
          </p>
        </div>
      </div>
      <Badge variant={statusVariant} className="shrink-0 text-[11px]">
        {appointment.status === "CONFIRMED" ? "Confirmed" : "Pending"}
      </Badge>
    </div>
  );
}

interface AppointmentListProps {
  appointments: BookedAppointment[];
  therapistNameFor: (therapistId: string) => string;
}

export function AppointmentList({ appointments, therapistNameFor }: AppointmentListProps) {
  return (
    <div className="space-y-2.5">
      {appointments.map((apt) => (
        <AppointmentCard
          key={apt.id}
          appointment={apt}
          therapistName={therapistNameFor(apt.therapistId)}
        />
      ))}
    </div>
  );
}
