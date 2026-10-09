/** Request guards shared by the Worker routes. */

/**
 * Paid routes accept only same-origin JSON. Requiring application/json makes a
 * cross-site request non-simple (it needs a CORS preflight, which this API never
 * grants); the Origin and Sec-Fetch-Site checks stop the rest.
 */
export function sameOriginJson(req: Request): boolean {
  if (!(req.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) return false;
  const site = req.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") return false;
  const origin = req.headers.get("origin");
  if (origin) {
    try { if (new URL(origin).host !== new URL(req.url).host) return false; } catch { return false; }
  }
  return true;
}
