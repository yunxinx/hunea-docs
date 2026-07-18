---
description: 说明 Hunea models.toml：供应商、模型、context_window 与示例配置
---

# models.toml

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

配置好后重启 Hunea，再使用 [`/models`](/guide/fun/menu/models) 选择模型即可。

相关页面：

- [配置总览](/guide/start/configuration/preface)
- [`config.toml`](/guide/start/configuration/config)
- [`phrases.toml`](/guide/start/configuration/phrases)
