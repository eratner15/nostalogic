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

// Base path for hosting under a sub-path such as ratlinks.com/tv. Set at app creation from env BASE_PATH.
let basePath = "";
export function setBasePath(bp: string) {
  basePath = bp.replace(/\/+$/, "");
}
export function getBasePath() {
  return basePath;
}
/** Prefix an absolute site path with the base path. u("/show/x") -> "/tv/show/x" when BASE_PATH=/tv. */
export function u(path: string) {
  return `${basePath}${path}`;
}
