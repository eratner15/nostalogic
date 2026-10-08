#!/usr/bin/env bash
# One-time setup for the Revival Watch agent. Run from the repo root, after
# the Worker is deployed with the migration. Needs: ant >= 1.34 logged in,
# wrangler logged in. Each step that changes something asks first.
set -euo pipefail
cd "$(dirname "$0")/.."
export NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt

confirm() { read -r -p "$1 [y/N] " a; [[ "$a" == "y" ]]; }

# 1. Create agent, environment, memory stores and vault. Shows the plan, then asks.
BASE=(agents/revival-watch.md environments/revival-watch.yaml
      memory_stores/nostal-preferences.yaml memory_stores/nostal-state.yaml vaults/nostal.yaml)
ant apply --dry-run -v "${BASE[@]}"
confirm "Apply this plan?" || exit 1
ant apply "${BASE[@]}"

id_of() { node -e "const l=require('./claude-lock.json');console.log(l.resources['$1'].id)"; }
PREFS=$(id_of ./memory_stores/nostal-preferences.yaml)
STATE=$(id_of ./memory_stores/nostal-state.yaml)
VAULT=$(id_of ./vaults/nostal.yaml)

# ant apply (1.39) does not resolve a path inside vault_ids; write the real id.
sed -i "s#  - ../vaults/nostal.yaml#  - ${VAULT}  # vaults/nostal.yaml#" deployments/revival-watch-weekly.md

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
for f in agent-seed/preferences/*.md; do seed "$PREFS" "$f"; done
for f in agent-seed/state/*.md; do seed "$STATE" "$f"; done

# 3. One token, two homes: the Worker secret and the vault credential. Never printed.
if confirm "Create a new AGENT_TOKEN (Worker secret + vault credential)?"; then
  TOKEN=$(openssl rand -hex 32)
  printf '%s' "$TOKEN" | npx wrangler secret put AGENT_TOKEN
  ant beta:vaults:credentials create --vault-id "$VAULT" --display-name "NostalDamus agent token" \
    --auth "{type: environment_variable, secret_name: NOSTAL_AGENT_TOKEN, secret_value: \"$TOKEN\", networking: {type: limited, allowed_hosts: [nostalogic.cafecito-ai.com]}, injection_location: {header: true}}" >/dev/null
  unset TOKEN
fi

# 4. The deployment last: it needs the vault credential to exist.
ant apply --dry-run -v deployments/revival-watch-weekly.md
confirm "Create the weekly deployment?" || exit 1
ant apply deployments/revival-watch-weekly.md
DEPL=$(id_of ./deployments/revival-watch-weekly.md)

# 5. Optional manual run, before the first Monday.
if confirm "Start one manual run now?"; then
  ant beta:deployments run --deployment-id "$DEPL"
fi
echo "Deployment: $DEPL. Runs: ant beta:deployment-runs list --deployment-id $DEPL"
