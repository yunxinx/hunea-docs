---
description: Built-in slash menu items in Hunea and what they do
---

# Overview

Hunea ships with a **slash menu**. With an empty input, type `/` and the menu appears:

![menu](/assets/fun/menu.png)

> Note: today the slash menu only opens when the **input is empty**. Typing `/` mid-draft does not open this menu. That may improve later.

Use the up/down arrow keys, or keep typing to filter, then press `Enter` on the selected item.

Built-in commands (click a **Command** cell to open its page):

| Command | Alias | Purpose |
| --- | --- | --- |
| [`/exit`](/guide/fun/menu/quit.html) | `/quit` | Quit the app |
| [`/resume`](/guide/fun/menu/resume.html) | — | Resume a previous session |
| [`/context`](/guide/fun/menu/context.html) | — | Inspect next-turn context usage (estimate) |
| [`/copy`](/guide/fun/menu/copy.html) | — | Pick messages and copy them |
| [`/resend`](/guide/fun/menu/resend.html) | — | Refill a previously sent message into the input |
| [`/tree`](/guide/fun/menu/tree.html) | — | Rewind precisely to a message node (default mode) |
| [`/sends-back`](/guide/fun/menu/sends-back.html) | — | Edit a specific prior user message (mutually exclusive with `/tree`; see below) |
| [`/models`](/guide/fun/menu/models.html) | — | Choose a model for the current session |
| [`/prompt`](/guide/fun/menu/prompt.html) | — | Inspect prompt assembly for the next new session |
| [`/clear`](/guide/fun/menu/clear.html) | `/new` | Clear the current conversation context |

## Notes

- **`/tree` vs `/sends-back`**: they never appear in the menu at the same time. By default, double-`Esc` is node-level precise rewind and the menu shows `/tree`. If you set Esc rewind to entry-level mode (`esc_rewind_mode = "entry"` under `[tui]`), the menu shows `/sends-back` instead. In short: `/sends-back` is about editing/resending a particular user turn; `/tree` rewinds more precisely on session nodes while keeping existing content — more like opening a branch. They are split so each matches a clearer job, instead of one overloaded command.
- **`/tool-debug`**: only appears when debug commands are enabled. It previews the tool-approval panel and is not a normal user command, so it stays out of the table. It may be removed or finished later.
- **Aliases**: completion maps `/quit` → `/exit` and `/new` → `/clear`. That exists mainly for people moving over from other CLIs — these two names are common enough that switching tools always tripped me up, so Hunea aliases them. Custom aliases, or even “macros” that chain actions, may come later as more of an extension story.
