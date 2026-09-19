import { drizzle } from "drizzle-orm/d1";
import { eq, sql } from "drizzle-orm";
import * as schema from "./db/schema";
import type { Store, Show, EventRow, VoteRow, SignupRow } from "./store";

export class D1Store implements Store {
  private db;
  constructor(d1: D1Database) {
    this.db = drizzle(d1, { schema });
  }
  async listShows(): Promise<Show[]> {
    const rows = await this.db.select().from(schema.shows).orderBy(schema.shows.slot, schema.shows.sortOrder);
    return rows as Show[];
  }
  async getShow(id: string): Promise<Show | null> {
    const rows = await this.db.select().from(schema.shows).where(eq(schema.shows.id, id)).limit(1);
    return (rows[0] as Show) ?? null;
  }
  async recordEvent(e: EventRow) {
    await this.db.insert(schema.events).values(e);
  }
  async vote(v: VoteRow) {
    await this.db
      .insert(schema.votes)
      .values(v)
      .onConflictDoUpdate({ target: [schema.votes.household, schema.votes.showId], set: { value: v.value, ts: v.ts } });
  }
  async signup(s: SignupRow): Promise<"created" | "exists"> {
    const existing = await this.db.select({ id: schema.signups.id }).from(schema.signups).where(eq(schema.signups.email, s.email)).limit(1);
    if (existing.length) return "exists";
    await this.db.insert(schema.signups).values(s);
    return "created";
  }
  async rawEvents(): Promise<EventRow[]> {
    const rows = await this.db.select().from(schema.events);
    return rows.map((r) => ({ household: r.household, showId: r.showId, kind: r.kind as EventRow["kind"], pct: r.pct, ts: r.ts }));
  }
  async rawVotes(): Promise<VoteRow[]> {
    const rows = await this.db.select().from(schema.votes);
    return rows.map((r) => ({ household: r.household, showId: r.showId, value: r.value as 1 | -1, ts: r.ts }));
  }
  async countSignups(): Promise<number> {
    const rows = await this.db.select({ n: sql<number>`count(*)` }).from(schema.signups);
    return Number(rows[0]?.n ?? 0);
  }
}
