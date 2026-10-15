import { act, render, screen } from "@testing-library/react";
import BookAppointmentPage from "@/app/(app)/appointments/book/[id]/page";
import { useTherapists } from "@/hooks/useTherapists";
import type { TherapistProfile } from "@/types/domain";

jest.mock("@/hooks/useTherapists", () => ({ useTherapists: jest.fn() }));
jest.mock("@/components/public/BackLink", () => ({ BackLink: () => null }));
jest.mock("@/components/therapy/BookingDialog", () => ({
  BookingDialog: ({ therapist }: { therapist: TherapistProfile | null }) =>
    therapist ? <div data-testid="booking-dialog">{therapist.userId}</div> : null,
}));

const mockedUseTherapists = useTherapists as jest.Mock;

const approvedTherapist: TherapistProfile = {
  id: "profile-1",
  userId: "11111111-1111-4111-8111-111111111111",
  userName: "Aline Uwase",
  bio: null,
  timezone: "Africa/Kigali",
  languagePreference: "en",
  specialisation: "Anxiety",
  languages: ["English"],
  isAcceptingPatients: true,
  photoUrl: null,
};

async function renderPage(id: string) {
  await act(async () => {
    render(<BookAppointmentPage params={Promise.resolve({ id })} />);
  });
}

describe("BookAppointmentPage", () => {
  it("opens real booking for a therapist from the live directory, keyed by userId", async () => {
    mockedUseTherapists.mockReturnValue({
      data: { therapists: [approvedTherapist], total: 1, page: 1, limit: 50 },
      isLoading: false,
      isError: false,
      error: null,
    });

    await renderPage(approvedTherapist.userId);

    expect(screen.getByRole("heading", { name: "Aline Uwase" })).toBeInTheDocument();
    expect(screen.getByTestId("booking-dialog")).toHaveTextContent(approvedTherapist.userId);
  });

  it("does not offer booking for a therapist who isn't in the directory", async () => {
    mockedUseTherapists.mockReturnValue({
      data: { therapists: [approvedTherapist], total: 1, page: 1, limit: 50 },
      isLoading: false,
      isError: false,
      error: null,
    });

    await renderPage("nsengiyumva-athanase");

    expect(screen.getByText(/isn't available for online booking/)).toBeInTheDocument();
    expect(screen.queryByTestId("booking-dialog")).not.toBeInTheDocument();
  });

  it("shows the API error instead of an empty page", async () => {
    mockedUseTherapists.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Could not reach the server."),
    });

    await renderPage(approvedTherapist.userId);

    expect(screen.getByText("Could not reach the server.")).toBeInTheDocument();
  });
});
