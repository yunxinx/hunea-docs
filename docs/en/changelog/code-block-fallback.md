---
description: 2026-07-17 update — align plain-text and highlight-failure fenced code blocks to a no-background fallback
---

# Fenced code block no-background fallback

- **Date**: 2026-07-17
- **Commit**: `fix(tui): unify no-background fallback style for fenced code blocks`
- **Version cue**: `0.11.1-alpha.6`

We've cleaned up the rendering paths for plain and broken-highlight fenced code blocks in the transcript:

1. **`text` / `txt` / `plain` / `plaintext` are treated as language-less fences**  
   These info strings won't get the full “has language” highlighting wrapper anymore — they render just like a plain ` ``` ` block.
2. **Highlight failure doesn't leave an unwanted surface background**  
   When syntax highlighting can't complete, the fallback now matches the plain fence style instead of leaving a colored empty shell.

This only affects the visual look of Markdown in the conversation area; no new configuration options.
