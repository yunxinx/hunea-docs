---
description: What the /tree slash command does in Hunea
---

# /tree

`/tree` in Hunea is for rewinding precisely to a session message node. I consider this one of Hunea’s signature features. The inspiration comes from pi — thank you.

Use it when you want to return near a particular user message, assistant reply, or tool result, then continue, rephrase and resend, or switch to another branch. Confirming `/tree` opens a full-screen session tree panel (title similar to `Session Tree`).

With defaults, pressing `Esc` twice on an empty input also enters the same kind of **user-message node-level** rewind; the menu shows `/tree` in that mode.

If you set `esc_rewind_mode` to `"entry"`, the menu shows `/sends-back` instead — a different interaction focused on editing a user turn. The two never appear in the slash menu together.

> Short version: `/tree` is precise node selection on the session tree, keeping content and opening branches; `/sends-back` is about editing/resending a particular user message.

## What the list shows

The panel shows the **current session’s** logical message tree, not global history.

Each row roughly shows:

1. Tree connectors / indent on the left (clearer when there are forks)
2. A type prefix: `user`, `assistant`, `tool`, `reasoning`
3. A node summary (truncated in the list; preview shows full content)

The title shows position, e.g. `Session Tree (3 of 12)`.

While loading: `Loading session tree...`. With nothing to show: `No messages yet`.

> The cursor tries to land on the currently relevant node; if that cannot be resolved, it falls back to the newest row.

Roughly:

![tree](/assets/fun/tree.png)

## How to operate (main list)

Footer shortcuts:

- `↑` / `↓`, or `j` / `k`: move selection
- `←` / `→`, or `h` / `l`: page (helps with many nodes)
- `Space`: full-content **preview** of the selected node
- `Tab`: if the current node has **at least two** sibling branches, open the branch picker (`Switch branch`)
- `A`: open the full branch topology view (`Branch Tree`)
- `Enter`: if the node is rewindable, **rewind precisely to that node**
- `Esc`: close the panel

Left-click a row to move the cursor; the click itself does not rewind.

Footer hints change with the selection:

- `Enter rewind` only when the current row is rewindable
- `Tab branch` only when multiple branches are available

### Message preview

After `Space` on the main list:

- `Esc` or `Space`: back to the session tree
- `←` / `→` / `↑` / `↓`, plus `h` / `j` / `k` / `l`: page longer content

There is no `Enter` rewind in preview — return to the list first.

Roughly:

![tree-preview](/assets/fun/tree-preview.png)

## After you rewind

On a rewindable node + `Enter`, Hunea:

1. Closes the session tree panel
2. Cuts the visible session context **precisely to that node’s restore point**
3. Keeps existing conversation content in the session tree as much as possible (more like opening a branch than deleting everything after)
4. If the node has refill text (common for **user** nodes), writes that body back into the input so you can edit and send

Notes:

- Not every row can `Enter`-rewind. Incomplete tool-call batches, or `reasoning` rows without a restore target, may do nothing on `Enter`.
- This is **in-session node rewind / branch positioning** — not `/resume` switching to another saved session, and not `/resend` only refilling global user history.

## Branch picker (Tab)

When a node already has multiple paths, `Tab` on that row opens a nearby `Switch branch` popup for **sibling branches**.

Roughly you will see:

- Columns: `Msgs` (message count), `Created`, `Updated`
- Branch summaries; the current branch is marked `(current)`
- Footer: `Enter switch` / `Space preview branch` / `Esc back`

Operations:

- `↑` / `↓`, or `j` / `k`: move in the branch list
- `Enter`: switch to the selected branch
- `Space`: preview a **non-current** branch’s tree (current branch usually does not open another preview)
- `Esc`: close the popup and return to the main session tree

Roughly:

![tree-branch-picker](/assets/fun/tree-branch-picker.png)

Visible rows are configurable:

```toml
[tui]
branch_picker_list_rows = 7
```

- Default `7`
- Range roughly `3` to `14`

## Full branch tree (A)

`A` opens the full-screen `Branch Tree` view for the session’s **entire branch topology**, not only siblings at one fork.

Title similar to `Branch Tree (2 of 5)`; loading may show `Loading branch tree...`, empty is `No branches yet`. A summary like `N branches, M messages` often sits above the list.

Operations:

- `↑` / `↓`, or `j` / `k`: move
- `←` / `→`, or `h` / `l`: page
- `Enter`: switch to the selected branch (usually a no-op if it is already current)
- `Space`: preview a **non-current** branch
- `Esc`: back to the main session tree

Roughly:

![tree-branch-tree](/assets/fun/tree-branch-tree.png)

## Branch preview (Space)

From the branch picker or full branch tree, `Space` on a non-current branch opens `Branch Preview`.

It lists **message nodes on that branch path**. The title may include create/update times, e.g.:

`Branch Preview (3 of 8 · Created 2h · Updated 5m)`

The title also uses a distinct color so it is easy to tell apart.

In branch preview:

- `↑` / `↓`, or `j` / `k`: move among nodes
- `←` / `→`, or `h` / `l`: page
- `Space`: open that node’s **message content preview**
- `Esc`: return to the source view (branch list or full branch tree)

> Branch preview itself does **not** `Enter`-rewind or switch; to switch branches, return to the branch list or `Branch Tree` and press `Enter`.

Roughly:

![tree-branch-preview](/assets/fun/tree-branch-preview.png)

## Compared with nearby commands

| What you want | Better command |
| --- | --- |
| Precisely return to a message node / open a branch in the current session | `/tree` |
| Edit/resend a particular user turn (menu shows this when `esc_rewind_mode = "entry"`) | [`/sends-back`](/guide/fun/menu/sends-back.html) |
| Only refill a prior user input without changing the session tree | [`/resend`](/guide/fun/menu/resend.html) |
| Copy user/assistant messages from the current session | [`/copy`](/guide/fun/menu/copy.html) |
| Switch to another saved session | [`/resume`](/guide/fun/menu/resume.html) |

Menu mutual exclusion with `/sends-back` is also noted in the [Slash Menu overview](/guide/fun/menu/).

## Related config

```toml
[tui]
# Default coarse: empty-input double Esc does node-level rewind; menu shows /tree
# entry mode: more "user message item" rewind; menu shows /sends-back
esc_rewind_mode = "coarse"

# Visible rows for the Tab branch popup inside /tree (3..14, default 7)
branch_picker_list_rows = 7
```

## Tips

- Near “that last turn”: open `/tree` — the cursor is usually near the current node — move up to the target and `Enter`.
- Unsure you hit the right node: `Space` preview first, then return and rewind.
- Already forked: `Tab` on the fork node, compare `Msgs / Created / Updated`, then `Enter` to switch.
- Many deep branches: `A` for the full `Branch Tree` is clearer than hunting in the main list.
- Want to inspect another branch without switching yet: `Space` on a non-current item in the branch list or branch tree.
