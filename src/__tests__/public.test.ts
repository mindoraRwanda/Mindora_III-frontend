import { THERAPISTS } from "@/lib/mock-data/therapists";

describe("Public mock data", () => {
  it("lists real therapists only, with no placeholder stats", () => {
    expect(THERAPISTS.map((therapist) => therapist.name)).toEqual(["Nsengiyumva Athanase"]);
    for (const therapist of THERAPISTS) {
      expect(therapist.rating).toBeUndefined();
      expect(therapist.reviews).toBeUndefined();
      expect(therapist.nearest).toBeUndefined();
    }
  });

});
