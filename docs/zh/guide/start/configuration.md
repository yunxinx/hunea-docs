---
description: 说明 Hunea 的 models.toml、config.toml、phrases.toml 配置文件位置、字段与示例
---

# 配置文件

Hunea 通过三个 TOML 文件进行配置：

| 文件 | 作用 |
| --- | --- |
| `models.toml` | 供应商与模型 |
| `config.toml` | TUI 与 runtime 等行为 |
| `phrases.toml` | 等待回复时的提示文案 |

## 放置位置与合并规则

可放在：

- 用户级（全局）：`~/.config/hunea/`
- 项目级：当前工作区下的 `.hunea/`

两者同时存在时，**项目级覆盖用户级**。修改配置后需要重启 hunea 才会生效。

如果没有特殊需要，`models.toml` 等优先写在全局，这样切换工作区后，已有配置和模型选择仍能生效。

补充：如果工作区 `.hunea/` 下存在 `portable.marker`，会进入便携模式，只读该工作区的配置/会话，不再叠加全局 `~/.config/hunea/`。首次启动若全局配置目录不可用，precheck 也可能引导你创建这个标记。

> 代码仓库中的 `*.example.toml` 在一定程度上可能落后于本文档，因此建议以当前文档为准。

## models.toml

用于配置供应商和模型。

`models.toml` 的配置说明如下（不一定准确，建议看后面的示例）：

```toml height="600"
# OpenAI 兼容服务或原生 provider 进行调整。`base_url`
# 对于 OpenAI 兼容 API 需要包含 `/v1` 前缀。
#
# 如果设置了 `models`，它将作为该 provider 的模型白名单。如果
# 省略 `models`，OpenAI 兼容 provider 会从 `{base_url}/models` 同步模型列表，
# 原生 provider 则在可用时使用其自身的模型列表接口。
#
# 原生 provider 也可以设置 `base_url` 指向第三方原生兼容端点。
# 这种情况下需要显式配置 `models = [...]`；自定义原生端点
# 尚不支持自动模型同步。

# 留空表示 Hunea 启动时不选择任何模型。当你从 /models 选择模型后，
# Hunea 会将最后选择的模型以 `provider/model` 格式写回此处。
default = ""

# Context 上限（tokens）配置
#
# hunea 按以下优先级解析每个模型的 context 上限，用于 /context 面板预算条渲染：
#   1. providers.<id>.model_profiles.<model>.context_window（最具体，见下方 local 示例）
#   2. defaults.context_window（全局默认）
#   3. built-in：按模型家族自动匹配，例如 gpt-4o / gpt-4o-mini 为 128000，
#      claude-sonnet-4 / claude-opus-4 为 200000；其余未识别模型回退到 256000。
# 三者均未配置时使用 built-in。下面两项均为可选，按需启用。
#
# 全局默认上限；未在 model_profiles 中显式覆盖的模型都会命中。
# [defaults]
# context_window = 128000

[providers.local]
enabled = true
kind = "openai_compatible"
display_name = "Local"
base_url = "http://127.0.0.1:1234/v1"
# 本地模型服务器通常不需要授权。
# 使用 `api_key` 可以将 token 直接写在此文件中，
# 使用 `api_key_env` 则从环境变量读取。如果两者都存在，优先使用 `api_key`。
# api_key = "local-secret"
# api_key_env = "LOCAL_OPENAI_API_KEY"
models = ["qwen3", "deepseek-r1-distill"]

# 单模型 context 上限覆盖，优先级高于 [defaults] 与 built-in。
# 适合本地模型用非标准上下文长度（例如 32k 量化的 qwen3）时显式标注，
# 避免 /context 面板按默认值渲染出与实际不符的预算条。
# [providers.local.model_profiles.qwen3]
# context_window = 32768
```

不过需要指出的是，上方这个配置文件和代码仓库中的配置文件示例并不是准确的，因为我的疏忽，example 文件在一定程度上是落后于当前文档的，因此建议以当前文件为准。

配置好的示例如下（建议创建好配置文件后，复制下面的示例进行修改）：

