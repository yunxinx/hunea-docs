---
description: 说明 Hunea 中的 Agent Skills 与 AGENTS.md / CLAUDE.md 指令文件：含义、存放位置、SKILL.md 格式与使用方式
---

# 技能与指令文件

这一页说明两类可以写入 Hunea 提示词的外部内容：

1. **指令文件**（`AGENTS.md` / `CLAUDE.md`）  
2. **技能（Agent Skills）**

这两类内容各有不同的适用场景。

## 两者的区别

| | 指令文件 | 技能（Skills） |
| --- | --- | --- |
| 典型文件 | `AGENTS.md`、`CLAUDE.md` | 每个技能目录下的 `SKILL.md` |
| 内容侧重 | 项目/个人的常驻约定：怎么测、别动哪些目录、提交规范等 | **某一类任务**的专项流程：步骤、约束、参考资料 |
| 加载方式 | 作为 instructions 进入提示词组装；偏“默认带上” | 渐进式：通常先只暴露名称与描述；需要时再读入正文，或由你手动绑定 |
| 是否适合写很长 | 不适合写得很长（会一直占上下文） | 更适合把长流程拆成可复用的专项包 |

业界把后一种东西称为 **Agent Skills**（可参考 [Agent Skills 规范](https://agentskills.io/specification)）。常见形态是：一个目录 + 一份 `SKILL.md`（YAML frontmatter + Markdown 正文）。Claude Code、Codex、Pi 等工具都在用相近约定；Hunea 也兼容其中常见的 **`.agents/skills/`** 发现路径。

如果不需要自定义，可以都不配置。Hunea 内置的核心 system prompt 与工具使用说明已经可以支持基本使用。

## 指令文件：`AGENTS.md` / `CLAUDE.md`

### 查找范围

| 作用域 | 位置 | 说明 |
| --- | --- | --- |
| 全局 | 数据目录下的 `AGENTS.md`（一般为 `~/.config/hunea/AGENTS.md`；便携模式则为工作区 `.hunea/AGENTS.md`） | 希望跨项目生效的通用约定 |
| 项目 | 从当前工作区目录向上到 git 根（包含各层目录）时，每一层优先使用 `AGENTS.md`，不存在时再使用 `CLAUDE.md` | 同一目录两者都存在时，**优先 `AGENTS.md`**，不会同时加载两份 |

因此在 monorepo 中，子目录与仓库根目录可以各自放置指令文件；Hunea 会按发现结果加入 instructions 列表。

### 生效方式

- 内容会作为 `instructions` 来源进入 prompt assembly。  
- 是否真正写入**下一次新会话**的 system prompt，取决于 [`/prompt`](/guide/fun/menu/prompt.html) 中该来源是否启用，以及是否被更高优先级来源遮蔽（shadow）。  
- **当前已有内容的会话不会因为刚修改了 AGENTS.md 就自动重新组装**。组装状态面向下一次新会话（或当前仍为空的会话）。

如果需要确认是否生效：打开 `/prompt`，在左侧 Active 列表中查找 `instructions`，查看其状态是 missing / disabled / shadowed，或在正文预览中是否出现对应内容。

### 适合写什么

没有强制模板。常见内容包括：

- 仓库的测试、格式化命令  
- 不建议修改的目录  
- 提交信息、分支命名等约定  
- 回复语言、禁止的危险操作等约束  

内容过长会增加上下文占用（可在 `/context` 中查看 system 侧占比）。较长的**专项流程**更适合做成 skill，而不是全部写进 `AGENTS.md`。

## 技能（Agent Skills）是什么

Skill 可以理解成：**可发现、可按需加载的专项说明包**。

设计上常见做法是「渐进披露」：

1. 先只把每个 skill 的 **名称 + 描述**（以及文件路径）告诉模型，方便它判断「当前任务是否相关」  
2. 真正需要时，再读取 `SKILL.md` 正文（以及正文里引用的同目录其它文件）  
3. 这样即使装了很多 skill，也不会一上来就把全部正文塞进上下文  

Hunea 里，技能发现片段的语义大致是：列出可用 skill，并提示模型在任务匹配时用 `read` 工具去加载对应文件；`SKILL.md` 中若引用相对路径，应按**技能目录**解析。

这和 `AGENTS.md` 不同：`AGENTS.md` 是常驻指令；skill 是「有这项任务时再启用」的专项能力说明。

### Hunea 如何发现技能

| 作用域 | 路径 |
| --- | --- |
| 全局 | `~/.agents/skills/` |
| 项目 | 从当前工作区向上到 git 根，每一层的 `.agents/skills/` |

每个 skill 是一个**目录**，目录内需要有 `SKILL.md`。

同名 skill 在多处出现时，会按发现顺序去重，列表中只保留先发现的一项。

### `SKILL.md` 格式

需要包含 YAML frontmatter 与 Markdown 正文。Hunea 解析时要求 frontmatter 中至少有非空的 `name` 与 `description`：

```markdown
---
name: rspress-docs-generator
description: 在本仓库中生成或维护 Rspress 文档站点时使用。涉及 rspress.config、docs 目录结构与 _meta.json 时优先加载。
disable-model-invocation: false
---

# Rspress Docs Generator

具体步骤、约定与限制……

需要更长的参考材料时，可放到同目录其它文件，并在正文中写明相对路径，
以便模型用 read 再打开。
```

字段说明（以 Hunea 当前实现为准）：

| 字段 | 是否必需 | 说明 |
| --- | --- | --- |
| `name` | 是 | 技能名称；也是输入框 `$` 选择与匹配时使用的名字 |
| `description` | 是 | **写清做什么、什么时候用**。模型是否会把它和当前任务对应起来，主要看这一段 |
| `disable-model-invocation` | 否 | 为 `true` 时，该 skill **不会进入「技能发现」目录**（模型不会在 discovery 列表里看到它以便自行选用）；仍可通过输入框 `$` 手动绑定。适合只想由你主动触发的流程 |

业界其它工具还可能支持更多 frontmatter（例如 `allowed-tools` 等），Hunea 当前以 `name` / `description` / `disable-model-invocation` 为主；请注意，并非所有扩展字段都能在 Hunea 中生效。

### 在 Hunea 里怎么用

| 用法 | 入口 | 发生什么 |
| --- | --- | --- |
| **技能发现（给模型看目录）** | 默认参与 [`/prompt`](/guide/fun/menu/prompt.html) 组装中的 skill discovery 片段 | 系统侧带上可用 skill 的名称、描述与路径；模型在任务匹配时再 `read` 正文。`disable-model-invocation: true` 的 skill 不会进这份目录 |
| **长期注入** | `/prompt` 的 Skill 页签中启用对应 skill | 把该 skill 的正文写入**下一次新会话**的 system 组装（占用更多上下文，适合确实需要默认带上的少量 skill） |
| **当前消息手动绑定** | 输入框中输入 `$` 打开 skill 选择器（见 [输入框](/guide/fun/designs/composer.html)） | 仅影响**当前这条**用户消息：发送时按绑定展开 skill 正文，会话里会留下 `$skill` 可见标记 |

需要区分：

- `$skill`：这一轮你显式附带某本说明  
- skill discovery：让模型知道有哪些 skill 可按描述选用  
- long-lived skill：把某本说明长期写进 system 侧  

自定义 prompt（输入框 `#` 前缀）是另一条路径，存放在 `.hunea/prompts/` 等相关位置，**不是** `.agents/skills/`。两者都可以在 `/prompt` 中管理，但目录与发现规则不同。

### 与 `/prompt` 的关系

- 改 skill discovery 是否启用、长期 skill 的启用与顺序：在 `/prompt` 中操作；保存后主要影响**之后的新会话**。  
- 确认组装结果：在 `/prompt` 中预览 Active 列表与组装正文。  
- 修改磁盘上的 `SKILL.md` 或 `AGENTS.md` 后，若当前会话已有内容，通常需要 `/clear` 或新会话后再观察效果。

## 一点使用建议

- 仓库级通用约定写 `AGENTS.md`；只在特定任务需要的流程做成 skill。  
- `description` 建议写具体触发场景（例如“维护 Rspress 文档站点、修改 `_meta.json` 时使用”），比只写“一个有用的技能”会更实用。  
- 正文尽量聚焦步骤与约束；过长的参考材料放到同目录其它文件，在 `SKILL.md` 里用相对路径引用。  
- 全局 `~/.agents/skills/` 适合个人跨项目复用；项目 `.agents/skills/` 适合随仓库提交、供协作者共用（也便于与同样扫描 `.agents/skills/` 的其它工具共享）。  
- 只想自己手动触发、不希望模型自行选用时，设置 `disable-model-invocation: true`，再用 `$` 绑定。  
- 若要停用某段 instructions 或 skill：在 `/prompt` 中禁用即可，不必删除文件。
