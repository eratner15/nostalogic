// Single-file review page: the guide and every show page in one HTML document with hash routing.
// Built for a private review link. No backend; buttons show a review note. Usage: npm run export:artifact
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { createApp } = await import("../src/app.ts");
const { MemoryStore } = await import("../src/store.ts");
const shows = JSON.parse(readFileSync(join(root, "content/shows.json"), "utf8"));
const app = createApp({ store: new MemoryStore(shows) });
const css = readFileSync(join(root, "public/guide.css"), "utf8");
const js = readFileSync(join(root, "public/guide.js"), "utf8");
const posters = Object.fromEntries(shows.map((s) => [s.id, readFileSync(join(root, `public/posters/${s.id}.svg`), "utf8")]));
const inner = (html) => html.slice(html.indexOf("<a class=\"skip\""), html.lastIndexOf("<script"));
const page = async (route) => inner(await (await app.request(route)).text());
const sections = [{ id: "guide", html: await page("/") }, { id: "about", html: await page("/about") }, ...(await Promise.all(shows.map(async (s) => ({ id: `show-${s.id}`, html: await page(`/show/${s.id}`), dark: true }))))];
const rewrite = (h) =>
  h
    .replace(/href="\/show\/([a-z0-9-]+)"/g, 'href="#show-$1"')
    .replace(/href="\/about"/g, 'href="#about"')
    .replace(/href="\/"/g, 'href="#guide"')
    .replace(/poster="\/posters\/([a-z0-9-]+)\.svg"/g, (m, id) => `poster="data:image/svg+xml;utf8,${encodeURIComponent(posters[id])}"`);
const body = sections.map((s) => `<div class="view" id="${s.id}" ${s.dark ? 'data-view-dark="1"' : ""} hidden>${rewrite(s.html)}</div>`).join("\n");
const out = `<title>Streetlights Listings</title>
<meta name="description" content="Review build of the Streetlights trailer site: the Friday night guide and four show pages.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&display=swap" rel="stylesheet">
<style>
${css}
.view[hidden]{display:none}
.review-bar{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:var(--accent);color:#fff;font-family:var(--f-head);font-variation-settings:"wdth" 100;font-weight:600;letter-spacing:.08em;text-transform:uppercase;font-size:.72rem;padding:6px 16px;text-align:center}
</style>
<div class="review-bar">Review build. Nothing you click here is saved. The live site is the worker on Cloudflare.</div>
<div id="views" data-base="" data-static="1">
${body}
</div>
<script>
${js.replace("document.body && document.body.getAttribute(\"data-base\")", 'document.getElementById("views").getAttribute("data-base")').replace("document.body && document.body.getAttribute(\"data-static\")", 'document.getElementById("views").getAttribute("data-static")')}
</script>
<script>
(function(){
  var views=document.querySelectorAll(".view");
  function show(){
    var id=(location.hash||"#guide").slice(1);
    var found=false;
    views.forEach(function(v){var on=v.id===id;v.hidden=!on;if(on)found=true;if(on){document.documentElement.setAttribute("data-theme",v.getAttribute("data-view-dark")?"dark":"light");}});
    if(!found){views[0].hidden=false;document.documentElement.setAttribute("data-theme","light");}
    window.scrollTo(0,0);
  }
  window.addEventListener("hashchange",show); show();
})();
</script>`;
mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist/review.html"), out);
console.log(`review page: ${sections.length} views, ${Math.round(out.length / 1024)} KB`);
