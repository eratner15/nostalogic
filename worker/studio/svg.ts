/**
 * Poster SVG hygiene. The Studio page shows posters through an <img> (where a
 * browser never runs scripts), and this is the second line of defence: keep
 * only a drawing, drop anything that could run code or load from elsewhere.
 */

const MAX_BYTES = 120_000;

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
    // Links that leave the document: only #fragment references survive.
    .replace(/\s(?:[\w-]+:)?href\s*=\s*("(?!#)[^"]*"|'(?!#)[^']*'|(?!["'#])[^\s>]+)/gi, "")
    // Quoted and unquoted references are separate cases, so url("#g") survives.
    .replace(/url\(\s*(?:"(?!#)[^"]*"|'(?!#)[^']*'|(?!["'#])[^)]*)\s*\)/gi, "none");
  if (!/^<svg[\s>]/.test(svg)) return null;
  // Ensure the namespace so the file renders when opened on its own.
  if (!/xmlns=/.test(svg.slice(0, 300))) svg = svg.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  return svg;
}
