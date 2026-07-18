---
description: Some of Hunea’s design choices and trade-offs
---

# Overview

A short tour of how Hunea thinks about design.

These choices may still change later, but they are relatively stable for now. Docs will follow if they shift.

If you mainly care about how to operate things, start with the [Slash Menu](/guide/fun/menu/preface).

## Why altscreen

Hunea’s main UI runs in the terminal’s **alternate screen** (often called altscreen / the alternate screen buffer).

In short: once altscreen is entered, the app — Hunea — gets an **independent full-screen canvas**. Frame refreshes, full-screen panels, overlays, and the status line can all paint to their own layout. Leaving altscreen on exit hands the terminal back to the primary screen. The main shell session is not polluted by intermediate TUI frames, clears, or partial redraws, and the exit path stays clean.

1. **Full-screen modal layers need a controllable surface**  
   Interfaces like [`/tree`](/guide/fun/menu/tree), [`/copy`](/guide/fun/menu/copy), [`/prompt`](/guide/fun/menu/prompt), and the session resume list are not small bottom popovers — they take over the whole screen for lists, previews, and paging. Altscreen lets those layers fill the terminal instead of fighting the shell’s scrollback history.
2. **The input can grow and scroll with the document, instead of sitting fixed at the bottom**  
   The main view lays out transcript and composer as one scrollable document. The composer can grow without bound and never opens a second scroll region inside the input box. That layout is hard to keep clean under a primary-screen + fixed bottom-bar model; in altscreen it can be recomputed every frame.
3. **“Review after exit” can be an explicit choice**  
   The cost of altscreen is that while a session is running, the terminal emulator’s own scrollback usually does not show internal TUI frames. Hunea does not treat “history must pile into the terminal scrollback” as the default. Instead it offers optional exit replay: with `print_transcript_on_exit = true`, leaving the app prints the current conversation back into primary-screen scrollback as a terminal replay. Default is off, because many people just end a session and do not want a full transcript dumped into the shell.

I did consider a Codex CLI–style bottom redraw that pushes content into the emulator’s native scrollback. The upsides are real:

1. Mouse selection and copy are native terminal features — natural and familiar
2. Scrolling is smooth; the emulator already handles inertia and related polish
3. …and whatever else I am forgetting right now

I still did not go that way, for simple reasons:

1. Too much implementation work
2. Incomplete handling produces a long tail of weird bugs
3. Unexpected issues show up anyway

Even mature tools like Claude Code offer an altscreen switch. Coincidentally, I hit a problem in Claude Code not long ago:

![index-1](/assets/designs/index1.png)

That was Claude Code `2.1.21x` — recent enough — and the issue still appeared. Codex CLI is better, but not immune. In some emulators I have also seen scrollback content loss: after content is pushed into scrollback, middle sections of a long dump sometimes disappear, likely from emulator or compatibility edge cases.

Codex CLI did add a feature a few months ago (I forget the name — and I no longer see it in my own v0.144.1 build) that could rebuild content after a terminal resize. That is a partial workaround: resize the window and hope the display heals.

So I stuck with altscreen, then optimized toward the feel of bottom-redraw where I could. Performance is decent today and will keep improving.

## Why some views support native mouse selection and others do not

“Mouse” in a terminal really has two semantics, and Hunea switches between them by view:

| Mode (concept) | Who owns click / drag | Typical scenes |
| --- | --- | --- |
| **App capture** | Hunea handles clicks, drag selection, list row picks | Main conversation, composer, and lists that need click-to-select |
| **Terminal native** | Selection returns to the terminal emulator | Full-screen layers that are more “read / preview” |

The main UI defaults to **app capture**. Reasons are straightforward:

- A click should place the composer cursor at that character
- Dragging on the transcript should produce a **semantic selection** — body text, not left chrome, indent, or status margins
- Lists should move the cursor on click without accidentally becoming “half a garbled terminal selection ready to paste”

So main-UI selection is computed by Hunea: hit testing and copy range are separate — left prompts and visual indent can still be easy to click, but copy does not take the decoration with it. Whether a finished selection auto-writes the clipboard is controlled by `copy_on_mouse_selection_release` (default off). Middle-click can also copy the current selection. Whole-message copy goes through [`/copy`](/guide/fun/menu/copy) — a different path from screen drag-select.

Full-screen layers are not all-or-nothing. Hunea picks mouse mode by whether the layer needs click navigation or reading/copying right now:

- **Lists that need row clicks and wheel-as-navigation** (e.g. `/tree`, `/copy`, message history, `/prompt` list state)  
  Stay under app capture, with alternate scroll so the wheel reliably pages/moves instead of being eaten by the terminal.
- **Content preview already open** (tree node preview, copy preview, prompt preview, …)  
  Mouse capture is turned off so **native selection** returns to the emulator, while alternate scroll stays so the wheel still pages.  
  In other words: preview is more like “a read-only text view” where your terminal’s usual drag-to-copy habits work.
- **Layers that are reading-first** (transcript overlay, session preview, …)  
  Same bias: native selection + alternate scroll.

One-line summary:

> **When interaction matters, the mouse belongs to Hunea; when reading and drag-select matter — e.g. Space previews and the Ctrl+T detail view — the mouse belongs to the terminal.**

That is why some views feel like a normal terminal for selection, while others refuse to drag-select yet happily accept list clicks.

## Other design choices

### The main view is “one scrollable document”, not “fixed bottom input + panel above”

Transcript and composer share one document layout. Hunea does not make “always pin the input region to the bottom” the preferred default — that steadily steals reading height, and long drafts tend to fall into scrolling inside the input box.

Even if fixed bottom bars or other layouts land later, they will be switchable options, not replacements that delete the current model.

### Defaults stay restrained

For example:

- `print_transcript_on_exit` defaults to `false`: exit does not flood the shell
- `copy_on_mouse_selection_release` defaults to `false`: finished selections do not auto-copy, reducing accidents
- Reasoning stays collapsed by default: open the transcript overlay when you need the long form

Open-box defaults, without manufacturing noise for you.

---

If a particular trade-off deserves its own topic later (session-tree branching, prompt assembly, …), I will write that up when there is time.
