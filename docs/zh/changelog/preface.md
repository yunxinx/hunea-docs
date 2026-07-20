---
description: Hunea 更新日志总览页面：按时间从新到旧浏览近期影响使用体验的 TUI、运行时与交互相关产品变更
---

# 更新日志

:::important 声明！
需要着重指出的是，截止 2026 年 7 月 20 日，所有的关于 TUI 样式和 Hunea 功能的更新，都是我个人"观察"后修改的结果！所以可能对于某些场景，比如及其细微的 TUI 渲染交互体验，我可能一时没有测试观察到，就没有及时优化或者修复，敬请见谅。这个情况可能会持续较长的一段时间，如果后续有反馈建议，我会在适当的时候撤销此通知。
:::

这里记录 Hunea 近期所有面向使用体验的变更。

当前工作区版本为 `0.12.1-alpha.2`，以仓库 `Cargo.toml` 中 `workspace.package.version` 为准。左侧列表按时间从新到旧排列，点击进入可查看完整说明。

> 如果只需查阅配置项，可直接查看 [config.toml](/guide/start/configuration/config) 与 [快捷键一览](/guide/fun/shortcuts)。

## 近期条目

| 日期 | 条目 | 版本 |
| --- | --- | --- |
| 2026-07-20 | [命令菜单触发方式可配置](/changelog/command-menu-mode) | `0.12.1-alpha.2` |
| 2026-07-19 | [统一 prose 换行为 UAX #14](/changelog/uax14-linebreak) | `0.12.1-alpha.1` |
| 2026-07-17 | [滚轮平滑滚动与滚动手感优化](/changelog/smooth-scroll) | `0.11.1-alpha.6` |
| 2026-07-17 | [fenced 代码块无背景回退样式统一](/changelog/code-block-fallback) | `0.11.1-alpha.6` |
| 2026-07-17 | [非贴底保留视口与左侧提示](/changelog/attention-pill) | `0.11.1-alpha.5` |
| 2026-07-16 | [请求超时改为 idle 空闲超时](/changelog/idle-timeout) | `0.11.1-alpha.4` |
| 2026-07-16 | [状态栏添加上下文使用率](/changelog/context-statusline) | `0.11.1-alpha.4` |
| 2026-07-16 | [工具级启用/禁用](/changelog/tool-enablement) | `0.11.1-alpha.3` |

配置类变更以文档站当前的 [config.toml](/guide/start/configuration/config) 为准；若示例文件滞后，以实际代码与对应条目描述为准。后续新增用户可见变更，会继续按清晰说明变更内容的粒度添加到列表中。
