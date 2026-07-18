---
description: Agent Skills and AGENTS.md / CLAUDE.md in Hunea — discovery paths, SKILL.md format, and prompt assembly
---

# Skills & Instruction Files

This page explains two types of external content that can be written into Hunea's prompts:

1. **Instruction files** (`AGENTS.md` / `CLAUDE.md`)  
2. **Agent Skills**

These two types serve different use cases.

## Differences between them

| | Instruction Files | Skills |
| --- | --- | --- |
| Typical files | `AGENTS.md`, `CLAUDE.md` | `SKILL.md` in each skill directory |
| Content focus | Project/personal standing conventions: how to test, which directories not to touch, commit conventions, etc. | Specialized processes for **a category of tasks**: steps, constraints, references |
| Loading method | Enters prompt assembly as instructions;偏向 "always included by default" | Progressive: usually only exposes name and description first; reads the full body when needed, or you can bind manually |
| Suitable for long content | Not suitable for very long content (it always occupies context) | More suitable for breaking long processes into reusable specialized packages |

The industry calls the latter **Agent Skills** (see [Agent Skills specification](https://agentskills.io/specification) for reference). The common form is: a directory + a `SKILL.md` (YAML frontmatter + Markdown body). Tools like Claude Code, Codex, Pi all use similar conventions; Hunea is also compatible with the common **`.agents/skills/`** discovery path.

If you don't need customization, you can leave both unconfigured. Hunea's built-in core system prompt and tool usage instructions already support basic usage.

## Instruction files: `AGENTS.md` / `CLAUDE.md`

### Search scope

| Scope | Location | Description |
| --- | --- | --- |
| Global | `AGENTS.md` in the data directory (usually `~/.config/hunea/AGENTS.md`; in portable mode it's `.hunea/AGENTS.md` in the workspace) | General conventions you want to apply across projects |
| Project | Searching upward from the current working directory to the git root (includes each level), each level prefers `AGENTS.md`, falls back to `CLAUDE.md` if not exists | When both exist in the same directory, **`AGENTS.md` is prioritized** — both won't be loaded at the same time |

Therefore in a monorepo, subdirectories and the repository root can each have their own instruction files; Hunea adds all found results to the instructions list.

### How it takes effect

- Content enters prompt assembly as an `instructions` source.  
- Whether it actually writes into the system prompt of **the next new session** depends on whether that source is enabled in [`/prompt`](/guide/fun/menu/prompt) and whether it's shadowed by a higher-priority source.  
- **A session that already has content won't automatically re-assemble just because you modified AGENTS.md**. Assembly state targets the next new session (or the current session if it's still empty).

To confirm whether it's working: open `/prompt`, look for `instructions` in the left Active list, check its status (missing / disabled / shadowed), or see if the corresponding content appears in the body preview.

### What to write here

There's no enforced template. Common content includes:

- Repository test and formatting commands  
- Directories that shouldn't be modified  
- Conventions like commit messages, branch naming  
- Constraints like reply language, forbidden dangerous operations  

Long content increases context usage (you can check the system-side percentage in `/context`). Longer **specialized processes** are better made into skills rather than writing everything into `AGENTS.md`.

## What are Agent Skills

A Skill can be understood as: **a discoverable, on-demand loaded package of specialized instructions**.

The common design approach is "progressive disclosure":

1. First, only tell the model the **name + description** (and file path) of each skill, so it can judge "whether this is relevant to the current task"  
2. When actually needed, it reads the `SKILL.md` body (and other files in the same directory referenced in the body)  
3. This way, even with many skills installed, it doesn't stuff all the bodies into the context right from the start

In Hunea, the skill discovery fragment semantically lists available skills and prompts the model to load the corresponding file with the `read` tool when the task matches; if `SKILL.md` references relative paths, they should be resolved relative to the **skill directory**.

This differs from `AGENTS.md`: `AGENTS.md` is a standing instruction; a skill is a specialized capability description that's "enabled when the task calls for it".

### How Hunea discovers skills

| Scope | Path |
| --- | --- |
| Global | `~/.agents/skills/` |
| Project | From current working directory up to git root, `.agents/skills/` at each level |

Each skill is a **directory**, and the directory needs to contain `SKILL.md`.

When the same-named skill appears in multiple places, it's deduplicated by discovery order — only the first discovered one is kept in the list.

### `SKILL.md` format

It needs to include YAML frontmatter and Markdown body. Hunea requires at least non-empty `name` and `description` in the frontmatter:

```markdown
---
name: rspress-docs-generator
description: Use when generating or maintaining Rspress documentation sites in this repository. Prioritize loading when dealing with rspress.config, docs directory structure, or _meta.json.
disable-model-invocation: false
---

# Rspress Docs Generator

Specific steps, conventions, and limitations...

For longer reference material, you can put it in other files in the same directory and write the relative path in the body,
so the model can open it with read.
```

Field description (based on Hunea's current implementation):

| Field | Required | Description |
| --- | --- | --- |
| `name` | Yes | Skill name; also used for selection and matching with the `$` prefix in the input box |
| `description` | Yes | **Clearly state what it does and when to use it**. Whether the model associates it with the current task mostly depends on this paragraph |
| `disable-model-invocation` | No | When `true`, this skill **won't enter the skill discovery directory** (the model won't see it in the discovery list for self-selection); it can still be manually bound via `$` in the input box. Suitable for processes you only want to trigger manually |

Other tools in the industry may support more frontmatter (like `allowed-tools`, etc.), Hunea currently focuses on `name` / `description` / `disable-model-invocation`; note that not all extended fields work in Hunea.

### How to use in Hunea

| Usage | Entry | What happens |
| --- | --- | --- |
| **Skill discovery (give the model a directory)** | By default participates in skill discovery fragment assembly in [`/prompt`](/guide/fun/menu/prompt) | The system side includes the name, description, and path of available skills; the model reads the body with `read` when the task matches. Skills with `disable-model-invocation: true` don't enter this directory |
| **Long-lived injection** | Enable the skill in the Skill tab of `/prompt` | Writes the skill body into the system assembly of **the next new session** (occupies more context, suitable for a small number of skills that really need to be always included) |
| **Manual binding for current message** | Type `$` in the input box to open the skill picker (see [Composer](/designs/composer)) | Only affects **this current** user message: when sending, the skill body is expanded according to the binding, and a `$skill` visible mark is left in the conversation |

To clarify:

- `$skill`: you explicitly attach this instruction to this round  
- skill discovery: lets the model know which skills are available to select by description  
- long-lived skill: writes the instruction permanently into the system side  

Custom prompts (the `#` prefix in the input box) are a separate path, stored in `.hunea/prompts/` and related locations, **not** in `.agents/skills/`. Both can be managed in `/prompt`, but they have different directories and discovery rules.

### Relationship to `/prompt`

- Changing whether skill discovery is enabled, or enabling/ordering long-lived skills: operate in `/prompt`; after saving, it mainly affects **future new sessions**.  
- Confirming the assembly result: preview the Active list and assembled body in `/prompt`.  
- After modifying `SKILL.md` or `AGENTS.md` on disk, if the current session already has content, you usually need `/clear` or a new session to see the effect.

## Usage tips

- Write repository-level general conventions in `AGENTS.md`; make processes only needed for specific tasks into skills.  
- For `description`, it's recommended to write specific trigger scenarios (e.g., "Use when maintaining Rspress documentation sites and modifying `_meta.json`") — this is more useful than just writing "a useful skill".  
- Keep the body focused on steps and constraints; put long reference material in other files in the same directory and reference them with relative paths in `SKILL.md`.  
- Global `~/.agents/skills/` is good for personal cross-project reuse; project `.agents/skills/` is good for committing with the repository and sharing with collaborators (also easy to share with other tools that also scan `.agents/skills/`).  
- When you only want to trigger manually and don't want the model to select it itself, set `disable-model-invocation: true` and bind with `$`.  
- If you want to disable an instruction or skill: just disable it in `/prompt` — no need to delete the file.
