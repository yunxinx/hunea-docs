---
description: /prompt 查看并调整下一次新会话的提示词组装结果，包括指令、技能、工具指南以及自定义来源的启停
---

# /prompt

使用 `/prompt` 可以查看、预览并调整**下一次新会话**的提示词组装结果。

这是 Hunea 比较核心的功能，目前已经可以正常使用，后续还会继续打磨完善。

当你需要确认系统提示由哪些来源拼接而成、临时开关某段指令/技能/工具指南、新增自定义提示词，或者想先预览最终完整的系统提示词再修改，都可以打开它。输入 `/prompt` 确认后，会打开一个全屏面板，标题是 `Prompt Assembly`。

> 菜单描述是 *Inspect prompt assembly for the next new session*（检查下一次新会话的提示词组装）。多数改动**不会回写当前会话已经开始过的 `transcript`（会话记录）**；它们面向“下一次新会话”。若当前会话还是空会话，关闭并落盘后也可能直接作用于当前空会话（见下方「关闭之后会发生什么」）。

## 面板概览

`/prompt` 是左右分栏的管理器，不是单列表：

1. **标题行**：左侧是 `Prompt Assembly`（提示词组装），右侧是四个候选页签
2. **左栏 `Active`（已装配）**：已经进入“下一次新会话装配结果”的来源列表
3. **右栏（候选 / 库存）**：还没全部进入装配，或可切换启停的候选集合
4. **底部分页线**：显示当前焦点侧的位置，例如 `Active (2 of 8)`（已装配，第 2 条 / 共 8 条）
5. **底部操作提示**：会随当前选中项变化；最右侧常有 `? more`（更多）

大致效果如下图所示：

![prompt](/assets/fun/prompt.png)

### 左栏：`Active`（已装配）

表头列大致是：

`Sel · Ord · Source · Type · Scope`

| 列 | 含义 |
| --- | --- |
| `Sel`（选择） | 是否启用（勾选态） |
| `Ord`（顺序） | 在装配结果中的顺序 |
| `Source`（来源） | 标题 / 名称；必要时会附带 `missing`（缺失）、`shadowed`（被遮蔽）、`+N shadowed`（另有 N 条被遮蔽）等标记 |
| `Type`（类型） | 来源类型，见下表 |
| `Scope`（作用域） | 作用域，常见为 `project`（项目）/ `global`（全局）；内置项为单独存在 |

`Type`（类型）大致对应：

| 显示 | 大致是什么 |
| --- | --- |
| `system`（系统） | 核心系统提示（内置默认，可被 `global`（全局）/ `project`（项目）的 `override`（覆盖）改写） |
| `instructions`（指令） | 指令文件，如全局 `AGENTS.md`、项目 `AGENTS.md` / `CLAUDE.md` |
| `custom`（自定义） | 自定义 `extra prompt`（额外提示词） |
| `discovery`（发现） | 技能发现片段（生成型） |
| `skill`（技能） | 长期注入型 `skill`（技能） |
| `tools`（工具） | 工具使用指南（生成型） |
| `dynamic`（动态） | 动态环境信息（基线 / 变化） |

当前焦点行左侧会有色块标记。若某条下面还“盖住”了同名/同键其他来源，可能显示 `+N shadowed`（另有 N 条被遮蔽）；按 `Ctrl + E` 可展开/收起这些被遮蔽明细。

### 右栏：四个页签

右上角页签（默认先落在 `Skill`（技能））：

| 页签 | 内容 |
| --- | --- |
| `Skill`（技能） | 已发现的长期 `skill`（技能）候选 |
| `Custom Prompts`（自定义提示词） | 自定义 `prompt`（提示词）候选；可新建 |
| `Tools`（工具） | 工具相关候选 / 指南片段 |
| `Dynamic`（动态） | 动态环境来源；可分别勾 `Base`（基线）/ `Change`（变化） |

不同页签的表头会略有不同，例如：

- `Skill`（技能）/ `Tools`（工具）：`Sel`（选择）· `Ord`（顺序）· `Name`（名称）· `Scope`（作用域）
- `Custom Prompts`（自定义提示词）：`Sel`（选择）· `Name`（名称）· `Scope`（作用域）
- `Dynamic`（动态）：`Base`（基线）· `Change`（变化）· `Source`（来源）· `Scope`（作用域）

## 怎么操作

### 焦点与导航

