import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

interface Profile {
  userName: string | null;
  bio: string | null;
}

interface MeResponse {
  role: "PATIENT" | "THERAPIST" | "ADMIN";
  profile?: Profile;
}

// GET /api/v1/users/me - User Service. Requires an authenticated session (RouteGuard
// guarantees one by the time anything using this hook renders).
export function useMyProfile() {
  return useQuery({
    queryKey: ["profile", "me"],
    queryFn: () => apiFetch<MeResponse>("/api/v1/users/me"),
  });
}
