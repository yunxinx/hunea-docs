---
description: Hunea config.toml: tui / runtime / debug fields, defaults, and examples
---

# config.toml

Controls Hunea's behavior. Generally you don't need much configuration — the defaults work for most use cases. Here are the defaults (what you see below is the default) and configurable examples:

```toml
# When both exist, project-level configuration overrides user-level.
# After modifying configuration, you need to restart Hunea for changes to take effect.
#
# Additional note: if there's a `portable.marker` in `.hunea/` of your workspace, it enters portable mode —
# only reads configuration/sessions from this workspace and doesn't overlay global `~/.config/hunea/`.
# If the global configuration directory isn't available on first launch, precheck may guide you to create this marker.

[tui]
# `motion` controls decorative animations in the TUI.
# - "full": enable all animations, this is the default.
# - "reduced": disable entrance, toast transitions, stream activity tick, and tool marker blinking;
#   the toast display duration is still preserved.
motion = "full"

# `scroll_animation` controls the smooth scrolling feel for the mouse wheel (frame stepping + acceleration for fast consecutive scrolling).
# - "off": disable smooth scrolling, wheel returns to instantaneous jumps of 3 lines per notch, no acceleration.
# - "snappy": close to instantaneous, only softens large scrolls.
# - "fast": fast convergence, minimal animation.
# - "smooth": balanced setting, this is the default.
# - "gentle": longer sliding.
# - "glide": longest sliding.
# Note: when `motion = "reduced"`, scrolling is instantaneous regardless of this setting.
scroll_animation = "smooth"

# Possible values:
# `user_input_style` controls the display style for "in-progress user input" and "sent user messages".
# - "cx": current framed style. Composer and user messages get a surface frame when the window is tall enough.
# - "cc": full-line colored compact style. Disables top/bottom surface frames, but keeps full-line user message background.
# - "ms": original old theme. User messages are colored by content bounds, no full-line padding, and no surface frame.
user_input_style = "cx"

# `status_line` controls what information to display in the status line under the input box.
# The order directly affects left-to-right display order.
# Currently supported values:
# - "git-branch": branch name of the Git repository the current working directory is in
# - "current-dir": short path of the current working directory, home prefix abbreviated to ~
# - "current-model": currently selected model, formatted as provider/model
# - "throughput": LLM tokens per second output for the last successful request, e.g. 139tps
# - "latency": time-to-first-token for the last successful request, e.g. 0.53s
# - "context-used": percentage of context used after the last successful request, e.g. Context 42% used
# - "context-remaining": percentage of context remaining after the last successful request, e.g. Context 58% left
#
# If not configured, no status line is shown; if configured but none of the items can resolve to displayable content,
# the status line remains hidden.
# status_line = ["git-branch"]

# `status_line_2` uses the same array format as `status_line`, for configuring a second status line.
# If the second line configures the same items as the first line, the first line has priority and the second line automatically skips duplicates.
# If not configured or explicitly written as [], no second line is shown.
# status_line_2 = ["current-dir"]

# `external_editor` controls the external editor command opened by Ctrl+G.
# Use native TOML array to express argv, for example:
# - ["code", "--wait"]
# - ["cursor", "--wait"]
# - ["zed", "--wait"]
# - ["subl", "-w"]
# - ["open", "-W", "-n", "-t"]
# - ["nvim"]
#
# For GUI editors like VS Code, Cursor, Zed, Sublime Text,
# you need to explicitly include the "wait until closed" parameter; otherwise Hunea returns to the TUI as soon as the editor process starts.
# For macOS `open`, you also need both `-W` and `-n`.
#
# If not configured or explicitly written as [], it falls back to auto-detection:
# tries VISUAL, EDITOR, then common platform editor commands in order.
# external_editor = ["code", "--wait"]

# `show_external_editor_helper` controls whether to show the brief
# "ctrl+g to edit in …" hint when the draft is multi-line.
# Enabled by default; if you're already familiar with the Ctrl+G workflow, you can turn it off to reduce noise.
show_external_editor_helper = true

# `copy_on_mouse_selection_release` controls whether to automatically copy the selection when you release the mouse
# button after dragging to create a selection.
# Disabled by default; enabling gives the "select to copy" feel familiar from some terminals.
copy_on_mouse_selection_release = false

# `swap_enter_and_send` controls whether to swap the key semantics of "newline" and "send message".
# Disabled by default; when enabled:
# - Enter inserts a newline
# - Ctrl+J and Shift+Enter send the message
swap_enter_and_send = false

# `ctrl_c_clears_input` controls whether a single Ctrl+C directly clears the draft when there's an unsent draft in the input box.
# Enabled by default; when disabled, Ctrl+C reverts to exit confirmation semantics.
ctrl_c_clears_input = true

# `composer_undo_limit` controls how many draft snapshots Ctrl+Z can undo in the input box.
# Only stored in the current TUI process, not written to session or config; the Ctrl+Y kill buffer still only keeps the latest kill.
# Range 1..200, default 50.
composer_undo_limit = 50

# `message_history_limit` controls the maximum number of global message history entries (cross-project).
# Specifically affects the capacity limit of the /resend interface.
# Range 100..1000, default 100.
message_history_limit = 100

# `esc_interrupt_presses` controls how many consecutive presses of Esc are needed
# to interrupt the current native request when a conversation turn is running.
# Allowed values 1, 2, 3; default 2.
esc_interrupt_presses = 2

# `show_esc_interrupt_hint` controls whether to show an interrupt hint like
# `esc 2x to interrupt` on the waiting line. Enabled by default.
show_esc_interrupt_hint = true

# `file_picker_popup_height` controls how many rows the @ file picker popup shows.
# The file picker popup always uses full terminal width; vertically anchored at the @ position, flips when space is tight.
# Range 3..21, default 7 rows.
file_picker_popup_height = 7

# `branch_picker_list_rows` controls how many visible branches the conversation tree branch picker popup shows.
# Range 3..14, default 7 rows.
branch_picker_list_rows = 7

# `print_transcript_on_exit` controls whether to replay and print the current conversation
# to the terminal scrollback after exiting TUI.
# This feature hasn't been maintained in a long time, it's recommended to keep it disabled by default.
print_transcript_on_exit = false

# `show_reasoning_content` controls whether to show the reasoning / thinking content returned by thinking models
# before the assistant message body.
# Disabled by default; when disabled, reasoning is still counted towards waiting line tokens and shows
# a temporary `thinking` state during reasoning streaming.
# That means, by default thinking content isn't shown, and you won't see it in the ctrl+t interface either —
# but /tree still preserves the thinking content.
show_reasoning_content = false

# `reasoning_content_display` controls the default display state of reasoning content in the transcript
# when `show_reasoning_content = true`.
# If not configured, `show_reasoning_content = true` defaults to `expanded`.
# `expanded-simplified` is a compact variant of `expanded` for long content: short content shows fully;
# long content keeps the first and last 4 lines, with `… +N lines (ctrl + t to view transcript)` in the middle.
# When you enter the transcript overlay with Ctrl+T, the full content is shown.
# Allowed values: `collapsed`, `expanded`, `expanded-simplified`, `snippet`.
reasoning_content_display = "collapsed"

# Controls which backtracking mode to use when you double-press Esc with an empty input box and no streaming output,
# and whether the slash menu shows /tree or /sends-back (they don't both appear).
#
# Default coarse:
# - double Esc → edit/resend by user message round (truncate after that message and refill content into input box)
# - menu shows /tree
# When configured to entry:
# - double Esc → open /tree (precise session node backtracking / create branch)
# - menu shows /sends-back (keeps the "edit user message" entry)
esc_rewind_mode = "coarse"

# `keyboard_enhancement` controls whether to enable kitty keyboard protocol for enhanced keybindings.
# - "auto": automatically detects based on environment (e.g. disables in VSCode terminal inside WSL), this is the default.
# - "on": force enable.
# - "off": force disable.
# Most cases can keep auto; if combinations or modifier keys behave strangely, you can explicitly disable and try again.
keyboard_enhancement = "auto"

[runtime]
# `request_retry_attempts` controls how many retries are allowed after a failed runtime request.
# This strategy is used by current native chat.
# Allowed values 1..10; default 3.
request_retry_attempts = 3

# `request_retry_delays` controls how many seconds to wait before each retry.
# Each value ranges from 1..1800.
# For example [1, 3, 5] means wait 1s before the first retry, 3s before the second,
# 5s before the third. If the list is shorter than request_retry_attempts, the last value is reused to fill in.
request_retry_delays = [1, 2, 3]

# `request_timeout_seconds` controls the idle timeout (in seconds) for **a single provider HTTP request**:
# it limits connection waiting and the idle interval between adjacent chunks in a streaming response; the timer resets when data is received.
# It **does not** limit the total duration of an entire turn. As long as data keeps arriving during the response, it won't interrupt just because total time exceeds 120s.
# After timeout, it enters the retry flow above; each retry gets a full fresh idle timeout.
# Allowed values 1..7200; default 120.
request_timeout_seconds = 120

# `tool_max_turns` controls the maximum number of agent multi-turn tool calling rounds.
# Default is unlimited; set to a positive integer to terminate the request after exceeding this number of rounds.
# tool_max_turns = 32

# `allow_managed_rg` / `allow_managed_fd` records whether to allow Hunea to download, verify, and install a pinned version
# of `rg` / `fd` when neither system PATH nor a bundled binary is available.
# Omitted or false means ask again when download is actually needed; true means allow similar downloads directly.
# allow_managed_rg = true
# allow_managed_fd = true

[debug]
# `enabled` controls whether to show slash commands only for local TUI debugging.
# Disabled by default; when enabled, it shows temporary debugging entries like `/tool-debug`.
# This is actually a feature I've neglected, and I'll consider removing or improving it later.
enabled = false
```

The getting started page also has my personal recommended minimal configuration, see [Getting Started](/guide/start/getting-started).

Related pages:

- [Configuration overview](/guide/start/configuration/preface)
- [`models.toml`](/guide/start/configuration/models)
- [`phrases.toml`](/guide/start/configuration/phrases)
