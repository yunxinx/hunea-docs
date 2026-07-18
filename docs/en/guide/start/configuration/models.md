---
description: models.toml reference for Hunea providers, models, context_window, API keys, and OpenAI-compatible setups
---

# models.toml

Used to configure providers and models.

Configuration explanation for `models.toml` (not exhaustive, see the examples below):

```toml
# Adjust for OpenAI-compatible services or native providers. For OpenAI-compatible APIs,
# `base_url` needs to include the `/v1` prefix.
#
# If you set `models`, it acts as an allowlist for this provider. If you omit `models`,
# OpenAI-compatible providers will sync the model list from `{base_url}/models`,
# and native providers use their own model list interface when available.
#
# Native providers can also set `base_url` to point to a third-party native-compatible endpoint.
# In this case you need to explicitly configure `models = [...]`; automatic model syncing
# isn't supported yet for custom native endpoints.

# Leave empty to select no model on Hunea startup. After you select a model from /models,
# Hunea writes the last selected model back here in `provider/model` format.
default = ""

# Context window upper limit configuration
#
# Hunea resolves the context window for each model with this priority, for /context panel budget bar rendering:
#   1. providers.<id>.model_profiles.<model>.context_window (most specific, see the local example below)
#   2. defaults.context_window (global default)
#   3. built-in: automatically matched by model family, e.g. gpt-4o / gpt-4o-mini is 128000,
#      claude-sonnet-4 / claude-opus-4 is 200000; other unrecognized models fall back to 256000.
# If none are configured, built-in is used. Both of the below are optional, enable as needed.
#
# Global default upper limit; applies to models not explicitly overridden in model_profiles.
# [defaults]
# context_window = 128000

[providers.local]
enabled = true
kind = "openai_compatible"
display_name = "Local"
base_url = "http://127.0.0.1:1234/v1"
# Local model servers usually don't need authorization.
# Use `api_key` to write the token directly in this file,
# use `api_key_env` to read from an environment variable. If both exist, `api_key` is prioritized.
# api_key = "local-secret"
# api_key_env = "LOCAL_OPENAI_API_KEY"
models = ["qwen3", "deepseek-r1-distill"]

# Per-model context window override, higher priority than [defaults] and built-in.
# Suitable for explicitly marking local models with non-standard context lengths (e.g. 32k quantized qwen3),
# preventing the /context panel from rendering a budget bar that doesn't match reality with the default.
# [providers.local.model_profiles.qwen3]
# context_window = 32768
```

It should be noted that the above configuration and the example in the code repository aren't fully up to date — due to my oversight, the example file lags behind this document to some extent, so it's recommended to follow this document.

Here's a configured example (it's recommended to create your configuration file by copying and modifying this example):

```toml
// You can change "pure" to your preferred name
// Note: names can't repeat
[providers.pure]
// Whether this provider is enabled — you can configure it but leave it disabled
enabled = true
// Currently, the only kinds that actually work for chat are:
// openai_compatible / openai_responses / openai
// (other names may still be written in config, but return unsupported at request time)
kind = "openai_responses"
// This adjusts the display name, like an alias
display_name = "Pure"
// Configure your API key for this provider
api_key = "sk-xxx"
// Configure base URL, needs the /v1 suffix
base_url = "https://xxx/v1"
// Optional: if not configured, you can sync from /models interface
// If configured, you can select and use directly without network syncing
models = ["xxx"]
```

If you need to configure the context window upper limit for a model, add:

```toml
// Global default upper limit; applies to models not explicitly overridden in model_profiles.
[defaults]
context_window = 128000
```

With this global default, or you can specify the context window for an individual model. For example, if you have a provider named `pure` with a model named `model-1`, you can specify the context window size individually:

```toml
[providers.pure.model_profiles.model-1]
context_window = 32768
```

All of this goes in the same `models.toml` configuration file. Combined, it looks like this:

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

Note that if you don't configure a global default context window, the default is 256k.

After configuration, restart Hunea and select your model using [`/models`](/guide/fun/menu/models).

Related pages:

- [Configuration overview](/guide/start/configuration/preface)
- [`config.toml`](/guide/start/configuration/config)
- [`phrases.toml`](/guide/start/configuration/phrases)
