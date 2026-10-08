"use client";

import { useEffect, useState } from "react";
import { fetchPropertiesFromApi, scoreAll, scoredProperties, type PropertyScore } from "@/services/property-data";

// One fetch per page load, shared by every component that asks.
let live: Promise<PropertyScore[] | null> | null = null;

/**
 * The live scored library from D1. Starts with the bundled snapshot so the page
 * renders at once and offline, then swaps in live scores, which move when the
 * weekly ledger or an approved proposal changes an input.
 */
export function useLibrary(): PropertyScore[] {
  const [library, setLibrary] = useState<PropertyScore[]>(scoredProperties);
  useEffect(() => {
    let alive = true;
    live ??= fetchPropertiesFromApi().then((list) => (list ? scoreAll(list) : null));
    live.then((list) => {
      if (alive && list) setLibrary(list);
    });
    return () => { alive = false; };
  }, []);
  return library;
}
