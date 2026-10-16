import { GetMatchedFlow } from "@/components/matching/GetMatchedFlow";
import { fetchAllPublicTherapists } from "@/lib/public-therapists-api";
import { toTherapist, type Therapist } from "@/lib/public-therapists";

export const revalidate = 60;

export default async function GetMatchedPage() {
  let therapists: Therapist[] = [];
  let loadError = false;
  try {
    therapists = (await fetchAllPublicTherapists()).map(toTherapist);
  } catch {
    loadError = true;
  }
  return <GetMatchedFlow therapists={therapists} loadError={loadError} />;
}
