---
description: 了解 Hunea 的安装和使用方式
---

# 快速开始

:::danger 注意
当前 Hunea 正处于 alpha 开发版本，后续更新不保证数据迁移兼容性，多数情况下是非兼容式的“破坏性”更新，以此保证项目初期架构的简洁准确，避免积累历史包袱。因此不建议存储重要的聊天数据（你可以自行手动导出，数据目录位于标准的 ~/.config/hunea/ 目录下），以预防数据丢失或不兼容问题。
:::

你可以使用 npm 下载安装，需要注意的是，当前需要安装 alpha 版本：

```bash
npm i -g hunea@alpha
```

不要直接安装：

```bash
npm i -g hunea
```

这样会安装到旧版本。

> 其中 -g 表示全局安装，安装好后就可以在任意路径执行启动 Hunea（只要 npm 环境配置正确，一般都能成功）。如果你不太清楚 npm 是什么，建议阅读[慢速开始](/guide/start/slow/index)

Hunea 目前还在开发，暂未有正式版本，主要精力都花在打磨 TUI 的稳定性、流畅性、美观度和易用性上。核心功能也是最近这段时间才整合完成，我希望能把易用性基础打牢，提供流畅稳定的体验。

Windows 上建议使用系统自带的 Windows Terminal（最好有 bash 环境；目前 Windows 还没做针对性优化，所以 powershell 和 cmd 的兼容性暂无法保证），macOS 推荐使用 kitty 或 Ghostty 这类更现代的终端模拟器，不推荐用系统内置的 Terminal（cx 主题目前还有样式问题未优化）。Linux 用户可以按个人喜好选择，同样推荐使用现代终端模拟器以获得最佳效果。

## 启动

安装完成后，建议你先进入想要工作的项目目录，然后在终端中执行 `hunea` 命令启动。初次启动时，如果系统 PATH 中找不到 `fd` 和 `rg`，且 Hunea 数据目录（`~/.config/hunea/`）中也没有这两个工具，会弹出询问是否下载：

![rg-install-ask](/assets/start/rg-install-ask.png)

![fd-install-ask](/assets/start/fd-install-ask.png)

建议下载和使用 `fd` 和 `rg` 而非内置的 fallback 选项。

> 除非是离线环境且无法自行下载上传 `fd` 和 `rg` 二进制文件到指定目录下 `~/.config/hunea/bin/`

至于为什么没有使用其他的工具，是因为还在评估，后续可能会考虑使用其他的工具。

如果没有什么意外的情况，在需要的工具准备就绪后，便会启动 Hunea 并进入 TUI 界面：

![start-tui](/assets/start/start-tui.png)

## 配置供应商和模型

可以在 `~/.config/hunea/` 或者当前打开的工作区目录下的 `.hunea/` 目录下创建 `models.toml` 配置文件来配置供应商和模型。

其中前者是全局的，后者是当前工作区生效的，并且工作区的优先级大于全局配置。但是如果没有特殊需要，优先在全局配置，这样可以在切换工作区后，已有的配置和模型选择能够正确生效。

建议创建好配置文件后，复制下面的示例进行修改：

```toml
// 其中 pure 可以改为自己喜欢的命名
// 注意命名不要重复
[providers.pure]
// 表示是否启用此供应商，可以只配置，但是不启用
enabled = true
// 当前实际可用于对话的 kind 主要是：
// openai_compatible / openai_responses
// （其它名称可能仍可写入配置，但请求阶段会返回 unsupported）
kind = "openai_responses"
// 这里调整的是显示名字，类似别名那种
display_name = "Pure"
// 配置该供应商的密钥
api_key = "sk-xxx"
// 配置 baseurl，需要带上 /v1 后缀
base_url = "https://xxx/v1"
// 可选：如果没有配置可以在 /models 界面同步
// 配置了此项，则无需网络同步可以直接选择和使用
models = ["xxx"]
```

更完整的 `models.toml` 字段说明、上下文窗口配置，以及 `config.toml` / `phrases.toml`，见[配置文件](/guide/start/configuration)。

配置好后就可以重启 Hunea，然后输入使用 `/models` 斜杠命令打开模型选择 TUI 菜单进行模型的选择：

![select-model](/assets/start/select-model.png)

选中需要的模型后使用 Enter 按键确认选择，便可以开始使用了。

## 推荐配置

对于 `config.toml`，一般不需要做太多配置，默认值已经适合绝大部分使用情况。完整字段说明见[配置文件](/guide/start/configuration)。

我个人自用的配置文件如下：

```toml
[tui]
status_line = ["current-dir", "current-model", "throughput", "latency"]
show_esc_interrupt_hint = false
show_reasoning_content = true
reasoning_content_display = "expanded-simplified"
```

`phrases.toml` 我个人使用的是内置默认的提示；完整示例与说明同样见[配置文件](/guide/start/configuration)。

## 下一步

到目前为止，安装、启动和基本配置已经足够开始使用了。如果需要继续了解，可以按需阅读：

- [配置文件](/guide/start/configuration)：`models.toml` / `config.toml` / `phrases.toml` 的完整说明
- [斜杠菜单](/guide/fun/menu/index)：内置命令与会话相关交互
- [工具与审批](/guide/fun/tools)：Agent 可调用的工具，以及需要审批的操作
- [技能与指令文件](/guide/fun/skills)：`$skill`、`AGENTS.md` / `CLAUDE.md` 如何参与提示词组装
- [快捷键一览](/guide/fun/shortcuts)：主界面、输入框与覆盖层的常用按键
- [设计与取舍](/guide/fun/designs/)：altscreen 与输入框等设计说明
