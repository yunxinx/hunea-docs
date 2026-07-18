---
description: What the /models slash command does in Hunea
---

# /models

Type `/models` to select a model for the current session.

Open it when you want to switch providers, change to a different model to continue chatting, or just confirm which model is currently selected. After confirmation, it opens an inline panel near the input area (replacing the original input box) to browse all enabled providers and models.

## Panel overview

The panel generally includes from top to bottom:

1. **Providers tab row**  
   Formatted like `Providers: [Local]  DeepSeek  OpenAI`. The currently selected provider is marked with brackets.

2. **Current Model**  
   The model selected for the current session, for example `[Local] qwen3`; shows `none` if nothing has been selected yet.

3. **Provider Details**  
   Summary information for the current provider, commonly two items:
   - `Model Source`: where the model list comes from, e.g. `configured`, `synced from /v1/models`, `not loaded`
   - `Endpoint`: the `base_url` for this provider; shows `not configured` if not set.

4. **Available Models**  
   List of selectable models under the current provider. Before searching, the title is `Available Models (Type to Search):`; after you start typing, it changes to `Search: <your search term>`.  
   The current cursor row is marked with `➜` on the left; if an item is already the currently selected model, it will be more prominent in display. If there's a description, it appears below the model id.

The bottom has a fixed shortcut hint:

`Enter select · U refresh · Esc clear/exit · ←→/Tab providers · ↑↓ navigate`

If no providers are enabled, Providers shows `[No Providers]` and the model area may show `No enabled models`. If a provider has an empty list, it may show `No models available for this provider`; if sync failed previously, you may directly see `Sync failed: ...`.

It roughly looks like this:

![models](/assets/fun/models.png)

## How to operate

Common operations:

- `←` / `→`, or `Tab` / `Shift + Tab`: switch between providers (cycles)
- `↑` / `↓`: move up/down in the model list of the current provider
- **Type directly**: instantly search and filter the model list (no need to press `/` to enter search mode first)
- `Backspace` (or `Ctrl + H`): delete one search character
- `Ctrl + U`: clear the current search term
- `Enter`: select the current model
- `U` (or `Shift + U`): refresh the model list for the **current** provider
- `Esc`:
  - If searching: clear search first
  - If search is empty: close the panel

Search matches model id and description (case-insensitive). If no matches, it shows `No models match search`. Switching to another provider generally clears the search term.

> Note: Vertical navigation uses arrow keys, `j` / `k` are **not** bound like in some full-screen lists. Mouse clicking isn't implemented either, because I consider this a low-frequency operation so the design doesn't need overly complex interaction.

## What happens after selection

After selecting a model in the list and pressing `Enter`, Hunea will:

1. Set this model as the one used by the **current session**
2. Close the `/models` panel
3. Show a toast like `Model selected: [Local] qwen3`
4. Try to write this selection back to `default` in `models.toml` (in the form `provider/model`), so the same selection persists on next startup

Therefore it affects both "what model to use for future rounds" and updates the default model configuration when possible. Historical messages themselves aren't rewritten when you change models; only subsequent requests use the newly selected model.

If writing back the default model fails, you'll generally see an error like `Failed to save default model: ...`; the current selection in the UI may have already changed, but the configuration file may not have updated successfully.

## Relationship to actual request capabilities

Multiple `kind` types can be configured in `models.toml` (configuration parsing recognizes these names), but **currently only these can actually initiate chat / streaming replies**:

- `openai_compatible` (must configure `base_url`, usually includes `/v1`)
- `openai_responses` (Responses API; also requires `base_url`)
- `openai` (uses official OpenAI base URL by default, you can configure `base_url` yourself)

Other kinds may still appear in the panel and configuration validation, but will return "unsupported" at the request stage when selected. Automatic model list syncing from `/models` currently covers mostly OpenAI-compatible providers. When configuring providers, it's recommended to prioritize the three types above to avoid "visible in list but can't send request" situations.

For more complete field documentation, see [Configuration](/guide/start/configuration).

## Refreshing the model list (U)

Press `U` to request a refresh of the available models for the **current provider**. Useful when:

- Your local model service just loaded/unloaded new models
- You omitted the `models` allowlist and want to sync again from remote `/models`
- Previous sync failed and you want to retry

On successful refresh, you'll typically see `Models refreshed: <provider display name>` and the list updates to the new results. If the currently selected model is no longer in the new list after refresh, the selection may be cleared and you'll need to pick again.

If refresh fails, the existing list is generally preserved as much as possible, and you'll see an error like `Failed to refresh models for Local: connection refused`; the `Sync failed: ...` message in the panel may also update. If a refresh task is already running, triggering it again may show `Model refresh is already running`.

## Where do models come from

`/models` shows Hunea's loaded and **enabled** provider directory, with configuration from `models.toml`. Common locations:

- Global: `~/.config/hunea/models.toml`
- Or current workspace: `.hunea/models.toml` (workspace takes precedence)

At the configuration level, you can think of it like this:

- If you write `models = [...]` in the provider: it generally follows this allowlist (source is more like `configured`)
- If you omit `models`: OpenAI-compatible / OpenAI providers will often try to sync from `{base_url}/models` (source is more like `synced from /v1/models`)
- Before the list is fetched: it may show `not loaded`

Note that seeing a model in the panel doesn't guarantee requests for that model will succeed. Currently, only `openai_compatible` / `openai_responses` / `openai` kinds work for chat.

For more complete `models.toml` writing, `default`, and context window configuration, see [Configuration](/guide/start/configuration).

## Usage tips

- You just want to confirm "which model are we using now": open `/models` and check the `Current Model` line, then `Esc` to exit.
- When there are many models: first `←` / `→` or `Tab`/`Shift + Tab` to the right provider, then type id keywords directly to filter — faster than scrolling up and down.
- Local service just changed model list: switch to that provider, press `U` to refresh, then `Enter` to select.
- You also want to check how much context remains: after selecting a model, you can use [`/context`](/guide/fun/menu/context.html); the context upper limit also depends on configuration in `models.toml`.
