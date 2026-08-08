const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.mindora.rw";

// Token stored in memory - never in localStorage (XSS protection)
// Access token lives in React state via AuthContext
// Refresh token lives in HttpOnly cookie set by Auth Service
let inMemoryAccessToken: string | null = null;

export class ApiError extends Error {
  status: number;
  // Zod's flatten().fieldErrors shape, e.g. { email: ["Invalid email address"] } -
  // present on 400 validation failures, absent otherwise.
  fieldErrors?: Record<string, string[]>;

  constructor(message: string, status: number, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export function setAccessToken(token: string | null) {
  inMemoryAccessToken = token;
}

export function getAccessToken() {
  return inMemoryAccessToken;
}

// OAuth is a full browser redirect, not a fetch call - Google's consent screen has to be
// a real page navigation. Point window.location at this to start the flow.
export function getGoogleOAuthUrl(): string {
  return `${API_URL}/api/v1/auth/oauth/google`;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) ?? {}),
  };

  if (inMemoryAccessToken) {
    headers["Authorization"] = `Bearer ${inMemoryAccessToken}`;
  }

  const method = options.method ?? "GET";
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      credentials: "include", // sends HttpOnly refresh token cookie automatically
    });
  } catch (networkError) {
    // fetch() itself throws for anything that never got an HTTP response at all -
    // backend down, DNS failure, offline, CORS rejection, etc. This is the one
    // failure mode that isn't an ApiError from a server response, so log it here:
    // it's the only place in the app that sees it, and every caller's generic
    // "something went wrong" catch-all would otherwise swallow it silently.
    console.error(`[api] ${method} ${path} - network error, no response received`, networkError);
    throw new ApiError("Could not reach the server. Check your connection and try again.", 0);
  }

  // Silent token refresh on 401 - only meaningful for requests that carried a session
  // token to begin with. Login/refresh themselves returning 401 means invalid
  // credentials or no session, not an expired token, so skip the retry dance there
  // and let the real server error surface below.
  const isAuthEndpoint = path === "/api/v1/auth/refresh" || path === "/api/v1/auth/login";
  if (response.status === 401 && !isAuthEndpoint) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Retry original request with new token
      headers["Authorization"] = `Bearer ${inMemoryAccessToken}`;
      response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
        credentials: "include",
      });
    } else {
      // Refresh failed - clear token, let AuthContext handle redirect
      setAccessToken(null);
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unknown error" }));
    console.error(
      `[api] ${method} ${path} - ${response.status} ${error.message ?? "Unknown error"}`
    );
    throw new ApiError(
      error.message ?? `API error: ${response.status}`,
      response.status,
      error.errors
    );
  }

  // Handle 204 No Content
  if (response.status === 204) return null as T;

  return response.json();
}

async function refreshAccessToken(): Promise<boolean> {
  try {
    // HttpOnly cookie is sent automatically via credentials: 'include'
    const data = await apiFetch<{ accessToken: string }>("/api/v1/auth/refresh", {
      method: "POST",
    });
    setAccessToken(data.accessToken);
    return true;
  } catch {
    return false;
  }
}
