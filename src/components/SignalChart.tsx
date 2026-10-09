"use client";

import type { DayPoint } from "@/lib/signals";

/**
 * One calm line. Neutral stroke for the series; the amber accent marks only
 * the last 30 points, the window the model reads. No gradient fill, no dots.
 */
export function SignalChart({ points, accentLast = 30, height = 200, unit = "" }: { points: DayPoint[]; accentLast?: number; height?: number; unit?: string }) {
  if (points.length < 2) return null;
  const w = 600, h = 200, padL = 44, padR = 8, padT = 10, padB = 24;
  const max = Math.max(1, ...points.map((p) => p.value));
  const x = (i: number) => padL + (i / (points.length - 1)) * (w - padL - padR);
  const y = (v: number) => padT + (1 - v / max) * (h - padT - padB);
  const path = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const start = Math.max(0, points.length - accentLast);
  const recent = points.slice(start).map((p, i) => `${i ? "L" : "M"}${x(start + i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const ticks = [0, 0.5, 1].map((f) => Math.round(max * f));
  const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n));
  const first = points[0].day, last = points[points.length - 1].day, mid = points[Math.floor(points.length / 2)].day;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }} role="img" aria-label={`${points.length} readings from ${first} to ${last}, peak ${max}${unit}`}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={padL} x2={w - padR} y1={y(t)} y2={y(t)} stroke="currentColor" strokeOpacity="0.12" />
          <text x={padL - 6} y={y(t) + 4} textAnchor="end" fontSize="11" fill="currentColor" fillOpacity="0.6" fontFamily="var(--font-mono, monospace)">{fmt(t)}</text>
        </g>
      ))}
      <path d={path} fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.5" strokeLinejoin="round" />
      {points.length > accentLast && <path d={recent} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinejoin="round" />}
      {[first, mid, last].map((d, i) => (
        <text key={d + i} x={i === 0 ? padL : i === 1 ? (padL + w - padR) / 2 : w - padR} y={h - 6} textAnchor={i === 0 ? "start" : i === 1 ? "middle" : "end"} fontSize="11" fill="currentColor" fillOpacity="0.6" fontFamily="var(--font-mono, monospace)">{d}</text>
      ))}
    </svg>
  );
}
