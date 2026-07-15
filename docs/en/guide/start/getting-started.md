---
description: How to install and use Hunea
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

> `-g` means a global install so you can run Hunea from any path (assuming permissions and `PATH` are correct — if `npm` works, this usually works too). If you are not sure what npm is, start with [Slow Start](/guide/start/slow/index).

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

Note: the snippet above and the example file in the code repository are not always perfectly in sync — the in-repo example has lagged a bit. Prefer what you see in this page.

A ready-to-edit example (create the file, then paste and adjust):

```toml
// Rename `pure` to whatever you like — just avoid collisions.
[providers.pure]
// Whether this provider is enabled; you can configure without enabling.
enabled = true
// Or `openai_compatible`. Only these two kinds are supported today.
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

To set context window limits, add:

```toml
# Global default; models without a model_profiles override hit this.
[defaults]
context_window = 128000
```

Or pin a single model. For example, with provider `pure` and model `model-1`:

```toml
[providers.pure.model_profiles.model-1]
context_window = 32768
```

All of that lives in the same `models.toml`. Combined:

```toml
[defaults]
context_window = 128000

[providers.pure]
enabled = true
kind = "openai_responses"
display_name = "Pure"
api_key = "sk-xxx"
base_url = "https://xxx/v1"
models = ["model-1"]

[providers.pure.model_profiles.model-1]
context_window = 32768
```

If you skip a global default context window, the built-in fallback is 256k.

After configuring, restart Hunea and run `/models` to open the model picker:

![select-model](/assets/start/select-model.png)

Highlight a model and press Enter to start chatting.

## Other config files

There are two more common files: `config.toml` for Hunea itself, and `phrases.toml` for the waiting-status phrases shown while the model replies.

Placement matches `models.toml`: either `~/.config/hunea/` or the workspace `.hunea/` directory.

`config.toml` usually needs little tuning — defaults fit most people. Defaults and knobs look like this:

```toml height="600"
# When both exist, project config overrides user config.
# Restart hunea after changes.

[tui]
# `motion` controls decorative TUI animation.
# - "full": full animation (default).
# - "reduced": disables entrance, toast transition, stream activity tick, and
#   tool marker blink; toast display duration is still kept.
motion = "full"

# Options:
# `user_input_style` controls how in-progress input and sent user messages look.
# - "cx": current framed style. composer and user messages show a surface frame
#   when the window is tall enough.
# - "cc": compact full-row tint. no top/bottom surface frame; keeps a full-row
#   user-message background.
# - "ms": oldest theme. colors only the content range, no full-row fill, no surface frame.
user_input_style = "cx"

# `status_line` controls what appears in the status row under the input.
# Order is left-to-right display order.
# Supported values:
# - "git-branch": branch name for the cwd's git repo
# - "current-dir": short path for cwd; home prefix becomes ~
# - "current-model": selected model as provider/model
# - "throughput": last successful request's LLM output tokens/sec, e.g. 139tps
# - "latency": last successful request's time-to-first-token, e.g. 0.53s
#
# Unconfigured: status line hidden. If configured but nothing can resolve,
# the status line stays hidden.
# status_line = ["git-branch"]

# `status_line_2` uses the same array format for a second status row.
# Duplicates already shown on the first row are skipped on the second.
# Unconfigured or [] hides the second row.
# status_line_2 = ["current-dir"]

# `external_editor` is the argv for the Ctrl+G external editor, e.g.:
# - ["code", "--wait"]
# - ["cursor", "--wait"]
# - ["zed", "--wait"]
# - ["subl", "-w"]
# - ["open", "-W", "-n", "-t"]
# - ["nvim"]
#
# GUI editors (VS Code, Cursor, Zed, Sublime Text, …) need an explicit
# "wait until closed" flag; otherwise hunea returns to the TUI as soon as the
# editor process starts. macOS `open` needs both `-W` and `-n`.
#
# Unconfigured or [] falls back to auto-detect: VISUAL, EDITOR, then common
# platform editor commands.
# external_editor = ["code", "--wait"]

# `show_external_editor_helper` shows the brief "ctrl+g to edit in …" hint
# for multi-line drafts. Default on; turn off once you know the workflow.
show_external_editor_helper = true

# `copy_on_mouse_selection_release` auto-copies when a left-drag selection
# finishes. Default off; on feels closer to "select to copy" terminals.
copy_on_mouse_selection_release = false

# `swap_enter_and_send` swaps newline vs send:
# Default off. When on:
# - Enter inserts a newline
# - Ctrl+J and Shift+Enter send the message
swap_enter_and_send = false

# `ctrl_c_clears_input`: with a non-empty draft, a single Ctrl+C clears it.
# Default on; when off, Ctrl+C goes back to exit-confirm semantics.
ctrl_c_clears_input = true

