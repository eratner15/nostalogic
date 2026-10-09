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
# POSIX cron: 1 = Monday (Cloudflare cron differs). The Worker's weekly ledger
# starts at 06:00 UTC Monday but waits until the hourly signal runs have read
# Sunday for every source (about 12:00 UTC at 20 pairs an hour). 13:32 New York
# is 17:32-18:32 UTC, after the snapshot in both EST and EDT.
schedule:
  type: cron
  expression: "32 13 * * 1"
  timezone: America/New_York
# Hard cap per run, in cents. Tighten after the first real runs show the cost.
budget:
  type: limit
  max_list_cost: {amount: "500", currency: USD}
---

Run this week's Revival Watch. Follow your instructions in order.
