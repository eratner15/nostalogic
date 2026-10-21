"""Build the data behind cafecito-ai.com/trends.

Reads only committed files, so the page is re-runnable and every number on it
comes from a verifier, never from typing:
  - the newest scripts/zeitgeist/calc_*.py: the current board (scores, bands,
    factors, caps), recomputed on every build;
  - docs/zeitgeist/history.csv: each trend's score and band by run;
  - agent-seed/zeitgeist/state/run-log.md: one line per run;
  - docs/zeitgeist/reports/*.html: copied for the page to link;
  - docs/zeitgeist/tracker.json: what we are building, hand-maintained.
Writes public/trends/data.json and public/trends/reports/. Run from the repo
root: python3 -I scripts/zeitgeist/build_trends.py
"""
import csv
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "trends"
STATUSES = {"live", "ready", "in_progress", "planned", "waiting", "done", "stopped"}
RUN_LINE = re.compile(r"^(\d{4}-\d{2}-\d{2}) report (\S+) .*?trends (\d+)(?: \([^)]*\))? go (\d+) watch (\d+)(?: pass (\d+))?")


def latest_calc() -> Path:
    calcs = sorted((ROOT / "scripts" / "zeitgeist").glob("calc_*.py"))
    if not calcs:
        sys.exit("no scripts/zeitgeist/calc_*.py")
    return calcs[-1]


def calc_weights(path: Path) -> dict:
    """The factor weights, read from the calculator itself (W = dict(...))."""
    m = re.search(r"^W = dict\((.*?)\)$", path.read_text(), re.M)
    if not m:
        sys.exit(f"no W = dict(...) in {path.name}")
    pairs = dict(kv.split("=") for kv in m.group(1).replace(" ", "").split(","))
    return {k: round(float(v) * 100) for k, v in pairs.items()}


def run_calc(path: Path) -> dict:
    out = subprocess.run([sys.executable, "-I", str(path)], check=True, capture_output=True, text=True)
    return json.loads(out.stdout)


def read_history() -> dict:
    hist: dict = {}
    with open(ROOT / "docs" / "zeitgeist" / "history.csv", newline="") as f:
        for row in csv.DictReader(f):
            hist.setdefault(row["trend"], []).append(
                {"date": row["run_date"], "score": int(row["score"]), "band": row["band"]})
    for points in hist.values():
        points.sort(key=lambda p: p["date"])
    return hist


def read_runs() -> list:
    runs = []
    for line in (ROOT / "agent-seed" / "zeitgeist" / "state" / "run-log.md").read_text().splitlines():
        m = RUN_LINE.match(line)
        if not m:
            continue
        date, report, n, go, watch, pss = m.groups()
        runs.append({"date": date, "report": Path(report).name, "trends": int(n), "go": int(go),
                     "watch": int(watch), "pass": int(pss) if pss is not None else 0, "note": line})
    return runs


def main() -> None:
    calc_path = latest_calc()
    calc = run_calc(calc_path)
    board = calc["board"]
    names = {r["name"] for r in board}
    run_date = re.search(r"calc_(\d{4}-\d{2}-\d{2})", calc_path.name).group(1)

    hist = read_history()
    for r in board:
        last = hist.get(r["name"], [])
        if not last or last[-1]["date"] != run_date or last[-1]["score"] != r["score"] or last[-1]["band"] != r["band"]:
            sys.exit(f"history.csv is out of step with {calc_path.name} for {r['name']!r}; add its {run_date} row")
        r["history"] = last

    tracker = json.loads((ROOT / "docs" / "zeitgeist" / "tracker.json").read_text())
    for item in tracker["items"]:
        if item["status"] not in STATUSES:
            sys.exit(f"tracker: bad status {item['status']!r} on {item['title']!r}")
        if item["trend"] is not None and item["trend"] not in names:
            sys.exit(f"tracker: {item['title']!r} names unknown trend {item['trend']!r}")

    runs = read_runs()
    reports_dir = ROOT / "docs" / "zeitgeist" / "reports"
    reports = sorted(p.name for p in reports_dir.glob("*.html"))
    for run in runs:
        if run["report"] not in reports:
            sys.exit(f"run-log names a missing report {run['report']}")

    (OUT / "reports").mkdir(parents=True, exist_ok=True)
    for old in (OUT / "reports").glob("*.html"):
        old.unlink()
    for name in reports:
        html = (reports_dir / name).read_text()
        if not html.lstrip().lower().startswith("<!doctype"):
            # The reports are artifact fragments; give them a page skeleton so
            # browsers render them in standards mode.
            html = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
                    '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
                    '<meta name="robots" content="noindex, nofollow">\n'
                    + html + '\n</html>\n')
        (OUT / "reports" / name).write_text(html)

    data = {
        "built_from": calc_path.name,
        "run_date": run_date,
        "weights": calc_weights(calc_path),
        "board": board,
        "runs": runs,
        "reports": reports,
        "tracker": tracker,
    }
    (OUT / "data.json").write_text(json.dumps(data, indent=1, default=str) + "\n")
    print(f"wrote {OUT / 'data.json'}: {len(board)} trends, {len(runs)} runs, "
          f"{len(reports)} reports, {len(tracker['items'])} tracker items")


if __name__ == "__main__":
    main()
