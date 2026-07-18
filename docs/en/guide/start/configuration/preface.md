---
description: How Hunea loads models.toml, config.toml, and phrases.toml: locations, merge rules, and section index
---

# Configuration

Hunea is configured via three TOML files:

| File | Purpose |
| --- | --- |
| [`models.toml`](/guide/start/configuration/models) | Providers and models |
| [`config.toml`](/guide/start/configuration/config) | TUI, runtime, and other behaviors |
| [`phrases.toml`](/guide/start/configuration/phrases) | Waiting prompt phrases while waiting for replies |

## Placement and merging rules

Can be placed at:

- User-level (global): `~/.config/hunea/`
- Project-level: `.hunea/` under the current working directory

When both exist, **project-level overrides user-level**. After modifying configuration, you need to restart Hunea for changes to take effect.

If you don't have special needs, prefer putting `models.toml` etc. globally, so your existing configuration and model selection still work when you switch workspaces.

Additional note: if there's a `portable.marker` in `.hunea/` of your workspace, it enters portable mode — only reads configuration/sessions from this workspace and doesn't overlay global `~/.config/hunea/`. If the global configuration directory isn't available on first launch, precheck may guide you to create this marker.

> The `*.example.toml` in the code repository may lag behind this document to some extent, so it's recommended to follow this document.

## File guides

- [`models.toml`](/guide/start/configuration/models): providers and models
- [`config.toml`](/guide/start/configuration/config): TUI, runtime, and other behaviors
- [`phrases.toml`](/guide/start/configuration/phrases): waiting prompt phrases
