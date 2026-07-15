---
description: What the /resend slash command does in Hunea
---

# /resend

`/resend` in Hunea is for refilling a previously sent message into the input.

Use it when you want an old prompt back in the composer — edit and send again, reuse a phrasing, or continue from a past draft. Confirming `/resend` opens a full-screen message history panel (title similar to `Message history`) where you pick the entry to refill.

You can also open the same panel with `Ctrl + R` when nothing else is covering the UI. Unlike the slash command path, `Ctrl + R` **does not clear** an existing draft; typing `/resend` through the menu occupies the input, so the field is usually empty after you confirm the command.

## What the list shows

This is **global** user-message history, not “only messages from the current session”. Prompts you sent in other project directories still appear here if they are still retained.

Notes:

- Only **user inputs you sent** are stored — no assistant replies
- Pure whitespace is not stored
- Two consecutive sends with identical body usually do not create a duplicate adjacent entry

Each row roughly shows:

1. Relative time (`now`, `5m`, `2h`, `1d`, …)
2. A summary of that user message (truncated in the list; refill/copy use full content)

The title shows position, e.g. `Message history (2 of 10)`.

While loading: `Loading message history...`. With no history yet: `No sent messages yet`.

> The list is oldest → newest, and the cursor defaults to the **newest** entry. You can usually open and `Enter` to refill the last send immediately.

Roughly:

![resend](/assets/fun/resend.png)

## How to operate

Footer shortcuts:

- `↑` / `↓`, or `j` / `k`: move selection
- `←` / `→`, or `h` / `l`: page (helps with long history)
- `/`: enter search mode and keep typing to filter
- `Enter`: **refill** the selected message into the input
- `c`: copy the selected message’s full text
- `Space`: full-content **preview** of the selection
- `Esc`: close; if searching, first leaves search, second closes

Left-click a row to move the cursor; the click itself does not refill.

Search matches full message text (case-insensitive). No hits → `No messages match search`. In search mode:

- `Backspace`: delete a character
- `Ctrl + U`: clear the query
- ordinary letters are search input — e.g. `c` / `j` / `k` no longer copy or move

In preview:

- `Esc` or `Space`: back to the list
- `←` / `→` / `↑` / `↓`, plus `h` / `j` / `k` / `l`: page longer content
- `c`: still copy the previewed entry

There is **no** `Enter` refill inside preview — return to the list first.

## After you refill

On `Enter`, Hunea:

1. Closes the panel
2. Writes the selected message’s **full body** into the input (cursor usually at the end)
3. **Does not auto-send** — edit further, then send yourself

If the input still had an unsent draft when the panel opened (typical for `Ctrl + R`), that draft is preferably recorded into message history before being replaced by the selected entry. Half-finished work is less likely to vanish when you switch to reusing an old message.

Important: this **refills the input** — it does not re-send, and it does not rewind the session to an old message. The session tree is unchanged by `/resend`.

List summaries may truncate for width; refill and `c` always use full text. Copy success/failure toasts match other copy paths (`Selection copied` / `Copy selection failed`).

## How much history is kept

Global history has a size cap:

```toml
[tui]
message_history_limit = 100
```

- Default `100`
- Configurable roughly from `100` to `1000`
- When over the limit, older entries are dropped first

Data lives under Hunea’s data directory (usually `~/.config/hunea/`) and is **shared across projects**, not one file per workspace.

## Tips

- Reuse “that last one”: the cursor is usually already on the newest entry — just `Enter`.
- Long history: search with `/` instead of pure scrolling.
- Half a draft already typed, but you want to check an old message: open with `Ctrl + R` so the draft stays; confirming a refill also tries to save the draft first.
- Want the text without refilling the input: press `c` in the list or preview.

If you want to **copy user/assistant messages from the current session**, use [`/copy`](/guide/fun/menu/copy.html), not `/resend`.
