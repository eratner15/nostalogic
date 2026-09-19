import { createApp } from "./app";
import { D1Store } from "./store-d1";

type Env = { DB: D1Database; ASSETS: Fetcher; ADMIN_TOKEN?: string; SITE_ENV?: string };

let cached: { app: ReturnType<typeof createApp>; db: D1Database } | null = null;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (!cached || cached.db !== env.DB) {
      cached = { app: createApp({ store: new D1Store(env.DB), adminToken: env.ADMIN_TOKEN }), db: env.DB };
    }
    return cached.app.fetch(request, env, ctx);
  },
};
