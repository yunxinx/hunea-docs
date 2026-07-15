---
description: What Hunea’s input box (composer) can do
---

# Composer

In Hunea (and in most similar products), the highest-frequency surface is the input box — internally called the **composer**.

It is not a “fixed bottom bar that scrolls inside itself when the draft gets long”. It lives in the **same scrollable document** as the transcript above. Write more lines and it grows downward with you; even when it fills the viewport, it scrolls with the whole document instead of opening a second scroll region inside the box. That matches the altscreen / main-document layout described in the [Overview](/guide/fun/designs/).

When empty you see a placeholder like `Enter to send Prompt` (this copy will be improved later). Prompt styling follows `user_input_style` (`cx` / `cc` / `ms`), but usage is the same: draft here, insert references, refill history, then send.

## Send and newlines

Default semantics:

| Key | Action |
| --- | --- |
| `Enter` | Send the current draft |
| `Shift + Enter` | Insert a newline |
| `Ctrl + J` | Insert a newline |
| `Alt + Enter` | Insert a newline |
| `Ctrl + M` | Insert a newline (only when the terminal can distinguish it; older terminals often report plain `Enter`) |

> Yes, that many ways to insert a newline — for compatibility. Pick the one you like.

If you prefer “Enter for newline, chord to send”, set `swap_enter_and_send = true`: `Enter` inserts a newline, and `Shift + Enter` / `Ctrl + J` send. `Alt + Enter` / `Ctrl + M` always insert a newline and are unaffected by the swap.

Before send, a few checks run:

1. Draft is empty after trimming whitespace → do not send
2. No model selected yet → toast asking you to configure a model
3. A conversation turn is already running → toast that a request is in progress
4. Selected provider unavailable, or OpenAI-compatible endpoint missing `base_url` → blocked with a toast

Past those checks, the draft becomes a user message in the transcript, the composer clears, and the turn actually starts.

## Text editing

Editing keys mostly follow familiar readline / shell habits:

| Key | Action |
| --- | --- |
| Arrows / `Ctrl + B` `Ctrl + F` | Move left/right |
| `Alt + B` / `Alt + F`, or `Option/Alt + ←` `→` | Move by word |
| `Ctrl + A` / `Home` | Start of line |
| `Ctrl + E` / `End` | End of line |
| `Ctrl + Home` / `Ctrl + End` | Start / end of the whole draft |
| `↑` `↓` / `Ctrl + P` `Ctrl + N` | Move up/down in a multi-line draft (see the history-refill exception below) |
| `PageUp` / `PageDown` | Page inside the draft and try to move the document viewport with you |
| `Backspace` / `Ctrl + H` | Delete backward |
| `Delete` / `Ctrl + D` | Delete forward |
| `Ctrl + W` / `Alt + Backspace` | Delete previous word |
| `Alt + D` / `Alt + Delete` | Delete next word |
| `Ctrl + U` | Delete from cursor to start of line |
| `Ctrl + K` | Delete to end of line (into the kill buffer) |
| `Ctrl + Y` | Yank the latest kill |
| `Ctrl + Z` | Undo draft edits |

Implementation choices you will feel while typing:

- **Undo is grapheme-grouped.** Continuous input of the same emoji / combining character does not force half-character undos; opening an external editor with `Ctrl + G`, sending, etc. become undo boundaries.
- **Undo depth** is `composer_undo_limit` (default 50, range 1..200), process-local only — not written into the session.
- **Kill buffer keeps only the latest** `Ctrl + K` / word-kill result; `Ctrl + Y` is not a full system clipboard.
- If the draft already has a **completed selection**, ordinary typing, paste, newline, and delete keys replace/delete that selection instead of inserting beside it.

Paste uses bracketed paste: large text arrives as one unit, newlines are normalized (`\r\n` and lone `\r` become `\n`), and “selection present → replace selection” still applies.

With a **non-empty draft**, `Ctrl + C` defaults to clearing the draft first (`ctrl_c_clears_input = true`) rather than starting exit confirm; empty input still uses the exit-confirm path. On clear, plain-text drafts are also recorded into message history for later refill; drafts with image attachments are not forced into that text history.

## Mouse

The main UI defaults to app-captured mouse (see [Overview](/guide/fun/designs/)), so on the composer you can:

- **Click**: place the cursor at that character (empty drafts have nothing to hit, so a click will not force a position)
- **Drag**: create a selection over input text; with a selection, typing / paste / delete use replace-selection semantics
- **Middle-click**: copy the current screen selection (same selection path as middle-click on the transcript)

