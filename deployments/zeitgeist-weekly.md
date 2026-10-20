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


## Paused runs

`write` and `edit` run under the `auto` permission policy. The server runs most
calls, denies unsafe ones, and pauses any it cannot decide. A paused session
waits indefinitely. After each Monday run, open the session: if it shows a
pending tool confirmation, read the proposed write and approve or deny it. If
the run log has no line for that Monday by noon New York time, check for a
paused session first.

A paused session does not stop next Monday's run, and two runs writing the
same ledger can clobber each other. If a run is still pending when you find
it, pause the deployment first:
`ant beta:deployments pause --deployment-id <id>`. Resolve the pending run,
then `ant beta:deployments unpause --deployment-id <id>`. Unpausing resumes
at the next scheduled Monday; a missed Monday is not run again.
