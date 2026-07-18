---
description: What the /resend slash command does in Hunea
---

# /resend

`/resend` refills a previously sent message back into the input box.

Use it when you want to reuse an old prompt, modify it and send again, or continue writing from an old draft. After typing `/resend` and confirming, it opens a full-screen message history panel titled `Message history` — just pick the message you want to refill.

You can also press `Ctrl + R` directly to open the same panel when no other panel is blocking. It differs slightly from the slash command: when opened via `Ctrl + R`, it **doesn't clear** the existing draft in the input box; when opened via `/resend` from the menu, the input box is already consumed by the command, so it's usually empty when confirmed.

## List overview

The panel lists **global** user message history, not just user messages from the current session. That means: content you sent in other project directories can still be found here as long as it's still kept in this history.

Note:

- Only records **user inputs you've sent**, assistant replies don't appear here
- Pure blank content isn't stored
- Two consecutive sends with exactly the same content won't store the adjacent duplicate again

Each line generally shows:

1. Relative time (e.g. `now`, `5m`, `2h`, `1d`)
2. Summary text of the user message (truncated in the list; full content is used for refill/copy)

The title bar shows your current position, for example `Message history (2 of 10)`, making it easy to see "which item I'm on / how many total".

It may show `Loading message history...` while loading; if there's no refillable history yet, it shows `No sent messages yet`.

> The list is ordered from oldest to newest, and the cursor defaults to the **newest** item. After opening, you can usually just press `Enter` to refill the latest send.

It roughly looks like this:

![resend](/assets/fun/resend.png)

## How to operate

The bottom shows a shortcut hint. Common operations:

- `↑` / `↓`, or `j` / `k`: move selection up/down
- `←` / `→`, or `h` / `l`: page through (useful when there's lots of history)
- `/`: enter search mode, keep typing to filter the list
- `Enter`: **refill the selected message** into the input box
- `c`: copy the full text of the selected message
- `Space`: open a **full content preview** for the selected message
- `Esc`: close the panel; if searching, exit search first, then close on second press

You can also click a line with the left mouse button to move the cursor there; clicking doesn't trigger refill.

Search matches the full message text (case-insensitive). If no matches, it shows `No messages match search`. In search mode:

- `Backspace`: delete characters
- `Ctrl + U`: clear the current search content
- Ordinary letters are treated as search terms, so `c`, `j`/`k` won't trigger copy or movement

In preview mode:

- `Esc` or `Space`: go back to the list
- `←` / `→` / `↑` / `↓`, and `h` / `j` / `k` / `l`: page through longer content
- `c`: still copies the currently previewed item directly

There is **no** `Enter` refill in preview; to refill you need to go back to the list and press `Enter`.

## What happens after refill

After selecting and pressing `Enter`, Hunea will:

1. Close the panel
2. Write the **full content** of the selected message into the input box (cursor generally moves to the end)
3. **Doesn't auto-send**; you can continue editing, then send it yourself

If there was an unsent draft in the input box when you opened the panel (typically the `Ctrl + R` path), Hunea will try to save this draft to message history before replacing it with your selection. This prevents losing half-written drafts when you "abandon writing to reuse an old message".

Note: this is **refilling the input box**, not resending, nor rewinding the session to an old message. The session tree itself isn't changed by `/resend`.

List summaries may be truncated due to terminal width, but refill and `c` copy both get the full text, not the ellipsized version you see on screen. Success/failure toasts for copying match other copy paths (similar to `Selection copied` / `Copy selection failed`).

## How much history is kept

This global history has an item limit, configured by:

```toml
[tui]
message_history_limit = 100
```

- Default `100`
- Configurable range is roughly `100` to `1000`
- When the limit is exceeded, older items are dropped first to keep newer ones

The data lives in Hunea's data directory (usually `~/.config/hunea/`), and it's **cross-project** global history — not a separate list per workspace.

## Usage tips

- You just want to quickly reuse "the last one": after opening, the cursor is already on the newest item — just press `Enter`.
- When history is long, searching for keywords with `/` is faster than scrolling up and down.
- You already have a half-written input and want to compare with an old message: open with `Ctrl + R`, your draft is kept; and before refill, your draft will be saved to history anyway.
- You just want the text, don't want to refill the input: press `c` to copy in the list or preview.

If you actually want to **select and copy user/assistant messages from the current session**, [`/copy`](/guide/fun/menu/copy) is more appropriate than `/resend`.
