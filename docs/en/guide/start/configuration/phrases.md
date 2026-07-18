---
description: phrases.toml for Hunea waiting-reply phrases — mode, order, and custom phrase list examples while the model runs
---

# phrases.toml

Designed for fun, it controls the phrases displayed while waiting for the AI to reply. It's placed in the same location as `models.toml` and `config.toml`.

Example configuration:

```toml
# mode = "append" keeps built-in phrases and appends custom phrases.
# mode = "override" uses only the phrases listed below.
mode = "append"

# order = "random" randomly selects one phrase per request.
# order = "cycle" cycles through phrases in order.
order = "random"

phrases = [
  "Reading context",
  "Thinking through it",
  "Checking the edges",
]
```

I personally use the built-in defaults, and I haven't tested this feature after implementing it. You can try it if you want, and feel free to open an Issue if you have problems.

Related pages:

- [Configuration overview](/guide/start/configuration/preface)
- [`models.toml`](/guide/start/configuration/models)
- [`config.toml`](/guide/start/configuration/config)
