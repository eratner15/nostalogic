import { html, raw } from "hono/html";
import { SITE, u, getBasePath } from "../config";

export const esc = (s: string) => s.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!);

export function layout(title: string, body: ReturnType<typeof html>, opts: { description?: string; bodyClass?: string; dark?: boolean } = {}) {
  const desc = opts.description ?? SITE.hero;
  return html`<!DOCTYPE html>
<html lang="en"${raw(opts.dark ? ' data-theme="dark"' : "")}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${u("/guide.css")}">
<link rel="icon" href="${u("/favicon.svg")}" type="image/svg+xml">
</head>
<body class="${opts.bodyClass ?? ""}" data-base="${getBasePath()}">
<a class="skip" href="#main">Skip to listings</a>
<header class="masthead">
  <div class="masthead-inner">
    <a class="brand" href="${u("/")}" aria-label="${SITE.name} home">
      <span class="brand-name">${SITE.name}<span class="brand-dot" aria-hidden="true"></span></span>
      <span class="brand-sub">${SITE.taglineFor("", SITE.nightLabel).replace(/^\. /, "")}</span>
    </a>
    <nav class="masthead-meta" aria-label="Site">
      <a class="masthead-link" href="${u("/")}">Listings</a>
      <a class="masthead-link" href="${u("/about")}">For parents</a>
    </nav>
  </div>
</header>
<main id="main">${body}</main>
<footer class="colophon">
  <div class="colophon-inner">
    <p><strong>${SITE.name}</strong> is a weekly family comedy block in development. Every show here is a trailer. Parents decide which ones become full seasons.</p>
    <p class="fine">${SITE.footerLine(SITE.name)} No comments, no personalized ads, no child accounts. <a href="${u("/about")}">Read how we handle data</a>.</p>
  </div>
</footer>
<script src="${u("/guide.js")}" defer></script>
</body>
</html>`;
}
export { html, raw };
