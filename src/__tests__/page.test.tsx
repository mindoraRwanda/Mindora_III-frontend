import { mockUpcomingAppointments } from "@/lib/mock-data/appointments";
import { mockCurrentUser } from "@/lib/mock-data/user";

describe("Mock data", () => {
  it("provides a current user with patient role", () => {
    expect(mockCurrentUser.role).toBe("PATIENT");
    expect(mockCurrentUser.name).toBe("Theodora");
  });

  it("provides upcoming appointments with valid statuses", () => {
    expect(mockUpcomingAppointments.length).toBeGreaterThan(0);
    mockUpcomingAppointments.forEach((apt) => {
      expect(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"]).toContain(apt.status);
    });
  });
});
