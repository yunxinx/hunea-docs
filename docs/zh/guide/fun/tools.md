---
description: 介绍 Hunea Agent 内置工具清单、工作区边界与工具审批交互
---

# 工具与审批

Hunea 在对话过程中，模型可以调用一组内置工具来完成读文件、改文件、执行命令、搜索代码、查看图片等工作，并在多轮调用后继续生成回复。

这一页说明用户侧会接触到的内容：有哪些工具、哪些需要审批、路径范围如何限制，以及审批面板如何操作。

> 工具相关的使用说明（tool guidelines）会参与 [`/prompt`](/guide/fun/menu/prompt.html) 的提示词组装；上下文占用也可以在 [`/context`](/guide/fun/menu/context.html) 中看到 `Tool definitions` 一项。本页补充的是运行时能力本身。

## 工作区边界

文件类工具（`read` / `write` / `edit` / `list_dir` / `view_image` / `grep` / `find`）只能访问**当前工作区**内的路径。路径可以是相对工作区的路径，也可以是位于工作区内部的绝对路径；超出范围会失败。

`bash` 默认也在工作区中执行；可以指定 `workdir`，但仍要求落在工作区范围内。

因此建议在真正需要操作的项目目录中启动 Hunea，而不是在无关的上层目录中启动。

## 内置工具一览

| 工具 | 作用 | 是否需要审批 |
| --- | --- | --- |
| `bash` | 在工作区执行 shell 命令；合并 stdout 与 stderr；输出过长时会截断，完整内容可能写入临时文件 | **需要（Ask）** |
| `read` | 读取 UTF-8 文本；可用 `offset` / `limit` 分段读取；输出带行号 | 否（Always） |
| `write` | 创建文件或整文件重写 | **需要（Ask）**，并提供 diff 预览 |
| `edit` | 按 `old_string` / `new_string` 做定点替换（可一次多处，但不可重叠） | **需要（Ask）**，并提供 diff 预览 |
| `list_dir` | 列出目录下的直接子项（遵循 gitignore，包含点文件） | 否 |
| `view_image` | 将本地图片（png / jpeg / gif / webp）作为多模态内容提供给模型 | 否 |
| `grep` | 按内容搜索（优先使用 managed 或 `PATH` 中的 `rg`，否则使用 fallback） | 否 |
| `find` | 按 glob 查找路径（优先使用 managed 或 `PATH` 中的 `fd`，否则使用 fallback） | 否 |

使用上需要注意：

- 能用专用工具完成的事，优先使用 `grep` / `find` / `list_dir` / `read`，而不是一律改用 `bash`。专用工具有明确的路径边界和输出截断策略；`bash` 更适合管道、环境变量，以及专用工具无法覆盖的命令。
- 对已有文件使用 `write` / `edit` 前，通常需要先完整 `read` 过该文件。这是为了降低在未读取完整内容时直接改写的风险。
- 图片文件请使用 `view_image`，而不是 `read`。
- `bash` 输出有上限（大约最后 2000 行或 50KB）。截断时会尽量将完整输出保存到临时文件。
- 系统中没有 `rg` / `fd` 时，搜索工具会使用启动时同意过的 managed 下载路径，或内置 fallback。这也是[快速开始](/guide/start/getting-started)中建议安装 `rg` / `fd` 的原因。

## 审批面板

权限策略大致分为两类：

- **Always**：直接执行，不弹出审批（读、搜、列目录、查看图片）。
- **Ask**：先弹出审批，同意后再执行（`bash` / `write` / `edit`）。

Ask 工具弹出时，常见选项为：

1. `Yes` — 仅同意本次  
2. `Yes, allow similar requests during this session` — 本会话内同类请求直接允许  
3. `No` — 仅拒绝本次  
4. `No, reject similar requests during this session` — 本会话内同类请求直接拒绝  

操作方式：

- `↑` / `↓` 或数字键切换选项；`Enter` / `y` 确认当前选择；`n` 用于拒绝侧选项（具体以面板高亮为准）
- `Esc` 取消本次审批交互；请求不会继续执行
- `write` / `edit` 会显示文件 diff 预览；内容较长时可进入全屏预览后滚动查看

需要注意：审批面板位于文档尾部区域。如果视口滚到上方查看历史消息，面板可能暂时不在可见范围内。此时界面会给出提示，避免在看不到选项时误操作。

> 调试用的 [`/tool-debug`](/guide/fun/menu/)（需 `debug.enabled = true`）可以预览审批面板界面，但不属于常规使用路径；后续也可能移除或继续完善。

## 轮次上限

一次用户请求中，Agent 可以连续进行多轮工具调用。如果需要限制轮次，可配置：

```toml
[runtime]
# 默认不限制；设置为正整数后，超过该轮次会终止本次请求
tool_max_turns = 32
```

请求重试、idle timeout 等说明见[配置文件](/guide/start/configuration)中的 `[runtime]` 部分。

## 和提示词、上下文的关系

- 当前启用了哪些工具、对应 guidelines 的内容：见 [`/prompt`](/guide/fun/menu/prompt.html) 的 Tools 页签。也可以在该页签中关闭工具；关闭后不会进入下一次新会话的组装结果。
- 工具定义占用的上下文：见 [`/context`](/guide/fun/menu/context.html)。
- 工具结果会进入会话树，因此 [`/tree`](/guide/fun/menu/tree.html) 中可以看到 `tool` 节点；但 [`/copy`](/guide/fun/menu/copy.html) 默认只列出用户消息与助手回复，不会把 tool / reasoning 一并列入拷贝列表。

## 一点使用建议

- 初次使用时，可以先进行只读操作（读文件、搜索），观察模型是否优先使用 `read` / `grep`。
- 修改文件时请查看 diff 预览。`Yes, allow similar…` 可以减少重复确认，也会在本会话内放行后续同类写操作，请按场景选择。
- 对无害且重复的命令，可以使用会话级允许；对删除文件、`git push --force`、修改权限等破坏性操作，建议保持逐次确认。
- 对话内容与工作区文件会发送至第三方 LLM 服务。涉及敏感目录或密钥文件时，请自行避免或在指令文件中加以约束。
