---
description: What the /resume slash command does in Hunea
---

# /resume

`/resume` in Hunea is for restoring a previous session.

Use it after you chatted with Hunea, quit, and came back — or when you want to switch the current view to an earlier saved conversation. Confirming `/resume` does not jump into a session immediately; it opens a full-screen session picker (title similar to `Resume Session`) so you can choose which one to restore.

## What the list shows

The panel lists sessions previously saved under the **current workspace / project**, and **excludes the session you are already in**.

Each entry roughly shows three lines:

1. A summary of the session’s **first user message** (falls back to the session title if there is none)
2. A summary of the **latest assistant reply** (same fallback)
3. Metadata: relative time (`now`, `5m`, `2h`, `1d`, …) · working directory · session size when available

While loading you may briefly see `Loading sessions...`. If the project has nothing to resume, you get `No sessions`.

> Session data lives under Hunea’s data directory (usually `~/.config/hunea/`). `/resume` itself filters by the **workspace you opened**, so starting Hunea in another project directory changes the list.

Roughly:

![resume](/assets/fun/resume.png)

The selected row is marked with a color block on the left, and its first line uses normal text color instead of the dim style.

## How to operate

The footer shows shortcuts. Common ones:

- `↑` / `↓`, or `j` / `k`: move selection
- `←` / `→`, or `h` / `l`: page up/down (useful with many sessions)
- `/`: enter search mode and keep typing to filter
- `Enter`: resume the selected session
- `Esc`: close the panel; if you are searching, the first Esc leaves search and a second closes
- `Space`: open a **full message preview** of the selected session before you decide

Search matches title, first user message, latest assistant reply, working directory, and associated model names. No hits → `No sessions match search`. In search mode, `Backspace` deletes characters and `Ctrl + U` clears the query.

In the preview:

- `Enter`: resume this session
- `Esc` or `Space`: return to the list
- `↑` / `↓` / `←` / `→`, plus `h` / `j` / `k` / `l`: page through longer content

## After you resume

On confirm, Hunea **switches** the visible conversation to that historical session and tries to restore the model that was in use so you can continue. Success usually shows something like `Resumed session <session-id>`.

Important: this **switches to another saved session** — it does not merge two sessions. The session you left does not vanish; the next time you open `/resume`, it usually appears again (once it has been stored successfully and is no longer the active session).

If you only want a fresh empty conversation, use `/clear` (alias `/new`), not `/resume`. To quit the app, see [`/exit`](/guide/fun/menu/quit.html).

## Tips

- To pick up “that last round” quickly, open `/resume` and `Enter` the first row (list is newest-first by last update).
- With many long titles, search the first user message with `/` instead of scanning by eye.
- When unsure, `Space` preview first, then `Enter` — cheaper than switching back and forth.
