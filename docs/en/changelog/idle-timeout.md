---
description: 2026-07-16 update — request_timeout_seconds is now a provider HTTP idle timeout, not a total turn time cap
---

# Request timeout changed to idle timeout

- **Date**: 2026-07-16
- **Commit**: `fix(runtime): change request timeout to per-provider idle timeout`
- **Version cue**: `0.11.1-alpha.4`

This is a runtime semantics correction. The config name `request_timeout_seconds` stays the same, but what it means has changed.

## Why the change? The old behavior was confusing

Before, it acted more like a maximum clock time for an entire turn/attempt, plus it had special cases like:

- Turn-level soft timeouts
- Pausing the timeout while approval dialogs were open

This made behavior hard to predict when you had long replies, slow model thinking, or just left an approval waiting for a while.

## New semantics

`[runtime].request_timeout_seconds` is now an **idle timeout for a single provider HTTP request** (default `120`, range `1..7200`):

1. It limits how long we wait for a connection to establish
2. It limits how long we wait between chunks when streaming a response
3. The timer **resets every time new data arrives**
4. It **does not** limit the total wall-clock time of an entire turn — as long as data keeps arriving, the response won't be cut off just for taking more than 120 seconds total.

When an idle timeout *does* hit, we still go through the normal retry flow; each fresh retry gets a full new idle timeout. The existing graceful cancellation path is preserved.

See [config.toml · request_timeout_seconds](/guide/start/configuration/config) for the current docs. If you cranked this number way up just to allow for long replies under the old semantics, you can probably lower it now: what matters now is "how long with no data do we wait before assuming it's stuck", not "what's the maximum time a whole turn could take".
