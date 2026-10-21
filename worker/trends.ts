/**
 * cafecito-ai.com/trends: the Zeitgeist trend tracker.
 *
 * The page shell (public/trends/index.html) is public and holds no data. The
 * data (public/trends/data.json) and the report copies (public/trends/reports/)
 * are served only to a browser holding the access cookie, because they carry
 * prices, margins and plans. The key is the TRENDS_KEY secret; without it the
 * data fails closed.
 */
export type TrendsEnv = { ASSETS: Fetcher; TRENDS_KEY?: string };

const COOKIE = "trends_key";
const PRIVATE = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" };

export function isTrendsPath(pathname: string): boolean {
  return pathname === "/trends" || pathname.startsWith("/trends/");
}

/** Constant-time string comparison, so the key cannot be guessed by timing. */
export function sameKey(a: string, b: string): boolean {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

function cookieKey(req: Request): string {
  const header = req.headers.get("Cookie") ?? "";
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === COOKIE) return decodeURIComponent(rest.join("="));
  }
  return "";
}

function withHeaders(res: Response, extra: Record<string, string>): Response {
  const out = new Response(res.body, res);
  for (const [k, v] of Object.entries(extra)) out.headers.set(k, v);
  return out;
}

function asset(req: Request, env: TrendsEnv, path: string): Promise<Response> {
  const url = new URL(req.url);
  url.pathname = path;
  url.search = "";
  return env.ASSETS.fetch(new Request(url.toString(), { method: "GET", headers: req.headers }));
}

export async function trendsRoute(req: Request, env: TrendsEnv): Promise<Response> {
  const { pathname } = new URL(req.url);

  if (pathname === "/trends") return Response.redirect(new URL("/trends/", req.url).toString(), 301);

  if (pathname === "/trends/login") {
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: PRIVATE });
    const form = await req.formData().catch(() => null);
    const given = String(form?.get("key") ?? "");
    const ok = !!env.TRENDS_KEY && sameKey(given, env.TRENDS_KEY);
    const headers = new Headers({ ...PRIVATE, Location: ok ? "/trends/" : "/trends/?denied=1" });
    if (ok) {
      headers.append("Set-Cookie",
        `${COOKIE}=${encodeURIComponent(given)}; Path=/trends; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax`);
    }
    return new Response(null, { status: 303, headers });
  }

  if (pathname === "/trends/" || pathname === "/trends/index.html") {
    return withHeaders(await asset(req, env, "/trends/index.html"), PRIVATE);
  }

  if (pathname === "/trends/data.json" || pathname.startsWith("/trends/reports/")) {
    if (!env.TRENDS_KEY) return new Response("Trends key not configured", { status: 503, headers: PRIVATE });
    if (!sameKey(cookieKey(req), env.TRENDS_KEY)) return new Response("Key required", { status: 401, headers: PRIVATE });
    return withHeaders(await asset(req, env, pathname), PRIVATE);
  }

  return new Response("Not found", { status: 404, headers: PRIVATE });
}
