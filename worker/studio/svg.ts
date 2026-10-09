/**
 * Poster SVG hygiene. The Studio page shows posters through an <img> (where a
 * browser never runs scripts), and this is the second line of defence: keep
 * only a drawing, drop anything that could run code or load from elsewhere.
 */

const MAX_BYTES = 120_000;

/** Decodes the XML entities a poster's text can use, so "Kenan &amp; Kel" reads as "Kenan & Kel". */
export function decodeXml(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
}

/**
 * True when every element closes in order. A browser shows nothing for an SVG file
 * whose tags do not match, so such a poster is rejected and asked for again.
 */
function wellFormed(svg: string): boolean {
  const body = svg.replace(/<!--[\s\S]*?-->/g, "").replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, "").replace(/<\?[\s\S]*?\?>/g, "");
  const stack: string[] = [];
  for (const [tag, close, name] of body.matchAll(/<(\/?)([^\s<>\/!?]+)[^<>]*>/g)) {
    if (tag.endsWith("/>")) continue;
    if (!close) stack.push(name);
    else if (stack.pop() !== name) return false;
  }
  return stack.length === 0 && !/<(?![!?\/]?[^\s<>\/!?]+[^<>]*>)/.test(body);
}

/**
 * True when an attribute value would load something from outside the file once the
 * XML parser decodes entities and CSS removes its escapes ("u&#114;l(https://...)").
 */
function loadsExternal(svg: string): boolean {
  for (const [, quoted] of svg.matchAll(/\s[\w:.-]+\s*=\s*("[^"]*"|'[^']*')/g)) {
    const value = decodeXml(quoted.slice(1, -1))
      .replace(/\\([0-9a-f]{1,6})\s?/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
      .replace(/\\(.)/g, "$1");
    if (/url\(\s*(?!["']?\s*#)/i.test(value) || /javascript:/i.test(value)) return true;
  }
  return false;
}

export function extractSvg(text: string): string | null {
  const start = text.indexOf("<svg");
  const end = text.lastIndexOf("</svg>");
  if (start === -1 || end === -1 || end < start) return null;
  return text.slice(start, end + "</svg>".length);
}

export function sanitizeSvg(raw: string): string | null {
  let svg = extractSvg(raw);
  if (!svg || svg.length > MAX_BYTES) return null;
  svg = svg
    // Elements that run code, embed documents, or pull remote content.
    // A namespace prefix ("<s:script>") does not hide an element.
    .replace(/<((?:[\w-]+:)?(?:script|foreignObject|iframe|object|embed|image|use|style|animate\w*|set|a))\b[\s\S]*?(<\/\1>|\/>)/gi, "")
    .replace(/<\/?(?:[\w-]+:)?(script|foreignObject|iframe|object|embed|image|use|style|a)\b[^>]*>/gi, "")
    // Event handlers and javascript: URLs.
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "")
    // xml:base would make a #fragment reference resolve against a remote document.
    .replace(/\sxml:base\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    // Links that leave the document: only #fragment references survive.
    .replace(/\s(?:[\w-]+:)?href\s*=\s*("(?!#)[^"]*"|'(?!#)[^']*'|(?!["'#])[^\s>]+)/gi, "")
    // Quoted and unquoted references are separate cases, so url("#g") survives.
    .replace(/url\(\s*(?:"(?!#)[^"]*"|'(?!#)[^']*'|(?!["'#])[^)]*)\s*\)/gi, "none");
  if (!/^<svg[\s>]/.test(svg)) return null;
  // A poster needs no namespace-prefixed elements, and a prefix can disguise an active one
  // ("<s.x:script>"), so any prefixed element tag rejects the poster outright.
  if (/<\/?[^\s<>\/!?]+:/.test(svg)) return null;
  if (!wellFormed(svg) || loadsExternal(svg)) return null;
  // Ensure the namespace so the file renders when opened on its own.
  if (!/xmlns=/.test(svg.slice(0, 300))) svg = svg.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  return svg;
}
