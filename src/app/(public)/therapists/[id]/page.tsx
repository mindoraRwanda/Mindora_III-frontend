import { redirect } from "next/navigation";

// Individual public therapist profiles are not yet wired to live data.
// Redirect to the directory listing instead.
export default function TherapistProfilePage() {
  redirect("/therapists");
}
