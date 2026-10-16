import { ApiError } from "@/lib/api";
import {
  PUBLIC_THERAPISTS_REVALIDATE_SECONDS,
  fetchAllPublicTherapists,
  fetchPublicTherapist,
} from "@/lib/public-therapists-api";
import { toTherapist } from "@/lib/public-therapists";
import type { PublicTherapistProfile } from "@/types/domain";

const API = "https://api.mindora.rw";

function profile(n: number): PublicTherapistProfile {
  return {
    userId: `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`,
    userName: `Therapist ${n}`,
    bio: null,
    specialisation: "Anxiety",
    languages: ["English"],
    photoUrl: null,
  };
}

function jsonResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

const fetchMock = jest.fn();

beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock;
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  (console.error as jest.Mock).mockRestore();
});

describe("fetchAllPublicTherapists", () => {
  it("calls User Service's anonymous directory with ISR caching and no credentials", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(200, { therapists: [profile(1)], total: 1, page: 1, limit: 50 })
    );

    const result = await fetchAllPublicTherapists();

    expect(result).toEqual([profile(1)]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${API}/api/v1/users/public/therapists?page=1&limit=50`);
    expect(init.next).toEqual({ revalidate: PUBLIC_THERAPISTS_REVALIDATE_SECONDS });
    // Anonymous endpoint: no token, no cookies, no preflight-triggering headers.
    expect(init.headers).toEqual({ Accept: "application/json" });
    expect(init.credentials).toBeUndefined();
    expect(init.method).toBeUndefined();
  });

  it("pages through the whole directory", async () => {
    const firstPage = Array.from({ length: 50 }, (_, i) => profile(i + 1));
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse(200, { therapists: firstPage, total: 51, page: 1, limit: 50 })
      )
      .mockResolvedValueOnce(
        jsonResponse(200, { therapists: [profile(51)], total: 51, page: 2, limit: 50 })
      );

    const result = await fetchAllPublicTherapists();

    expect(result).toHaveLength(51);
    expect(fetchMock.mock.calls[1][0]).toBe(
      `${API}/api/v1/users/public/therapists?page=2&limit=50`
    );
  });

  it("passes documented filters through", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(200, { therapists: [], total: 0, page: 1, limit: 50 })
    );
    await fetchAllPublicTherapists({ specialisation: "Trauma", language: "French" });
    expect(fetchMock.mock.calls[0][0]).toBe(
      `${API}/api/v1/users/public/therapists?specialisation=Trauma&language=French&page=1&limit=50`
    );
  });

  it("throws on server errors instead of returning an empty directory", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(401, { message: "Unauthorized" }));
    await expect(fetchAllPublicTherapists()).rejects.toMatchObject({
      status: 401,
      message: "Unauthorized",
    });
  });

  it("rejects a response that isn't a therapist list", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(200, { data: [] }));
    await expect(fetchAllPublicTherapists()).rejects.toBeInstanceOf(ApiError);
  });

  it("reports an unreachable service as a network ApiError", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("fetch failed"));
    await expect(fetchAllPublicTherapists()).rejects.toMatchObject({ status: 0 });
  });
});

describe("fetchPublicTherapist", () => {
  it("fetches one listed therapist by userId", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(200, { therapist: profile(7) }));
    await expect(fetchPublicTherapist(profile(7).userId)).resolves.toEqual(profile(7));
    expect(fetchMock.mock.calls[0][0]).toBe(
      `${API}/api/v1/users/public/therapists/${profile(7).userId}`
    );
  });

  it("returns null for unknown or unlisted therapists (404)", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(404, { message: "Therapist not found" }));
    await expect(fetchPublicTherapist("nsengiyumva-athanase")).resolves.toBeNull();
  });

  it("encodes the id into a single path segment", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(404, { message: "Therapist not found" }));
    await fetchPublicTherapist("../admin?x=1");
    expect(fetchMock.mock.calls[0][0]).toBe(
      `${API}/api/v1/users/public/therapists/..%2Fadmin%3Fx%3D1`
    );
  });

  it("propagates other failures", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(500, { message: "Internal server error" }));
    await expect(fetchPublicTherapist(profile(1).userId)).rejects.toMatchObject({ status: 500 });
  });
});

describe("toTherapist", () => {
  it("maps the public profile onto what the pages render, keyed by userId", () => {
    expect(
      toTherapist({
        userId: "u-1",
        userName: "Nsengiyumva Athanase",
        bio: "First paragraph.\n\nSecond paragraph.",
        specialisation: "Couple therapy, Trauma-focused therapy; CBT",
        languages: ["Kinyarwanda", "English", "French"],
        photoUrl: "https://api.mindora.rw/api/v1/users/photos/a.jpg",
      })
    ).toEqual({
      id: "u-1",
      name: "Nsengiyumva Athanase",
      photo: "https://api.mindora.rw/api/v1/users/photos/a.jpg",
      bio: ["First paragraph.", "Second paragraph."],
      languages: ["Kinyarwanda", "English", "French"],
      specialisations: ["Couple therapy", "Trauma-focused therapy", "CBT"],
    });
  });

  it("handles a sparse profile without inventing details", () => {
    expect(
      toTherapist({
        userId: "u-2",
        userName: null,
        bio: null,
        specialisation: null,
        languages: [],
        photoUrl: null,
      })
    ).toEqual({
      id: "u-2",
      name: "Mindora therapist",
      photo: undefined,
      bio: [],
      languages: [],
      specialisations: [],
    });
  });
});