```toml
// 其中 pure 可以改为自己喜欢的命名
// 注意命名不要重复
[providers.pure]
// 表示是否启用此供应商，可以只配置，但是不启用
enabled = true
// 当前实际可用于对话的 kind 主要是：
// openai_compatible / openai_responses / openai
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

如果需要配置模型上下文窗口上限，则需要加上：

```toml
# 全局默认上限；未在 model_profiles 中显式覆盖的模型都会命中。
[defaults]
context_window = 128000
```

上方的这种全局默认上限，或者对单个模型指定的上限，比如已经配置好了一个供应商名为 `pure`，然后也有一个模型叫做 `model-1`，那么就可以对其单独进行上下文窗口大小的指定：

```toml
[providers.pure.model_profiles.model-1]
context_window = 32768
```

这些都是放在同一个 `models.toml` 配置文件中的，结合起来如下：

```toml
[defaults]
context_window = 128000

[providers.pure]
enabled = true
kind = "openai_responses"
display_name = "Pure"
api_key = "sk-xxx"
base_url = "https://xxx/v1"
models = ["model-1"]

[providers.pure.model_profiles.model-1]
context_window = 32768
```

需要注意的是，如果不配置全局的默认上下文窗口上限的话，那么默认是 256k。

配置好后重启 Hunea，再使用 [`/models`](/guide/fun/menu/models.html) 选择模型即可。

## config.toml

控制 Hunea 本身的行为。一般不需要做太多配置，默认值已经适合绝大部分使用情况。默认值（给出的就是默认值）和可改示例如下：

```toml height="600"
# 当两者同时存在时，项目级配置会覆盖用户级配置。
# 修改配置后需要重启 hunea 才会生效。
#
# 补充：如果工作区 `.hunea/` 下存在 `portable.marker`，会进入便携模式，
# 只读该工作区的配置/会话，不再叠加全局 `~/.config/hunea/`。
# 首次启动若全局配置目录不可用，precheck 也可能引导你创建这个标记。

[tui]
# `motion` 控制 TUI 的装饰性动画。
# - "full"：启用完整动画，是默认值。
# - "reduced"：关闭 entrance、toast transition、stream activity tick 与 tool marker blink；
#   toast 的信息展示时限仍然保留。
motion = "full"

# `scroll_animation` 控制滚轮平滑滚动的手感档位（分帧推进 + 快速连滚加速度）。
# - "off"：关闭平滑滚动，滚轮恢复固定 3 行/格的瞬时跳变，无加速度。
# - "snappy"：接近瞬时，仅柔化大幅滚动。
# - "fast"：快速收敛，少量动画。
# - "smooth"：均衡档位，是默认值。
# - "gentle"：更长的滑动。
# - "glide"：最长的滑动。
# 注意：`motion = "reduced"` 时无论此项取值，滚动均为瞬时。
scroll_animation = "smooth"

# 可选值：
# `user_input_style` 控制“输入中的用户内容”和“发送后的用户消息”的展示风格。
# - "cx"：当前 framed 样式。composer 与用户消息会在足够高的窗口里显示 surface frame。
# - "cc"：整行着色的紧凑样式。关闭上下 surface frame，但保留整行用户消息背景。
# - "ms"：最原始的旧主题。用户消息按内容范围着色，不做整行补齐，也不显示 surface frame。
user_input_style = "cx"

# `status_line` 控制输入框下方状态行中要显示的信息。
# 顺序会直接影响从左到右的显示顺序。
# 当前支持的值：
# - "git-branch"：当前工作目录所在 Git 仓库的分支名
# - "current-dir"：当前工作目录的短路径，home 前缀会缩写为 ~
# - "current-model"：当前选择的模型，格式为 provider/model
# - "throughput"：最近一次成功请求的 LLM 每秒输出 token 数，例如 139tps
# - "latency"：最近一次成功请求的首 token 延迟，例如 0.53s
# - "context-used"：最近一次成功请求后的上下文已用百分比，例如 Context 42% used
# - "context-remaining"：最近一次成功请求后的上下文剩余百分比，例如 Context 58% left
#
# 未配置时不显示状态行；如果配置了但配置项都拿不到可以显示的内容时，
# 状态行也会保持隐藏。
# status_line = ["git-branch"]

