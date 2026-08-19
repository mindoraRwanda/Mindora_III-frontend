import { useQuery } from "@tanstack/react-query";
import { fetchMyProfile } from "@/lib/user-api";

// Requires an authenticated session (RouteGuard guarantees one by the time
// anything using this hook renders).
export function useMyProfile() {
  return useQuery({
    queryKey: ["profile", "me"],
    queryFn: fetchMyProfile,
  });
}
