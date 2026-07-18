---
description: Hunea 如何加载 models.toml、config.toml、phrases.toml：全局与项目路径、合并规则与便携模式
---

# 配置文件

Hunea 通过三个 TOML 文件进行配置：

| 文件 | 作用 |
| --- | --- |
| [`models.toml`](/guide/start/configuration/models) | 供应商与模型 |
| [`config.toml`](/guide/start/configuration/config) | TUI 与 runtime 等行为 |
| [`phrases.toml`](/guide/start/configuration/phrases) | 等待回复时的提示文案 |

## 放置位置与合并规则

可放在：

- 用户级（全局）：`~/.config/hunea/`
- 项目级：当前工作区下的 `.hunea/`

两者同时存在时，**项目级覆盖用户级**。修改配置后需要重启 hunea 才会生效。

如果没有特殊需要，`models.toml` 等优先写在全局，这样切换工作区后，已有配置和模型选择仍能生效。

补充：如果工作区 `.hunea/` 下存在 `portable.marker`，会进入便携模式，只读该工作区的配置/会话，不再叠加全局 `~/.config/hunea/`。首次启动若全局配置目录不可用，precheck 也可能引导你创建这个标记。

> 代码仓库中的 `*.example.toml` 在一定程度上可能落后于本文档，因此建议以当前文档为准。

## 分文件说明

- [`models.toml`](/guide/start/configuration/models)：供应商与模型
- [`config.toml`](/guide/start/configuration/config)：TUI 与 runtime 等行为
- [`phrases.toml`](/guide/start/configuration/phrases)：等待回复时的提示文案
