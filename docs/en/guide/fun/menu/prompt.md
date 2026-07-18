---
description: What the /prompt slash command does in Hunea
---

# /prompt

Use `/prompt` to inspect, preview, and adjust the **prompt assembly result for the next new session**.

This is a relatively core feature of Hunea. It's already usable and will continue to be polished.

Open it when you need to confirm which sources the system prompt is assembled from, temporarily toggle instructions/skills/tool guides on/off, add custom prompts, or preview the final complete system prompt before modifying. After typing `/prompt` and confirming, it opens a full-screen panel titled `Prompt Assembly`.

> The menu description is *Inspect prompt assembly for the next new session*. Most changes **do not rewrite the transcript for the current already-started session**; they target the "next new session". If the current session is still empty, closing and persisting may apply directly to the current empty session (see "What happens after closing" below).

## Panel overview

`/prompt` is a two-column manager, not a single list:

1. **Title bar**: left is `Prompt Assembly`, right has four candidate tabs
2. **Left column `Active`**: sources already included in "next new session assembly"
3. **Right column (candidates / inventory)**: candidate collections not fully assembled, or toggleable
4. **Bottom pagination line**: shows position on the currently focused side, e.g. `Active (2 of 8)`
5. **Bottom operation hint**: changes with the currently selected item; `? more` is often on the far right

It roughly looks like this:

![prompt](/assets/fun/prompt.png)

### Left column: `Active`

The header columns are roughly:

`Sel · Ord · Source · Type · Scope`

| Column | Meaning |
| --- | --- |
| `Sel` | Whether enabled (checked state) |
| `Ord` | Order in the assembly result |
| `Source` | Title / name; may have `missing`, `shadowed`, `+N shadowed` tags when needed |
| `Type` | Source type, see table below |
| `Scope` | Scope, commonly `project` / `global`; built-ins have their own |

`Type` roughly corresponds to:

| Display | What it is |
| --- | --- |
| `system` | Core system prompt (built-in default, can be overridden by `global` / `project` `override`) |
| `instructions` | Instruction files, like global `AGENTS.md`, project `AGENTS.md` / `CLAUDE.md` |
| `custom` | Custom extra prompt |
| `discovery` | Skill discovery fragment (generated) |
| `skill` | Long-lived injected skill |
| `tools` | Tool usage guidelines (generated) |
| `dynamic` | Dynamic environment information (base / changes) |

The currently focused row has a color swatch mark on the left. If an item "shadows" other sources with the same name/key, it may show `+N shadowed`; press `Ctrl + E` to expand/collapse these shadowed details.

### Right column: four tabs

Top-right tabs (defaults to `Skill`):

| Tab | Content |
| --- | --- |
| `Skill` | Discovered long-lived skill candidates |
| `Custom Prompts` | Custom prompt candidates; can create new |
| `Tools` | Tool-related candidates / guideline fragments |
| `Dynamic` | Dynamic environment sources; can toggle `Base` / `Change` separately |

Headers differ slightly between tabs:

- `Skill` / `Tools`: `Sel` · `Ord` · `Name` · `Scope`
- `Custom Prompts`: `Sel` · `Name` · `Scope`
- `Dynamic`: `Base` · `Change` · `Source` · `Scope`

## How to operate

### Focus and navigation

- `←` / `→`, or `h` / `l`: switch focus between left and right columns  
  (on the `Dynamic` tab, left/right may also move between `Base` / `Change` columns)
- `↑` / `↓`, or `j` / `k`: move selection up/down
- `PageUp` / `PageDown`: page through
- `Home` / `End`: jump to start/end of current list
- `Tab` / `Shift + Tab`: when focus is on right column, cycle through top-right tabs
- `?`: toggle more shortcut help (the `More` overlay)
- `Esc`: close the `/prompt` panel (triggers the commit/persist flow, see later)

You can also use the mouse:

- Click a top-right tab: switch to that candidate page
- Click a left/right list row: switch focus and select that row

### Preview

- `Space`: preview the content of the **currently selected item** (single source / skill / tool / dynamic, etc.)
- `p`: preview the **fully assembled system prompt** (titled `Assembled prompt`)

In preview mode:

- `Esc` / `Space` / `p`: go back to the main panel
- `↑` / `↓` / `←` / `→`, and `h` / `j` / `k` / `l`: page through longer content

It roughly looks like this:

![prompt-preview](/assets/fun/prompt-preview.png)

![prompt-assembled](/assets/fun/prompt-assembled.png)

### Editing, toggling, reordering

The bottom hint changes with the selection. Common actions:

| Shortcut | Action |
| --- | --- |
| `e` | Open the currently editable item in external editor (footer may also say `e/ctrl+g edit`) |
| `a` | Create a new custom prompt (first select `Project` / `Global` scope) |
| `d` | Delete the currently deletable item |
| `x` | Toggle enabled/disabled (footer often shows `x disable`) |
| `J` / `K` (Shift): | Adjust order on the `Active` side (move down / up) |
| `r` | Depends on selection: restore core system override, or reset discovered skill order |
| `Ctrl + E` | Expand/collapse `shadowed` details |

