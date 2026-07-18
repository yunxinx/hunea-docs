---
description: What the /exit slash command does in Hunea
---

# /exit

`/exit` exits the Hunea application. `/quit` is an alias — typing `/exit` or `/quit` has exactly the same effect. The alias exists mainly for easier transition from other CLI products, since both names are common.

Use it when you're done chatting and want to close the app normally. Type `/` in an empty input box, select `/exit`, and press `Enter` to exit.

## Difference from Ctrl + C

You can also exit with `Ctrl + C`, but there are some differences:

- **`/exit` / `/quit`**: after confirming the command, **exits directly** with no second confirmation.
- **`Ctrl + C`**: to avoid accidental exits, by default you need to **press a second time** to actually exit. The first press shows `Press again to exit` in the status bar; press `Ctrl + C` again within about 1 second to exit; if you timeout, the prompt disappears and you need to start over.

Additionally, if there's an unsent draft in the input box, the first `Ctrl + C` will usually **clear the input** first and won't immediately enter exit confirmation; only subsequent presses enter the double-confirmation flow. Therefore: for a clean exit, `/quit` (or `/exit`) is more recommended; `Ctrl + C` is better for the "clear input first / confirm exit later" habit.

## After exiting

The current version doesn't print an extra statistical summary or "how to return to your previous session" message after exit; when the process ends, your terminal returns to the state it was in before you launched Hunea.

The session itself is generally stored in the data directory (usually `~/.config/hunea/`). Next time you launch Hunea in the same workspace, you can use [`/resume`](/guide/fun/menu/resume) to recover the previous conversation from the list — you don't have to start from scratch.

If you just want to **clear the current conversation and start a new session** but don't want to close the app, use `/clear` (alias `/new`) — it serves a different purpose than `/exit`.

## Possible future changes

In the future, we may output some additional information on exit, similar to Claude Code or Codex CLI:

- Hints on how to quickly return to the session before exit
- Statistics like token usage
