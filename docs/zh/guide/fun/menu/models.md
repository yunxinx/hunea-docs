---
description: 介绍 Hunea 的 /models 斜杠命令的作用
---

# /models

输入 `/models` 可以为当前会话选择模型。

如果你想切换供应商、换一个模型继续聊天，或者只是想确认一下当前选中的是哪个模型，都可以打开它。确认后会在输入区附近打开一块内联面板，占据原来输入框的位置，用来浏览你已经启用的所有 provider 和模型列表。

## 面板概览

面板大致从上到下包括：

1. **Providers 标签行**  
   形如 `Providers: [Local]  DeepSeek  OpenAI`。当前选中的 provider 会用方括号标出。

2. **Current Model**  
   当前会话已选中的模型，例如 `[Local] qwen3`；如果还没选过，则显示 `none`。

3. **Provider Details**  
   当前 provider 的摘要信息，常见两项：
   - `Model Source`：模型列表来源，例如 `configured`、`synced from /v1/models`、`not loaded`
   - `Endpoint`：该 provider 的 `base_url`；未配置时会显示 `not configured`

4. **Available Models**  
   当前 provider 下可选择的模型列表。未搜索时标题类似 `Available Models(Type to Search):`；开始键入后会变成 `Search: <你的搜索词>`。  
   当前光标行左侧会有 `➜` 标记；若某条本来就是当前已选模型，展示上也会更突出一点。有描述时，描述会出现在模型 id 下方。

底部固定有一行快捷键提示，大致是：

`Enter select · U refresh · Esc clear/exit · ←→/Tab providers · ↑↓ navigate`

如果没有任何已启用 provider，Providers 处会显示 `[No Providers]`，模型区则可能是 `No enabled models`。某个 provider 列表为空时，可能显示 `No models available for this provider`；若此前同步失败，也可能直接看到 `Sync failed: ...`。

大致效果如下图所示：

![models](/assets/fun/models.png)

## 怎么操作

常用操作如下：

- `←` / `→`，或者 `Tab` / `Shift + Tab`：在 provider 之间切换（会循环）
- `↑` / `↓`：在当前 provider 的模型列表里上下移动
- **直接键入字符**：即时搜索过滤模型列表（不必先按 `/` 进入搜索）
- `Backspace`（或 `Ctrl + H`）：删除一个搜索字符
- `Ctrl + U`：清空当前搜索词
- `Enter`：选中当前模型
- `U`（或 `Shift + U`）：刷新**当前** provider 的模型列表
- `Esc`：
  - 若正在搜索：先清空搜索
  - 搜索已空时：关闭面板

搜索会匹配模型 id 与描述（大小写不敏感）。没有命中时会显示 `No models match search`。切换到另一个 provider 时，搜索词通常会一并清空。

> 注意：这个面板里的上下移动主要靠方向键，**没有**像部分全屏列表那样绑定 `j` / `k`。也没有实现鼠标点击等功能，因为我个人认为这个操作比较低频，所以当时设计的时候就没做太复杂的交互。

## 选择之后会发生什么

在列表里选中模型并按 `Enter` 后，Hunea 会：

1. 把该模型设为**当前会话**使用的模型
2. 关闭 `/models` 面板
3. 弹出类似 `Model selected: [Local] qwen3` 的提示
4. 尽量把这次选择写回 `models.toml` 的 `default`（形如 `provider/model`），方便下次启动时还能落到同一选择

因此它既影响“这一轮之后继续用什么模型”，也会尽量更新默认模型配置。历史消息本身不会因为换模型而被改写；只是后续请求会走新选中的模型。

若写回默认模型失败，一般会看到类似 `Failed to save default model: ...` 的错误提示；此时界面上的当前选择可能已经变了，但配置文件未必更新成功。

## 与实际请求能力的关系

`models.toml` 中可以配置多种 `kind`（配置解析会识别这些名称），但**当前实际能够发起 chat / 流式回复的**主要是：

- `openai_compatible`（必须配置 `base_url`，通常包含 `/v1`）
- `openai_responses`（Responses API；同样需要 `base_url`）
- `openai`（默认使用官方 OpenAI base URL，也可以自行配置 `base_url`）

其它 kind 可能仍会出现在面板或配置校验中，但选中后在请求阶段会返回 unsupported。从 `/models` 自动同步模型列表，目前也主要覆盖 OpenAI 兼容这一类。配置供应商时建议优先使用上面三种，避免出现“列表中可见，但请求无法发出”的情况。

更完整的字段说明见[配置文件](/guide/start/configuration)。

## 刷新模型列表（U）

按 `U` 会请求刷新**当前 provider** 的可用模型列表。适合：

- 本地模型服务刚新加载/卸载了模型
- 省略了 `models` 白名单、希望从远端 `/models` 再同步一遍
- 之前同步失败，想重试

刷新成功时，常见提示是 `Models refreshed: <provider 显示名>`，列表会换成新结果。若刷新后当前已选模型不在新列表里，选中状态可能会被清掉，需要你重新挑一个。

刷新失败时，已有列表通常会尽量保留，并提示类似 `Failed to refresh models for Local: connection refused`；面板里的 `Sync failed: ...` 也可能随之更新。若已有刷新任务还在跑，再次触发可能提示 `Model refresh is already running`。

## 模型从哪来

`/models` 展示的是 Hunea 已加载、且 **enabled** 的 provider 目录，配置来自 `models.toml`。放置位置通常是：

- 全局：`~/.config/hunea/models.toml`
- 或当前工作区：`.hunea/models.toml`（工作区优先）

配置层面大致可以这样理解：

- 在 provider 里写了 `models = [...]`：通常按这份白名单展示（来源更像 `configured`）
- 省略 `models`：OpenAI 兼容 / OpenAI 一类往往会尝试从 `{base_url}/models` 同步（来源更像 `synced from /v1/models`）
- 还没拉到列表时：可能先是 `not loaded`

需要注意：面板中可以看到某个模型，并不表示对该模型的请求一定能够成功。当前可用于对话的 kind 仍以 `openai_compatible` / `openai_responses` / `openai` 为主。

更完整的 `models.toml` 写法、`default`，以及模型上下文窗口等配置，见 [配置文件](/guide/start/configuration)。

## 一点使用建议

- 只想确认“现在用的是哪个模型”：打开 `/models` 看 `Current Model` 一行即可，`Esc` 退出。
- 模型很多时：先 `←` / `→` 或者 `Tab`/`Shift + Tab` 切到对应 provider，再直接键入 id 关键字过滤，比纯靠上下翻更快。
- 本地服务刚变过模型列表：先切到该 provider，按 `U` 刷新，再 `Enter` 选择。
- 想顺带看上下文还剩多少：选好模型后可用 [`/context`](/guide/fun/menu/context.html)；context 上限也和 `models.toml` 里的配置有关。
