---
description: What the /copy slash command does in Hunea
---

# /copy

`/copy` in Hunea is for picking session messages and copying them to the clipboard.

Use it when you want one user turn, one assistant reply, or several messages together — for docs, issues, or continuing the thread elsewhere. Confirming `/copy` opens a full-screen message picker (title similar to `Copy Messages`). Select targets, then choose a copy format.

## What the list shows

The panel lists **copyable message nodes from the current session**, and **keeps only user and assistant messages**. Tool calls (`tool`) and reasoning (`reasoning`) stay out of this list — they are usually better inspected in-session.

Each row roughly shows:

1. A multi-select mark on the left: after `Tab` multi-select, selected rows show a color block
2. A role prefix: `user` or `assistant`
3. A summary of that message (truncated in the list; the real copy uses full content)

The title shows position, e.g. `Copy Messages (3 of 12)`.

While loading you may see `Loading copy picker...`. If there are no user/assistant messages yet: `No user or assistant messages`.

> The cursor tries to land on the currently relevant message; if that cannot be resolved, it falls back to the newest row. You can often open the panel and copy the latest turn immediately.

Roughly:

![copy](/assets/fun/copy.png)

## How to operate

Footer shortcuts:

- `↑` / `↓`, or `j` / `k`: move the cursor
- `←` / `→`, or `h` / `l`: page (helps with long lists)
- `Tab`: toggle multi-select on the current row
- `A` (or `Shift + A`):
  - no multi-select yet → **select all**
  - already multi-selected → **invert selection**
- `Space`: full-content **preview** of the current row
- `c`: copy in **display** format
- `C` (or `Shift + C`): copy in **raw** format
- `Esc`: close the panel

Left-click a row to move the cursor; the click itself does not copy.

With multi-select, the footer also shows something like `· 2 selected`.

In preview:

- `Esc` or `Space`: back to the list
- `←` / `→` / `↑` / `↓`, plus `h` / `j` / `k` / `l`: page longer content
- `c` / `C`: still copy (see “Which messages get copied”)

## Which messages get copied

On `c` or `C`, the target set is:

1. **If you are in preview**: only the **currently previewed** message (list multi-select is ignored)
2. **If you are in the list with multi-select**: all checked messages, in list order, joined together
3. **If you are in the list with no multi-select**: the **current cursor row**

When joining multiple messages, blank lines separate them (three newlines in the implementation) so the paste reads as sections, not one blob.

Notes:

- After a successful copy the **panel stays open** so you can keep selecting or press `Esc` to leave.
- List summaries may be truncated for terminal width, but the copy always uses full message text, not the ellipsis on screen.

## raw vs display

`/copy` offers two formats, matching the footer’s `C copy raw` and `c copy display`:

| Key | Format | Rough meaning |
| --- | --- | --- |
| `C` | **raw** | Closer to the message’s own source text |
| `c` | **display** | Closer to the human-facing text composed for the UI |

For user messages the two are usually similar. For assistant replies the gap is larger: if the reply has playable tool-call fragments underneath, `display` often folds that presentation text in; `raw` stays closer to the message body.

In short:

- **Prefer the original message body** → `C` (raw)
- **Prefer what you saw in the TUI** → `c` (display)

When unsure, `Space` preview first, then pick a format.

## After you copy

Hunea writes the assembled text to the clipboard (system clipboard first; some environments fall back to a terminal clipboard protocol). Success usually toasts `Selection copied`; failure: `Copy selection failed`.

If there is nothing copyable and you still press a copy key: `No user or assistant messages to copy` — nothing empty is written.

On clipboard failure, **existing multi-select is kept** so you can fix the environment and retry without re-checking rows.

## Tips

- Just the last assistant reply: open `/copy` — the cursor is usually near the newest message — then `c` or `C`.
- A full Q&A round: `Tab` the relevant `user` / `assistant` rows, then copy once.
- Long sessions: page with `h` / `l` instead of line-by-line scrolling.
- Need to verify first: `Space` preview → `c`/`C` there, or return to the list and copy.

If what you actually want is to **put an old user input back into the composer**, use `/resend`, not `/copy`.
