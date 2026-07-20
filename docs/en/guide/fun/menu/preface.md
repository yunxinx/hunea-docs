---
description: Hunea slash menu overview — open with / on an empty input and jump to each built-in command’s docs
---

# Overview

Hunea ships with a **slash menu**. With an empty input, type `/` and the menu appears:

![menu](/assets/fun/menu.png)

> Note: the inline `/` slash menu today only opens when the **input is empty**. Typing `/` mid-draft does not open this menu. That may improve later.

Use the up/down arrow keys, or keep typing to filter, then press `Enter` on the selected item.

## Two ways to open the menu

Since `0.12.1-alpha.2`, how the command menu is triggered can be configured via `command_menu_mode` under `[tui]`, with three options:

| `command_menu_mode` | `/` inline menu | `Ctrl+O` floating menu |
| --- | --- | --- |
| `slash` (default) | Yes | No |
| `floating` | No (`/` is plain text) | Yes |
| `both` | Yes | Yes |

- **`/` inline menu**: the default described above, triggered only when the composer is empty and starts with `/`.
- **`Ctrl+O` floating menu**: independent of whether the input is empty; invoke it any time with `Ctrl+O`. The floating menu scrolls up and down, and shows a scrollbar on the right when there are more commands than fit; the visible row count is controlled by `command_menu_rows` (range `7..21`, default `7`). Handy if you want to type `/` as a literal character, or prefer invoking commands with a fixed shortcut.

### How to interact with the `Ctrl+O` floating menu

Beyond the keyboard, the floating menu also supports mouse click and scroll:

- **Keyboard**: `↑` / `↓` moves the selection up and down (the list auto-scrolls to follow when it overflows the visible area), keep typing to filter/match, `Enter` triggers the selected command, and `Esc` closes the menu.
- **Mouse click**: click a command row directly to select and trigger it, without first moving there with the arrow keys.
- **Mouse wheel**: when there are more commands than the `command_menu_rows` limit, scroll the wheel over the popup to page up and down; the scrollbar on the right reflects your current position.

The `Ctrl+O` floating menu looks like this:

![menu-2](/assets/fun/menu-2.png)

> Both menus share the same items, filtering, and selection behavior; only the trigger differs. For configuration and value ranges see [config.toml · command_menu_mode](/guide/start/configuration/config), and for key bindings see [Keyboard Shortcuts](/guide/fun/shortcuts).

Built-in commands (click a **Command** cell to open its page):

| Command | Alias | Purpose |
| --- | --- | --- |
| [`/exit`](/guide/fun/menu/quit) | `/quit` | Quit the app |
| [`/resume`](/guide/fun/menu/resume) | — | Resume a previous session |
| [`/context`](/guide/fun/menu/context) | — | Inspect next-turn context usage (estimate) |
| [`/copy`](/guide/fun/menu/copy) | — | Pick messages and copy them |
| [`/resend`](/guide/fun/menu/resend) | — | Refill a previously sent message into the input |
| [`/tree`](/guide/fun/menu/tree) | — | Rewind precisely to a message node (default mode) |
| [`/sends-back`](/guide/fun/menu/sends-back) | — | Edit a specific prior user message (mutually exclusive with `/tree`; see below) |
| [`/models`](/guide/fun/menu/models) | — | Choose a model for the current session |
| [`/prompt`](/guide/fun/menu/prompt) | — | Inspect prompt assembly for the next new session |
| [`/clear`](/guide/fun/menu/clear) | `/new` | Clear the current conversation context |

## Notes

- **`/tree` vs `/sends-back`**: they never appear in the menu at the same time. By default, double-`Esc` is node-level precise rewind and the menu shows `/tree`. If you set Esc rewind to entry-level mode (`esc_rewind_mode = "entry"` under `[tui]`), the menu shows `/sends-back` instead. In short: `/sends-back` is about editing/resending a particular user turn; `/tree` rewinds more precisely on session nodes while keeping existing content — more like opening a branch. They are split so each matches a clearer job, instead of one overloaded command.
- **`/tool-debug`**: only appears when debug commands are enabled. It previews the tool-approval panel and is not a normal user command, so it stays out of the table. It may be removed or finished later.
- **Aliases**: completion maps `/quit` → `/exit` and `/new` → `/clear`. That exists mainly for people moving over from other CLIs — these two names are common enough that switching tools always tripped me up, so Hunea aliases them. Custom aliases, or even “macros” that chain actions, may come later as more of an extension story.
