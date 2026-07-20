---
description: 状态栏新增 context-used 与 context-remaining，在请求成功后显示上下文窗口已用/剩余百分比
---

# 状态栏添加上下文使用率

- **日期**：2026-07-16
- **提交**：`feat(tui): 为 statusline 添加上下文使用率类别`
- **版本**：`0.11.1-alpha.4`

状态栏新增两个可选项目，用于显示当前上下文窗口的使用情况。

## 配置

```toml
[tui]
status_line = [
  "current-dir",
  "current-model",
  "context-used", # [!code highlight]
  "context-remaining", # [!code highlight]
]
```

| 配置值 | 显示示例 | 说明 |
| --- | --- | --- |
| `context-used` | `Context 42% used` | 最近一次成功请求后的已用百分比 |
| `context-remaining` | `Context 58% left` | 最近一次成功请求后的剩余百分比 |

效果如下：

![context-used-remaining](/assets/changelog/context-used-remaining.png)

## 行为说明

1. 数值来自请求完成时返回的 `context_usage`，获取后刷新状态栏显示。
2. **`/resume` 恢复会话**和**`/clear` 清空当前对话**时会重置显示，避免将上一个会话的百分比带入新上下文。
3. 遵循与其他状态栏项目相同的规则：不配置则不显示；配置后若暂时无法获取数据，该位置也不会保留空行。

上下文窗口总容量仍由 `models.toml` 解析规则决定（`model_profiles` → `defaults` → 内置），配置参考见 [models.toml](/guide/start/configuration/models) 与 [`/context`](/guide/fun/menu/context)。
