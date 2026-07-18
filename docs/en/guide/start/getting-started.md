---
description: Install the Hunea alpha via npm, start the TUI agent, pick a model, and complete your first conversation
---

# Getting Started

:::danger Note
Hunea is currently in alpha. Later updates do **not** promise data migrations. Most releases will be intentionally breaking so the early project can stay clean and accurate instead of carrying historical baggage. Do **not** store important chat data here (you can always export manually — data lives under the standard `~/.config/hunea/` directory) unless you accept the risk of loss or incompatibility.
:::

Install with npm. Important: you currently need:

```bash
npm i -g hunea@alpha
```

to get the alpha build. Do **not** use:

```bash
npm i -g hunea
```

That installs an older package instead.

> `-g` means a global install so you can run Hunea from any path (assuming permissions and `PATH` are correct — if `npm` works, this usually works too). If you are not sure what npm is, start with [Slow Start](/guide/start/slow/preface).

Hunea is still under active development with no stable release yet. Most energy has gone into making the TUI stable, fast, polished, and easy to use. Features only landed more recently, after that usability and performance foundation felt solid enough.

On Windows, prefer the built-in Terminal app (a bash environment helps; Windows has not been specifically optimized yet, so PowerShell / cmd compatibility is unclear). On macOS, prefer modern terminal emulators such as kitty or Ghostty over the stock Terminal.app (the `cx` theme still has some styling issues there). Linux users can use whatever they like; modern emulators still tend to look and feel best.

## Launch

After install, create a sensible working directory and start with `hunea` in a terminal. On first launch, if neither `fd` nor `rg` is on `PATH` and neither is present under Hunea's data directory (`~/.config/hunea/`), you will be asked whether to download them:

![rg-install-ask](/assets/start/rg-install-ask.png)

![fd-install-ask](/assets/start/fd-install-ask.png)

Prefer downloading and using `fd` and `rg` over the built-in fallbacks.

> Skip only if you are offline and cannot place `fd` / `rg` binaries yourself under `~/.config/hunea/bin/`.

Why not other tools? Still evaluating — alternatives may come later.

If nothing goes wrong, once the tools are ready Hunea starts into the TUI:

![start-tui](/assets/start/start-tui.png)

## Configure providers and models

Create a `models.toml` either under `~/.config/hunea/` or under `.hunea/` in the current workspace.

The first is global; the second is workspace-scoped and wins when both exist. Unless you have a special reason, prefer the global file so model choice and provider config still work after switching workspaces.

`models.toml` is documented below (not every line is guaranteed perfect — prefer the later examples):

```toml height="600"
# Tune OpenAI-compatible services or native providers. `base_url`
# for OpenAI-compatible APIs should include the `/v1` prefix.
#
# If `models` is set, it becomes that provider's model whitelist. If
# `models` is omitted, OpenAI-compatible providers sync from
# `{base_url}/models`; native providers use their own model list APIs when available.
#
# Native providers may also set `base_url` to a third-party native-compatible
# endpoint. In that case you must set `models = [...]` explicitly; custom
# native endpoints do not support automatic model sync yet.

# Leave empty so Hunea starts with no model selected. After you pick a model
# from /models, Hunea writes the last selection back here as `provider/model`.
default = ""

# Context window (tokens)
#
# hunea resolves each model's context limit for the /context panel budget bar
# in this order:
#   1. providers.<id>.model_profiles.<model>.context_window (most specific; see local example)
#   2. defaults.context_window (global default)
#   3. built-in: matched by model family, e.g. gpt-4o / gpt-4o-mini → 128000,
#      claude-sonnet-4 / claude-opus-4 → 200000; unrecognized models fall back to 256000.
# If none of the above apply, built-in is used. Both items below are optional.
#
# Global default; models without an explicit model_profiles override hit this.
# [defaults]
# context_window = 128000

[providers.local]
enabled = true
kind = "openai_compatible"
display_name = "Local"
base_url = "http://127.0.0.1:1234/v1"
# Local model servers usually need no auth.
# Use `api_key` to put the token in this file, or `api_key_env` to read from an
# environment variable. If both exist, `api_key` wins.
# api_key = "local-secret"
# api_key_env = "LOCAL_OPENAI_API_KEY"
models = ["qwen3", "deepseek-r1-distill"]

# Per-model context override; wins over [defaults] and built-in.
# Useful for local models with non-standard windows (e.g. a 32k quantized qwen3)
# so /context does not render a budget bar against the wrong default.
# [providers.local.model_profiles.qwen3]
# context_window = 32768
```

A ready-to-edit example (create the file, then paste and adjust):

```toml
// Rename `pure` to whatever you like — just avoid collisions.
[providers.pure]
// Whether this provider is enabled; you can configure without enabling.
enabled = true
// Currently, the only kinds that actually work for chat are:
// openai_compatible / openai_responses / openai
// (other names may still be written in config, but return unsupported at request time)
kind = "openai_responses"
// Display name / alias shown in the UI.
display_name = "Pure"
// Provider secret.
api_key = "sk-xxx"
// base_url including the `/v1` suffix.
base_url = "https://xxx/v1"
// Optional: if omitted you can sync from the /models UI.
// When set, you can pick and use models without a network sync.
models = ["xxx"]
```

For complete `models.toml` field documentation, context window configuration, see [models.toml](/guide/start/configuration/models); for `config.toml` / `phrases.toml`, see the [Configuration overview](/guide/start/configuration/preface).

After configuring, restart Hunea and run `/models` to open the model picker:

![select-model](/assets/start/select-model.png)

Highlight a model and press Enter to start chatting.

## Recommended Configuration

For `config.toml`, you generally don't need much configuration — the defaults work for most use cases. For complete field documentation, see [config.toml](/guide/start/configuration/config).

My personal configuration:

```toml
[tui]
status_line = ["current-dir", "current-model", "throughput", "latency"]
show_esc_interrupt_hint = false
show_reasoning_content = true
reasoning_content_display = "expanded-simplified"
```

I stick with the built-in phrases for `phrases.toml` myself; complete examples and documentation are in [phrases.toml](/guide/start/configuration/phrases).

## Next steps

At this point, installation, launch, and basic configuration are enough to start using Hunea. To learn more, read according to your needs:

- [Configuration](/guide/start/configuration/preface): complete documentation for `models.toml` / `config.toml` / `phrases.toml`
- [Slash Menu](/guide/fun/menu/preface): built-in commands and session-related interactions
- [Tools & Approval](/guide/fun/tools): tools the Agent can call, and operations that require approval
- [Skills & Instruction Files](/guide/fun/skills): how `$skill`, `AGENTS.md` / `CLAUDE.md` participate in prompt assembly
- [Keyboard Shortcuts](/guide/fun/shortcuts): common keys for the main interface, input box, and overlays
- [Design & Trade-offs](/designs/preface): design explanations for altscreen, composer, and more
