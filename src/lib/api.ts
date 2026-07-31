const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// Token stored in memory — never in localStorage (XSS protection)
// Access token lives in React state via AuthContext
// Refresh token lives in HttpOnly cookie set by Auth Service
let inMemoryAccessToken: string | null = null;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function setAccessToken(token: string | null) {
  inMemoryAccessToken = token;
}

export function getAccessToken() {
  return inMemoryAccessToken;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) ?? {}),
  };

  if (inMemoryAccessToken) {
    headers["Authorization"] = `Bearer ${inMemoryAccessToken}`;
  }

  let response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include", // sends HttpOnly refresh token cookie automatically
  });

  // Silent token refresh on 401 — only meaningful for requests that carried a session
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
      // Refresh failed — clear token, let AuthContext handle redirect
      setAccessToken(null);
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new ApiError(error.message ?? `API error: ${response.status}`, response.status);
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
