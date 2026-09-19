import { html, raw, layout, esc } from "./layout";
import { SITE } from "../config";
import type { Show, SiteStats } from "../store";

const slotName = (slot: number) => SITE.slotLabels[slot - 1] ?? `Slot ${slot}`;
const slotOrd = (slot: number) => SITE.slotOrdinals[slot - 1] ?? "";
const mmss = (s: number | null) => (s == null ? "" : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`);

function posterSvg(show: Show, size: "card" | "hero" = "card") {
  // Original generated title card: a dusk color field and one lit window. No borrowed imagery.
  const h = show.posterHue;
  const w = size === "hero" ? 1280 : 640;
  const ht = size === "hero" ? 720 : 360;
  const k = ht / 360;
  const title = esc(show.title.toUpperCase());
  return `<svg class="poster" viewBox="0 0 ${w} ${ht}" role="img" aria-label="${esc(show.title)} title card" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="g${show.id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="hsl(${h} 40% 18%)"/><stop offset="1" stop-color="hsl(${(h + 30) % 360} 45% 9%)"/></linearGradient></defs>
<rect width="${w}" height="${ht}" fill="url(#g${show.id})"/>
<rect x="${w - 150 * k}" y="${70 * k}" width="${84 * k}" height="${104 * k}" fill="hsl(${h} 30% 6%)"/>
<rect x="${w - 142 * k}" y="${78 * k}" width="${68 * k}" height="${88 * k}" fill="#FFC46B" opacity="0.92"/>
<rect x="${w - 142 * k}" y="${78 * k}" width="${68 * k}" height="${88 * k}" fill="none" stroke="hsl(${h} 30% 6%)" stroke-width="${3 * k}"/>
<line x1="${w - 108 * k}" y1="${78 * k}" x2="${w - 108 * k}" y2="${166 * k}" stroke="hsl(${h} 30% 6%)" stroke-width="${3 * k}"/>
<line x1="${w - 142 * k}" y1="${122 * k}" x2="${w - 74 * k}" y2="${122 * k}" stroke="hsl(${h} 30% 6%)" stroke-width="${3 * k}"/>
<text x="${28 * k}" y="${44 * k}" font-family="Archivo, Arial Narrow, sans-serif" font-weight="600" font-size="${15 * k}" letter-spacing="${3 * k}" fill="hsl(${h} 15% 92%)" opacity="0.8">${esc(SITE.nightShort)} NIGHT · ${esc(slotOrd(show.slot).toUpperCase())} · ${esc(slotName(show.slot).toUpperCase())}</text>
<text x="${28 * k}" y="${ht - 34 * k}" font-family="Archivo, Arial Narrow, Impact, sans-serif" font-stretch="condensed" font-weight="800" font-size="${44 * k}" letter-spacing="-0.5" fill="hsl(${h} 15% 95%)">${title}</text>
</svg>`;
}

export function guidePage(shows: Show[]) {
  const rows = shows
    .map(
      (s, i) => html`<li class="listing ${s.status === "premiere" ? "listing-premiere" : ""}" style="--hue:${s.posterHue};--i:${i}">
  <a class="listing-link" href="/show/${s.id}">
    <div class="listing-time"><span class="t">${s.slot}</span><span class="slot">${slotOrd(s.slot)} · ${slotName(s.slot)}</span></div>
    <div class="listing-art">${raw(posterSvg(s))}</div>
    <div class="listing-body">
      <h2 class="listing-title">${s.title} <span class="tag">${s.genreLabel}</span> <span class="tag tag-quiet">${s.ratingLabel}</span></h2>
      <p class="listing-logline">${s.logline}</p>
      <p class="listing-blurb">${s.blurb}</p>
      <p class="listing-cta">${s.status === "premiere" ? html`<span class="premiere-note">Premiere pick</span> ` : ""}${s.trailerUrl ? html`<span class="cta"><span class="on-air-dot" aria-hidden="true"></span> Watch the trailer</span> <span class="dur">${mmss(s.trailerSeconds)}</span>` : html`<span class="cta cta-soon">Trailer in production</span>`}</p>
    </div>
  </a>
</li>`
    )
    .join("");
  const body = html`
<section class="guide-head">
  <div class="guide-head-inner">
    <p class="eyebrow">${SITE.nightLabel} night listings</p>
    <h1 class="guide-title">${SITE.hero}</h1>
    <p class="guide-dek">Four original comedies, in order, on one night. Every show here is a trailer. Watch one. Then tell us one thing: would your house watch this? The shows parents pick get made.</p>
  </div>
  <div class="grid-block" aria-label="${SITE.nightLabel} night order">
    <div class="grid-times" aria-hidden="true"><span>${SITE.nightShort} night</span>${raw(SITE.slotOrdinals.map((t) => `<span>${t}</span>`).join(""))}</div>
    <div class="grid-strip">
      <div class="grid-strip-ch"><span class="ch-num">${SITE.channelNumber}</span><span class="ch-name">${SITE.name}</span></div>
      ${raw(shows.map((s) => `<a class="grid-cell" href="/show/${s.id}" style="--hue:${s.posterHue}"><span class="grid-time">${esc(slotName(s.slot))}</span><span class="grid-title">${esc(s.title)}</span></a>`).join(""))}
    </div>
  </div>
</section>
<section class="listings-wrap">
  <ol class="listings">${raw(rows)}</ol>
</section>
<section class="signup-band" id="signup">
  <div class="signup-inner">
    <h2>Save the night</h2>
    <p>${SITE.emailName} lands in a parent's inbox before the block. When it premieres, and which show your house picked. Nothing else.</p>
    <form class="signup-form" method="post" action="/api/signup" data-signup>
      <label class="sr-only" for="email">Parent email</label>
      <input id="email" name="email" type="email" required autocomplete="email" placeholder="parent@example.com">
      <label class="check"><input type="checkbox" name="parent" required> I am a parent or guardian, age 18 or over.</label>
      <button type="submit">${SITE.saveButton}</button>
      <p class="form-note" data-note aria-live="polite"></p>
    </form>
  </div>
</section>`;
  return layout(`${SITE.name}: ${SITE.nightLabel} night listings`, body, { bodyClass: "page-guide" });
}

export function showPage(show: Show, all: Show[]) {
  const others = all.filter((s) => s.id !== show.id);
  const player = show.trailerUrl
    ? html`<div class="player" data-player data-show="${show.id}">
  <video controls playsinline preload="metadata" poster="/posters/${show.id}.svg" data-video>
    <source src="${show.trailerUrl}" type="video/mp4">
    Your browser cannot play this video.
  </video>
</div>`
    : html`<div class="player player-soon" aria-label="Trailer in production">${raw(posterSvg(show, "hero"))}<div class="soon-badge">Trailer in production</div></div>`;
  const body = html`
<article class="show" style="--hue:${show.posterHue}">
  <nav class="crumbs"><a href="/">${SITE.nightLabel} night listings</a> <span aria-hidden="true">/</span> <span>${slotOrd(show.slot)}, the ${slotName(show.slot)}</span></nav>
  <header class="show-head">
    <p class="eyebrow">${SITE.nightLabel} night · ${slotOrd(show.slot)} · ${slotName(show.slot)} · ${show.genreLabel} · ${show.ratingLabel} · ${show.runtimeLabel}</p>
    <h1 class="show-title">${show.title}</h1>
    <p class="show-logline">${show.logline}</p>
    <p class="show-prompt">Watch the trailer. Then tell us one thing: would your house watch this?</p>
  </header>
  ${player}
  <section class="show-body">
    <h2 class="sr-only">About the show</h2>
    <p class="show-blurb">${show.blurb}</p>
  </section>
  <section class="verdict" data-vote data-show="${show.id}">
    <h2>Would your house watch this?</h2>
    <div class="verdict-buttons">
      <button type="button" class="vote vote-up" data-value="up"><span class="vote-fill" aria-hidden="true"></span><span class="vote-label">${SITE.voteYes}</span></button>
      <button type="button" class="vote vote-down" data-value="down"><span class="vote-fill" aria-hidden="true"></span><span class="vote-label">${SITE.voteNo}</span></button>
    </div>
    <p class="form-note" data-note aria-live="polite">One vote per household. You can change it.</p>
  </section>
  <section class="signup-band signup-band-inline">
    <div class="signup-inner">
      <h2>Save the night</h2>
      <p>${SITE.emailName} lands in a parent's inbox before ${show.title} premieres. Nothing else.</p>
      <form class="signup-form" method="post" action="/api/signup" data-signup>
        <label class="sr-only" for="email2">Parent email</label>
        <input id="email2" name="email" type="email" required autocomplete="email" placeholder="parent@example.com">
        <label class="check"><input type="checkbox" name="parent" required> I am a parent or guardian, age 18 or over.</label>
        <button type="submit">${SITE.saveButton}</button>
        <p class="form-note" data-note aria-live="polite"></p>
      </form>
    </div>
  </section>
  <nav class="up-next">
    <h2>Also on ${SITE.nightLabel} night</h2>
    <ul>${raw(others.map((s) => `<li style="--hue:${s.posterHue}"><a href="/show/${s.id}"><span class="up-time">${s.slot}</span> <span class="up-title">${esc(s.title)}</span> <span class="up-slot">${esc(slotOrd(s.slot))} · ${esc(slotName(s.slot))}</span></a></li>`).join(""))}</ul>
  </nav>
</article>`;
  return layout(`${show.title}: ${SITE.name}`, body, { description: show.logline, bodyClass: "page-show", dark: true });
}

export function aboutPage() {
  const body = html`
<article class="prose">
  <p class="eyebrow">For parents</p>
  <h1>What this is</h1>
  <p>${SITE.name} is a weekly family comedy block in development. One night a week, ${SITE.nightLabel}. Four original shows, in order. A host who carries the house between them.</p>
  <p>Right now the shows are trailers. We put them here so parents can tell us which ones deserve full seasons. Plays and votes are the greenlight.</p>
  <h2>How we handle children and privacy</h2>
  <ul>
    <li>The account holder is always a parent or guardian. There is no child login and no child account.</li>
    <li>We collect no personal information from children. The only thing we ask for is a parent's email, and only if you offer it.</li>
    <li>We measure with a random household number stored in a cookie on your browser. It holds no name, no address, and no device identity.</li>
    <li>There are no comments and no personalized ads.</li>
  </ul>
  <p class="fine">Privacy policy and terms are in review with counsel and will appear here before public launch.</p>
  <h2>How the trailers were made</h2>
  <p class="fine">Disclosure text about production methods is in review with counsel and will appear here before public launch.</p>
</article>`;
  return layout(`For parents: ${SITE.name}`, body);
}

export function notFoundPage() {
  return layout(`Not found: ${SITE.name}`, html`<article class="prose"><p class="eyebrow">Off air</p><h1>Nothing on this channel</h1><p><a href="/">Back to ${SITE.nightLabel} night listings</a>.</p></article>`);
}

export function statsPage(s: SiteStats) {
  const pct = (n: number) => `${Math.round(n * 100)}%`;
  const rows = s.shows
    .map(
      (r) => `<tr><td>${r.slot}</td><td>${esc(r.title)}</td><td>${r.households}</td><td>${r.plays}</td><td>${r.reached25}</td><td>${r.reached50}</td><td>${r.reached75}</td><td>${r.completed}</td><td>${pct(r.completionRate)}</td><td>${r.votesUp}</td><td>${r.votesDown}</td><td>${r.voteRatio == null ? "n/a" : r.voteRatio.toFixed(1)}</td><td>${r.developFurther ? "YES" : "no"}</td></tr>`
    )
    .join("");
  const body = html`
<article class="prose stats">
  <p class="eyebrow">Owner view</p>
  <h1>Demand dashboard</h1>
  <table class="stats-table">
    <thead><tr><th>Slot</th><th>Show</th><th>Households</th><th>Plays</th><th>25%</th><th>50%</th><th>75%</th><th>100%</th><th>Completion</th><th>Yes</th><th>No</th><th>Ratio</th><th>Develop further</th></tr></thead>
    <tbody>${raw(rows)}</tbody>
  </table>
  <ul>
    <li>Parent sign-ups: ${s.signups} (floor 500: ${s.signupFloorMet ? "met" : "not met"})</li>
    <li>Households seen: ${s.householdsTotal}. Returning in a later week: ${s.householdsReturning} (${pct(s.returnRate)})</li>
    <li>Develop-further line (D-013): completion at or above 40 percent and a yes-to-no ratio at or above 3 to 1.</li>
  </ul>
</article>`;
  return layout(`Stats: ${SITE.name}`, body);
}
