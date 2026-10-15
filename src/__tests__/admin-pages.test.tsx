import { render, screen } from "@testing-library/react";
import AdminAuditLogPage from "@/app/admin/audit-log/page";
import AdminModerationPage from "@/app/admin/moderation/page";
import { useAuditLog, useModerationQueue } from "@/hooks/useAdmin";

jest.mock("@/hooks/useAdmin", () => ({
  useAuditLog: jest.fn(),
  useModerationQueue: jest.fn(),
}));

const mockedUseAuditLog = useAuditLog as jest.Mock;
const mockedUseModerationQueue = useModerationQueue as jest.Mock;

describe("AdminAuditLogPage", () => {
  it("renders entries from the backend's `auditLogs` key", () => {
    mockedUseAuditLog.mockReturnValue({
      data: {
        auditLogs: [
          {
            id: "log-1",
            adminId: "admin-1",
            actionType: "USER_SUSPENDED",
            targetId: "user-7",
            metadata: null,
            createdAt: "2026-10-01T10:00:00.000Z",
          },
        ],
        total: 1,
        page: 1,
        limit: 50,
      },
      isLoading: false,
      isError: false,
    });

    render(<AdminAuditLogPage />);

    expect(screen.getByText("USER_SUSPENDED")).toBeInTheDocument();
    expect(screen.getByText("Target: user-7")).toBeInTheDocument();
    expect(screen.queryByText("No admin actions recorded yet.")).not.toBeInTheDocument();
  });

  it("shows the empty state only when there really are no entries", () => {
    mockedUseAuditLog.mockReturnValue({
      data: { auditLogs: [], total: 0, page: 1, limit: 50 },
      isLoading: false,
      isError: false,
    });

    render(<AdminAuditLogPage />);

    expect(screen.getByText("No admin actions recorded yet.")).toBeInTheDocument();
  });
});

describe("AdminModerationPage", () => {
  it("renders pending reports instead of a blank page", () => {
    mockedUseModerationQueue.mockReturnValue({
      data: {
        reports: [
          {
            _id: "r1",
            contentId: "post-1",
            contentType: "POST",
            reportedBy: "user-1",
            reason: "Spam links",
            status: "PENDING",
            createdAt: "2026-10-01T10:00:00.000Z",
          },
        ],
        total: 1,
        page: 1,
        limit: 50,
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<AdminModerationPage />);

    expect(screen.getByText("Reported post")).toBeInTheDocument();
    expect(screen.getByText("Spam links")).toBeInTheDocument();
    expect(screen.queryByText("No pending reports.")).not.toBeInTheDocument();
  });
});
