// Data layer. Two implementations: D1 (production) and Memory (tests, local fallback).
export type Show = {
  id: string;
  slot: number;
  title: string;
  logline: string;
  blurb: string;
  genreLabel: string;
  ratingLabel: string;
  runtimeLabel: string;
  trailerUrl: string | null;
  trailerSeconds: number | null;
  posterHue: number;
  status: string;
  sortOrder: number;
};
export type EventKind = "play" | "progress" | "complete";
export type EventRow = { household: string; showId: string; kind: EventKind; pct: number; ts: number };
export type VoteRow = { household: string; showId: string; value: 1 | -1; ts: number };
export type SignupRow = { email: string; household: string; ts: number };

export type ShowStats = {
  showId: string;
  title: string;
  slot: number;
  households: number; // distinct households with a play
  plays: number;
  reached25: number;
  reached50: number;
  reached75: number;
  completed: number;
  completionRate: number; // completed / households, 0..1
  votesUp: number;
  votesDown: number;
  voteRatio: number | null; // up / down, null when down is 0
  developFurther: boolean; // D-013 line: completion >= 0.40 and ratio >= 3 (or up >= 3 with no down)
};
export type SiteStats = {
  shows: ShowStats[];
  signups: number;
  householdsTotal: number;
  householdsReturning: number; // households with plays in 2 or more distinct ISO weeks
  returnRate: number;
  signupFloorMet: boolean; // D-009: 500 parent sign-ups
};

export interface Store {
  listShows(): Promise<Show[]>;
  getShow(id: string): Promise<Show | null>;
  recordEvent(e: EventRow): Promise<void>;
  vote(v: VoteRow): Promise<void>;
  signup(s: SignupRow): Promise<"created" | "exists">;
  rawEvents(): Promise<EventRow[]>;
  rawVotes(): Promise<VoteRow[]>;
  countSignups(): Promise<number>;
}

export const DEVELOP_FURTHER = { completion: 0.4, voteRatio: 3, signupFloor: 500 } as const;

export function isoWeekKey(tsMs: number): string {
  const d = new Date(tsMs);
  const day = (d.getUTCDay() + 6) % 7; // Monday = 0
  const thursday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - day + 3));
  const firstThursday = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((thursday.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return `${thursday.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export async function computeStats(store: Store): Promise<SiteStats> {
  const [shows, events, votes, signups] = await Promise.all([
    store.listShows(),
    store.rawEvents(),
    store.rawVotes(),
    store.countSignups(),
  ]);
  const byShow = new Map<string, EventRow[]>();
  for (const e of events) {
    if (!byShow.has(e.showId)) byShow.set(e.showId, []);
    byShow.get(e.showId)!.push(e);
  }
  const showStats: ShowStats[] = shows.map((s) => {
    const evs = byShow.get(s.id) ?? [];
    const maxPct = new Map<string, number>();
    let plays = 0;
    for (const e of evs) {
      if (e.kind === "play") plays++;
      const pct = e.kind === "complete" ? 100 : e.pct;
      maxPct.set(e.household, Math.max(maxPct.get(e.household) ?? 0, pct));
    }
    const households = maxPct.size;
    const count = (th: number) => [...maxPct.values()].filter((p) => p >= th).length;
    const completed = count(100);
    const vs = votes.filter((v) => v.showId === s.id);
    const votesUp = vs.filter((v) => v.value === 1).length;
    const votesDown = vs.filter((v) => v.value === -1).length;
    const completionRate = households ? completed / households : 0;
    const voteRatio = votesDown === 0 ? null : votesUp / votesDown;
    const ratioOk = votesDown === 0 ? votesUp >= DEVELOP_FURTHER.voteRatio : voteRatio! >= DEVELOP_FURTHER.voteRatio;
    return {
      showId: s.id,
      title: s.title,
      slot: s.slot,
      households,
      plays,
      reached25: count(25),
      reached50: count(50),
      reached75: count(75),
      completed,
      completionRate,
      votesUp,
      votesDown,
      voteRatio,
      developFurther: households > 0 && completionRate >= DEVELOP_FURTHER.completion && ratioOk,
    };
  });
  const weeksByHousehold = new Map<string, Set<string>>();
  for (const e of events) {
    if (!weeksByHousehold.has(e.household)) weeksByHousehold.set(e.household, new Set());
    weeksByHousehold.get(e.household)!.add(isoWeekKey(e.ts));
  }
  const householdsTotal = weeksByHousehold.size;
  const householdsReturning = [...weeksByHousehold.values()].filter((w) => w.size >= 2).length;
  return {
    shows: showStats,
    signups,
    householdsTotal,
    householdsReturning,
    returnRate: householdsTotal ? householdsReturning / householdsTotal : 0,
    signupFloorMet: signups >= DEVELOP_FURTHER.signupFloor,
  };
}

export class MemoryStore implements Store {
  shows: Show[] = [];
  events: EventRow[] = [];
  votes = new Map<string, VoteRow>();
  signups = new Map<string, SignupRow>();
  constructor(shows: Show[] = []) {
    this.shows = shows;
  }
  async listShows() {
    return [...this.shows].sort((a, b) => a.slot - b.slot || a.sortOrder - b.sortOrder);
  }
  async getShow(id: string) {
    return this.shows.find((s) => s.id === id) ?? null;
  }
  async recordEvent(e: EventRow) {
    this.events.push(e);
  }
  async vote(v: VoteRow) {
    this.votes.set(`${v.household}:${v.showId}`, v);
  }
  async signup(s: SignupRow) {
    if (this.signups.has(s.email)) return "exists";
    this.signups.set(s.email, s);
    return "created";
  }
  async rawEvents() {
    return this.events;
  }
  async rawVotes() {
    return [...this.votes.values()];
  }
  async countSignups() {
    return this.signups.size;
  }
}
