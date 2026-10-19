#!/usr/bin/env bash
# One-time setup for the Zeitgeist Scout agent. Run from the repo root.
# Needs: ant >= 1.34 logged in. Each step that changes something asks first.
set -euo pipefail
cd "$(dirname "$0")/.."
export NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt

confirm() { read -r -p "$1 [y/N] " a; [[ "$a" == "y" ]]; }

# 0. The agent must not run on placeholder assets.
if grep -q '\[TITLE\]' agent-seed/zeitgeist/preferences/assets.md; then
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

# 2. Seed memory. A path that already exists (409) is left as it is; any other
#    failure stops the script, so the agent never runs without its rules.
seed() {
  local store=$1 f=$2 out
  if out=$(ant beta:memory-stores:memories create --memory-store-id "$store" --path "/$(basename "$f")" --content "$(cat "$f")" 2>&1 >/dev/null); then
    return 0
  fi
  if grep -qiE '409|already exists|conflict' <<<"$out"; then
    echo "kept existing /$(basename "$f")"
  else
    echo "memory seed failed for $f: $out" >&2
    exit 1
  fi
}
for f in agent-seed/zeitgeist/preferences/*.md; do seed "$PREFS" "$f"; done
for f in agent-seed/zeitgeist/state/*.md; do seed "$STATE" "$f"; done

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
