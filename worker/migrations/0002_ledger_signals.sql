-- Revival Watch: prediction ledger, signal pipeline, agent proposals.
-- Plan: docs/plans/revival-watch.html. Additive only; no existing column changes.

-- Keep the hand-authored r2 buzz before rubric r3 starts to overwrite social_buzz.
ALTER TABLE properties ADD COLUMN social_buzz_hand INTEGER;
UPDATE properties SET social_buzz_hand = social_buzz WHERE social_buzz_hand IS NULL;

-- Weekly score history. Insert-only: a second write in the same week is ignored.
CREATE TABLE IF NOT EXISTS score_snapshots (
  property_id      TEXT NOT NULL REFERENCES properties(id),
  week             TEXT NOT NULL,                 -- Monday, YYYY-MM-DD (UTC)
  score            INTEGER NOT NULL,
  social_buzz      INTEGER NOT NULL,
  modern_relevance INTEGER NOT NULL,
  window_alignment INTEGER NOT NULL,
  rubric_version   TEXT NOT NULL,
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (property_id, week)
);
CREATE INDEX IF NOT EXISTS idx_snapshots_week ON score_snapshots(week);

-- Approved revival news. Only an approved proposal or an admin writes here.
CREATE TABLE IF NOT EXISTS outcomes (
  id          TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES properties(id),
  kind        TEXT NOT NULL CHECK (kind IN ('announced','released','denied')),
  event_date  TEXT NOT NULL,                      -- YYYY-MM-DD
  source_url  TEXT NOT NULL,
  note        TEXT,
  proposal_id TEXT,
  approved_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_outcomes_property ON outcomes(property_id, event_date);

-- One bookmark per (property, source). read_to = last day fully read.
CREATE TABLE IF NOT EXISTS signal_bookmarks (
  property_id TEXT NOT NULL REFERENCES properties(id),
  source      TEXT NOT NULL CHECK (source IN ('wikipedia','arcticshift')),
  query       TEXT NOT NULL,                      -- wiki title, or subreddit name
  read_to     TEXT,                               -- YYYY-MM-DD; null = never read
  last_error  TEXT,
  PRIMARY KEY (property_id, source)
);

-- One row per day read ('ok'), or one row per failed read ('gap').
CREATE TABLE IF NOT EXISTS signal_readings (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id TEXT NOT NULL,
  source      TEXT NOT NULL,
  status      TEXT NOT NULL CHECK (status IN ('ok','gap')),
  day         TEXT,                               -- the day counted (ok rows)
  value       REAL,                               -- views or posts that day
  detail      TEXT,                               -- error text (gap rows)
  read_at     TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_readings_day ON signal_readings(property_id, source, day) WHERE status = 'ok';
CREATE INDEX IF NOT EXISTS idx_readings_status ON signal_readings(status, id);

-- Agent digests and the proposals they carry.
CREATE TABLE IF NOT EXISTS digests (
  id             TEXT PRIMARY KEY,
  week           TEXT NOT NULL,
  summary_md     TEXT NOT NULL,
  unread_sources TEXT NOT NULL DEFAULT '[]',     -- JSON array of strings
  cursor_from    INTEGER NOT NULL,
  cursor_to      INTEGER NOT NULL,
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS proposals (
  id          TEXT PRIMARY KEY,
  digest_id   TEXT NOT NULL REFERENCES digests(id),
  item_key    TEXT NOT NULL UNIQUE,               -- stable id: no repeat across weeks
  property_id TEXT NOT NULL REFERENCES properties(id),
  kind        TEXT NOT NULL CHECK (kind IN ('outcome','field')),
  title       TEXT NOT NULL,
  payload     TEXT NOT NULL,                      -- JSON
  source_url  TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','approved','rejected')),
  decided_at  TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status, created_at);

-- The agent's bookmark: the last signal_readings.id a committed digest covered.
CREATE TABLE IF NOT EXISTS agent_cursor (
  agent  TEXT PRIMARY KEY,
  cursor INTEGER NOT NULL DEFAULT 0
);
INSERT OR IGNORE INTO agent_cursor (agent, cursor) VALUES ('revival-watch', 0);
