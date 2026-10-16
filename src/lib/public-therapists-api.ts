import { ApiError } from "@/lib/api";
import { toQueryString } from "@/lib/query-string";
import type { PublicTherapistListResponse, PublicTherapistProfile } from "@/types/domain";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.mindora.rw";

// Matches user-service's Cache-Control (max-age=60) on these endpoints, so an
// approval, suspension or unpublish shows on the public pages within ~1 min.
export const PUBLIC_THERAPISTS_REVALIDATE_SECONDS = 60;

// The endpoint's documented maximum page size.
const PAGE_LIMIT = 50;
// Upper bound on pages fetched for one render, so a misbehaving `total`
// can't turn into an unbounded loop of requests.
const MAX_PAGES = 20;

// Deliberately not apiFetch: these are anonymous endpoints called from server
// components. apiFetch would attach a session token and, on a 401, try
// /auth/refresh with cookies - neither applies to a public page.
async function getPublic<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: PUBLIC_THERAPISTS_REVALIDATE_SECONDS },
    });
  } catch (networkError) {
    console.error(`[api] GET ${path} - network error, no response received`, networkError);
    throw new ApiError("Could not reach the server. Check your connection and try again.", 0);
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unknown error" }));
    const message = error.message ?? `API error: ${response.status}`;
    console.error(`[api] GET ${path} - ${response.status} ${message}`);
    throw new ApiError(message, response.status, error.errors, error);
  }

  return response.json();
}

// GET /api/v1/users/public/therapists - every approved, non-suspended
// therapist who is accepting patients. Pages through the whole directory so
// the public pages can search and filter it client-side.
export async function fetchAllPublicTherapists(
  filters: { specialisation?: string; language?: string } = {}
): Promise<PublicTherapistProfile[]> {
  const therapists: PublicTherapistProfile[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const data = await getPublic<PublicTherapistListResponse>(
      `/api/v1/users/public/therapists${toQueryString({ ...filters, page, limit: PAGE_LIMIT })}`
    );
    if (!Array.isArray(data?.therapists)) {
      throw new ApiError("Unexpected therapist directory response", 502);
    }
    therapists.push(...data.therapists);
    if (data.therapists.length < PAGE_LIMIT || therapists.length >= data.total) break;
  }
  return therapists;
}

// GET /api/v1/users/public/therapists/:userId - null when the therapist
// doesn't exist or isn't publicly listed (the service answers both with 404).
export async function fetchPublicTherapist(userId: string): Promise<PublicTherapistProfile | null> {
  try {
    const data = await getPublic<{ therapist: PublicTherapistProfile }>(
      `/api/v1/users/public/therapists/${encodeURIComponent(userId)}`
    );
    if (!data?.therapist) throw new ApiError("Unexpected therapist profile response", 502);
    return data.therapist;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
