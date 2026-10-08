// Run: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { checkItem } from "./agent-api.ts";

const ids = new Set(["daria-1997"]);
const outcome = (payload: Record<string, unknown>) => ({
  item_key: "daria-1997:announced:2026-11-01", property_id: "daria-1997", kind: "outcome" as const,
  title: "Daria revival announced", source_url: "https://variety.com/x", payload,
});

test("an outcome without a source quote is rejected", () => {
  assert.match(checkItem(outcome({ kind: "announced", event_date: "2026-11-01" }), ids) ?? "", /quote/);
  assert.equal(checkItem(outcome({ kind: "announced", event_date: "2026-11-01", quote: "MTV greenlit the series." }), ids), null);
});