Not every row supports all actions. For example:

- Core `system`, instruction files, generated `discovery` / `tools` / some `dynamic` sources usually **cannot** be directly deleted with `d` like custom prompts
- Only editable sources show `e`
- Only on the `Active` side, when reordering is allowed, will you see `J/K reorder`

### Creating a new custom prompt

Press `a` when in the `Custom Prompts` context on the right:

1. First pops up scope selection: `[Project] Global` (currently project, global optional) or `Project [Global]` (currently global, project optional)
2. `←` / `→` (or `h` / `l`) switch scope
3. `Enter` to confirm, `Esc` to cancel
4. After confirmation, opens external editor to write content; save and exit, and Hunea writes back to the corresponding scope

It roughly looks like this:

![prompt-create](/assets/fun/prompt-create.png)

## What are these sources?

You can think of the left column as "the system assembly list that the next new session will carry". Common sources include:

1. **Core system prompt**  
   Hunea's built-in core behavior instructions. Can be overridden by `global` / `project` `override`; when selected, you can press `r` to restore the default core prompt, which is useful for one-click recovery after messy modifications.

2. **Instructions files**  
   - Global: `AGENTS.md` in the data directory (usually `~/.config/hunea/AGENTS.md`)  
   - Project: `AGENTS.md` or `CLAUDE.md` found by searching upward from the workspace/repository (when in the same directory, `AGENTS.md` is usually prioritized)

3. **Custom prompts**  
   Your own maintained extra prompt fragments. Project-level usually lives in `.hunea/prompts/custom/`, and assembly state is recorded by `.hunea/prompt-assembly.toml`.

4. **Skill discovery / long-lived skills**  
   Skill discovery fragments, and long-lived injectable skills. This is different from temporary `@` / `$skill` injections that are "only attached for this round" in a session.

5. **Tool guidelines**  
   Tool usage instructions generated based on currently available tools.

6. **Dynamic environment**  
   Environment information:  
   - `Base`: more for first-round baseline  
   - `Change`: more for incremental changes in subsequent rounds  
   You can check these separately in the right `Dynamic` tab.

## What does `shadowed` mean?

Sources with the same name or conflicting keys may exist at `project` / `global` / `builtin` levels simultaneously. During assembly, only the **higher-priority** one actually takes effect, and the others are marked `shadowed`.

Priority roughly is:

`project` > `global` > `builtin`

So you may see an `Active` item with `+1 shadowed`, meaning there's another same-key source covered underneath. Expand with `Ctrl + E` to verify which layer is actually active.

## What happens after closing

When you press `Esc` to close `/prompt`, Hunea tries to commit/persist the working copy from this panel, rather than "just look and discard".

The success feedback depends on the effective scope:

| Case | Common feedback |
| --- | --- |
| Mainly affects the next new session | Toast: `Prompt updated. Applies to next new session.` |
| Current session is still empty, can update current session assembly | System message: `Prompt updated for current empty session.` |

Note:

- **For the current session that already has conversation content**, modifying assembly in `/prompt` generally won't rewrite the entire historical transcript.
- To get most changes into the next round completely, the safest approach is: after closing `/prompt`, use `/clear` (alias `/new`) to start a new session.
- If opening `/prompt` fails to enter the editing session (e.g., begin fails), the panel may close directly without going through the commit flow.

## Where is configuration persisted

Common locations for project-level:

```text
.hunea/prompt-assembly.toml
.hunea/prompts/
.hunea/prompts/custom/
```

Global side is related to Hunea's data directory (usually `~/.config/hunea/`), for example global `AGENTS.md`, and global prompt assembly state (managed by session store / data directory, not just current workspace files).

You don't need to manually write all files before using `/prompt`: many custom items can be created and edited with `a` / `e` in the panel, then Hunea writes them back.

## How it differs from related commands

| What you want to do | More appropriate command |
| --- | --- |
| Inspect/adjust the system assembly list for the next new session | `/prompt` |
| Check how much context is used / remaining | [`/context`](/guide/fun/menu/context) |
| Switch model for current session | [`/models`](/guide/fun/menu/models) |
| Clear current conversation, start a new session | `/clear` (alias `/new`) |
| Copy user/assistant messages from current session | [`/copy`](/guide/fun/menu/copy) |

`/context` answers "how much budget is left"; `/prompt` answers "among this budget, what sources make up the system side, and can it be modified".

## Usage tips

- You just want to confirm "what exactly will the next round carry": open and press `p` to see the `Assembled prompt`, which is usually faster than opening one by one.
- Your project has `AGENTS.md` / `CLAUDE.md` but it doesn't seem to take effect: look for `instructions` in the left column, check if it's `missing`, `disabled`, or `shadowed` by a higher-priority source.
- You want to add a long-term instruction just for the current repository: switch right to `Custom Prompts`, `a` select `Project`, after writing confirm it appears in the left `Active` list.
- After changing order or toggling, preview with `p` first, then `Esc` to close and persist; if you need to verify immediately in clean context, then `/clear` to start a new session.
- If you can't remember all shortcuts, press `?` to see `More` — easier than guessing footer abbreviations.
