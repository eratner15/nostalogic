---
name: zeitgeist-weekly
agent: ../agents/zeitgeist-scout.md
environment_id: ../environments/zeitgeist-scout.yaml
resources:
  - path: ../memory_stores/zeitgeist-preferences.yaml
    access: read_only
  - path: ../memory_stores/zeitgeist-state.yaml
    access: read_write
# POSIX cron: 1 = Monday. Runs before Revival Watch (13:32) so both reports
# arrive the same morning.
schedule:
  type: cron
  expression: "7 9 * * 1"
  timezone: America/New_York
# Hard cap per run, in cents. Tighten after the first real runs show the cost.
budget:
  type: limit
  max_list_cost: {amount: "500", currency: USD}
---

Run this week's Zeitgeist Scout. Follow your instructions in order.
