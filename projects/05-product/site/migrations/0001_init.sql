CREATE TABLE `shows` (
  `id` text PRIMARY KEY NOT NULL,
  `slot` integer NOT NULL,
  `title` text NOT NULL,
  `logline` text NOT NULL,
  `blurb` text NOT NULL,
  `genre_label` text NOT NULL,
  `rating_label` text DEFAULT 'Family' NOT NULL,
  `runtime_label` text DEFAULT '30 min' NOT NULL,
  `trailer_url` text,
  `trailer_seconds` integer,
  `poster_hue` integer DEFAULT 30 NOT NULL,
  `status` text DEFAULT 'trailer' NOT NULL,
  `sort_order` integer DEFAULT 0 NOT NULL
);
CREATE TABLE `events` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `household` text NOT NULL,
  `show_id` text NOT NULL,
  `kind` text NOT NULL,
  `pct` integer DEFAULT 0 NOT NULL,
  `ts` integer NOT NULL
);
CREATE INDEX `events_show_idx` ON `events` (`show_id`);
CREATE INDEX `events_household_idx` ON `events` (`household`);
CREATE TABLE `votes` (
  `household` text NOT NULL,
  `show_id` text NOT NULL,
  `value` integer NOT NULL,
  `ts` integer NOT NULL,
  PRIMARY KEY(`household`, `show_id`)
);
CREATE TABLE `signups` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `email` text NOT NULL,
  `household` text NOT NULL,
  `ts` integer NOT NULL
);
CREATE UNIQUE INDEX `signups_email_unique` ON `signups` (`email`);
