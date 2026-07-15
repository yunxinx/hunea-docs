---
description: What the /exit slash command does in Hunea
---

# /exit

`/exit` in Hunea is for quitting the app.

`/quit` is an alias. Either name completes to the same action: typing `/quit` still quits; typing `/exit` does the same. The alias exists mainly for people coming from other CLIs — both names are common.

Use it when you are done with Hunea and want a clean exit. With an empty input, type `/`, select `/exit` (or match it via `/quit`), then press `Enter`.

## Difference from Ctrl + C

You can also quit with `Ctrl + C`, but the behavior differs:

- **`/exit` / `/quit`**: exits **immediately** after you confirm the command — no second confirmation.
- **`Ctrl + C`**: to reduce accidental exits, you must press it **again**. The first press shows `Press again to exit` in the status area; a second `Ctrl + C` within about one second actually exits. After the timeout the hint disappears and you start over.

Also, if the input still has an unsent draft, the first `Ctrl + C` usually **clears the input** instead of starting the exit confirm; only later presses enter the double-press exit flow. For a clean quit, prefer `/quit` (or `/exit`). `Ctrl + C` fits the “clear draft first, then confirm exit” habit.

## After exit

This version does not print usage stats or “how to get back to the last session” hints on exit. When the process ends, the terminal returns to whatever state it had before you launched Hunea.

Sessions are typically stored under the data directory (usually `~/.config/hunea/`). Next time you start Hunea in the same workspace, use [`/resume`](/guide/fun/menu/resume.html) to pick a prior conversation instead of starting from zero.

If you only want to **clear the current conversation and open a new one** without leaving the app, use `/clear` (alias `/new`), not `/exit`.

## Possible later changes

Exit may later print extra information, similar to Claude Code or Codex CLI:

- how to quickly reopen the session you just left
- token usage and other stats
