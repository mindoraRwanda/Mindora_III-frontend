import { render, screen } from "@testing-library/react";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { useAuth } from "@/contexts/AuthContext";

const replace = jest.fn();
const push = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace, push }),
  usePathname: () => "/admin/users",
}));
jest.mock("@/contexts/AuthContext", () => ({ useAuth: jest.fn() }));

const mockedUseAuth = useAuth as jest.Mock;

function authAs(role: "PATIENT" | "THERAPIST" | "ADMIN" | null, isLoading = false) {
  mockedUseAuth.mockReturnValue({
    isLoading,
    isAuthenticated: role !== null,
    user: role ? { userId: "u1", email: "u@example.com", role } : null,
  });
}

beforeEach(() => jest.clearAllMocks());

describe("RouteGuard", () => {
  it("renders admin pages for an ADMIN", () => {
    authAs("ADMIN");
    render(
      <RouteGuard requiredRole="ADMIN">
        <p>admin content</p>
      </RouteGuard>
    );
    expect(screen.getByText("admin content")).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
  });

  it("sends a THERAPIST away from admin pages to their own dashboard", () => {
    authAs("THERAPIST");
    render(
      <RouteGuard requiredRole="ADMIN">
        <p>admin content</p>
      </RouteGuard>
    );
    expect(push).toHaveBeenCalledWith("/therapist");
  });

  it("sends a PATIENT away from admin pages", () => {
    authAs("PATIENT");
    render(
      <RouteGuard requiredRole="ADMIN">
        <p>admin content</p>
      </RouteGuard>
    );
    expect(push).toHaveBeenCalledWith("/today");
  });

  it("redirects signed-out visitors to login with a return URL and renders nothing", () => {
    authAs(null);
    render(
      <RouteGuard requiredRole="ADMIN">
        <p>admin content</p>
      </RouteGuard>
    );
    expect(replace).toHaveBeenCalledWith("/login?returnUrl=%2Fadmin%2Fusers");
    expect(screen.queryByText("admin content")).not.toBeInTheDocument();
  });

  it("waits for the silent refresh before deciding", () => {
    authAs(null, true);
    render(
      <RouteGuard requiredRole="ADMIN">
        <p>admin content</p>
      </RouteGuard>
    );
    expect(replace).not.toHaveBeenCalled();
    expect(screen.queryByText("admin content")).not.toBeInTheDocument();
  });
});
