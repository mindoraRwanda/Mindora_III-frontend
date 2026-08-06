export const signupFeatures = [
  "Daily mood check-ins in under a minute",
  "Vetted therapists, booked in two taps",
  "Reflect - a private AI journal that listens",
  "Circle - anonymous community held with care",
] as const;

export const joinReasons = [
  {
    id: "grounded" as const,
    label: "Feel more grounded",
    icon: "heart",
  },
  {
    id: "routine" as const,
    label: "Start a gentle routine",
    icon: "routine",
  },
  {
    id: "reflect" as const,
    label: "Reflect & journal",
    icon: "journal",
  },
] as const;

export const loginTestimonial = {
  quote: "This app feels like a warm room I can walk into on hard days.",
  author: "Amelie R., member",
};
