---
description: New command_menu_mode config controls how the command menu is triggered (slash/floating/both), adding a Ctrl+O floating command menu and a configurable row count via command_menu_rows
---

# Configurable command menu trigger

- **Date**: 2026-07-20
- **Commit**: `feat(tui): make the command menu trigger configurable`
- **Version cue**: `0.12.1-alpha.2`

Previously the slash command menu could only be triggered by typing `/` in an empty composer. This change adds a floating command menu and makes the trigger configurable: you can keep inline `/`, switch to `Ctrl+O` floating, or enable both.

## What changed

1. **New `command_menu_mode` config**  
   Controls how the command menu is triggered, with three options:
   - `"slash"` (default): only triggers the inline slash command menu when the composer starts with `/`, same as before.
   - `"floating"`: `/` no longer triggers the menu (it's treated as plain text); open the floating command menu with `Ctrl+O` instead.
   - `"both"`: both work at once; the inline `/` menu and the `Ctrl+O` floating menu don't interfere with each other.

2. **New `Ctrl+O` floating command menu**  
   The floating menu scrolls up and down, and shows a scrollbar on the right when there are more commands than fit; beyond the keyboard, it also supports mouse click to select and wheel scrolling. Handy if you want to type `/` as a literal character, or prefer invoking commands with a fixed shortcut. It looks like this:

   ![menu-2](/assets/fun/menu-2.png)

3. **New `command_menu_rows` config**  
   Controls how many command rows the `Ctrl+O` floating menu shows at once; the rest scroll. Range `7..21`, default `7`.

## Config

Under `[tui]` in `config.toml`:

```toml
# slash / floating / both, default slash
command_menu_mode = "slash"

# rows shown at once in the floating menu, range 7..21, default 7
command_menu_rows = 7
```

| `command_menu_mode` | `/` inline menu | `Ctrl+O` floating menu |
| --- | --- | --- |
| `slash` (default) | Yes | No |
| `floating` | No (`/` is plain text) | Yes |
| `both` | Yes | Yes |

For more key bindings see [Keyboard Shortcuts](/guide/fun/shortcuts), and for the command list see [Slash menu overview](/guide/fun/menu/preface).
