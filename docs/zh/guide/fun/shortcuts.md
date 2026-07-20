---
description: Hunea 常用快捷键一览：覆盖输入框发送、斜杠菜单、全屏面板导航、Esc 回溯以及工具审批等交互场景
---

# 快捷键一览

Hunea 的按键分布在输入框、斜杠菜单、各类全屏面板和审批界面中。各功能页已有说明，本页汇总常用快捷键，便于查阅。

> 终端模拟器、tmux 或远程会话也可能拦截部分组合键。如果某个按键没有反应，可先确认是否被外层环境占用；也可以检查 `keyboard_enhancement`（`auto` / `on` / `off`）是否需要显式关闭。

## 主界面 / 输入框（composer）

默认发送语义如下（可用 `swap_enter_and_send` 交换 Enter 与 Shift+Enter / Ctrl+J）：

| 按键 | 作用 |
| --- | --- |
| `Enter` | 发送草稿（开启交换后改为换行） |
| `Shift + Enter` / `Ctrl + J` | 换行（开启交换后改为发送） |
| `Alt + Enter` / `Ctrl + M` | 换行（不受交换影响；部分旧终端中 `Ctrl + M` 会表现为普通 Enter） |
| `Ctrl + C` | 有草稿时默认清空草稿（`ctrl_c_clears_input`）；空输入时进入退出确认 |
| `Esc` | 流式输出中：按 `esc_interrupt_presses`（默认 2）次中断当前请求；空输入且无流式输出时：连按两次进入回溯（见下） |
| `Ctrl + G` | 使用外部编辑器编辑当前草稿 |
| `Ctrl + R` | 打开全局消息历史（与 [`/resend`](/guide/fun/menu/resend) 同类） |
| `Ctrl + O` | 打开悬浮命令菜单（需 `command_menu_mode` 为 `floating` 或 `both`） |
| `Ctrl + T` | 打开 transcript 全屏详情 |
| `Ctrl + Z` / `Ctrl + Y` | 草稿撤销 / 粘贴最近一次 kill 内容 |
| `PageUp` / `PageDown` | 优先滚动文档，再处理输入框内翻页 |
| 鼠标滚轮 | 滚动主文档；手感由 `scroll_animation` 控制 |

空输入框、且当前**没有**流式输出时，连按两次 `Esc`：

| `esc_rewind_mode` | 双击 `Esc` 的行为 | 斜杠菜单显示 |
| --- | --- | --- |
| `coarse`（默认） | 按某轮用户消息编辑/重发（与 `/sends-back` 相同） | `/tree` |
| `entry` | 打开 `/tree` | `/sends-back` |

编辑类按键贴近 readline（如 `Ctrl + A/E/B/F/K/U/W`、按词移动与删除等），细节见[输入框](/designs/composer)。

### 前缀浮窗

| 前缀 | 作用 |
| --- | --- |
| `/`（输入框为空时输入） | [斜杠菜单](/guide/fun/menu/preface) |
| `@` | 文件 / 图片路径 |
| `$` | [技能](/guide/fun/skills) |
| `#` | 自定义 prompt |

浮窗内常见操作：继续输入进行过滤，`↑` / `↓` 移动，`Tab` 补全或确认，`Enter` 选中，`Esc` 关闭。

## 斜杠菜单

默认在空输入框输入 `/` 即可内联触发。可通过 `command_menu_mode`（`slash` / `floating` / `both`）改变触发方式：`floating` 下 `/` 为普通文本，改用 `Ctrl+O` 唤出悬浮菜单；`both` 两者同时可用。悬浮菜单一次显示行数由 `command_menu_rows`（默认 7）控制，超出部分可滚动。
| 按键 | 作用 |
| --- | --- |
| `↑` / `↓` | 移动 |
| 继续输入 | 过滤 / 匹配 |
| `Tab` | 补全到当前匹配项 |
| `Enter` | 执行 |
| `Esc` | 关闭菜单 |