# `status_line_2` 使用与 `status_line` 相同的数组格式，用于配置第二行状态行。
# 如果第二行与第一行配置了相同项目，第一行优先显示，第二行会自动跳过重复项。
# 未配置或显式写成 [] 时，不显示第二行。
# status_line_2 = ["current-dir"]

# `external_editor` 控制 Ctrl+G 打开的外部编辑器命令。
# 使用 TOML 数组原生表达 argv，例如：
# - ["code", "--wait"]
# - ["cursor", "--wait"]
# - ["zed", "--wait"]
# - ["subl", "-w"]
# - ["open", "-W", "-n", "-t"]
# - ["nvim"]
#
# 对于 VS Code、Cursor、Zed、Sublime Text 这类 GUI 编辑器，
# 需要显式带上“等待关闭后再返回”的参数；否则 hunea 会在编辑器刚启动时就回到 TUI。
# macOS 的 `open` 也需要同时带上 `-W` 与 `-n`。
#
# 未配置或显式写成 [] 时，会退回到自动探测模式：
# 依次尝试 VISUAL、EDITOR，以及平台常见编辑器命令。
# external_editor = ["code", "--wait"]

# `show_external_editor_helper` 控制多行草稿时是否显示
# “ctrl+g to edit in …” 这条短暂提示。
# 默认开启；如果已经熟悉 Ctrl+G 工作流，可以关闭以减少干扰。
show_external_editor_helper = true

# `copy_on_mouse_selection_release` 控制鼠标左键拖拽选区完成后，
# 是否在释放按键时自动复制选中的内容。
# 默认关闭；开启后会更接近一些终端里的“选中即复制”手感。
copy_on_mouse_selection_release = false

# `swap_enter_and_send` 控制是否交换“换行”和“发送消息”的按键语义。
# 默认关闭；开启后：
# - Enter 改为插入换行
# - Ctrl+J 与 Shift+Enter 改为发送消息
swap_enter_and_send = false

# `ctrl_c_clears_input` 控制在输入框已有草稿时，
# 单击 Ctrl+C 是否直接清空草稿。
# 默认开启；关闭后，Ctrl+C 会恢复为退出确认语义。
ctrl_c_clears_input = true

# `composer_undo_limit` 控制输入框 Ctrl+Z 可撤回的草稿快照数量。
# 仅保存在当前 TUI 进程内，不会写入会话或配置；Ctrl+Y 的 kill buffer 仍只保存最近一次 kill。
# 取值范围 1..200，默认 50。
composer_undo_limit = 50

# `message_history_limit` 控制全局 message history 最大保留条数（跨项目）。
# 具体是影响 /resend 界面的容量上限
# 取值范围 100..1000，默认 100。
message_history_limit = 100

# `esc_interrupt_presses` 控制当前对话 turn 运行中，
# 需要连续按多少次 Esc 才会中断当前 native 请求。
# 可选值为 1、2、3；默认 2。
esc_interrupt_presses = 2

# `show_esc_interrupt_hint` 控制等待行是否显示 `esc 2x to interrupt`
# 这类打断提示。默认开启。
show_esc_interrupt_hint = true

# `file_picker_popup_height` 控制 @ 文件选择浮窗的行数。
# 文件选择浮窗固定使用完整终端宽度；垂直方向以 @ 位置为锚点，空间不足时自动翻转。
# 取值范围 3..21，默认高度 7 行。
file_picker_popup_height = 7

# `branch_picker_list_rows` 控制对话树分支选择浮窗的可见分支行数。
# 取值范围 3..14，默认 7 行。
branch_picker_list_rows = 7

# `print_transcript_on_exit` 控制退出 TUI 后，是否把当前对话内容
# 回放打印到终端 scrollback。
# 这个功能许久没有维护，建议保持默认也就是关闭
print_transcript_on_exit = false

