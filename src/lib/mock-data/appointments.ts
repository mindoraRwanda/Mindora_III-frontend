import type { Appointment } from "@/types/domain";

export const mockNextSession: Appointment = {
  id: "apt-next-001",
  therapistId: "th-amina-001",
  therapistName: "Dr. Amina Osei",
  therapistInitials: "AO",
  slotStart: "2026-07-07T10:00:00",
  slotEnd: "2026-07-07T11:00:00",
  status: "CONFIRMED",
  sessionType: "VIDEO",
};

export const mockUpcomingAppointments: Appointment[] = [
  {
    id: "apt-001",
    therapistId: "th-amina-001",
    therapistName: "Dr. Amina Osei",
    therapistInitials: "AO",
    slotStart: "2026-07-07T10:00:00",
    slotEnd: "2026-07-07T11:00:00",
    status: "CONFIRMED",
    sessionType: "VIDEO",
  },
  {
    id: "apt-002",
    therapistId: "th-felix-001",
    therapistName: "Dr. Felix Nkosi",
    therapistInitials: "FN",
    slotStart: "2026-07-10T14:00:00",
    slotEnd: "2026-07-10T15:00:00",
    status: "PENDING",
    sessionType: "IN_PERSON",
  },
  {
    id: "apt-003",
    therapistId: "th-chidi-001",
    therapistName: "Dr. Chidi Mba",
    therapistInitials: "CM",
    slotStart: "2026-07-14T09:00:00",
    slotEnd: "2026-07-14T10:00:00",
    status: "CONFIRMED",
    sessionType: "VIDEO",
  },
];
