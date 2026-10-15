import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ForgotPasswordForm, ResetPasswordForm } from "@/components/auth/PasswordResetForms";
import { requestPasswordReset, resetPassword } from "@/lib/auth-api";
import { ApiError } from "@/lib/api";

const replace = jest.fn();
let searchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace, push: jest.fn(), back: jest.fn() }),
  useSearchParams: () => searchParams,
}));
jest.mock("@/lib/auth-api", () => ({
  requestPasswordReset: jest.fn(),
  resetPassword: jest.fn(),
}));
jest.mock("@/components/public/BackLink", () => ({ BackLink: () => null }));

const mockedRequest = requestPasswordReset as jest.Mock;
const mockedReset = resetPassword as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  searchParams = new URLSearchParams();
});

describe("ForgotPasswordForm", () => {
  it("posts the email and shows the server's non-committal message", async () => {
    mockedRequest.mockResolvedValueOnce({
      message: "If that email exists, a reset link has been sent.",
    });
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText("Email"), "admin@mindora.rw");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(mockedRequest).toHaveBeenCalledWith("admin@mindora.rw");
    expect(await screen.findByRole("status")).toHaveTextContent(
      "If that email exists, a reset link has been sent."
    );
  });

  it("surfaces API errors such as rate limiting", async () => {
    mockedRequest.mockRejectedValueOnce(new ApiError("Too many requests", 429));
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText("Email"), "admin@mindora.rw");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(await screen.findByText("Too many requests")).toBeInTheDocument();
  });
});

describe("ResetPasswordForm", () => {
  it("submits the token from the link with the new password, then goes to login", async () => {
    searchParams = new URLSearchParams("token=abc123");
    mockedReset.mockResolvedValueOnce({ message: "Password updated successfully" });
    const user = userEvent.setup();
    render(<ResetPasswordForm />);

    await user.type(screen.getByLabelText("New password"), "a-new-password");
    await user.type(screen.getByLabelText("Confirm new password"), "a-new-password");
    await user.click(screen.getByRole("button", { name: /set new password/i }));

    expect(mockedReset).toHaveBeenCalledWith("abc123", "a-new-password");
    expect(replace).toHaveBeenCalledWith("/login?reset=1");
  });

  it("rejects mismatched passwords without calling the API", async () => {
    searchParams = new URLSearchParams("token=abc123");
    const user = userEvent.setup();
    render(<ResetPasswordForm />);

    await user.type(screen.getByLabelText("New password"), "a-new-password");
    await user.type(screen.getByLabelText("Confirm new password"), "different-password");
    await user.click(screen.getByRole("button", { name: /set new password/i }));

    expect(await screen.findByText("Passwords don't match")).toBeInTheDocument();
    expect(mockedReset).not.toHaveBeenCalled();
  });

  it("shows an expired-token error and does not navigate", async () => {
    searchParams = new URLSearchParams("token=used");
    mockedReset.mockRejectedValueOnce(new ApiError("Invalid or expired reset token", 400));
    const user = userEvent.setup();
    render(<ResetPasswordForm />);

    await user.type(screen.getByLabelText("New password"), "a-new-password");
    await user.type(screen.getByLabelText("Confirm new password"), "a-new-password");
    await user.click(screen.getByRole("button", { name: /set new password/i }));

    expect(await screen.findByText(/Invalid or expired reset token/)).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("explains a link with no token instead of showing a form that can't work", () => {
    render(<ResetPasswordForm />);
    expect(screen.getByText("Reset link incomplete")).toBeInTheDocument();
    expect(screen.queryByLabelText("New password")).not.toBeInTheDocument();
  });
});
