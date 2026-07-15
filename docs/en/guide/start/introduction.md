---
description: The naming, ideas, and some plans behind Hunea.
---

# Introduction

:::note About this English version
The English docs are primarily AI-translated from the Chinese originals.
They should match the product behavior, but wording and nuance may still be off.
If something reads unclear, incomplete, or wrong, please open an issue or PR on
[hunea-docs](https://github.com/yunxinx/hunea-docs) — Chinese remains the source of truth for now.
:::

Hunea is a TUI agent tool built with Rust and Ratatui. I named it Hunea by blending *human* and *easy*. That is also the product vision: something that fits how people actually work and feels easy to use. A lot of the effort has gone into TUI design and interaction.

I want the same simple, approachable experience for professionals, learners, and people who just want AI help without learning a pile of commands. Beginners and power users should feel close to the same low friction — the gap from first open to long-term use should stay small.

## Using Hunea

Go to [Getting Started](/guide/start/getting-started) to learn how to work with Hunea.

Or go to [Slow Start](/guide/start/slow/index) if you want to learn from the very beginning.

## Side notes

> Long, optional, and mostly personal thoughts — fine to skip.

The idea for this tool started around late December 2025 through early 2026.

By then there were already plenty of mature TUI tools: Claude Code (which I barely use), plus ones I have used more — droid (Factory), Codex CLI (OpenAI; the one I used longest), OpenCode (I think it already existed then?), and various Chinese ones like iFlow CLI (I recommended it to classmates for a while; it shut down on 2026-04-17), Qoder CLI, Neovate (I tried it; it seems unmaintained now), and others I no longer remember.

For me, most of them had UX rough edges — fair enough for products that were still young. By the time this doc is written (July 2026), many of them are much more polished. Even so, some interactions still feel off: input editing, reading and copying messages, and other core flows I care about. If there is one big inspiration, Codex CLI helped a lot — you can see the overall TUI look is close to it, with my own observations from other CLIs mixed in. Is Hunea perfect? Of course not. I mainly wanted something pleasant for my own daily use. Where it ends up is hard to say, and I will not claim the world is ready to love TUI tools either. Personally I prefer TUI: lighter, fewer things installed on the machine, and usable over SSH on remote servers.

From about January to March 2026 I first built on Go + Bubble Tea. Development felt fast and the UI was decent — until an early architecture mistake forced a full rewrite. I will not rehash that design error here.

After thinking it through, I moved to the Rust ecosystem and chose an altscreen approach. I deliberately did **not** pin the input box to the bottom the way OpenCode and many other TUI products do. That pattern is familiar and fine for many people, but I dislike how a fixed bottom bar steals reading height — you end up resizing the terminal just to see more content. I dislike even more scrolling *inside* the input box when a draft gets long, which pushes me into nvim or another external editor just to reread what I typed. (A fixed bottom composer may still land later as an option, along with other layouts — never forced, always switchable in config.)

Other things bothered me too: prompts and chrome everywhere, constantly interrupting the flow. Maybe that is just me. Either way, I did not want that design.

So a lot of Hunea's direction comes from those friction points: a clean, consistent TUI; an unbounded composer that never collapses or scrolls inside itself no matter how long the draft is (external editors exist, but I wanted one consistent place to stay, so mouse click, selection replace, and similar helpers came with it); and other experience fixes.

Prompt assembly, inspecting what actually gets sent, and related features exist to open the black box. I want a full, honest view of my inputs and the assistant's outputs. Someone might say you can already do this with packet capture or other tooling on top of existing CLIs.

Fair point — I just do not want that much ceremony. And some tools, Claude Code among them, are not nearly that customizable; they stay black boxes. Core system prompts often cannot be replaced at all. Hunea can. You can replace them, sync across projects (with project vs global scopes; more may come later, but this is already useful), or disable them entirely. You can see what you sent, what came back, and what went out. No black box, fully transparent. The code is open source; no hidden side channels. Keep the defaults, rewrite prompts, or use someone else's later via a smoother path — all fine.

I also want follow-ups around `/prompt`: different tool sets and prompt designs per model family, so each model can work closer to its strengths — GPT preferring patch-style tools, Claude preferring other patterns, Kimi / GLM quirks, how to guide DeepSeek comfortably, and so on (that last part is hard without collecting data, so it may come later).

Those will be specialized rather than one prompt and one tool set forced onto every model. The work is large, but the goal is still low learning cost. The tedious parts should be done for you; open-box defaults with little configuration are a deliberate priority.

In short, the problems I want to address:

1. **Opacity.** Hunea is transparent and open, with no back doors. What prompt was sent and what came back is exactly what you see.
2. **Simplicity and low cognitive load.** Little to almost no onboarding cliff. In an era where many tools feel built for agents first, I still want tools that feel good for people.
3. **Speed, small footprint, cross-platform.** That is why TUI over web/GUI for now. I have put real work into making TUI feel better; other surfaces may come later, but that is longer-term.
4. **Freedom and extensibility.** More of this will open up over time — eventually even a fully customizable core, though that is early to promise.
5. **Whatever else I forgot while typing this by hand.**

At the start the idea was simpler: just a TUI shell I liked using.

I did not even plan a full agent at first. I wanted an ACP-based TUI wrapper around tools like Claude Code (you can still see that in early commits before the full rewrite and cleanup).

The drawbacks piled up. ACP itself is incomplete, vendor support is uneven, and more importantly it did not solve the transparency problems I cared about. Needing to install someone else's product before using mine felt backwards, and I still would not know what that product was doing. Different vendors implement things differently — better to build one freer, more consistent platform myself.

It is also a small attempt to raise the bar for this space at home. There are domestic TUI tools from large companies, but day-to-day use often feels awkward. Profit matters, sure — can the product at least feel less twisted to use?

Finally: TUI stays light. Users should not need a pile of VS Code installs or browser tabs. Yes, TUI can look harder at first — that is what "Slow Start" is for. Windows users may still hit rough edges today because Windows has not been optimized yet; WSL2 or a Linux VM is the safer path for now.

Windows is still high priority. Who says Windows is bad for development? I like it a lot — it just needs more time.
