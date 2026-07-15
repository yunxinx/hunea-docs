---
description: What the /prompt slash command does in Hunea
---

# /prompt

`/prompt` in Hunea is for inspecting, previewing, and adjusting **Prompt Assembly** for the **next new session**.

This is an early form of a core Hunea capability that will keep being refined. It is already usable in a simple form today.

Use it when you want to see which sources make up the system prompt, temporarily toggle an instructions / skill / tool guide, add a custom prompt, or preview the final system prompt before changing anything. Confirming `/prompt` opens a full-screen panel (title similar to `Prompt Assembly`).

> The menu description is *Inspect prompt assembly for the next new session*. Most edits **do not rewrite a session that already has transcript history**; they target the next new session. If the current session is still empty, closing and persisting may apply to that empty session directly (see “What happens when you close”).

## What the panel shows

`/prompt` is a two-column manager, not a single list:

1. **Title row**: `Prompt Assembly` on the left; four candidate tabs on the right
2. **Left column `Active`**: sources already in the “next new session” assembly result
3. **Right column (candidates / inventory)**: not fully assembled yet, or toggleable candidates
4. **Bottom pager line**: position on the focused side, e.g. `Active (2 of 8)`
5. **Bottom action hints**: change with the selection; often `? more` on the far right

Roughly:

![prompt](/assets/fun/prompt.png)

### Left: `Active`

Header columns roughly:

`Sel · Ord · Source · Type · Scope`

| Column | Meaning |
| --- | --- |
| `Sel` | Enabled (checked) |
| `Ord` | Order in the assembly result |
| `Source` | Title / name; may show `missing`, `shadowed`, `+N shadowed`, etc. |
| `Type` | Source type (table below) |
| `Scope` | Usually `project` / `global`; built-ins stand alone |

`Type` roughly maps to:

| Display | Roughly |
| --- | --- |
| `system` | Core system prompt (built-in default; overridable by global/project override) |
| `instructions` | Instruction files such as global `AGENTS.md`, project `AGENTS.md` / `CLAUDE.md` |
| `custom` | Custom extra prompts |
| `discovery` | Skill-discovery fragment (generated) |
| `skill` | Long-lived injected skill |
| `tools` | Tool-use guidelines (generated) |
| `dynamic` | Dynamic environment info (base / change) |

The focused row has a color mark on the left. If an entry still “covers” other same-name / same-key sources, you may see `+N shadowed`; `Ctrl + E` expands/collapses those shadowed details.

### Right: four tabs

Top-right tabs (default starts on `Skill`):

| Tab | Contents |
| --- | --- |
| `Skill` | Discovered long-lived skill candidates |
| `Custom Prompts` | Custom prompt candidates; can create new ones |
| `Tools` | Tool-related candidates / guideline fragments |
| `Dynamic` | Dynamic environment sources; toggle `Base` / `Change` separately |

Headers differ slightly by tab, e.g.:

- `Skill` / `Tools`: `Sel` · `Ord` · `Name` · `Scope`
- `Custom Prompts`: `Sel` · `Name` · `Scope`
- `Dynamic`: `Base` · `Change` · `Source` · `Scope`

## How to operate

### Focus and navigation

- `←` / `→`, or `h` / `l`: switch focus between columns  
  (on the `Dynamic` tab, left/right may also move between the `Base` / `Change` columns)
- `↑` / `↓`, or `j` / `k`: move selection
- `PageUp` / `PageDown`: page
- `Home` / `End`: jump to list start/end
- `Tab` / `Shift + Tab`: when focus is on the right, cycle the top-right tabs
- `?`: open/close the more-shortcuts overlay (`More`)
- `Esc`: close `/prompt` (triggers submit/persist — see below)

Mouse also works:

- Click a top-right tab to switch
- Click a list row to focus and select it

### Preview

- `Space`: preview the **selected item** body (single source / skill / tool / dynamic, …)
- `p`: preview the **fully assembled** system prompt (title similar to `Assembled prompt`)

In preview:

- `Esc` / `Space` / `p`: back to the main panel
- `↑` / `↓` / `←` / `→`, plus `h` / `j` / `k` / `l`: page longer content

Roughly:

![prompt-preview](/assets/fun/prompt-preview.png)

![prompt-assembled](/assets/fun/prompt-assembled.png)

### Edit, toggle, reorder

Footer actions change with the selection. Common ones:

| Key | Action |
| --- | --- |
| `e` | Open the current editable item in an external editor (footer may show `e/ctrl+g edit`) |
| `a` | Create a custom prompt (pick `Project` / `Global` scope first) |
| `d` | Delete the current deletable item |
| `x` | Toggle enable/disable (footer often `x disable`) |
| `J` / `K` (Shift) | Reorder on the `Active` side (up/down) |
| `r` | Depends on selection: restore core system override, or reset discovered skill order |
| `Ctrl + E` | Expand/collapse shadowed details |

