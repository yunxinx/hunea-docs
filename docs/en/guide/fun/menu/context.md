---
description: What the /context slash command does in Hunea
---

# /context

`/context` in Hunea is for inspecting how much of the current session’s context window is used.

Use it when you want a sense of how full the window is, how much room is left, and roughly which categories are consuming it. Confirming `/context` opens an inline panel near the input (title `Context Usage`).

Roughly:

![context](/assets/fun/context.png)

> Numbers here are **estimates**. The panel also marks them with `~` so they are not read as exact accounting.

## What the panel shows

While loading you may see `Loading context budget...`. When ready, you typically get:

1. **Summary line**  
   Something like `model id · ~used/limit tokens (percent)`, e.g. `gpt-4o · ~32k/128k tokens (25.0%)`. The limit comes from the current model’s context-window config (see “Where the limit comes from”).

2. **Heatmap (color grid)**  
   Colored blocks proportional to each category’s share of the total window, with free space styled separately. It is not “message N owns cell M” precision — just a visual of whether system prompt, tool definitions, or conversation messages dominate.

3. **Legend**  
   Categories roughly include (only items with estimated usage > 0, plus free space):

   | Label | Roughly includes |
   | --- | --- |
   | `System prompt` | System prompt / prompt prefixes |
   | `Skill discovery` | Skill-discovery fragments |
   | `Tool definitions` | Tool definitions |
   | `Messages` | User messages, assistant replies, tool results, reasoning, and other dialogue-side content |
   | `Free space` | Room left under the context limit |

Each legend row usually has a color mark, category name, estimated tokens, and share of the total. Press `Esc` to close. There are no extra interaction shortcuts in the current version. On a very narrow terminal the panel may say there is not enough space; widen the window and open it again.

## What it estimates

`/context` estimates how the **next request prepared for the provider**, based on the current session state, would occupy context.

So it folds in system-side content, tool definitions, history (including related tool results / reasoning), and so on. If the runtime already has a provider-reported total context size, the displayed “used total” may be calibrated against that so percentages track real request size more closely — category breakdowns remain estimates either way.

In short:

- **“Can I keep chatting / should I `/clear`?”** → look at used/limit and percent on the summary line
- **“What is eating the window?”** → heatmap + legend

## Where the limit comes from

The **limit** on the right (or summary line) is resolved per model, roughly:

1. `providers.<id>.model_profiles.<model>.context_window` (most specific)
2. `defaults.context_window` (global default)
3. Built-in rules by model family; unrecognized models hit a built-in fallback

All of that is configurable in `models.toml`. For local models with non-standard windows, set `context_window` under the matching `model_profiles` entry; otherwise `/context` may render against a too-large default. Full configuration notes live in [Getting Started](/guide/start/getting-started).