The goal is more natural long-prompt editing in place, with less need for external tools.

## External editor

When a long draft is painful inside the TUI, `Ctrl + G` dumps the current content to a temp file, suspends the TUI, opens an external editor, then writes the result back after you save and quit.

- Editor command comes from `external_editor`; if unset, Hunea tries `VISUAL`, `EDITOR`, then common platform editors
- GUI editors (VS Code / Cursor / Zed / Sublime, …) need a “wait until closed” flag, e.g. `["code", "--wait"]`, otherwise Hunea returns to the TUI as soon as the editor process starts
- When the draft becomes multi-line, the status area may briefly show `ctrl+g to edit in …`; set `show_external_editor_helper = false` to hide it
- External-editor write-back is one undoable whole-draft replace: `Ctrl + Z` returns to the draft from before the editor opened

## Prefix completion and attachments

Several “type a prefix → popup” features live in the composer. They anchor on the token near the cursor rather than a separate command line:

| Prefix | What it does |
| --- | --- |
| `/` (when the whole input looks like a slash command) | Opens the inline [Slash Menu](/guide/fun/menu/); keep typing to filter |
| `@` | File path completion; choosing an image path becomes an image attachment placeholder |
| `$` | Pick a skill and create a structured binding |
| `#` | Pick a custom prompt and create a structured binding |

### `@` files and images

- Ordinary files: insert a **path reference** (e.g. `@src/main.rs`). The TUI does **not** expand file contents into the prompt on send; the model should use a `read`-style tool when it needs the body. That keeps user instructions and file snapshots from mixing (this may evolve, but the current design is intentional).
- Images (png / jpeg / gif / webp today): selection becomes an image placeholder tag in the draft and is sent as a structured attachment. **The selected model must support multimodal / vision**, or the request will error.
- Popup height is `file_picker_popup_height` (default 7 rows); width is full terminal width; vertically anchored at `@`, flipping sides when space is tight.

### `$` / `#`

Selection replaces the current token with a readable name and attaches the matching binding on the message. At send time the runtime can tell “user body” from “attached skill / custom prompt”.

### `/` slash menu

The menu only appears when the whole input is in “slash-command query” shape (empty input, type `/`, then filter). Typing `/` in the middle of a long draft does not suddenly open the full menu — same rule as the [Slash Menu](/guide/fun/menu/) docs.

## History refill

Two ways to bring back something you wrote before, with different emphasis:

1. **Blind refill (Up / Down)**  
   Under suitable boundary conditions (often an empty draft, or the cursor at the very start/end of the draft), `↑` / `↓` walk local + persisted message history and drop old text into the input.  
   In a multi-line draft with the cursor in the middle, up/down prefer moving inside the draft and will not accidentally page history.
2. **Message history panel (`Ctrl + R` / `/resend`)**  
   Opens a full-screen / panel-style history list when you want to search, inspect, then choose.  
   Global history size is capped by `message_history_limit` (default 100).

## Status line and styling

A status line can sit under the input (`status_line` / `status_line_2`) for branch, directory, current model, throughput, time-to-first-token, and so on. Unconfigured — or when nothing can resolve — the status line hides instead of leaving a blank row.

`user_input_style` only changes how in-progress input and sent user messages look; it does not change send, completion, or mouse semantics.

## Config cheatsheet

All under `[tui]`; restart to apply:

| Key | Default | Role |
| --- | --- | --- |
| `swap_enter_and_send` | `false` | Swap Enter-send / chord-newline |
| `ctrl_c_clears_input` | `true` | With a draft, Ctrl+C clears first |
| `composer_undo_limit` | `50` | Ctrl+Z undo snapshot count |
| `external_editor` | auto-detect | Ctrl+G external editor argv |
| `show_external_editor_helper` | `true` | Multi-line ctrl+g hint |
| `file_picker_popup_height` | `7` | Visible rows for `@` / `$` / `#` popups |
| `message_history_limit` | `100` | Global message history cap |
| `user_input_style` | `"cx"` | Input and user-message look |
| `status_line` / `status_line_2` | hidden if unset | Status under the input |

---

Overall, Hunea’s composer aims at “comfortable long input in a terminal” — unbounded growth, clickable/selectable mouse, escape hatch to an external editor, history refill, in-place `@` / `$` / `#` / `/` completion — without secretly stuffing file contents into the prompt.