Not every row supports every action. For example:

- Core `system`, instruction files, generated `discovery` / `tools` / some `dynamic` sources usually **cannot** be `d`-deleted like a custom prompt
- `e` only appears for editable sources
- `J/K reorder` only on the `Active` side when reordering is allowed

### Creating a custom prompt

From the right-side `Custom Prompts` context, press `a`:

1. Scope picker: `[Project] Global` or `Project [Global]`
2. `←` / `→` (or `h` / `l`) to switch scope
3. `Enter` confirm, `Esc` cancel
4. On confirm, an external editor opens for the body; saving writes back to that scope

Roughly:

![prompt-create](/assets/fun/prompt-create.png)

## What these sources are

Treat the left column as the “system assembly checklist for the next new session”. Common sources:

1. **Core system prompt**  
   Hunea’s built-in core behavior text. Overridable via global/project override; with it selected, `r` can try restoring the default core prompt after a messy edit.

2. **Instructions files**  
   - Global: `AGENTS.md` under the data directory (usually `~/.config/hunea/AGENTS.md`)  
   - Project: `AGENTS.md` or `CLAUDE.md` found walking up from the workspace/repo (same directory usually prefers `AGENTS.md`)

3. **Custom prompts**  
   Extra prompt fragments you maintain. Project-level files usually live under `.hunea/prompts/custom/`, with assembly state in `.hunea/prompt-assembly.toml`.

4. **Skill discovery / long-lived skills**  
   Discovery fragments and skills that can stay injected long-term. Not the same as a one-turn `@` / `$skill` attach in the session.

5. **Tool guidelines**  
   Tool-use instructions generated from currently available tools.

6. **Dynamic environment**  
   Environment info:  
   - `Base`: more first-turn baseline  
   - `Change`: more later-turn deltas  
   Toggle each in the right-side `Dynamic` tab.

## What “shadowed” means

Same-name or same-conflict-key sources may exist at project / global / builtin layers at once. Assembly usually lets only the **higher-priority** one take effect; the rest are marked `shadowed`.

Priority roughly:

`project` > `global` > `builtin`

So an `Active` row may show `+1 shadowed`, meaning another same-key source is covered underneath. Expand with `Ctrl + E` to see which layer actually wins.

## What happens when you close

On `Esc`, Hunea tries to submit/persist the panel’s working copy rather than “look once and throw away”.

Toasts/messages depend on the effective scope:

| Situation | Typical feedback |
| --- | --- |
| Mainly affects the next new session | Toast: `Prompt updated. Applies to next new session.` |
| Current session is still empty and can update immediately | System message: `Prompt updated for current empty session.` |

Notes:

- A **current session that already has content** generally will not have its whole transcript rewritten because you changed assembly in `/prompt`.
- To bring most edits fully into the next conversation, close `/prompt` then `/clear` (alias `/new`) for a new session.
- If opening `/prompt` never successfully began an edit session (e.g. begin failed), the panel may close without going through submit.

## Where config lands

Project-level locations commonly:

```text
.hunea/prompt-assembly.toml
.hunea/prompts/
.hunea/prompts/custom/
```

Global state ties to Hunea’s data directory (usually `~/.config/hunea/`) — e.g. global `AGENTS.md` and global prompt-assembly state managed via the session store / data directory, not only workspace files.

You do not need to hand-write every file before using `/prompt`: many custom items can be created/edited with `a` / `e` in the panel and written back by Hunea.

## Compared with nearby commands

| What you want | Better command |
| --- | --- |
| Inspect/adjust the system assembly checklist for the next new session | `/prompt` |
| See how much context is used / left | [`/context`](/guide/fun/menu/context.html) |
| Switch the current session’s model | [`/models`](/guide/fun/menu/models.html) |
| Clear the current conversation and start a new one | `/clear` (alias `/new`) |
| Copy user/assistant messages from the current session | [`/copy`](/guide/fun/menu/copy.html) |

`/context` answers “how much budget is left”; `/prompt` answers “which sources build the system side of that budget, and can I change them”.

## Tips

- Only check what the next turn will carry: open and press `p` for `Assembled prompt` — often faster than opening items one by one.
- Project has `AGENTS.md` / `CLAUDE.md` but it feels ignored: find `instructions` on the left — is it `missing`, `disabled`, or `shadowed` by a higher-priority source?
- Add a long-lived note for this repo: right tab `Custom Prompts`, `a` → `Project`, then confirm it appears in left `Active`.
- After reordering or toggling, `p` preview, then `Esc` to persist; use `/clear` when you want a clean context to verify.
- When shortcuts are fuzzy, `?` for `More` beats guessing footer abbreviations.