# `composer_undo_limit`: how many draft snapshots Ctrl+Z can undo.
# Process-local only; not written to session or config. Ctrl+Y kill buffer still
# keeps only the latest kill. Range 1..200, default 50.
composer_undo_limit = 50

# `message_history_limit`: max global message-history entries (cross-project).
# Caps capacity for the /resend UI. Range 100..1000, default 100.
message_history_limit = 100

# `esc_interrupt_presses`: how many Esc presses in a row interrupt the current
# native request while a turn is running. 1, 2, or 3; default 2.
esc_interrupt_presses = 2

# `show_esc_interrupt_hint`: whether the waiting row shows hints like
# `esc 2x to interrupt`. Default on.
show_esc_interrupt_hint = true

# `file_picker_popup_height`: rows for the @ file picker popup.
# Full terminal width; vertically anchored at @, flips when space is tight.
# Range 3..21, default 7.
file_picker_popup_height = 7

# `branch_picker_list_rows`: visible branch rows in the session-tree branch picker.
# Range 3..14, default 7.
branch_picker_list_rows = 7

# `print_transcript_on_exit`: after leaving the TUI, replay the current
# conversation into terminal scrollback. This path has not been maintained for
# a long time — leave the default (off).
print_transcript_on_exit = false

# `show_reasoning_content`: when a thinking model returns reasoning / thinking,
# whether to show it before the assistant body. Default off. Even when off,
# reasoning tokens still count on the waiting row, and a temporary `thinking`
# status appears while reasoning streams.
# Meaning: reasoning is hidden by default, and Ctrl+T will not show it either —
# but /tree still keeps reasoning content visible.
show_reasoning_content = false

# `reasoning_content_display`: default display state of reasoning once it is
# admitted into the transcript when show_reasoning_content = true.
# Unconfigured + show_reasoning_content = true defaults to `expanded`.
# `expanded-simplified` is a compact variant of `expanded`: short content shows
# fully; long content keeps 4 lines head/tail with
# `… +N lines (ctrl + t to view transcript)` in the middle; Ctrl+T opens the
# transcript overlay for the full text.
# Options: `collapsed`, `expanded`, `expanded-simplified`, `snippet`.
reasoning_content_display = "collapsed"

# Double-Esc when nothing is streaming.
# Default `coarse`: edit a previously sent user message.
# Set to `entry` for /tree-style entry rewind; in that mode the slash menu
# replaces /tree with /sends-back so you can still edit prior user messages.
# Pick what fits your workflow.
esc_rewind_mode = "coarse"

[runtime]
# `request_retry_attempts`: max retries after a runtime request fails.
# Used by native chat today. Range 1..10; default 3.
request_retry_attempts = 3

# `request_retry_delays`: seconds to wait before each retry.
# Each value is 1..1800.
# e.g. [1, 3, 5] waits 1s / 3s / 5s before the 1st / 2nd / 3rd retry.
# If the list is shorter than request_retry_attempts, the last value is reused.
request_retry_delays = [1, 2, 3]

# `request_timeout_seconds`: max duration per runtime request attempt.
# Timeouts enter the retry flow above; each retry gets a full timeout again.
# Range 1..7200; default 120.
request_timeout_seconds = 120

# `tool_max_turns`: max agent multi-turn tool-call rounds.
# Unlimited by default; a positive integer stops the request after that many turns.
# tool_max_turns = 32

# `allow_managed_rg` / `allow_managed_fd`: whether hunea may download, verify,
# and install a pinned `rg` / `fd` when neither PATH nor a bundled binary works.
# Missing or false re-prompts next time a download is needed; true continues
# similar downloads without asking again.
# allow_managed_rg = true
# allow_managed_fd = true

[debug]
# `enabled`: show slash commands meant only for local TUI debugging.
# Default off; when on, temporary entries like `/tool-debug` appear.
# This is a half-forgotten feature — may be removed or finished later.
enabled = false
```

My personal config:

```toml
[tui]
status_line = ["current-dir", "current-model", "throughput", "latency"]
show_esc_interrupt_hint = false
show_reasoning_content = true
reasoning_content_display = "expanded-simplified"
```

And a playful `phrases.toml` example:

```toml
# mode = "append" keeps built-in phrases and appends yours.
# mode = "override" uses only the phrases listed below.
mode = "append"

# order = "random" picks a random phrase each request.
# order = "cycle" walks the list in order.
order = "random"

phrases = [
  "Reading context",
  "Thinking through it",
  "Checking the edges",
]
```

I stick with the built-in phrases myself, and I have not thoroughly tested this feature after shipping it. Try it if you want, and open an Issue if something breaks.

## Next steps

That is all there is to configure for Hunea itself right now. To learn the built-in features and how to use them, continue with the [Slash Menu](/guide/fun/menu/index).
