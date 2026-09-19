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

## 8. Review deploy at ratlinks.com/tv

The container that built this site cannot reach the Cloudflare or Netlify APIs (egress policy), so the deploy is an owner step. Where ratlinks.com is hosted decides the path. Both paths keep the code unchanged.

### 8a. If ratlinks.com is on Cloudflare (recommended, keeps D1, votes, and sign-ups)

1. `cd projects/05-product/site`
2. `npx wrangler login`
3. `npx wrangler d1 create porchlight-guide-db` and paste the `database_id` into `wrangler.toml`.
4. In `wrangler.toml` set `BASE_PATH = "/tv"` and add a route: `routes = [{ pattern = "ratlinks.com/tv*", zone_name = "ratlinks.com" }]`.
5. `npm run db:migrate:remote` then `npm run seed:build` then `npm run seed:remote`.
6. `npx wrangler secret put ADMIN_TOKEN`
7. `npm run deploy`
8. Open `https://ratlinks.com/tv/`. The dashboard is `https://ratlinks.com/tv/admin?token=<ADMIN_TOKEN>`.

### 8b. If ratlinks.com is elsewhere (static review only, no votes or sign-ups saved)

1. `cd projects/05-product/site`
2. `BASE_PATH=/tv npm run export:static`
3. Upload the `dist/` folder to the host so that `dist/index.html` serves at `https://ratlinks.com/tv/`.
4. Every button works but shows "Review build: nothing is saved here."

### 8c. Fastest public preview with no domain work

1. `npx wrangler login`
2. `npx wrangler deploy --config wrangler.preview.toml`
3. Wrangler prints a `workers.dev` URL. The preview has no database, so votes and sign-ups last only as long as the worker instance.

## 9. GitHub Actions deploy (the path in use)

`.github/workflows/deploy-tv.yml` runs on every push that touches the site. It needs repository secrets:

| Secret | Required | Token permissions |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Yes | Account > Workers Scripts > Edit. For saved votes and sign-ups: Account > D1 > Edit. For ratlinks.com/tv: Zone > Workers Routes > Edit on the ratlinks.com zone. |
| `CLOUDFLARE_ACCOUNT_ID` | Yes | The account that holds the ratlinks.com zone. |
| `ADMIN_TOKEN` | Optional | Any long random string. Unlocks `/admin?token=...`. |

Outcomes:
1. Preview at `https://streetlights-guide.evan-ratner.workers.dev/` (and the earlier `streetlights-preview` worker from the first run).
2. If the token has D1 Edit, the workflow creates `porchlight-guide-db`, migrates, seeds, and binds it. Otherwise the site runs in review mode: pages and trailers work, votes and sign-ups are not saved.
3. If the ratlinks.com zone is on the account and the token has Workers Routes Edit, `https://ratlinks.com/tv/` goes live. Otherwise the step warns and the preview URL stands.

To add a permission: Cloudflare dashboard, My Profile, API Tokens, edit the token, add the permission, save. Then re-run the workflow from the Actions tab.
