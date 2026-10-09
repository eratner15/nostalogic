-- Remix Studio: one row per development pack (concept, poster, opening pages,
-- preview, verdict). Steps are written as they finish, so a failed run keeps
-- what it made before the failure.
CREATE TABLE IF NOT EXISTS studio_packages (
  id            TEXT PRIMARY KEY,
  property_ids  TEXT NOT NULL,                 -- JSON array of source property ids
  format        TEXT NOT NULL,
  preview_kind  TEXT NOT NULL CHECK (preview_kind IN ('trailer','scene')),
  status        TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running','done','error')),
  concept       TEXT,                          -- JSON
  poster_svg    TEXT,                          -- sanitized SVG
  screenplay    TEXT,                          -- Fountain text
  preview       TEXT,                          -- JSON
  verdict       TEXT,                          -- JSON
  error         TEXT,
  model         TEXT NOT NULL,
  session_key   TEXT NOT NULL,
  input_tokens  INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_studio_created ON studio_packages(created_at DESC);
