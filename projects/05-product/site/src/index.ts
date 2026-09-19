import { createApp } from "./app";
import { D1Store } from "./store-d1";
import { MemoryStore, type Show } from "./store";
import seedShows from "../content/shows.json";

type Env = { DB?: D1Database; ASSETS: Fetcher; ADMIN_TOKEN?: string; SITE_ENV?: string; BASE_PATH?: string };

let cached: { app: ReturnType<typeof createApp>; key: string } | null = null;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const key = `${env.BASE_PATH ?? ""}|${env.DB ? "d1" : "memory"}`;
    if (!cached || cached.key !== key) {
      // Without a D1 binding (preview accounts), serve from an in-memory store seeded from content/shows.json.
      // Votes and sign-ups then live only for the life of the isolate. Production always binds D1.
      const store = env.DB ? new D1Store(env.DB) : new MemoryStore(seedShows as Show[]);
      cached = { app: createApp({ store, adminToken: env.ADMIN_TOKEN, basePath: env.BASE_PATH ?? "", assets: env.ASSETS }), key };
    }
    return cached.app.fetch(request, env, ctx);
  },
};
