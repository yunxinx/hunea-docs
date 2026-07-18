---
description: What the /tree slash command does in Hunea
---

# /tree

`/tree` precisely backtracks to a message node in the current session. This is a signature feature of Hunea, inspired by pi — thanks for that.

Use it when you want to go back to a user message, assistant reply, or tool result node, continue chatting from there, modify and resend, or switch to another branch. After typing `/tree` and confirming, it opens a full-screen session tree panel titled `Session Tree`.

With the default `esc_rewind_mode = "coarse"`, `/tree` appears in the slash menu. Note: double-pressing `Esc` in an empty input box **does not** open `/tree` — instead it enters another "edit/resend by user message round" interaction (truncates after that message and refills the content into the input box, see [`/sends-back`](/guide/fun/menu/sends-back)).

Only when `esc_rewind_mode` is configured to `"entry"` does double-pressing `Esc` open `/tree`; at the same time, the menu changes to show `/sends-back` — the two don't appear in the slash menu at the same time. That means the menu item and double-`Esc` correspond to the two backtracking modes separately; changing configuration just swaps their entry points.

> Simple distinction: `/tree` is for precise node selection on the session tree, preserves existing content and creates branches; `/sends-back` (and double-`Esc` in default coarse mode) is more focused on editing/resending by user message round.

## List overview

The panel shows the logical message tree of **the current session**, not global history.

Each line generally shows:

1. Left-side **tree connections / indentation diagram** (more obvious when there are branches)
2. Message type prefix: `user`, `assistant`, `tool`, `reasoning`
3. Summary text of the node (truncated in the list; see full content in preview)

The title bar shows your current position, for example `Session Tree (3 of 12)`, making it easy to see "which item I'm on / how many total".

It may show `Loading session tree...` while loading; if the current session has no displayable messages yet, it shows `No messages yet`.

> By default the cursor tries to land on the currently relevant node; if "current line" isn't available, it falls back to the newest item in the list.

It roughly looks like this:

![tree](/assets/fun/tree.png)

## How to operate (main list)

The bottom shows a shortcut hint. Common operations:

- `↑` / `↓`, or `j` / `k`: move selection up/down
- `←` / `→`, or `h` / `l`: page through (useful when there are many nodes)
- `Space`: open a **full content preview** for the currently selected node
- `Tab`: if the current node has **at least two** sibling branches, open the branch selection popup (`Switch branch`)
- `A`: open the complete branch topology view (`Branch Tree`)
- `Enter`: if the current node is backtrackable, **precisely backtrack to this node**
- `Esc`: close the panel

You can also click a line with the left mouse button to move the cursor there; clicking doesn't trigger backtracking.

The footer hint changes with the current selection:

- `Enter rewind` only appears when the current line **is backtrackable**
- `Tab branch` only appears when the current line **has multiple branches to choose from**

### Message preview

After pressing `Space` in the main list:

- `Esc` or `Space`: go back to the session tree list
- `←` / `→` / `↑` / `↓`, and `h` / `j` / `k` / `l`: page through longer content

There is no `Enter` backtracking in preview; to backtrack you need to go back to the list and press `Enter`.

It roughly looks like this:

![tree-preview](/assets/fun/tree-preview.png)

## What happens after backtracking

After selecting a backtrackable node in the main list and pressing `Enter`, Hunea will:

1. Close the session tree panel
2. Precisely cut the visible context of the current session **to the restore point corresponding to this node**
3. Existing conversation content is preserved in the session tree as much as possible (more like opening a branch than deleting everything after)
4. If the node has refillable text (common for **user message** nodes), that content is written back to the input box so you can edit and resend it.

Note:

- Not all rows allow `Enter` backtracking. For example, some incomplete tool call batches, or `reasoning` lines that don't have a restore target may have no effect when you press `Enter`.
- This is **intra-session node backtracking / branch positioning**, not switching to another saved session like `/resume`, nor just refilling global user history like `/resend`.

## Branch selection popup (Tab)

When a node already has multiple paths under it, pressing `Tab` on that row pops up a `Switch branch` popup near the list, for switching between **sibling branches**.

