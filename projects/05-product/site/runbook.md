# Runbook: trailer site

Stack: Cloudflare Workers, Hono, TypeScript, D1, Drizzle, wrangler. Folder: `projects/05-product/site/`.
The NostalDamus app at the repo root is a separate worker. Nothing here touches it.

## 1. Local run

1. `cd projects/05-product/site`
2. `npm install`
3. `npm run db:migrate:local`
4. `npm run seed:build` then `npm run seed:local`
5. `npm run dev`
6. Open `http://127.0.0.1:8787/`.

Admin dashboard in local dev: create `.dev.vars` with `ADMIN_TOKEN=devtoken`, restart, open `/admin?token=devtoken`.

## 2. Checks before any deploy

1. `npm run typecheck`
2. `npm test`
3. Open the guide and one show page at phone width. No horizontal scroll.

## 3. First deploy (owner, one time)

1. `npx wrangler login`
2. `npx wrangler d1 create porchlight-guide-db`. Copy the `database_id` into `wrangler.toml`.
3. `npm run db:migrate:remote`
4. `npm run seed:build` then `npm run seed:remote`
5. `npx wrangler secret put ADMIN_TOKEN` (a long random string)
6. `npm run deploy`
7. Add a custom domain in the Cloudflare dashboard under Workers, Custom Domains, once the brand name is chosen (Fork D) and counsel clears CG-01.

## 4. Update the shows or trailers

1. Edit `content/shows.json`. Set `trailerUrl` to the MP4 URL (Cloudflare R2 or Stream) and `trailerSeconds`.
2. `npm run seed:build`
3. `npm run seed:remote`
No redeploy is needed for content. Redeploy only for code.

## 5. Hosting trailer files

Put finished MP4 files on Cloudflare R2 with a public bucket domain, or on Cloudflare Stream and use the MP4 download URL. Keep each trailer under 60 MB at 1080p. The `<video>` tag uses `preload="metadata"`, so the poster shows before any download.

## 6. Measurement

- Household: a random cookie `hh`. No PII. One per browser. Never sent to a third party.
- Events: play, progress at 25, 50, 75 percent, complete.
- Votes: one per household per show, changeable.
- Sign-ups: parent email only, with a parent confirmation box.
- Dashboard: `/admin?token=<ADMIN_TOKEN>` or `GET /api/stats` with `Authorization: Bearer <ADMIN_TOKEN>`.
- Lines: D-009 sign-up floor 500. D-013 develop-further per show: completion at or above 40 percent and yes-to-no at or above 3 to 1.

## 7. Release gates (do not skip)

- CG-02: privacy policy and terms must clear counsel before public launch. The About page holds placeholders.
- CG-03: any AI-generated performance, voice, or image in a trailer must clear counsel, and the About page must carry the disclosure text, before public launch.
- Standards: every trailer needs a PASS report in `projects/08-compliance/out/standards/` before it goes into `content/shows.json`.
- `<meta name="robots" content="noindex">` stays on until both counsel gates clear.
