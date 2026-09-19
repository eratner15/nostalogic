// Single place for the brand name. Fork D replaces the provisional value.
// The codename "Porchlight" is not the brand. "Streetlights" is the brand-strategist's
// recommendation (projects/02-brand/out/names-5.md) until the owner decides and counsel clears CG-01.
export const SITE = {
  name: "Streetlights",
  hero: "One night a week. Four new shows. The whole house on one couch.",
  taglineFor: (name: string, night: string) => `${name}. The block premieres every ${night} night. Listings inside.`,
  nightLabel: "Friday",
  nightShort: "FRI",
  channelNumber: "36",
  // Public words from projects/02-brand/out/voice.md. Internal words stay in canon/GLOSSARY.md.
  slotLabels: ["Anchor", "Hangout", "Wildcard", "Lights Out"] as const,
  slotOrdinals: ["First", "Second", "Third", "Last"] as const,
  voteYes: "I'd watch this",
  voteNo: "Not for us",
  saveButton: "Save the night",
  emailName: "The Listing",
  footerLine: (name: string) => `${name} is for families. A parent holds every account. We collect nothing from children.`,
};
