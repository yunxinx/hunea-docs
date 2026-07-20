---
description: 新增 command_menu_mode 配置命令菜单触发方式（slash/floating/both），并加入 Ctrl+O 悬浮命令菜单与可配置显示行数 command_menu_rows
---

# 命令菜单触发方式可配置

- **日期**：2026-07-20
- **提交**：`feat(tui): 命令菜单触发方式可配置`
- **版本**：`0.12.1-alpha.2`

此前斜杠命令菜单只能通过在空输入框输入 `/` 触发。本次更新新增了一个悬浮命令菜单，并让触发方式变得可配置：你可以选择保留 `/` 内联触发、改用 `Ctrl+O` 悬浮触发，或两者同时启用。

## 主要变化

1. **新增 `command_menu_mode` 配置**  
   控制命令菜单的触发方式，可选三档：
   - `"slash"`（默认）：仅在输入框以 `/` 开头时内联触发斜杠命令菜单，与旧行为一致。
   - `"floating"`：`/` 不再触发菜单（视为普通文本），改由 `Ctrl+O` 打开悬浮命令菜单。
   - `"both"`：两种方式同时可用，`/` 内联菜单与 `Ctrl+O` 悬浮菜单互不干扰。

2. **新增 `Ctrl+O` 悬浮命令菜单**  
   悬浮菜单支持上下滚动，命令较多时浮窗右侧会显示滚动条；除键盘外还支持鼠标单击选中与滚轮翻看。适合希望把 `/` 当作普通字符输入、或更喜欢用固定快捷键唤出命令的场景。效果如下：

   ![menu-2](/assets/fun/menu-2.png)

3. **新增 `command_menu_rows` 配置**  
   控制 `Ctrl+O` 悬浮菜单一次显示的命令行数，超出的部分可滚动查看。取值范围 `7..21`，默认 `7` 行。

## 配置方式

在 `config.toml` 的 `[tui]` 段中配置：

```toml
# slash / floating / both，默认 slash
command_menu_mode = "slash"

# 悬浮菜单一次显示的命令行数，范围 7..21，默认 7
command_menu_rows = 7
```

| `command_menu_mode` | `/` 触发内联菜单 | `Ctrl+O` 悬浮菜单 |
| --- | --- | --- |
| `slash`（默认） | 是 | 否 |
| `floating` | 否（`/` 为普通文本） | 是 |
| `both` | 是 | 是 |

更多按键说明见[快捷键一览](/guide/fun/shortcuts)，命令列表见[斜杠菜单前言](/guide/fun/menu/preface)。
