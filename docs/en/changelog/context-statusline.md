---
description: 2026-07-16 update — statusline gains context-used and context-remaining items
---

# Status line context usage

- **Date**: 2026-07-16
- **Commit**: `feat(tui): add context usage items to statusline`
- **Version cue**: `0.11.1-alpha.4`

The status line now has two new optional components for showing how much of your context window is being used.

## Config

```toml
[tui]
status_line = [
  "current-dir",
  "current-model",
  "context-used", # [!code highlight]
  "context-remaining", # [!code highlight]
]
```

| Value | Example | Meaning |
| --- | --- | --- |
| `context-used` | `Context 42% used` | Percentage used after your last successful request |
| `context-remaining` | `Context 58% left` | Percentage remaining after your last successful request |

## Behavior details

1. Numbers come from the `context_usage` reported when a request finishes (on the `MessageFinished` path), then the status line refreshes.
2. **`/resume`** (restoring a session) and **`/clear`** (clearing the current conversation) both reset the display — so you don't carry over an old percentage from a previous session.
3. Follows the same rules as other status line items: if you don't configure it, it doesn't show up. If you do configure it but we don't have data yet, the slot won't leave an empty line.

The total context window size still comes from your `models.toml` resolution (`model_profiles` → `defaults` → built-in). For reference, see [models.toml](/guide/start/configuration/models) and [`/context`](/guide/fun/menu/context).
