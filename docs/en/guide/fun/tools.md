---
description: Hunea built-in tools, workspace path limits, which actions need approval, and how the approval panel works
---

# Tools & Approval

During conversation in Hunea, the model can call a set of built-in tools to read files, edit files, execute commands, search code, view images, and more, then continue generating replies after multiple rounds of calls.

This page explains what users encounter: which tools exist, which require approval, how path scope is restricted, and how to operate the approval panel.

> Tool usage guidelines participate in prompt assembly in [`/prompt`](/guide/fun/menu/prompt); context usage also shows a `Tool definitions` entry in [`/context`](/guide/fun/menu/context). This page complements the runtime capability itself.

## Workspace boundaries

File tools (`read` / `write` / `edit` / `list_dir` / `view_image` / `grep` / `find`) can only access paths **inside the current workspace**. Paths can be relative to the workspace, or absolute paths located inside the workspace; access outside fails.

`bash` also executes inside the workspace by default; you can specify `workdir`, but it still must fall within the workspace.

Therefore, it's recommended to launch Hunea in the project directory you actually need to operate on, rather than in an unrelated parent directory.

## Built-in tool list

| Tool | Purpose | Requires approval |
| --- | --- | --- |
| `bash` | Execute shell commands in the workspace; merge stdout and stderr; truncates long output, full content may be written to a temp file | **Yes (Ask)** |
| `read` | Read UTF-8 text; supports `offset` / `limit` for chunked reading; output includes line numbers | No (Always) |
| `write` | Create a file or overwrite an entire file | **Yes (Ask)**, with diff preview |
| `edit` | Perform targeted replacement by `old_string` / `new_string` (multiple non-overlapping changes allowed in one call) | **Yes (Ask)**, with diff preview |
| `list_dir` | List direct children of a directory (respects gitignore, includes dotfiles) | No |
| `view_image` | Provide a local image (png / jpeg / gif / webp) as multimodal content to the model | No |
| `grep` | Search by content (prefers managed or `rg` in `PATH`, falls back otherwise) | No |
| `find` | Find paths by glob (prefers managed or `fd` in `PATH`, falls back otherwise) | No |

Usage notes:

- Prefer `grep` / `find` / `list_dir` / `read` for what they can handle, rather than always using `bash`. Specialized tools have clear path boundaries and output truncation strategies; `bash` is better for pipelines, environment variables, and commands that specialized tools don't cover.
- Before using `write` / `edit` on an existing file, you generally need to `read` the full file first. This reduces the risk of direct rewriting without reading the complete content.
- For image files, use `view_image`, not `read`.
- `bash` output has an upper limit (about the last 2000 lines or 50KB). When truncated, the full output is saved to a temp file when possible.
- If `rg` / `fd` isn't available on your system, search tools use the managed download path you agreed to on startup, or a built-in fallback. That's why [Getting Started](/guide/start/getting-started) recommends installing `rg` / `fd`.

## Approval panel

Permission strategy is roughly two categories:

- **Always**: execute directly, no approval popup (read, search, list dir, view image).
- **Ask**: popup approval first, execute after approval (`bash` / `write` / `edit`).

When an Ask tool pops up, common options are:

1. `Yes` — approve only this one time
2. `Yes, allow similar requests during this session` — allow similar requests directly for the rest of the session
3. `No` — reject only this one time
4. `No, reject similar requests during this session` — reject similar requests directly for the rest of the session

Operations:

- `↑` / `↓` or number keys switch options; `Enter` / `y` confirm the current selection; `n` for reject options (follow the panel highlight)
- `Esc` cancels this approval interaction; the request won't execute
- `write` / `edit` shows a file diff preview; for long content you can enter full-screen preview and scroll

Note: the approval panel is at the end of the document. If the viewport is scrolled up to see historical messages, the panel may not be visible temporarily. The interface gives a hint to avoid accidental operation when you can't see the options.

> The debug [`/tool-debug`](/guide/fun/menu/preface) (requires `debug.enabled = true`) can preview the approval panel UI, but it's not a regular usage path; it may be removed or improved later.

## Turn limit

In one user request, the Agent can make multiple consecutive rounds of tool calls. If you need to limit the number of rounds, configure:

```toml
[runtime]
# Default is unlimited; set to a positive integer to terminate the request after exceeding this number of rounds
tool_max_turns = 32
```

See the `[runtime]` section in [config.toml](/guide/start/configuration/config) for request retry, idle timeout, and other instructions.

## Relationship to prompts and context

- Which tools are currently enabled, and their guideline content: see the Tools tab in [`/prompt`](/guide/fun/menu/prompt). You can also toggle tools off on that tab; when toggled off, they won't enter the assembly for the next new session.
- Context usage from tool definitions: see [`/context`](/guide/fun/menu/context).
- Tool results enter the session tree, so you can see `tool` nodes in [`/tree`](/guide/fun/menu/tree); but [`/copy`](/guide/fun/menu/copy) by default only lists user messages and assistant replies, it doesn't include tool / reasoning in the copy list.

## Usage tips

- When first using, start with read-only operations (read files, search) and observe whether the model prefers `read` / `grep`.
- When modifying files, check the diff preview. `Yes, allow similar…` reduces repeated confirmations and allows subsequent similar writes in this session — choose based on your scenario.
- For harmless repeated commands, you can use session-level allow; for destructive operations like deleting files, `git push --force`, changing permissions, it's recommended to keep per-request confirmation.
- Conversation content and workspace files are sent to third-party LLM services. For sensitive directories or secret files, please avoid or constrain them in your instruction files.
