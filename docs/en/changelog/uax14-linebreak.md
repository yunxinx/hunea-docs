---
description: Main-document prose wrapping is unified onto a UAX #14 line-break planner; URLs are no longer split mid-token, paths and hyphenated words wrap at standard breakpoints, and styling no longer changes where lines break
---

# Unified prose wrapping via UAX #14

- **Date**: 2026-07-19
- **Commit**: `feat(tui): unify prose wrapping onto a UAX #14 line-break planner`
- **Version cue**: `0.12.1-alpha.1`

This is a foundational unification of line wrapping. Previously, wrap, prompt input wrapping, Markdown rendering, and syntax highlighting each maintained their own greedy tokenizer with slightly different behavior. They're now all converged onto a single line-break planner.

## What changed

1. **Wrapping follows the Unicode standard (UAX #14)**  
   The planner computes grapheme boundaries and UAX #14 break opportunities over the full text in one pass, then decides wrap points using terminal display width. Styling is just a projection onto already-determined byte ranges, so it **no longer affects where lines break**. The same text wraps identically whether or not it's highlighted.

2. **URLs are no longer split mid-token**  
   URL-like tokens are kept whole and avoid being broken in the middle (including a fallback for wrapping punctuation). Long links are easier to recognize and copy in narrow terminals.

3. **A visible change in wrapping behavior**  
   File paths and hyphenated words now wrap at valid UAX #14 break opportunities instead of being hard-cut at arbitrary columns. Long paths or words like `foo-bar-baz` break at more intuitive points. (Note: file paths themselves aren't given "never split" protection; they just wrap at standard breakpoints.)

4. **Better handling of CJK and special characters**  
   CJK line-break rules (kinsoku) are applied to avoid disallowed leading/trailing punctuation; `LS` / `PS` / `NEL`, lone `CR`, and `CRLF` are all treated as mandatory breaks.

## What you'll notice

- Long links and paths wrap at more sensible points in narrow windows, without hard mid-token cuts.
- Mixed CJK/Latin and punctuation-heavy paragraphs wrap more naturally.
- In rare cases, if you relied on a "hard cut at a fixed column" look before, wrap points may differ slightly from the old version; this is an expected behavior change.

This is a correctness-and-consistency refactor: it removes ~700 lines of duplicated implementation and adds a performance optimization for reusing line counts when user messages resize wider (O(1) reuse via a construction-time monotonicity guarantee instead of re-scanning the body). For you, the main payoff is that wrapping is finally consistent everywhere.
