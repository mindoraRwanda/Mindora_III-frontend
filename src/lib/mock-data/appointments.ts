import type { Appointment } from "@/types/domain";

export const mockNextSession: Appointment = {
  id: "apt-next-001",
  therapistId: "th-aline-001",
  therapistName: "Dr. Aline Uwase",
  therapistInitials: "AU",
  slotStart: "2026-07-07T10:00:00",
  slotEnd: "2026-07-07T11:00:00",
  status: "CONFIRMED",
  sessionType: "VIDEO",
};

export const mockUpcomingAppointments: Appointment[] = [
  {
    id: "apt-001",
    therapistId: "th-aline-001",
    therapistName: "Dr. Aline Uwase",
    therapistInitials: "AU",
    slotStart: "2026-07-07T10:00:00",
    slotEnd: "2026-07-07T11:00:00",
    status: "CONFIRMED",
    sessionType: "VIDEO",
  },
  {
    id: "apt-002",
    therapistId: "th-eric-001",
    therapistName: "Dr. Eric Mugisha",
    therapistInitials: "EM",
    slotStart: "2026-07-10T14:00:00",
    slotEnd: "2026-07-10T15:00:00",
    status: "PENDING",
    sessionType: "AUDIO",
  },
  {
    id: "apt-003",
    therapistId: "th-diane-001",
    therapistName: "Dr. Diane Ingabire",
    therapistInitials: "DI",
    slotStart: "2026-07-14T09:00:00",
    slotEnd: "2026-07-14T10:00:00",
    status: "CONFIRMED",
    sessionType: "VIDEO",
  },
];
