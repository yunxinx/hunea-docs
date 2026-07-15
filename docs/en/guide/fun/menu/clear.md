---
description: What the /clear slash command does in Hunea
---

# /clear

`/clear` in Hunea is for clearing the current conversation context and starting a new session.

`/new` is an alias. Either name matches the same item: typing `/new` still clears the current conversation; typing `/clear` does the same.

Use it when the session is long, context is full, or you want a clean starting point without quitting the app. With an empty input, type `/`, select `/clear` (or match it via `/new`), then press `Enter`.

> This version has **no second confirmation**: selecting and pressing `Enter` runs immediately. A confirm step may never be added.

## What happens after it runs

After you confirm `/clear`, Hunea roughly does two things:

1. **Reset the TUI surface close to a fresh launch**
2. **Reset the runtime session** so later requests use a new, clean conversation context

UI-side changes commonly include:

- Visible conversation history for the current session is cleared
- The startup banner reappears
- The input draft is cleared
- Overlays / inline panels are closed when possible (model picker, session resume, session tree, copy panel, approval panel, file/skill pickers, …)
- Streaming state, selection, light toasts, and similar UI chrome are cleared too

Runtime-side it is more like “open a new session”:

- An in-flight request is usually interrupted / cancelled
- History sent to the provider is cleared
- The next send prepares as a **new session** (including re-taking the “next new session” prompt-assembly result)

## What it does not clear

`/clear` clears the **current conversation context**, not all of Hunea’s data. It usually does **not** throw away:

- **The currently selected model**  
  It generally keeps working; you do not have to `/models` again (you still can).

- **Already saved historical sessions**  
  Prior chats that were persisted usually still appear in [`/resume`](/guide/fun/menu/resume.html). `/clear` is “switch to a new empty session”, not bulk-delete archives.

- **Global user-message history**  
  The cross-project history used by [`/resend`](/guide/fun/menu/resend.html) is not emptied by `/clear`.

- **`models.toml`, prompt assembly, config files**  
  Provider/model config and the assembly state you maintain in [`/prompt`](/guide/fun/menu/prompt.html) are not rewritten by `/clear`.

## Compared with nearby commands

| What you want | Better command |
| --- | --- |
| Clear the current conversation and start a new session, stay in the app | `/clear` (alias `/new`) |
| Quit the whole app | [`/exit`](/guide/fun/menu/quit.html) (alias `/quit`) |
| Return to a saved older session | [`/resume`](/guide/fun/menu/resume.html) |
| Only refill a prior user input | [`/resend`](/guide/fun/menu/resend.html) |
| Precisely return to a message node / open a branch in the current session | [`/tree`](/guide/fun/menu/tree.html) |
| See roughly how much context is used | [`/context`](/guide/fun/menu/context.html) |

In short:

- **Still want Hunea; the chat is just messy/full** → `/clear`
- **Done for now; close the program** → `/exit`
- **Not discarding this chat — recovering an older session** → `/resume`

## Tips

- Context almost full, model “forgets” or answers off-topic: glance at [`/context`](/guide/fun/menu/context.html), then `/clear` when you need a clean session.
- Just changed prompt assembly in [`/prompt`](/guide/fun/menu/prompt.html): most edits target the next new session; close the panel then `/clear` to verify the new assembly sooner.
- Still need something from the current session: [`/copy`](/guide/fun/menu/copy.html) it out first, then `/clear`.
- Only want to reuse an old prompt without dropping the current conversation: [`/resend`](/guide/fun/menu/resend.html), not `/clear`.
