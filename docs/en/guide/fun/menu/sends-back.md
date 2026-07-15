---
description: What the /sends-back slash command does in Hunea
---

# /sends-back

`/sends-back` in Hunea is for returning to a **previously sent user message**, putting it back into the input, and truncating the conversation after that message. With default settings this menu item is **hidden**; on the main conversation view, when nothing is streaming, double-`Esc` is the usual way in.

If you have used Codex CLI, the surface will feel familiar. Hunea differs in a few details — for example, `Esc` in this view does not keep selecting further upward. That change came from being burned by Codex CLI once; I no longer remember the exact failure, but when I implemented this I deliberately separated the behaviors.

Use it when you want to edit a particular turn and resend, or continue writing from an old user input, without the precise node/branch workflow of [`/tree`](/guide/fun/menu/tree.html). It is oriented toward “edit/resend a user message” and reconnecting that user input.

:::danger Note
This flow is rewrite/resend-oriented, so it does **not** keep the later conversation content. If you want to keep existing content while going back near an earlier send to explore more model answers, use `/tree` instead.
:::

> It and [`/tree`](/guide/fun/menu/tree.html) **never appear in the slash menu at the same time**. Only with `esc_rewind_mode = "entry"` does the menu show `/sends-back`; the default `coarse` menu shows `/tree`. The mutual exclusion is also described in the [Slash Menu overview](/guide/fun/menu/).

Roughly:

![sends-back](/assets/fun/sends-back.png)

The selected prior user message is highlighted.

## How to open

### 1. Slash menu (entry mode only)

Configure:

```toml
[tui]
esc_rewind_mode = "entry"
```

Then with an empty input type `/`, select `/sends-back`, and press `Enter`.

### 2. Double `Esc` on empty input (default coarse mode)

With the default `esc_rewind_mode = "coarse"`, the menu has **no** `/sends-back` item, but double `Esc` on an empty input enters the **same** “rewind by user message” interaction:

1. First `Esc`: status shows `Press Esc again to edit previous message`
2. Second `Esc`: opens a full-screen conversation overlay and highlights the latest user message

If the hint times out, you do something else in between, the input has a draft, or a stream is still running, the rewind usually does not continue.

> After switching to `"entry"`: the menu shows `/sends-back`; empty-input double `Esc` opens [`/tree`](/guide/fun/menu/tree.html) instead. Think of the menu item and double `Esc` as complementary rewind modes, not duplicates.

## What you see after opening

A **full-screen conversation overlay** (reuses the transcript overlay) — not `/tree`’s separate session-tree list.

Roughly:

1. The current session’s full visible conversation
2. The **currently selected user message** highlighted
3. A footer similar to:

`Enter edit · ← older · → newer · ↑↓ scroll · Esc close`

The default landing is the **latest user message**. If the session has no user messages yet, opening via the menu may toast `No previous user message` and skip the panel.

## How to operate

Common keys:

- `←`: select an older user message
- `→`: select a newer user message
- `↑` / `↓`, plus `PgUp` / `PgDn`, `Home` / `End`: scroll the conversation (**does not** change which user message is selected)
- `Enter`: confirm this user message and enter the edit/resend flow
- `Esc`: close the overlay with no changes

`Ctrl + T` or `Ctrl + C` can also close the overlay (same as a normal full-screen transcript view).

Notes:

- You only walk **user messages** — not assistant / tool result / reasoning rows
- Left/right change which user message is selected; up/down mainly scroll

## After you confirm

On a selected user message + `Enter`, Hunea roughly:

1. Closes the overlay
2. **Removes that user message and everything after it** from the visible conversation
3. **Refills** that user message’s full body into the input (attachments kept when possible)
4. Truncates the provider-facing history so later requests align with the context **before** that user message
5. **Does not auto-send** — edit, then send yourself

So it is closer to:

> “Go back to that question, void what came after, edit, then send”

than:

> “Open a new branch on the session tree while keeping the old content”

Notes:

- An in-flight request may refuse truncation and surface an error
- Text refilled into the input does **not** enter the composer’s Ctrl+Z undo history — deliberate, so a half draft is not scrambled by undo
- Unlike [`/resend`](/guide/fun/menu/resend.html): `/resend` only refills from **global** user history and does not change the current session tree; `/sends-back` changes visible content and subsequent request context

## Compared with nearby commands

| What you want | Better command |
| --- | --- |
| Edit/resend a particular user turn and drop what followed | `/sends-back` (or double `Esc` under default coarse) |
| Precisely pick a node on the session tree, keep content, open a branch | [`/tree`](/guide/fun/menu/tree.html) |
| Only refill a prior user input without changing the current session | [`/resend`](/guide/fun/menu/resend.html) |
| Copy user/assistant messages out of the current session | [`/copy`](/guide/fun/menu/copy.html) |
| Clear the whole conversation and start fresh | [`/clear`](/guide/fun/menu/clear.html) |

In short:

- **Edit “that last question” and send again** → `/sends-back` / double `Esc`
- **Land near a specific assistant / tool node and branch** → `/tree`
- **Reuse an old prompt without touching the session** → `/resend`

## Related config

```toml
[tui]
# Default coarse:
# - menu shows /tree
# - empty-input double Esc: this page's "edit/resend user message" interaction
#
# entry mode:
# - menu shows /sends-back
# - empty-input double Esc: opens /tree instead
esc_rewind_mode = "coarse"
```

## Tips

- Only the latest turn: open and `Enter` — you are usually already on the newest user message.
- Older questions: `←`; scroll with `↑`/`↓` when content is hard to read.
- Later branch content you still need: prefer [`/tree`](/guide/fun/menu/tree.html); do not truncate with `/sends-back`.
- Only copy or reuse an old prompt without touching the session: [`/copy`](/guide/fun/menu/copy.html) or [`/resend`](/guide/fun/menu/resend.html).