`Ctrl+O` 悬浮菜单还支持鼠标：单击命令行即选中并触发，命令超出可见行数时可在浮窗上滚动鼠标滚轮翻看。

完整命令列表见[斜杠菜单前言](/guide/fun/menu/preface)。

## 会话恢复 `/resume`、消息复制 `/copy`、历史 `/resend`

这类全屏列表的导航方式相近（以界面底部提示为准）：

| 按键 | 常见作用 |
| --- | --- |
| `↑` / `↓` 或 `j` / `k` | 移动 |
| `←` / `→` 或 `h` / `l` | 按页翻动或其他横向相关操作（视面板而定） |
| `/` | 进入搜索（部分面板） |
| `Space` | 预览 |
| `Enter` | 确认（恢复会话 / 复制 / 回填等） |
| `Esc` | 返回或关闭 |
| `Tab` | `/copy` 等多选场景下的选中切换 |

## 会话树 `/tree`

| 按键 | 作用 |
| --- | --- |
| `↑` / `↓` 或 `j` / `k` | 移动节点 |
| `←` / `→` 或 `h` / `l` | 按页翻动 |
| `Space` | 预览当前节点 / 分支内容 |
| `Tab` | 存在多个兄弟分支时打开分支选择 |
| `A` | 打开完整 Branch Tree |
| `Enter` | 回溯到可恢复节点，或切换分支 |
| `Esc` | 逐级返回 / 关闭 |

更细的分层操作（分支预览、Branch Tree）见 [`/tree`](/guide/fun/menu/tree)。

## 用户消息回溯（默认双击 Esc / `/sends-back`）

| 按键 | 作用 |
| --- | --- |
| `←` / `→` | 在用户消息之间切换（仅用户消息，不含 assistant / tool） |
| `↑` / `↓`、`PgUp` / `PgDn`、`Home` / `End` | 滚动查看，不切换选中项 |
| `Enter` | 截断该条之后的内容，并将该用户消息回填到输入框（不会自动发送） |
| `Esc` / `Ctrl + T` / `Ctrl + C` | 关闭覆盖层，不修改会话 |

详见 [`/sends-back`](/guide/fun/menu/sends-back)。

## Transcript 全屏（`Ctrl + T`）

| 按键 | 作用 |
| --- | --- |
| `j` / `k`、方向键、`Ctrl + U/D`、`PgUp` / `PgDn`、`Home` / `End` | 滚动 |
| `Esc` / `q` / `Ctrl + C` / `Ctrl + T` | 关闭 |

## 工具审批

| 按键 | 作用 |
| --- | --- |
| `↑` / `↓` | 在 Yes / No 及会话级选项之间移动 |
| `Enter` / `y` | 确认当前选项（`y` 偏向同意侧） |
| `n` | 拒绝侧 |
| `Esc` | 取消本次审批交互 |
| 全屏 diff 预览中的翻页键 | 查看 `write` / `edit` 的变更内容 |

选项含义与面板不可见时的提示，见[工具与审批](/guide/fun/tools)。

## 模型 / 提示词等其它面板

- [`/models`](/guide/fun/menu/models)：直接输入进行过滤，`Enter` 选中；`U` 刷新模型列表（若供应商支持）  
- [`/prompt`](/guide/fun/menu/prompt)：双栏与页签；`Space` 预览单项，`p` 查看组装结果，`?` 查看该面板帮助，`Ctrl + G` 可用外部编辑器编辑正文  

各面板底部通常会显示当前上下文的操作提示。具体操作以界面提示为准；本页只汇总最常用的按键。

## 一点使用建议

- 建议先熟悉：`Enter` 发送、`Ctrl + J` 换行、`Ctrl + G` 外部编辑、`Ctrl + R` 历史、`Ctrl + T` 详情、空输入双 `Esc` 回溯。  
- 其它面板可优先查看底部操作提示。  
- 组合键异常时：可更换现代终端模拟器（如 kitty / Ghostty / Windows Terminal），检查 tmux 前缀键，或尝试 `keyboard_enhancement = "off"`。
