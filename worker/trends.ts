/**
 * cafecito-ai.com/trends: the Zeitgeist trend tracker.
 *
 * The page (public/trends/index.html), its data (public/trends/data.json) and
 * the report copies (public/trends/reports/) are public. The Worker serves only
 * those paths from assets, so nothing else under /trends leaks out of the bundle.
 */
export type TrendsEnv = { ASSETS: Fetcher };

// Public, but kept out of search results; and short-cached so a deploy shows fast.
const HEADERS = { "Cache-Control": "public, max-age=300", "X-Robots-Tag": "noindex, nofollow" };

export function isTrendsPath(pathname: string): boolean {
  return pathname === "/trends" || pathname.startsWith("/trends/");
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

  if (pathname === "/trends/" || pathname === "/trends/index.html") {
    return withHeaders(await asset(req, env, "/trends/index.html"), HEADERS);
  }

  if (pathname === "/trends/data.json" || /^\/trends\/reports\/\d{4}-\d{2}-\d{2}\.html$/.test(pathname)) {
    return withHeaders(await asset(req, env, pathname), HEADERS);
  }

  return new Response("Not found", { status: 404, headers: HEADERS });
}
