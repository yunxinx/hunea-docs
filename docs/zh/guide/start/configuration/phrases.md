---
description: Hunea phrases.toml：等待 AI 回复时的提示文案 mode、order 与自定义 phrases 示例
---

# phrases.toml

出于趣味性而设计，用来控制在等待 AI 回复消息时显示的文案。放置位置与 `models.toml`、`config.toml` 相同。

示例配置如下：

```toml
# mode = "append" 保留内置短语并追加自定义短语。
# mode = "override" 仅使用下方列出的短语。
mode = "append"

# order = "random" 每次请求随机选择一条短语。
# order = "cycle" 按顺序依次循环使用短语。
order = "random"

phrases = [
  "Reading context",
  "Thinking through it",
  "Checking the edges",
]
```

我个人使用的是内置默认的提示，而且这个功能实现后我并没有进行测试，如果需要可以尝试使用，如有问题可以开 Issue 进行反馈。

相关页面：

- [配置总览](/guide/start/configuration/preface)
- [`models.toml`](/guide/start/configuration/models)
- [`config.toml`](/guide/start/configuration/config)