- `←` / `→`，或者 `h` / `l`：在左右栏之间切换焦点  
  （在 `Dynamic`（动态）页签上，左右也可能用于在 `Base`（基线）/ `Change`（变化）列之间移动）
- `↑` / `↓`，或者 `j` / `k`：上下移动选中项
- `PageUp` / `PageDown`：按页翻动
- `Home` / `End`：跳到当前列表首尾
- `Tab` / `Shift + Tab`：焦点在右栏时，循环切换右上角页签
- `?`：打开/关闭更多快捷键说明（`More`（更多）浮层）
- `Esc`：关闭 `/prompt` 面板（会触发后续提交/落盘流程，见后文）

也可以用鼠标：

- 点右上角页签：切到对应候选页
- 点左右列表行：切换焦点并选中该行

### 预览

- `Space`：预览**当前选中项**的正文（单条 `source`（来源）/ `skill`（技能）/ `tool`（工具）/ `dynamic`（动态）等）
- `p`：预览**整段已装配**的 `system prompt`（系统提示词）（标题类似 `Assembled prompt`（已装配提示词））

在预览界面里：

- `Esc` / `Space` / `p`：退回主面板
- `↑` / `↓` / `←` / `→`，以及 `h` / `j` / `k` / `l`：翻页查看更长内容

大致效果如下图所示：

![prompt-preview](/assets/fun/prompt-preview.png)

![prompt-assembled](/assets/fun/prompt-assembled.png)

### 编辑、启停、排序

底部提示会随选中项变化，常用动作：

| 快捷键 | 作用 |
| --- | --- |
| `e` | 用外部编辑器打开当前可编辑项（页脚也可能写成 `e/ctrl+g edit`（编辑）） |
| `a` | 新建自定义 `prompt`（提示词）（先选 `Project`（项目）/ `Global`（全局）作用域） |
| `d` | 删除当前可删除项 |
| `x` | 切换启用/禁用（页脚常显示为 `x disable`（禁用）） |
| `J` / `K`（Shift） | 在 `Active`（已装配）侧调整顺序（上/下） |
| `r` | 视选中项而定：恢复核心 `system override`（系统覆盖），或重置 `discovered skill`（已发现技能）顺序 |
| `Ctrl + E` | 展开/收起 `shadowed`（被遮蔽）明细 |

不是每一行都支持全部动作。例如：

- 核心 `system`（系统）、指令文件、生成型 `discovery`（发现）/ `tools`（工具）/ 某些 `dynamic`（动态）来源，通常**不能**像自定义 `prompt`（提示词）那样直接 `d` 删掉
- 只有可编辑来源才会出现 `e`
- 只有 `Active`（已装配）侧、且允许重排时，才会看到 `J/K reorder`（重排）

### 新建自定义 `prompt`（提示词）

在右栏 `Custom Prompts`（自定义提示词）相关上下文里按 `a`：

1. 先弹出作用域选择：`[Project] Global`（当前为项目，可选全局）或 `Project [Global]`（当前为全局，可选项目）
2. `←` / `→`（或 `h` / `l`）切换作用域
3. `Enter` 确认，`Esc` 取消
4. 确认后会进入外部编辑器写正文；保存退出后写回对应 `scope`（作用域）

大致效果如下图所示：

![prompt-create](/assets/fun/prompt-create.png)

## 这些来源分别是什么

可以把左栏理解成“下一轮新会话会带上的 `system`（系统）拼装清单”，常见来源包括：

1. **`Core system prompt`（核心系统提示词）**  
   Hunea 内置的核心行为说明。可用 `global`（全局）/ `project`（项目）的 `override`（覆盖）改写；选中后可用 `r` 尝试恢复默认核心提示词，用于在修改混乱后一键复原。

2. **`Instructions`（指令）文件**  
   - 全局：数据目录下的 `AGENTS.md`（一般是 `~/.config/hunea/AGENTS.md`）  
   - 项目：工作区/仓库向上查找的 `AGENTS.md` 或 `CLAUDE.md`（同目录时通常优先 `AGENTS.md`）

3. **`Custom prompts`（自定义提示词）**  
   你自己维护的额外 `prompt`（提示词）片段。项目级通常落在 `.hunea/prompts/custom/`，并由 `.hunea/prompt-assembly.toml` 记录装配状态。

4. **`Skill discovery`（技能发现）/ `long-lived skills`（长期技能）**  
   技能发现片段，以及可长期注入的 `skill`（技能）。和会话里临时 `@` / `$skill` 一类“这一轮才挂上”的注入不是同一件事。

