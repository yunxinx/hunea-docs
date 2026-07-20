---
description: The /prompt Tools tab gains On/Guide dual-column switches to enable or disable individual built-in tools, filtering disabled tools from the model request and session registry, with persistence
---

# Per-tool enable / disable

- **Date**: 2026-07-16
- **Commit**: `feat(prompt): support per-tool enable/disable`
- **Version cue**: `0.11.1-alpha.3`

Previously the Tools tab in [`/prompt`](/guide/fun/menu/prompt) only controlled whether a tool's usage *guidelines* were injected into the prompt; it couldn't actually turn a tool off. This change lets you decide, per tool, whether it's exposed to the model at all.

## What changed

1. **Tools tab is now an On/Guide dual-column toggle**  
   Each tool row now has two checkbox columns:
   - `On`: whether the tool itself is enabled. When off, the tool won't appear in the tool list sent to the model, so the model can't call it.
   - `Guide`: whether the tool's usage guidelines are injected into the system prompt, same as the old behavior.

   The On/Guide dual-column switches look like this:

   ![tool-off-on](/assets/changelog/tool-off-on.png)

2. **Disabled tools are filtered in two places**  
   Turning `On` off filters the tool out of both the **provider request tool definitions** and the **session tool registry**. Disabling isn't just "don't mention it to the model"; the tool truly isn't offered at runtime anymore.

3. **State is persisted**  
   Tool enablement (`tool_enablement`) is written to the session store (SQLite) and project-level TOML. On an empty session the change takes effect immediately; sessions that have already started still target the "next new session", consistent with other `/prompt` edits.

## How to use it

In the [`/prompt`](/guide/fun/menu/prompt) panel, switch the right column to the `Tools` tab:

| Key | Action |
| --- | --- |
| `←` / `→` | Move between the `On` / `Guide` columns (the active column is highlighted) |
| `x` | Toggle the switch in the current column |

A couple of interactions to note:

- When a tool's `On` is off, its `Guide` column becomes non-operable (dimmed), and `x` is a no-op there. With the tool itself disabled, injecting only its guidelines makes no sense.
- Tools that have no guidelines to begin with also have a no-op `Guide` column.

## Related features

- For the built-in tool list, approval policy, and path boundaries, see [Tools & approvals](/guide/fun/tools).
- Preview the final assembled prompt after toggling with `p` in [`/prompt`](/guide/fun/menu/prompt); see tool-definition context usage in [`/context`](/guide/fun/menu/context).
- Most edits target the "next new session". To verify immediately in a clean context, close `/prompt` and start a new session with `/clear` (alias `/new`).
