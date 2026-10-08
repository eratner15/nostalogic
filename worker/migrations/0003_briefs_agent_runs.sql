-- $199 brief intake (Codex funnel) and the Prophet search agent's run log.
-- IF NOT EXISTS: safe if brief_requests was already created by hand.
-- Same-day commercial funnel: qualified requests for the $199 Revival
-- Opportunity Brief. Payment stays on a hosted checkout URL when configured.
CREATE TABLE IF NOT EXISTS brief_requests (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  company       TEXT,
  property_name TEXT NOT NULL,
  objective     TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'new',
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_brief_requests_created ON brief_requests(created_at DESC);

-- Prophet search agent: one row per answered question, with the research
-- steps it took and token usage, so cost and answer quality can be audited.
CREATE TABLE IF NOT EXISTS agent_runs (
  id                TEXT PRIMARY KEY,
  session_key       TEXT NOT NULL,
  question          TEXT NOT NULL,
  answer            TEXT NOT NULL,
  cited_ids         TEXT NOT NULL DEFAULT '[]',   -- JSON array of property ids
  steps             TEXT NOT NULL DEFAULT '[]',   -- JSON array of {tool, input, summary}
  model             TEXT NOT NULL,
  input_tokens      INTEGER NOT NULL DEFAULT 0,
  output_tokens     INTEGER NOT NULL DEFAULT 0,
  cache_read_tokens INTEGER NOT NULL DEFAULT 0,
  status            TEXT NOT NULL DEFAULT 'ok' CHECK (status IN ('ok','error')),
  error             TEXT,                          -- the message shown to the visitor on failure
  created_at        TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_agent_runs_created ON agent_runs(created_at DESC);
