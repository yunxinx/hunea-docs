---
description: What the /clear slash command does in Hunea
---

# /clear

`/clear` clears the current conversation context and starts a brand-new session. `/new` is an alias — typing `/clear` or `/new` has exactly the same effect.

Use it when your current session is getting long, context is almost full, and you want to continue chatting from a clean slate without quitting the app. Just type `/` in an empty input box, select `/clear`, and press `Enter`.

> The current version **does not ask for confirmation**: selecting and pressing `Enter` executes immediately. It's unlikely we'll add a confirmation step later.

## What happens after execution

After confirming `/clear`, Hunea does roughly two things:

1. **Restores the TUI to a state close to fresh launch**
2. **Resets the runtime session**, so subsequent requests go through a new, clean conversation context

Common UI changes include:

- The visible conversation history of the current session is cleared
- The startup banner reappears
- The draft in the input box is cleared
- Most overlays/panels are closed (model selection, session resume, session tree, copy panel, approval panel, file/skill picker, etc.)
- Any in-flight streaming state, selections, toasts, etc. are also cleared

On the runtime side, it's more like "starting a new session":

- If there was an ongoing request, it will typically be interrupted/canceled
- The historical context sent to providers is cleared
- The next send will be prepared as a **new session** (including reapplying prompt assembly for the next new session)

## What won't be cleared

`/clear` only clears **the current conversation context** — it doesn't wipe all Hunea data. You won't usually lose:

- **Your currently selected model**  
  It will generally persist, so you don't need to re-select with `/models` (though you can still change it if you want).

- **Already saved historical sessions**  
  Previous conversations that were persisted to disk can still be found in the [`/resume`](/guide/fun/menu/resume) list; `/clear` is more like "switch to a new empty session" than bulk-deleting archives.

- **Global user message history**  
  The cross-session history used by [`/resend`](/guide/fun/menu/resend) is not cleared by `/clear`.

- **`models.toml`, prompt assembly, configuration files**  
  Provider/model configuration and the assembly state you maintain in [`/prompt`](/guide/fun/menu/prompt) are not directly changed by `/clear`.

## How it differs from related commands

| What you want to do | More appropriate command |
| --- | --- |
| Clear current conversation, start a new session, stay in the app | `/clear` (alias `/new`) |
| Exit the entire application | [`/exit`](/guide/fun/menu/quit) (alias `/quit`) |
| Go back to a saved old session | [`/resume`](/guide/fun/menu/resume) |
| Only refill a previously sent user input | [`/resend`](/guide/fun/menu/resend) |
| Precisely return to a message node / branch in the current session | [`/tree`](/guide/fun/menu/tree) |
| Check how much context is currently used | [`/context`](/guide/fun/menu/context) |

To put it simply:

- **You still want to use Hunea, the conversation is just too messy/full** → `/clear`
- **You're done chatting and want to close the program** → `/exit`
- **You don't want to discard the current conversation, you just want to recover an old session** → `/resume`

## Usage tips

- When context is almost full and the model starts "forgetting" or answering off-topic: check [`/context`](/guide/fun/menu/context) first, then use `/clear` to start a clean session when needed.
- After modifying prompt assembly in [`/prompt`](/guide/fun/menu/prompt): most changes apply to "the next new session"; close the panel then `/clear` to easily verify the new assembly immediately.
- If there's content in the current session you want to keep: use [`/copy`](/guide/fun/menu/copy) to copy it out first, then `/clear`.
- If you just want to reuse an old prompt and don't want to discard the current conversation: use [`/resend`](/guide/fun/menu/resend), it won't clear the current conversation.