5. **`Tool guidelines`（工具使用指南）**  
   根据当前可用工具生成的工具使用说明。

6. **`Dynamic environment`（动态环境）**  
   环境信息：  
   - `Base`（基线）：更偏首轮基线  
   - `Change`（变化）：更偏后续轮次的变化增量  
   右栏 `Dynamic`（动态）页可分别勾选。

## 遮蔽 `shadowed`是什么意思

同名或同冲突键的来源可能同时存在于 `project`（项目）/ `global`（全局）/ `builtin`（内置）等层级。装配时通常只会让**更高优先级**的那条真正生效，其余会被标成 `shadowed`（被遮蔽）。

优先级大致是：

`project`（项目） > `global`（全局） > `builtin`（内置）

因此你可能在列表里看到某条 `Active`（已装配）项附带 `+1 shadowed`（另有 1 条被遮蔽），表示下面还有被盖住的同键来源。用 `Ctrl + E` 展开后可以核对“到底生效的是哪一层”。

## 关闭之后会发生什么

按 `Esc` 关闭 `/prompt` 时，Hunea 会尽量把本次面板里的工作副本提交/落盘，而不是“只看一眼就丢”。

提交成功后的提示，取决于生效范围：

| 情况 | 常见反馈 |
| --- | --- |
| 主要影响下一次新会话 | `toast`（轻提示）：`Prompt updated. Applies to next new session.`（提示词已更新，将作用于下一次新会话） |
| 当前仍是空会话，可直接更新当前会话装配 | 系统消息：`Prompt updated for current empty session.`（已为当前空会话更新提示词） |

需要注意：

- **已经聊过内容的当前会话**，一般不会因为你在 `/prompt` 里改装配，就把历史 `transcript`（会话记录）整段重写一遍。
- 想让多数改动完整进入下一轮对话，更稳妥的是：关闭 `/prompt` 后，用 `/clear`（别名 `/new`）开一条新会话。
- 若打开 `/prompt` 时根本没成功进入编辑会话（例如 begin 失败），面板可能被直接关掉且不走提交流程。

## 配置会落在哪里

项目级常见位置：

```text
.hunea/prompt-assembly.toml
.hunea/prompts/
.hunea/prompts/custom/
```

全局侧则与 Hunea 数据目录相关（一般是 `~/.config/hunea/`），例如全局 `AGENTS.md`、以及全局 `prompt assembly`（提示词组装）状态（由 `session store`（会话存储）/ 数据目录管理，而不是只靠当前工作区文件）。

你不必手工先把所有文件写齐才用 `/prompt`：很多自定义项可以在面板里用 `a` / `e` 创建和编辑，再由 Hunea 写回。

## 和相邻命令的区别

| 你想做的事 | 更合适的命令 |
| --- | --- |
| 查看/调整“下一轮新会话”的 `system`（系统）拼装清单 | `/prompt` |
| 看上下文大概占了多少、还剩多少 | [`/context`](/guide/fun/menu/context) |
| 切换当前会话模型 | [`/models`](/guide/fun/menu/models) |
| 清空当前对话、开一条新会话 | `/clear`（别名 `/new`） |
| 从当前会话拷用户/助手消息 | [`/copy`](/guide/fun/menu/copy) |

`/context` 回答的是“预算还剩多少”；`/prompt` 回答的是“这些预算里的 `system`（系统）侧，究竟由哪些来源拼出来、能不能改”。

## 一点使用建议

- 只想确认“下一轮到底会带上什么”：打开后按 `p` 看 `Assembled prompt`（已装配提示词），通常比一条条点开更快。
- 项目有 `AGENTS.md` / `CLAUDE.md` 却感觉没生效：到左栏找 `instructions`（指令），看是 `missing`（缺失）、被 `disabled`（已禁用），还是被更高优先级来源 `shadowed`（被遮蔽）。
- 想给当前仓库单独加一段长期说明：右栏切到 `Custom Prompts`（自定义提示词），`a` 选 `Project`（项目），写完后确认它出现在左栏 `Active`（已装配）列表里。
- 改完顺序或开关后，先 `p` 预览，再 `Esc` 关闭落盘；需要立刻在干净上下文里验证时，再 `/clear` 开新会话。
- 快捷键记不全时，按 `?` 看 `More`（更多），比猜页脚缩写更省事。
