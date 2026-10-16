import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { notFound } from "next/navigation";
import { TherapistDirectory } from "@/components/therapists/TherapistDirectory";
import TherapistProfilePage from "@/app/(public)/therapists/[id]/page";
import { fetchPublicTherapist } from "@/lib/public-therapists-api";
import type { Therapist } from "@/lib/public-therapists";

let mockSearchParams = new URLSearchParams();
const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({ replace: mockReplace }),
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));
jest.mock("@/contexts/AuthContext", () => ({ useAuth: () => ({ isAuthenticated: false }) }));
jest.mock("@/components/public/BackLink", () => ({ BackLink: () => null }));
jest.mock("@/lib/public-therapists-api", () => ({ fetchPublicTherapist: jest.fn() }));

const aline: Therapist = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Aline Uwase",
  bio: [],
  languages: ["English", "Kinyarwanda"],
  specialisations: ["Anxiety"],
};
const eric: Therapist = {
  id: "22222222-2222-4222-8222-222222222222",
  name: "Eric Mugisha",
  bio: [],
  languages: ["French"],
  specialisations: ["Trauma"],
};

beforeEach(() => {
  mockSearchParams = new URLSearchParams();
});

describe("TherapistDirectory", () => {
  it("renders therapists from the backend with profile and booking links keyed by userId", () => {
    render(<TherapistDirectory therapists={[aline]} />);

    expect(screen.getByText("Aline Uwase")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View Profile" })).toHaveAttribute(
      "href",
      `/therapists/${aline.id}`
    );
    expect(screen.getByRole("link", { name: "Book Now" })).toHaveAttribute(
      "href",
      `/signup?returnUrl=${encodeURIComponent(`/appointments/book/${aline.id}`)}`
    );
  });

  it("filters by specialisation and language from the URL", () => {
    mockSearchParams = new URLSearchParams("specialisation=Trauma");
    const { unmount } = render(<TherapistDirectory therapists={[aline, eric]} />);
    expect(screen.queryByText("Aline Uwase")).not.toBeInTheDocument();
    expect(screen.getByText("Eric Mugisha")).toBeInTheDocument();
    unmount();

    mockSearchParams = new URLSearchParams("language=Kinyarwanda");
    render(<TherapistDirectory therapists={[aline, eric]} />);
    expect(screen.getByText("Aline Uwase")).toBeInTheDocument();
    expect(screen.queryByText("Eric Mugisha")).not.toBeInTheDocument();
  });

  it("shows an error state, not an empty directory or fallback cards, when loading failed", () => {
    render(<TherapistDirectory therapists={[]} loadError />);
    expect(screen.getByRole("alert")).toHaveTextContent("couldn't load our therapists");
    expect(screen.queryByText("No therapists are listed yet")).not.toBeInTheDocument();
  });

  it("distinguishes an empty directory from filters matching nothing", () => {
    const { unmount } = render(<TherapistDirectory therapists={[]} />);
    expect(screen.getByText("No therapists are listed yet")).toBeInTheDocument();
    unmount();

    mockSearchParams = new URLSearchParams("specialisation=OCD");
    render(<TherapistDirectory therapists={[aline]} />);
    expect(screen.getByText("No therapists match these filters")).toBeInTheDocument();
  });
});

describe("TherapistProfilePage", () => {
  const mockedFetch = fetchPublicTherapist as jest.Mock;

  it("renders the listed therapist's real profile", async () => {
    mockedFetch.mockResolvedValueOnce({
      userId: aline.id,
      userName: "Aline Uwase",
      bio: "Supportive, evidence-based care.",
      specialisation: "Anxiety, Depression",
      languages: ["English"],
      photoUrl: null,
    });

    render(await TherapistProfilePage({ params: Promise.resolve({ id: aline.id }) }));

    expect(mockedFetch).toHaveBeenCalledWith(aline.id);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Aline Uwase");
    expect(screen.getByText("Supportive, evidence-based care.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Book Now" })).toHaveAttribute(
      "href",
      expect.stringContaining(encodeURIComponent(`/appointments/book/${aline.id}`))
    );
  });

  it("404s for therapists that aren't publicly listed", async () => {
    mockedFetch.mockResolvedValueOnce(null);
    await expect(
      TherapistProfilePage({ params: Promise.resolve({ id: "nsengiyumva-athanase" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });
});
