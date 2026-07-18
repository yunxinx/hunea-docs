---
description: 了解 Hunea 内置的斜杠菜单及其功能
---

# 前言

Hunea 内置了一些 `斜杠菜单`。在输入框为空时输入 `/`，就会弹出菜单项，效果如下：

![menu](/assets/fun/menu.png)

> 说明：当前 Hunea 只支持**输入框为空**时触发斜杠菜单；输入框里已有内容时，键入 `/` 不会打开这份菜单。后续可能会进行优化。

然后可以用键盘上下方向键移动，或者继续键入来过滤/匹配想要的菜单项，选中后按 `Enter`，即可触发对应功能。

当前 Hunea 内置的斜杠菜单如下（点击 **命令** 列可跳转到对应文档）：

| 命令 | 别名 | 作用 |
| --- | --- | --- |
| [`/exit`](/guide/fun/menu/quit) | `/quit` | 退出应用 |
| [`/resume`](/guide/fun/menu/resume) | — | 恢复此前的会话 |
| [`/context`](/guide/fun/menu/context) | — | 查看下一轮上下文占用情况（估算） |
| [`/copy`](/guide/fun/menu/copy) | — | 挑选消息并复制 |
| [`/resend`](/guide/fun/menu/resend) | — | 回填此前已发送的消息 |
| [`/tree`](/guide/fun/menu/tree) | — | 精确回溯到某个消息节点（默认模式） |
| [`/sends-back`](/guide/fun/menu/sends-back) | — | 编辑某轮某条用户消息（与 `/tree` 互斥，见下方说明） |
| [`/models`](/guide/fun/menu/models) | — | 为当前会话选择模型 |
| [`/prompt`](/guide/fun/menu/prompt) | — | 查看下一次新会话的提示词组装情况 |
| [`/clear`](/guide/fun/menu/clear) | `/new` | 清空当前对话上下文 |

## 补充说明

- **`/tree` 与 `/sends-back`**：二者不会同时出现在菜单中，并且与空输入框连按两次 `Esc` 的行为是配合使用的，而不是重复提供同一入口。默认 `esc_rewind_mode = "coarse"` 时：菜单显示 `/tree`；空输入框连按两次 `Esc` 会进入「按某轮用户消息编辑/重发」的交互（截断该条之后的内容，并将正文回填到输入框，与 `/sends-back` 相同）。若将配置改为 `esc_rewind_mode = "entry"`（位于 `[tui]` 节下）：菜单改为显示 `/sends-back`，连按两次 `Esc` 则打开 `/tree`。也就是说，菜单项与双击 `Esc` 分别对应两种回溯方式，修改配置只是交换快捷键入口与菜单入口。我把它们拆开，是为了各自对应更合适的使用场景，而不是合并成同一个命令。
- **`/tool-debug`**：仅在开启 debug 命令时出现，用于预览 tool approval 面板，不属于常规用户命令，所以不放进上表。后续也可能会移除，或者继续完善。
- **别名**：输入补全时，`/quit` 会落到 `/exit`；同理 `/new` 会落到 `/clear`。这样做是为了方便从其他 CLI 产品过渡到 Hunea，这两个命令很常用，我自己在不同 CLI 之间切换时总被名字卡一下手，所以在 Hunea 里做了别名。后续可能会放开别名自定义，甚至考虑“宏”（一个命令串起多个动作）不过这个更偏扩展场景了，等到时候再考虑一下如何设计了。
