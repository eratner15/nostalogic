---
name: revival-watch-weekly
agent: ../agents/revival-watch.md
environment_id: ../environments/revival-watch.yaml
vault_ids:
  - ../vaults/nostal.yaml
resources:
  - path: ../memory_stores/nostal-preferences.yaml
    access: read_only
  - path: ../memory_stores/nostal-state.yaml
    access: read_write
# POSIX cron: 1 = Monday (Cloudflare cron differs). 07:32 New York is after the
# Worker's 06:00 UTC weekly ledger in both EST and EDT.
schedule:
  type: cron
  expression: "32 7 * * 1"
  timezone: America/New_York
# Hard cap per run, in cents. Tighten after the first real runs show the cost.
budget:
  type: limit
  max_list_cost: {amount: "500", currency: USD}
---

Run this week's Revival Watch. Follow your instructions in order.
