---
description: What the /models slash command does in Hunea
---

# /models

`/models` in Hunea is for choosing a model for the current session.

Use it to switch providers, pick another model, or confirm which model is selected right now. Confirming `/models` opens an inline panel near the input (it takes over the input area) for browsing enabled providers and their models.

## What the panel shows

Top to bottom, roughly:

1. **Providers tab row**  
   Like `Providers: [Local]  DeepSeek  OpenAI`. The active provider is marked with brackets.

2. **Current Model**  
   The model already selected for this session, e.g. `[Local] qwen3`; `none` if nothing is selected yet.

3. **Provider Details**  
   Summary for the active provider, commonly:
   - `Model Source`: where the list came from — `configured`, `synced from /v1/models`, `not loaded`, …
   - `Endpoint`: that provider’s `base_url`; `not configured` when missing

4. **Available Models**  
   Models under the active provider. Title is like `Available Models(Type to Search):` until you type, then `Search: <query>`.  
   The cursor row has a `➜` mark; the already-selected model is also visually emphasized. Descriptions, when present, appear under the model id.

A fixed footer of shortcuts:

`Enter select · U refresh · Esc clear/exit · ←→/Tab providers · ↑↓ navigate`

With no enabled providers: Providers shows `[No Providers]`, and the model area may be `No enabled models`. An empty provider list may show `No models available for this provider`; a prior sync failure may show `Sync failed: ...` directly.

Roughly:

![models](/assets/fun/models.png)

## How to operate

Common keys:

- `←` / `→`, or `Tab` / `Shift + Tab`: cycle providers
- `↑` / `↓`: move in the current provider’s model list
- **Type characters**: live search/filter (no need to press `/` first)
- `Backspace` (or `Ctrl + H`): delete one search character
- `Ctrl + U`: clear the search query
- `Enter`: select the current model
- `U` (or `Shift + U`): refresh the **current** provider’s model list
- `Esc`:
  - while searching: clear the search first
  - with an empty search: close the panel

Search matches model id and description (case-insensitive). No hits → `No models match search`. Switching provider usually clears the search.

> Note: navigation here is mainly arrow keys — there is **no** `j` / `k` binding like some full-screen lists. Mouse click is also not implemented; I treated this as a lower-frequency path and kept the interaction simple.

## After you select

On `Enter`, Hunea:

1. Sets that model as the one for the **current session**
2. Closes the `/models` panel
3. Toasts something like `Model selected: [Local] qwen3`
4. Tries to write the choice back to `models.toml` as `default` (`provider/model`) so the next launch lands on the same selection

So it affects both “what this session uses next” and the default model config when possible. Historical messages are not rewritten when you switch; only subsequent requests use the new model.

If saving the default fails, you usually see `Failed to save default model: ...`. The in-UI selection may already have changed even when the config file did not.

## Refreshing the list (U)

`U` refreshes the **current** provider’s available models. Useful when:

- a local model server just loaded/unloaded models
- you omitted the `models` whitelist and want to re-sync from remote `/models`
- a previous sync failed and you want to retry

On success you often see `Models refreshed: <provider display name>` and the list updates. If the previously selected model is gone from the new list, selection may be cleared and you need to pick again.

On failure, the existing list is usually kept, with a toast like `Failed to refresh models for Local: connection refused`; the panel’s `Sync failed: ...` may update too. A second refresh while one is running may toast `Model refresh is already running`.

## Where models come from

`/models` shows Hunea’s loaded, **enabled** provider catalog from `models.toml`, typically:

- Global: `~/.config/hunea/models.toml`
- Or workspace: `.hunea/models.toml` (workspace wins)

At the config level:

- `models = [...]` on a provider → usually shown as that whitelist (source more like `configured`)
- omit `models` → OpenAI-compatible providers often sync from `{base_url}/models` (source more like `synced from /v1/models`)
- list not loaded yet → may show `not loaded`

Full `models.toml` syntax, `default`, and per-model context windows: [Getting Started](/guide/start/getting-started).

## Tips

- Only check the active model: open `/models`, read `Current Model`, `Esc` out.
- Many models: `←` / `→` or `Tab`/`Shift + Tab` to the provider, then type an id keyword — faster than pure scrolling.
- Local server just changed its list: switch to that provider, `U` refresh, then `Enter`.
- Want remaining context after picking: [`/context`](/guide/fun/menu/context.html); the context limit also depends on `models.toml`.
