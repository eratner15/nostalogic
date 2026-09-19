import { html, raw } from "hono/html";
import { SITE } from "../config";

export const esc = (s: string) => s.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!);

export function layout(title: string, body: ReturnType<typeof html>, opts: { description?: string; bodyClass?: string } = {}) {
  const desc = opts.description ?? `${SITE.name}. ${SITE.tagline}`;
  return html`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,500;0,600;0,700;0,800;1,600&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/guide.css">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
</head>
<body class="${opts.bodyClass ?? ""}">
<a class="skip" href="#main">Skip to listings</a>
<header class="masthead">
  <div class="masthead-inner">
    <a class="brand" href="/" aria-label="${SITE.name} home">
      <span class="brand-mark" aria-hidden="true"><span class="brand-dot"></span></span>
      <span class="brand-name">${SITE.name}</span>
    </a>
    <div class="masthead-meta">
      <span class="on-air"><span class="on-air-dot" aria-hidden="true"></span> ${SITE.nightLabel}s at ${SITE.firstAirTime}</span>
      <a class="masthead-link" href="/about">For parents</a>
    </div>
  </div>
</header>
<main id="main">${body}</main>
<footer class="colophon">
  <div class="colophon-inner">
    <p><strong>${SITE.name}</strong> is a weekly family comedy block in development. Every show here is a trailer. Your votes decide which ones become full seasons.</p>
    <p class="fine">Made for families. The account holder is always a parent or guardian. We collect no information from children. No comments, no personalized ads, no child accounts. <a href="/about">How we handle privacy</a>.</p>
  </div>
</footer>
<script src="/guide.js" defer></script>
</body>
</html>`;
}
export { html, raw };
