/**
 * Poster SVG hygiene. The Studio page shows posters through an <img> (where a
 * browser never runs scripts), and this is the second line of defence: keep
 * only a drawing, drop anything that could run code or load from elsewhere.
 */

import { XMLParser, XMLValidator } from "fast-xml-parser";

const MAX_BYTES = 120_000;

/** Decodes the XML entities a poster's text can use, so "Kenan &amp; Kel" reads as "Kenan & Kel". */
export function decodeXml(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
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

// The elements a drawn poster uses. Anything else (an HTML <img> in a switched default
// namespace, <feImage>, unknown tags) rejects the poster rather than being repaired.
const DRAWING = new Set([
  "svg", "g", "defs", "title", "desc", "metadata", "symbol", "rect", "circle", "ellipse", "line",
  "polyline", "polygon", "path", "text", "tspan", "textPath", "linearGradient", "radialGradient",
  "stop", "clipPath", "mask", "pattern", "marker", "filter", "feBlend", "feColorMatrix",
  "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap",
  "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR",
  "feGaussianBlur", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight",
  "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence",
]);
const drawingParser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: "", processEntities: false });

/**
 * True when the parsed poster holds only drawing elements in the SVG namespace: no element
 * outside DRAWING, no default namespace other than SVG, no `src`, and no backslash in any
 * attribute value (CSS escapes and line continuations have no use in a poster).
 */
function onlySvgDrawing(svg: string): boolean {
  type XmlNode = Record<string, unknown> & { ":@"?: Record<string, string> };
  const ok = (nodes: XmlNode[]): boolean => nodes.every((node) => {
    if ("#text" in node) return true;
    const name = Object.keys(node).find((k) => k !== ":@");
    if (!name || !DRAWING.has(name)) return false;
    for (const [attr, value] of Object.entries(node[":@"] ?? {})) {
      const v = decodeXml(String(value));
      if (attr === "xmlns" && v !== "http://www.w3.org/2000/svg") return false;
      if (/^src$/i.test(attr) || v.includes("\\")) return false;
    }
    return ok((node[name] as XmlNode[]) ?? []);
  });
  return ok(drawingParser.parse(svg) as XmlNode[]);
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
  // A document type can declare entities; a poster never needs one.
  if (/<!(DOCTYPE|ENTITY)/i.test(svg)) return null;
  svg = svg
    // Normalize first, so every later check reads plain elements and text: comments and
    // processing instructions never render, and CDATA becomes ordinary escaped text.
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\?[\s\S]*?\?>/g, "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, (_, text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"))
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
  // A real XML check: a browser shows nothing for an SVG file that does not parse
  // (unbalanced tags, unquoted attributes, entities XML does not define).
  if (XMLValidator.validate(svg) !== true || /&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-f]+);)/i.test(svg)) return null;
  if (loadsExternal(svg) || !onlySvgDrawing(svg)) return null;
  // Ensure the namespace so the file renders when opened on its own.
  // Read only the root's own attributes (quote-aware), and require the SVG namespace there.
  const root = svg.match(/^<svg(?:\s+[^\s=>\/]+\s*=\s*(?:"[^"]*"|'[^']*'))*\s*\/?>/)?.[0];
  if (!root) return null;
  const ns = root.match(/\sxmlns\s*=\s*(?:"([^"]*)"|'([^']*)')/);
  if (!ns) svg = svg.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  else if ((ns[1] ?? ns[2]) !== "http://www.w3.org/2000/svg") return null;
  return svg;
}
