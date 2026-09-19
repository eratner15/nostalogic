// Single place for the brand name. Fork D replaces the provisional value.
// The codename "Porchlight" is not the brand. The provisional display name below is
// the brand-strategist's recommendation until the owner decides and counsel clears CG-01.
export const SITE = {
  name: "PROVISIONAL",
  tagline: "One night a week. Four shows. One couch.",
  nightLabel: "Friday",
  nightShort: "FRI",
  firstAirTime: "8:00",
  channelNumber: "36",
  // Slot times shown on the guide. Full episodes use 30-minute bands. Trailers show the band a show will own.
  slotTimes: ["8:00", "8:30", "9:00", "9:30"] as const,
  slotLabels: ["Anchor", "Hangout", "Wildcard", "Lights Out"] as const,
};