In the popup you'll generally see:

- Header columns: `Msgs` (message count), `Created`, `Updated`
- Summary of each branch; the current branch has a `(current)` mark
- Bottom hint: `Enter switch` / `Space preview branch` / `Esc back`

Operations:

- `↑` / `↓`, or `j` / `k`: move in the branch list
- `Enter`: switch to the selected branch
- `Space`: preview the session tree content of a **non-current** branch (usually won't open preview on the current branch)
- `Esc`: close the popup, go back to the main session tree

It roughly looks like this:

![tree-branch-picker](/assets/fun/tree-branch-picker.png)

You can adjust the visible row count for the popup with configuration:

```toml
[tui]
branch_picker_list_rows = 7
```

- Default `7`
- Configurable range is roughly `3` to `14`

## Complete branch tree (A)

Pressing `A` enters the `Branch Tree` full-screen view, which shows the **entire branch topology** in the current session, not just sibling items near a fork.

The title is like `Branch Tree (2 of 5)`; it may show `Loading branch tree...` while loading, or `No branches yet` if there are no branches. Above the list there's usually a summary like `N branches, M messages`.

Operations:

- `↑` / `↓`, or `j` / `k`: move up/down
- `←` / `→`, or `h` / `l`: page through
- `Enter`: switch to the selected branch (no operation if it's already the current branch)
- `Space`: preview a **non-current** branch
- `Esc`: go back to the main session tree list

It roughly looks like this:

![tree-branch-tree](/assets/fun/tree-branch-tree.png)

## Branch preview (Space)

From the branch selection popup or complete branch tree, pressing `Space` on a non-current branch opens `Branch Preview`.

This lists the **message nodes on that branch path**, and the title may also include creation/update time, for example:

`Branch Preview (3 of 8 · Created 2h · Updated 5m)`

And the title itself has a different color for easier distinction.

In branch preview:

- `↑` / `↓`, or `j` / `k`: move selected node
- `←` / `→`, or `h` / `l`: page through
- `Space`: open a **message content preview** for this node
- `Esc`: go back to the source interface (branch list or complete branch tree)

> Branch preview itself **doesn't** support direct `Enter` backtracking/switching; to switch branches, go back to the branch list or `Branch Tree` and press `Enter`.

It roughly looks like this:

![tree-branch-preview](/assets/fun/tree-branch-preview.png)

## How it differs from related commands

| What you want to do | More appropriate command |
| --- | --- |
| Precisely go back to a message node / open a branch in the current session | `/tree` |
| Edit/resend by user message round (double `Esc` in default coarse mode; `/sends-back` in menu when entry mode) | [`/sends-back`](/guide/fun/menu/sends-back) |
| Only refill a previously sent user input, don't change the session tree | [`/resend`](/guide/fun/menu/resend) |
| Select and copy user/assistant messages from current session | [`/copy`](/guide/fun/menu/copy) |
| Switch to another saved session | [`/resume`](/guide/fun/menu/resume) |

The menu mutual exclusion with `/sends-back` is also mentioned in the [slash menu overview](/guide/fun/menu/preface).

## Related configuration

```toml
[tui]
# Default coarse:
# - Menu shows /tree
# - Double-press Esc in empty input: enters "edit/resend by user message" (see /sends-back)
#
# When configured to entry:
# - Menu shows /sends-back
# - Double-press Esc in empty input: opens /tree
esc_rewind_mode = "coarse"

# Visible rows for the branch popup opened by Tab in /tree (3..14, default 7)
branch_picker_list_rows = 7
```

## Usage tips

- You just want to go back to "near the last round": after opening `/tree`, the cursor is already near the current node — just move up to the target row and `Enter`.
- If you're not sure you have the right node: `Space` to preview the content first, then go back to the list and backtrack.
- When there are multiple branches at a fork: press `Tab` on the fork node, compare with `Msgs / Created / Updated`, then `Enter` to switch.
- When there are many branches and deep levels: use `A` to see the full `Branch Tree` — clearer than searching in the main list.
- You just want to confirm what another branch looks like before switching: press `Space` to preview non-current items in the branch list or branch tree.
