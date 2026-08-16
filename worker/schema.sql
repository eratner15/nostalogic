-- NostalDamus D1 schema. The properties table is the product; everything the
-- old static property-data.ts carried moves here, plus scoring provenance.
CREATE TABLE IF NOT EXISTS properties (
  id                   TEXT PRIMARY KEY,        -- kebab-name-year
  name                 TEXT NOT NULL,
  year                 INTEGER NOT NULL CHECK (year BETWEEN 1993 AND 1998),
  category             TEXT NOT NULL,
  genre                TEXT NOT NULL,
  original_impact      INTEGER NOT NULL,
  modern_relevance     INTEGER NOT NULL,
  social_buzz          INTEGER NOT NULL,
  rights_complexity    INTEGER NOT NULL,
  creator_availability INTEGER NOT NULL,
  brief_description    TEXT NOT NULL,
  core_audience        TEXT NOT NULL,
  current_signal       TEXT NOT NULL,
  revival_format       TEXT NOT NULL,
  tags                 TEXT NOT NULL DEFAULT '[]',   -- JSON array
  preserve             TEXT NOT NULL DEFAULT '[]',   -- JSON array
  update_recs          TEXT NOT NULL DEFAULT '[]',   -- JSON array
  -- scoring provenance: which rubric produced the judgment scores and when
  rubric_version       TEXT NOT NULL,
  scored_at            TEXT NOT NULL DEFAULT (datetime('now')),
  created_at           TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_properties_category ON properties(category);
CREATE INDEX IF NOT EXISTS idx_properties_year ON properties(year);

-- Remix Lab persistence: a remix is 2+ property ids plus the generated concept.
CREATE TABLE IF NOT EXISTS remixes (
  id           TEXT PRIMARY KEY,
  property_ids TEXT NOT NULL,               -- JSON array of property ids
  concept      TEXT NOT NULL,               -- generated revival concept (markdown)
  model        TEXT,                        -- null when deterministic fallback
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Prophet Chat: flat message log per session key (anonymous, client-generated).
CREATE TABLE IF NOT EXISTS chat_messages (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  session_key TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('user','assistant')),
  content     TEXT NOT NULL,
  cited_ids   TEXT NOT NULL DEFAULT '[]',   -- property ids the answer used
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_messages(session_key, id);

-- Simple per-key daily counters for tier rate limits (Phase 3 wires tiers).
CREATE TABLE IF NOT EXISTS usage_counters (
  bucket     TEXT NOT NULL,                 -- e.g. 'remix' | 'chat'
  actor_key  TEXT NOT NULL,                 -- session key or user id later
  day        TEXT NOT NULL,                 -- YYYY-MM-DD
  n          INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (bucket, actor_key, day)
);
