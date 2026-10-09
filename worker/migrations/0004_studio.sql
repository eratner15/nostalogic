-- Remix Studio: one row per development pack (concept, opening pages, sizzle,
-- poster and keyframes, verdict). Steps are written as they finish, so a
-- failed run keeps what it made before the failure. Images live in R2
-- (binding MEDIA); this table stores their same-origin URLs in `art`.
CREATE TABLE IF NOT EXISTS studio_packages (
  id            TEXT PRIMARY KEY,
  property_ids  TEXT NOT NULL,                 -- JSON array of source property ids
  format        TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running','done','error')),
  concept       TEXT,                          -- JSON
  screenplay    TEXT,                          -- Fountain text
  sizzle        TEXT,                          -- JSON: shots, style bible, poster prompt
  art           TEXT,                          -- JSON: poster image URL or SVG, keyframe URLs
  verdict       TEXT,                          -- JSON
  error         TEXT,
  model         TEXT NOT NULL,
  session_key   TEXT NOT NULL,
  input_tokens  INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  cache_write_tokens INTEGER NOT NULL DEFAULT 0,  -- prompt-cache writes (billed above input)
  cache_read_tokens  INTEGER NOT NULL DEFAULT 0,  -- prompt-cache reads (billed below input)
  images        INTEGER NOT NULL DEFAULT 0,    -- images generated, for cost tracking
  hidden        INTEGER NOT NULL DEFAULT 0,    -- 1 = taken down by an admin (rights or abuse)
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_studio_created ON studio_packages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_studio_gallery ON studio_packages(status, hidden, created_at DESC);
