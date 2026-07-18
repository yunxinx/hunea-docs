---
description: Smooth mouse-wheel scrolling on the main document with six configurable scroll_animation feel tiers
---

# Smooth mouse-wheel scrolling

- **Date**: 2026-07-17
- **Commit**: `feat(tui): systemically improve mouse wheel smooth scrolling and feel`
- **Version cue**: `0.11.1-alpha.6`

Mouse-wheel scrolling on the main document is no longer just “jump N lines per notch” — we now have a configurable smooth scrolling system.

## What you will feel

1. **Wheel slides by your chosen tier**  
   The default is `"smooth"`: wheel input accumulates and animates in ~8ms steps, so it feels like gliding instead of hard step jumps.
2. **Fast scrolling accelerates, but capped**  
   Acceleration builds up to the tier's limit. Reverse direction or wait a moment, and the multiplier resets — no runaway inertia.
3. **Boundaries clean up properly**  
   Hitting top/bottom edges, snapping, pinning to bottom, or on empty documents all clear the pending scroll. When you manually scroll all the way down, bottom-following automatically restarts (except when you're dragging to select text, so we don't steal your selection).
4. **Fullscreen modals pause animation**  
   When a fullscreen modal covers the main document, smooth scrolling draining freezes. Closing the overlay won't leave you with a drifted viewport from background processing.
5. **PageUp / PageDown jump instantly**  
   Page turns via keyboard are always instantaneous, separate from wheel animation: paging needs to be fast, wheel is all about feel.

## Config

Under `[tui]` in `config.toml`:

```toml
# off / snappy / fast / smooth / gentle / glide
# default: smooth
scroll_animation = "smooth"
```

| Value | Feel |
| --- | --- |
| `off` | No smooth scroll; ~3 lines/notch instantaneous jumps, no acceleration |
| `snappy` | Near-instant; only softens large moves |
| `fast` | Quick settle, little animation |
| `smooth` | Balanced default |
| `gentle` | Longer glide |
| `glide` | Longest glide |

A couple more notes:

- If you have `motion = "reduced"`, scrolling is forced to be instantaneous **no matter what** `scroll_animation` says.
- Unknown tier names will give you a clear configuration error instead of silently falling back to defaults.

This change also widens the transcript exactize window along the scroll direction while animating, which prevents row-estimation errors from turning into annoying viewport jumps during the animation. See [config.toml · scroll_animation](/guide/start/configuration/config) and [Shortcuts · mouse wheel](/guide/fun/shortcuts) for more details.
