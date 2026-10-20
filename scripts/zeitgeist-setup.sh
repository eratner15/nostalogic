#!/usr/bin/env bash
# One-time setup for the Zeitgeist Scout agent. Run from the repo root.
# Needs: ant >= 1.34 logged in. Each step that changes something asks first.
set -euo pipefail
cd "$(dirname "$0")/.."
export NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt

confirm() { read -r -p "$1 [y/N] " a; [[ "$a" == "y" ]]; }

# 0. The agent must not run on placeholder assets.
if grep -qE '\[(AUTHOR|ASIN)\]' agent-seed/zeitgeist/preferences/assets.md; then
  echo "Fill in agent-seed/zeitgeist/preferences/assets.md first." >&2
  exit 1
fi

# 1. Create agent, environment and memory stores. Shows the plan, then asks.
BASE=(agents/zeitgeist-scout.md environments/zeitgeist-scout.yaml
      memory_stores/zeitgeist-preferences.yaml memory_stores/zeitgeist-state.yaml)
ant apply --dry-run -v "${BASE[@]}"
confirm "Apply this plan?" || exit 1
ant apply "${BASE[@]}"

id_of() { node -e "const l=require('./claude-lock.json');console.log(l.resources['$1'].id)"; }
PREFS=$(id_of ./memory_stores/zeitgeist-preferences.yaml)
STATE=$(id_of ./memory_stores/zeitgeist-state.yaml)

# 2. Seed memory.
#    State (ledger, run log) is create-only: a path that already exists is the
#    agent's own work and is kept. Preferences are the repo's rules, so a
#    preference that already exists is overwritten with the repo copy.
#    The API keys updates by memory id, not path (memory docs: "use this ID,
#    not the path, to read, update, or delete the memory"), and has no
#    get-by-path, so the id is found by listing the store and matching .path.
#    A 409 can also mean an ancestor/descendant path overlap; that case has no
#    exact-path match in the listing and stops the script, for state and
#    preferences alike.
create() {  # store file -> 0 created, 1 exists (409), exits on other errors
  local store=$1 f=$2 out
  if out=$(ant beta:memory-stores:memories create --memory-store-id "$store" \
             --path "/$(basename "$f")" --content "$(cat "$f")" 2>&1 >/dev/null); then
    return 0
  fi
  if grep -qiE '409|already exists|conflict' <<<"$out"; then return 1; fi
  echo "memory seed failed for $f: $out" >&2
  exit 1
}
exact_id() {  # store path -> id of the memory at exactly that path, or ""
  # list flags per the CLI reference (path_prefix, format); check
  # `ant beta:memory-stores:memories list --help` if this step fails.
  ant beta:memory-stores:memories list --memory-store-id "$1" \
      --path-prefix "/" --format json \
    | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{
        const j=JSON.parse(s); const items=Array.isArray(j)?j:(j.data||[]);
        const m=items.find(x=>x.path===process.argv[1]); console.log(m?m.id:"");})' "$2"
}
seed_state() {
  local store=$1 f=$2 path
  path="/$(basename "$f")"
  create "$store" "$f" && return 0
  if [[ -z "$(exact_id "$store" "$path")" ]]; then
    echo "memory seed failed for $f: $path conflicts with another path and has no exact match" >&2
    exit 1
  fi
  echo "kept existing $path"
}
seed_pref() {
  local store=$1 f=$2 path id
  path="/$(basename "$f")"
  create "$store" "$f" && return 0
  id=$(exact_id "$store" "$path")
  if [[ -z "$id" ]]; then
    echo "memory seed failed for $f: $path conflicts with another path and has no exact match" >&2
    exit 1
  fi
  ant beta:memory-stores:memories update --memory-store-id "$store" \
    --memory-id "$id" --content "$(cat "$f")" >/dev/null
  echo "updated existing $path from the repo"
}
for f in agent-seed/zeitgeist/preferences/*.md; do seed_pref "$PREFS" "$f"; done
for f in agent-seed/zeitgeist/state/*.md; do seed_state "$STATE" "$f"; done

# 3. The weekly deployment.
ant apply --dry-run -v deployments/zeitgeist-weekly.md
confirm "Create the weekly deployment?" || exit 1
ant apply deployments/zeitgeist-weekly.md
DEPL=$(id_of ./deployments/zeitgeist-weekly.md)

# 4. Optional manual run, before the first Monday.
if confirm "Start one manual run now?"; then
  ant beta:deployments run --deployment-id "$DEPL"
fi
echo "Deployment: $DEPL. Reports: ant beta:memory-stores:memories list --memory-store-id $STATE"
