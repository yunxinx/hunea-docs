---
description: Hunea changelog of user-facing product changes — browse recent TUI, runtime, and interaction updates by date
---

# Changelog

:::important Disclaimer!
It's worth stressing that, as of 2026-07-20, every update to Hunea's TUI styling and features is the result of changes I made based on my own personal "observation"! So for certain scenarios, such as extremely subtle TUI rendering and interaction details, I may not have tested or noticed them yet, and thus haven't optimized or fixed them in time. Please bear with me. This situation may last for quite a while; once there's feedback and suggestions down the road, I'll remove this notice at an appropriate time.
:::

This page records **user-facing** Hunea changes. The write-ups follow what the code actually does, not just commit titles.

The current workspace version is `0.12.1-alpha.2` (from `workspace.package.version` in the repo `Cargo.toml`). Entries in the left sidebar are newest first; open each page for the full write-up.

> For field reference rather than release narrative, see [config.toml](/guide/start/configuration/config) and [Keyboard Shortcuts](/guide/fun/shortcuts).

## Recent entries

| Date | Entry | Version cue |
| --- | --- | --- |
| 2026-07-20 | [Configurable command menu trigger](/changelog/command-menu-mode) | `0.12.1-alpha.2` |
| 2026-07-19 | [Unified prose wrapping via UAX #14](/changelog/uax14-linebreak) | `0.12.1-alpha.1` |
| 2026-07-17 | [Smooth mouse-wheel scrolling](/changelog/smooth-scroll) | `0.11.1-alpha.6` |
| 2026-07-17 | [Fenced code block no-background fallback](/changelog/code-block-fallback) | `0.11.1-alpha.6` |
| 2026-07-17 | [Keep viewport + attention pill](/changelog/attention-pill) | `0.11.1-alpha.5` |
| 2026-07-16 | [Request timeout is idle timeout](/changelog/idle-timeout) | `0.11.1-alpha.4` |
| 2026-07-16 | [Status line context usage](/changelog/context-statusline) | `0.11.1-alpha.4` |
| 2026-07-16 | [Per-tool enable / disable](/changelog/tool-enablement) | `0.11.1-alpha.3` |

For config fields, prefer the live [config.toml](/guide/start/configuration/config) docs; if an example file lags, trust the code and the matching entry. Future user-visible changes will keep being appended to the left list at a granularity that explains what actually changed.