# `show_reasoning_content` 控制思考模型返回 reasoning / thinking 内容时，
# 是否在助手消息正文前显示这段内容。
# 默认关闭；关闭时仍会把 reasoning 输出计入等待行 tokens，并在 reasoning 流式输出期间
# 显示临时 `thinking` 状态。
# 意思是，默认是不显示思维链内容，并且 ctrl+t 界面也不会看到思考内容
# 但是 /tree 界面还是会保留显示思维链内容
show_reasoning_content = false

# `reasoning_content_display` 控制 show_reasoning_content = true 时，
# 思维链内容进入 transcript 后的默认展示状态。
# 未配置时，show_reasoning_content = true 会默认使用 `expanded`。
# `expanded-simplified` 是 `expanded` 的长内容 compact 变体：短内容完整显示；
# 长内容保留前后各 4 行，中间以 `… +N lines (ctrl + t to view transcript)` 提示，
# Ctrl+T 进入 transcript overlay 后显示完整内容。
# 可选值：`collapsed`、`expanded`、`expanded-simplified`、`snippet`。
reasoning_content_display = "collapsed"

# 控制空输入框、且当前没有流式输出时，连按两次 Esc 使用哪一种回溯，
# 以及斜杠菜单中显示 /tree 还是 /sends-back（二者不会同时出现）。
#
# 默认 coarse：
# - 双击 Esc → 按某轮用户消息编辑/重发（截断该条之后的内容，并将正文回填到输入框）
# - 菜单显示 /tree
# 配置为 entry：
# - 双击 Esc → 打开 /tree（会话节点级精确回溯 / 创建分支）
# - 菜单显示 /sends-back（保留「编辑用户消息」入口）
esc_rewind_mode = "coarse"

# `keyboard_enhancement` 控制是否启用 kitty keyboard protocol 增强键位。
# - "auto"：按环境自动判断（例如 WSL 内的 VSCode 终端会禁用），是默认值。
# - "on"：强制开启。
# - "off"：强制关闭。
# 多数情况下保持 auto 即可；如果组合键或修饰键行为异常，可以显式关闭后再试。
keyboard_enhancement = "auto"

[runtime]
# `request_retry_attempts` 控制 runtime 请求失败后最多重试几次。
# 当前 native chat 会使用该策略。
# 可选值为 1..10；默认 3。
request_retry_attempts = 3

# `request_retry_delays` 控制每次重试前等待的秒数。
# 每个值范围为 1..1800。
# 例如 [1, 3, 5] 表示第 1 次重试前等待 1s，第 2 次等待 3s，
# 第 3 次等待 5s。列表短于 request_retry_attempts 时，会复用最后一个值补齐。
request_retry_delays = [1, 2, 3]

# `request_timeout_seconds` 控制**单次 provider HTTP 请求**的 idle timeout（秒）：
# 用于限制建连等待，以及流式响应中相邻数据块之间的空闲间隔；收到数据后会重置计时。
# 它**不限制**整轮 turn 的总时长。只要响应过程中持续有数据到达，就不会仅因总耗时超过 120s 而中断。
# 超时后会进入上面的重试流程；每次重试都会重新获得完整的 idle timeout。
# 可选值为 1..7200；默认 120。
request_timeout_seconds = 120

# `tool_max_turns` 控制 agent multi-turn 工具调用轮次上限。
# 默认不限制；设置为正整数后，超过该轮次会终止本次请求。
# tool_max_turns = 32

# `allow_managed_rg` / `allow_managed_fd` 记录是否允许 hunea 在系统 PATH
# 和 bundled binary 都不可用时，下载、校验并安装 pin 版本的 `rg` / `fd`。
# 缺省或 false 表示下次实际需要下载时重新询问；true 表示同类下载可直接继续。
# allow_managed_rg = true
# allow_managed_fd = true

[debug]
# `enabled` 控制是否显示仅用于本地调试 TUI 效果的斜杠命令。
# 默认关闭；开启后会显示 `/tool-debug` 等临时调试入口。
# 这个其实是一个被我忽略的功能，后续会考虑移除或者将其完善化
enabled = false
```

快速开始里也写了我个人自用的一份精简推荐配置，见[快速开始](/guide/start/getting-started)。

## phrases.toml

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
