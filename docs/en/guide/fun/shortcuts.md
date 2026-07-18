---
description: Keyboard shortcuts for Hunea input, slash menu, full-screen panels, Esc rewind, and tool approval flows
---

# Keyboard Shortcuts

Hunea's keybindings are distributed across the input box, slash menu, various full-screen panels, and approval interfaces. Each feature page already has explanations, this page summarizes common shortcuts for easy reference.

> Terminal emulators, tmux, or remote sessions may also intercept some combinations. If a key doesn't work, first check if it's captured by the outer environment; you can also check if `keyboard_enhancement` (`auto` / `on` / `off`) needs to be explicitly turned off.

## Main interface / Composer

Default send semantics (you can swap Enter with Shift+Enter / Ctrl+J using `swap_enter_and_send`):

| Key | Action |
| --- | --- |
| `Enter` | Send draft (becomes newline when swap is enabled) |
| `Shift + Enter` / `Ctrl + J` | Insert newline (becomes send when swap is enabled) |
| `Alt + Enter` / `Ctrl + M` | Insert newline (unaffected by swap; `Ctrl + M` behaves as plain Enter in some older terminals) |
| `Ctrl + C` | With a draft, defaults to clearing the draft (`ctrl_c_clears_input`); with empty input, enters exit confirmation |
| `Esc` | During streaming: interrupt the current request after `esc_interrupt_presses` (default 2) presses; with empty input and no streaming: double-press enters backtracking (see below) |
| `Ctrl + G` | Edit the current draft in an external editor |
| `Ctrl + R` | Open global message history (same as [`/resend`](/guide/fun/menu/resend)) |
| `Ctrl + T` | Open full-screen transcript details |
| `Ctrl + Z` / `Ctrl + Y` | Undo draft edit / yank most recent kill |
| `PageUp` / `PageDown` | Prioritize scrolling the document, then handle paging inside the input box |
| Mouse wheel | Scroll the main document; feel controlled by `scroll_animation` |

When the input box is empty and **there is no** streaming output, double-press `Esc`:

| `esc_rewind_mode` | Double-Esc behavior | Slash menu shows |
| --- | --- | --- |
| `coarse` (default) | Edit/resend by user message round (same as `/sends-back`) | `/tree` |
| `entry` | Open `/tree` | `/sends-back` |

Editing keys mostly follow readline conventions (like `Ctrl + A/E/B/F/K/U/W`, word movement and deletion, etc.), see [Composer](/designs/composer) for details.

### Prefix popups

| Prefix | Purpose |
| --- | --- |
| `/` (typed when input box is empty) | [Slash Menu](/guide/fun/menu/preface) |
| `@` | File / image path |
| `$` | [Skill](/guide/fun/skills) |
| `#` | Custom prompt |

Common operations inside popups: continue typing to filter, `↑` / `↓` to move, `Tab` to complete or confirm, `Enter` to select, `Esc` to close.

## Slash Menu

| Key | Action |
| --- | --- |
| `↑` / `↓` | Move |
| Continue typing | Filter / match |
| `Tab` | Complete to current match |
| `Enter` | Execute |
| `Esc` | Close menu |

See the [slash menu overview](/guide/fun/menu/preface) for the full command list.

## Session resume `/resume`, message copy `/copy`, history `/resend`

Navigation for these full-screen lists is generally similar (follow the hint at the bottom of the interface):

| Key | Common action |
| --- | --- |
| `↑` / `↓` or `j` / `k` | Move |
| `←` / `→` or `h` / `l` | Page through or other horizontal operations (depends on the panel) |
| `/` | Enter search (some panels) |
| `Space` | Preview |
| `Enter` | Confirm (resume session / copy / refill, etc.) |
| `Esc` | Go back or close |
| `Tab` | Toggle selection in multi-select scenarios like `/copy` |

## Session tree `/tree`

| Key | Action |
| --- | --- |
| `↑` / `↓` or `j` / `k` | Move node |
| `←` / `→` or `h` / `l` | Page through |
| `Space` | Preview current node / branch content |
| `Tab` | Open branch selection when multiple sibling branches exist |
| `A` | Open full Branch Tree |
| `Enter` | Backtrack to restorable node, or switch branch |
| `Esc` | Go back level by level / close |

See [`/tree`](/guide/fun/menu/tree) for more detailed layered operations (branch preview, Branch Tree).

## User message backtracking (default double Esc / `/sends-back`)

| Key | Action |
| --- | --- |
| `←` / `→` | Switch between user messages (only user messages, excludes assistant / tool) |
| `↑` / `↓`, `PgUp` / `PgDn`, `Home` / `End` | Scroll view, doesn't change selection |
| `Enter` | Truncate content after this message and refill this user message into the input box (doesn't auto-send) |
| `Esc` / `Ctrl + T` / `Ctrl + C` | Close overlay, doesn't modify the session |

See [`/sends-back`](/guide/fun/menu/sends-back) for details.

## Full-screen Transcript (`Ctrl + T`)

| Key | Action |
| --- | --- |
| `j` / `k`, arrow keys, `Ctrl + U/D`, `PgUp` / `PgDn`, `Home` / `End` | Scroll |
| `Esc` / `q` / `Ctrl + C` / `Ctrl + T` | Close |

## Tool Approval

| Key | Action |
| --- | --- |
| `↑` / `↓` | Move between Yes / No and session-level options |
| `Enter` / `y` | Confirm current option (`y` leans toward approve side) |
| `n` | Reject side |
| `Esc` | Cancel this approval interaction |
| Paging keys in full-screen diff preview | View changes for `write` / `edit` |

For option meaning and hints when the panel is invisible, see [Tools & Approval](/guide/fun/tools).

## Other panels: Models / Prompt

- [`/models`](/guide/fun/menu/models): type directly to filter, `Enter` to select; `U` to refresh model list (if provider supports)  
- [`/prompt`](/guide/fun/menu/prompt): two-column with tabs; `Space` to preview single item, `p` to see assembled result, `?` to see panel help, `Ctrl + G` to edit body in external editor  

Each panel generally shows operation hints for the current context at the bottom. Specific operations follow the interface hints; this page only summarizes the most commonly used keys.

## Usage tips

- It's recommended to first get familiar with: `Enter` send, `Ctrl + J` newline, `Ctrl + G` external edit, `Ctrl + R` history, `Ctrl + T` details, double `Esc` backtrack on empty input.  
- For other panels, check the bottom operation hint first.  
- When combination keys behave unexpectedly: try a modern terminal emulator (like kitty / Ghostty / Windows Terminal), check your tmux prefix key, or try `keyboard_enhancement = "off"`.
