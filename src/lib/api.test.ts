import { apiFetch, ApiError, setAccessToken } from "@/lib/api";
import { fetchAuditLog, fetchModerationQueue, approveTherapistApplication } from "@/lib/admin-api";
import { fetchTherapists } from "@/lib/appointments-api";
import { login } from "@/lib/auth-api";

// Deterministic contract tests against a mocked fetch. They pin down what the
// client sends (service URL, path, method, auth, cookies) and how it parses
// what comes back - they do NOT prove the live backend behaves this way.

const API = "https://api.mindora.rw";

function jsonResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

const fetchMock = jest.fn();

beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
  setAccessToken(null);
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("apiFetch", () => {
  it("targets the Kong gateway with the full /api/v1 path exactly once, sending cookies", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(200, { ok: true }));

    await apiFetch("/api/v1/users/me");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${API}/api/v1/users/me`);
    expect(init.credentials).toBe("include");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(init.headers.Authorization).toBeUndefined();
  });

  it("attaches the in-memory access token as a Bearer header", async () => {
    setAccessToken("token-123");
    fetchMock.mockResolvedValueOnce(jsonResponse(200, {}));

    await apiFetch("/api/v1/users/me");

    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer token-123");
  });

  it("refreshes once on 401 and retries the original request with the new token", async () => {
    setAccessToken("expired");
    fetchMock
      .mockResolvedValueOnce(jsonResponse(401, { message: "Unauthorized" }))
      .mockResolvedValueOnce(jsonResponse(200, { accessToken: "fresh" }))
      .mockResolvedValueOnce(jsonResponse(200, { id: "me" }));

    await expect(apiFetch("/api/v1/users/me")).resolves.toEqual({ id: "me" });

    expect(fetchMock.mock.calls[1][0]).toBe(`${API}/api/v1/auth/refresh`);
    expect(fetchMock.mock.calls[1][1].method).toBe("POST");
    expect(fetchMock.mock.calls[2][0]).toBe(`${API}/api/v1/users/me`);
    expect(fetchMock.mock.calls[2][1].headers.Authorization).toBe("Bearer fresh");
  });

  it("clears the session and surfaces the 401 when the refresh also fails", async () => {
    setAccessToken("expired");
    fetchMock
      .mockResolvedValueOnce(jsonResponse(401, { message: "Unauthorized" }))
      .mockResolvedValueOnce(jsonResponse(401, { message: "No session" }))
      .mockResolvedValueOnce(jsonResponse(401, { message: "Unauthorized" }));

    await expect(apiFetch("/api/v1/users/me")).rejects.toMatchObject({ status: 401 });
  });

  it("does not try to refresh when the login itself is rejected", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(401, { message: "Invalid credentials" }));

    await expect(login("a@b.co", "wrong-password")).rejects.toMatchObject({
      status: 401,
      message: "Invalid credentials",
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not refresh on 403 - a forbidden role is not an expired session", async () => {
    setAccessToken("patient-token");
    fetchMock.mockResolvedValueOnce(jsonResponse(403, { message: "Forbidden" }));

    await expect(apiFetch("/api/v1/admin/users")).rejects.toMatchObject({
      status: 403,
      message: "Forbidden",
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("exposes zod fieldErrors from 400 responses", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(400, { message: "Validation failed", errors: { email: ["Invalid email"] } })
    );

    const error = (await apiFetch("/api/v1/auth/register", { method: "POST" }).catch(
      (e: unknown) => e
    )) as ApiError;
    expect(error).toBeInstanceOf(ApiError);
    expect(error.fieldErrors).toEqual({ email: ["Invalid email"] });
  });

  it("falls back to the `error` key used by some services", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(404, { error: "Alert not found" }));

    await expect(apiFetch("/api/v1/admin/alerts/x/resolve")).rejects.toMatchObject({
      status: 404,
      message: "Alert not found",
    });
  });

  it("turns a network failure into an ApiError with status 0 instead of swallowing it", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));

    await expect(apiFetch("/api/v1/users/me")).rejects.toMatchObject({ status: 0 });
  });

  it("returns null for 204 No Content", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 204,
      json: jest.fn(),
    } as unknown as Response);

    await expect(apiFetch("/api/v1/mood/abc", { method: "DELETE" })).resolves.toBeNull();
  });
});

describe("service contracts", () => {
  it("reads the admin audit log from `auditLogs`, as Admin Service returns it", async () => {
    const body = {
      auditLogs: [
        {
          id: "log-1",
          adminId: "admin-1",
          actionType: "THERAPIST_APPLICATION_APPROVED",
          targetId: "app-1",
          metadata: null,
          createdAt: "2026-10-01T10:00:00.000Z",
        },
      ],
      total: 1,
      page: 1,
      limit: 50,
    };
    fetchMock.mockResolvedValueOnce(jsonResponse(200, body));

    const result = await fetchAuditLog({ limit: 50, actionType: "THERAPIST_APPLICATION_APPROVED" });

    expect(fetchMock.mock.calls[0][0]).toBe(
      `${API}/api/v1/admin/audit-log?limit=50&actionType=THERAPIST_APPLICATION_APPROVED`
    );
    expect(result.auditLogs).toHaveLength(1);
    expect(result.auditLogs[0].actionType).toBe("THERAPIST_APPLICATION_APPROVED");
  });

  it("keeps Community Service's Mongo `_id` on moderation reports", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(200, {
        reports: [
          {
            _id: "665f0c",
            contentId: "665f0d",
            contentType: "POST",
            reportedBy: "user-1",
            reason: "Harassment",
            status: "PENDING",
            createdAt: "2026-10-01T10:00:00.000Z",
          },
        ],
        total: 1,
        page: 1,
        limit: 20,
      })
    );

    const result = await fetchModerationQueue({ limit: 20 });

    expect(fetchMock.mock.calls[0][0]).toBe(`${API}/api/v1/admin/moderation/queue?limit=20`);
    expect(result.reports[0]._id).toBe("665f0c");
    expect(result.reports[0].contentType).toBe("POST");
  });

  it("approves applications with PUT and no body, surfacing the 503 role-activation failure", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(503, {
        message: "Application approved but role activation failed — retry required",
        userId: "user-9",
      })
    );

    const error = await approveTherapistApplication("app-1").catch((e) => e);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${API}/api/v1/admin/therapist-applications/app-1/approve`);
    expect(init.method).toBe("PUT");
    expect(init.body).toBeUndefined();
    expect(error).toMatchObject({ status: 503 });
    expect((error as ApiError).body).toMatchObject({ userId: "user-9" });
  });

  it("lists therapists from User Service with filters as query params", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(200, { therapists: [], total: 0, page: 1, limit: 50 })
    );

    await fetchTherapists({ limit: 50, specialisation: "Anxiety", language: undefined });

    expect(fetchMock.mock.calls[0][0]).toBe(
      `${API}/api/v1/users/therapists?limit=50&specialisation=Anxiety`
    );
  });
});
