import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";

export const shows = sqliteTable("shows", {
  id: text("id").primaryKey(), // slug
  slot: integer("slot").notNull(), // 1..4
  title: text("title").notNull(),
  logline: text("logline").notNull(),
  blurb: text("blurb").notNull(), // guide listing blurb, 2 to 3 sentences
  genreLabel: text("genre_label").notNull(), // e.g. "Comedy", "Anthology"
  ratingLabel: text("rating_label").notNull().default("Family"),
  runtimeLabel: text("runtime_label").notNull().default("30 min"),
  trailerUrl: text("trailer_url"), // null = trailer in production
  trailerSeconds: integer("trailer_seconds"),
  posterHue: integer("poster_hue").notNull().default(30), // 0..360 for the generated poster
  status: text("status").notNull().default("trailer"), // trailer | pilot | series
  sortOrder: integer("sort_order").notNull().default(0),
});

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  household: text("household").notNull(), // random id from a first-party cookie, no PII
  showId: text("show_id").notNull(),
  kind: text("kind").notNull(), // play | progress | complete
  pct: integer("pct").notNull().default(0), // 0..100
  ts: integer("ts").notNull(), // unix ms
});

export const votes = sqliteTable(
  "votes",
  {
    household: text("household").notNull(),
    showId: text("show_id").notNull(),
    value: integer("value").notNull(), // 1 = would watch, -1 = would not
    ts: integer("ts").notNull(),
  },
  (t) => [primaryKey({ columns: [t.household, t.showId] })]
);

export const signups = sqliteTable("signups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  household: text("household").notNull(),
  ts: integer("ts").notNull(),
});
