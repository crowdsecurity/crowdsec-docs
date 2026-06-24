---
id: hooks
title: Hooks
sidebar_position: 4
---

The Application Security Component lets you hook into different stages to change behavior at runtime.

Hooks run in six phases:

- `on_load`: Called just after the rules have been loaded into the engine.
- `pre_eval`: Called after a request has been received but before the rules are evaluated.
- `post_eval`: Called after the rules have been evaluated.
- `on_match`: Called after a successful match of a rule. If multiple rules, this hook will be called only once.
- `on_challenge`: Called for in-band requests carrying a valid challenge cookie, with the decoded `fingerprint` object available. See [Bot detection](bot_detection/intro.md). (In-band only.)
- `on_challenge_submit`: Called when a client POSTs a challenge response to `/crowdsec-internal/challenge/submit`, after crypto validation and fingerprint decryption. See [Bot detection](bot_detection/intro.md). (In-band only.)

## Using hooks

Hooks are configured in your AppSec config file.

The `on_load` hook only supports `apply`, while other hooks support `filter` and `apply`.

Both `filter` and `apply` of the same phase have access to the same helpers.

Except for `on_load`, hooks can be called twice per request: once for in-band processing and once for out-of-band processing. Use `IsInBand` and `IsOutBand` to filter the hook.

Hooks have the following format:

```yaml
on_match:
  - filter: IsInBand && 1 == 1
    apply:
      - valid expression
      - valid expression
```

If the filter returns `true`, each of the expressions in the `apply` section are executed.

<!-- once https://github.com/crowdsecurity/crowdsec-docs/issues/555 is fixed, document on_success-->

### `on_load`

This hook is intended to be used to disable rules at loading (eg, to temporarily disable a rule that is causing false positives).

#### Available helpers

| Helper Name                    | Type                                    | Description                                                                                                                                                           |
| ------------------------------ | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RemoveInBandRuleByName`       | `func(tag str)`                         | Disable the named in-band rule                                                                                                                                        |
| `RemoveInBandRuleByTag`        | `func(tag str)`                         | Disable the in-band rule identified by the tag (multiple rules can have the same tag)                                                                                 |
| `RemoveInBandRuleByID`         | `func(id int)`                          | Disable the in-band rule identified by the ID                                                                                                                         |
| `RemoveOutBandRuleByName`      | `func(tag str)`                         | Disable the named out-of-band rule                                                                                                                                    |
| `RemoveOutBandRuleByTag`       | `func(tag str)`                         | Disable the out-of-band rule identified by the tag (multiple rules can have the same tag)                                                                             |
| `RemoveOutBandRuleByID`        | `func(id int)`                          | Disable the out-of-band rule identified by the ID                                                                                                                     |
| `SetRemediationByTag`          | `func(tag str, remediation string)`     | Change the remediation of the in-band rule identified by the tag (multiple rules can have the same tag)                                                               |
| `SetRemediationByID`           | `func(id int, remediation string)`      | Change the remediation of the in-band rule identified by the ID                                                                                                       |
| `SetRemediationByName`         | `func(name str, remediation string)`    | Change the remediation of the in-band rule identified by the name                                                                                                     |
| `LoadAPISchemaWithName`        | `func(ref str, filename str)`           | Load an OpenAPI schema from `<data_dir>/schemas/<filename>` and register it under `ref`. See [OpenAPI Schema Validation](api_validation.md).                          |
| `LoadAPISchemaWithOptions`     | `func(ref str, filename str, opts map)` | Same as `LoadAPISchemaWithName` but accepts per-schema policy overrides (`on_route_not_found`, `on_method_not_allowed`).                                              |
| `RegisterAPISchemaBodyDecoder` | `func(content_type str, decoder str)`   | Enable a non-default body decoder for a Content-Type. See [available decoders](api_validation.md#body-decoders).                                                      |
| `SetMaxBodySize`               | `func(size int)`                        | Set the maximum request body size (in bytes) buffered and inspected by the engine. Defaults to 10MB. See [Request body size handling](#request-body-size-handling)    |
| `SetBodySizeExceededAction`    | `func(action str)`                      | Set what happens when a request body exceeds the maximum size: `drop` (default), `partial`, or `allow`. See [Request body size handling](#request-body-size-handling) |

##### Example

```yaml
name: crowdsecurity/my-appsec-config
default_remediation: ban
inband_rules:
  - crowdsecurity/base-config
  - crowdsecurity/vpatch-*
on_load:
  - apply:
      - RemoveInBandRuleByName("my_rule")
      - SetRemediationByTag("my_tag", "captcha")
```

### `pre_eval`

This hook is intended to be used to disable rules only for this particular request (eg, to disable a rule for a specific IP).

#### Available helpers

| Helper Name                 | Type                                 | Description                                                                                                                                                                                                                                                     |
| --------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RemoveInBandRuleByName`    | `func(tag str)`                      | Disable the named in-band rule                                                                                                                                                                                                                                  |
| `RemoveInBandRuleByTag`     | `func(tag str)`                      | Disable the in-band rule identified by the tag (multiple rules can have the same tag)                                                                                                                                                                           |
| `RemoveInBandRuleByID`      | `func(id int)`                       | Disable the in-band rule identified by the ID                                                                                                                                                                                                                   |
| `RemoveOutBandRuleByName`   | `func(tag str)`                      | Disable the named out-of-band rule                                                                                                                                                                                                                              |
| `RemoveOutBandRuleByTag`    | `func(tag str)`                      | Disable the out-of-band rule identified by the tag (multiple rules can have the same tag)                                                                                                                                                                       |
| `RemoveOutBandRuleByID`     | `func(id int)`                       | Disable the out-of-band rule identified by the ID                                                                                                                                                                                                               |
| `IsInBand`                  | `bool`                               | `true` if the request is in the in-band processing phase                                                                                                                                                                                                        |
| `IsOutBand`                 | `bool`                               | `true` if the request is in the out-of-band processing phase                                                                                                                                                                                                    |
| `SetRemediationByTag`       | `func(tag str, remediation string)`  | Change the remediation of the in-band rule identified by the tag (multiple rules can have the same tag)                                                                                                                                                         |
| `SetRemediationByID`        | `func(id int, remediation string)`   | Change the remediation of the in-band rule identified by the ID                                                                                                                                                                                                 |
| `SetRemediationByName`      | `func(name str, remediation string)` | Change the remediation of the in-band rule identified by the name                                                                                                                                                                                               |
| `req`                       | `http.Request`                       | Original HTTP request received by the remediation component                                                                                                                                                                                                     |
| `DropRequest`               | `func(reason str)`                   | Stop processing the request immediately and instruct the remediation component to block the request                                                                                                                                                             |
| `DisableBodyInspection`     | `func()`                             | Skip body inspection for the current request (also bypasses the maximum body size check). See [Request body size handling](#request-body-size-handling)                                                                                                         |
| `ValidateRequestWithSchema` | `func(ref str) bool`                 | Validate the current request against an OpenAPI schema previously loaded under `ref` (returns `true` on success). On failure, structured details are published to `hook_vars` (see [OpenAPI Schema Validation](api_validation.md#validation-result-variables)). |
| `hook_vars`                 | `map[string]string`                  | Per-request scratch space shared with later hooks and propagated to the resulting event. Helpers such as `ValidateRequestWithSchema` publish their results here.                                                                                                |
| `SendChallenge`             | `func()`                             | Instruct the AppSec component to serve a JavaScript challenge for this request. No-op if the request already carries a valid challenge cookie. See [Bot detection](bot_detection/intro.md).                                                                     |
| `GrantChallengeCookie`      | `func(reason str, ttl str?)`         | Mint a valid challenge cookie for this client (allowlist escape hatch for trusted user-agents or internal probes). `reason` is recorded in logs (≤256 bytes); optional `ttl` (a Go duration like `"24h"`) overrides the configured `cookie_ttl`.                 |
| `SetChallengeDifficulty`    | `func(level str)`                    | Override the proof-of-work difficulty for this request. Valid levels: `"disabled"`, `"low"`, `"medium"` (default), `"high"`, `"impossible"`. See [Challenge difficulty levels](#challenge-difficulty-levels).                                                    |

#### Example

```yaml
name: crowdsecurity/my-appsec-config
default_remediation: ban
inband_rules:
  - crowdsecurity/base-config
  - crowdsecurity/vpatch-*
pre_eval:
  - filter: IsInBand == true && req.RemoteAddr == "192.168.1.1"
    apply:
      - RemoveInBandRuleByName("my_rule")
```

### `post_eval`

This hook is mostly intended for debugging or threat-hunting purposes.

#### Available helpers

| Helper Name              | Type                          | Description                                                                                                                                                                                                                                                     |
| ------------------------ | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `IsInBand`               | `bool`                        | `true` if the request is in the in-band processing phase                                                                                                                                                                                                        |
| `IsOutBand`              | `bool`                        | `true` if the request is in the out-of-band processing phase                                                                                                                                                                                                    |
| `DumpRequest`            | `func()`                      | Dump the request to a file                                                                                                                                                                                                                                      |
| `req`                    | `http.Request`                | Original HTTP request received by the remediation component                                                                                                                                                                                                     |
| `SendChallenge`          | `func()`                      | Instruct the AppSec component to serve a JavaScript challenge for this request. No-op if the request already carries a valid challenge cookie. See [Bot detection](bot_detection/intro.md).                                                                     |
| `GrantChallengeCookie`   | `func(reason str, ttl str?)`  | Mint a valid challenge cookie for this client (allowlist escape hatch for trusted user-agents or internal probes). `reason` is recorded in logs (≤256 bytes); optional `ttl` (a Go duration like `"24h"`) overrides the configured `cookie_ttl`.                 |
| `SetChallengeDifficulty` | `func(level str)`             | Override the proof-of-work difficulty for this request. Valid levels: `"disabled"`, `"low"`, `"medium"` (default), `"high"`, `"impossible"`. See [Challenge difficulty levels](#challenge-difficulty-levels).                                                    |

#### DumpRequest

In order to make `DumpRequest` write your request to a file, you have to call `DumpRequest().ToJSON()`, which will create a file in the OS temporary directory (eg, `/tmp` on Linux) with the following format: `crowdsec_req_dump_<RANDOM_PART>.json`.

You can configure what is dumped with the following options:

- `DumpRequest().NoFilters()`: Clear any previous filters (ie. dump everything)
- `DumpRequest().WithEmptyHeadersFilters()`: Clear the headers filters, ie. dump all the headers
- `DumpRequest().WithHeadersContentFilter(regexp string)`: Add a filter on the content of the headers, ie. dump only the headers that _do not_ match the provided regular expression
- `DumpRequest().WithHeadersNameFilter(regexp string)`: Add a filter on the name of the headers, ie. dump only the headers that _do not_ match the provided regular expression
- `DumpRequest().WithNoHeaders()`: Do not dump the request headers
- `DumpRequest().WithHeaders()`: Dump all the request headers (override any previous filter)
- `DumpRequest().WithBody()`: Dump the request body
- `DumpRequest().WithNoBody()`: Do not dump the request body
- `DumpRequest().WithEmptyArgsFilters()`: Clear the query parameters filters, ie. dump all the query parameters
- `DumpRequest().WithArgsContentFilter(regexp string)`: Add a filter on the content of the query parameters, ie. dump only the query parameters that _do not_ match the provided regular expression
- `DumpRequest().WithArgsNameFilter(regexp string)`: Add a filter on the name of the query parameters, ie. dump only the query parameters that _do not_ match the provided regular expression

By default, everything is dumped.
All regexps are case-insensitive.

You can chain the options, for example:

```
DumpRequest().WithNoBody().WithArgsNameFilter("var1").WithArgsNameFilter("var2").ToJSON()
```

This will discard the body of the request, remove the query parameters `var1` and `var2` from the dump, and dump everything else.

#### Example

```yaml
name: crowdsecurity/my-appsec-config
default_remediation: ban
inband_rules:
  - crowdsecurity/base-config
  - crowdsecurity/vpatch-*
post_eval:
  - filter: IsInBand == true
    apply:
      - DumpRequest().NoFilters().WithBody().ToJSON()
```

### `on_match`

This hook is intended to be used to change the behavior of the engine after a match (eg, to change the remediation that will be used dynamically).

#### Available helpers

| Helper Name      | Type                       | Description                                                                                                   |
| ---------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `SetRemediation` | `func(remediation string)` | Change the remediation that will be returned to the remediation component                                     |
| `SetReturnCode`  | `func(code int)`           | Change the HTTP code that will be returned to the remediation component                                       |
| `CancelAlert`    | `func()`                   | Prevent the Application Security Component to create a crowdsec alert                                         |
| `SendAlert`      | `func()`                   | Force the Application Security Component to create a crowdsec alert                                           |
| `CancelEvent`    | `func()`                   | Prevent the Application Security Component to create a crowdsec event                                         |
| `SendEvent`      | `func()`                   | Force the Application Security Component to create a crowdsec event                                           |
| `DumpRequest`    | `func()`                   | Dump the request to a file (see previous section for detailed usage)                                          |
| `IsInBand`       | `bool`                     | `true` if the request is in the in-band processing phase                                                      |
| `IsOutBand`      | `bool`                     | `true` if the request is in the out-of-band processing phase                                                  |
| `evt`            | `types.Event`              | [The event that has been generated](/docs/expr/event.md#appsec-helpers) by the Application Security Component |
| `req`            | `http.Request`             | Original HTTP request received by the remediation component                                                   |

#### Example

```yaml
name: crowdsecurity/my-appsec-config
default_remediation: ban
inband_rules:
 - crowdsecurity/base-config
 - crowdsecurity/vpatch-*
on_match:
  - filter: IsInBand == true && req.RemoteAddr == "192.168.1.1"
   apply:
    - CancelAlert()
    - CancelEvent()
  - filter: |
      any( evt.Appsec.MatchedRules, #.name == "crowdsecurity/vpatch-env-access") and
      req.RemoteAddr = "192.168.1.1"
    apply:
    - SetRemediation("allow")
  - filter: evt.Appsec.MatchedRules.GetURI() contains "/foobar/"
    apply:
     - SetRemediation("allow")
```

### `on_challenge`

This hook fires for in-band requests that carry a valid `__crowdsec_challenge` cookie — i.e. clients that have already passed the JavaScript challenge once. The decoded device `fingerprint` is available, so this is the right place to apply per-request decisions based on what the challenge learned about the client. Skipped if the request has no valid challenge cookie. **In-band only.**

See [Bot detection](bot_detection/intro.md) for the broader picture.

#### Available helpers

| Helper Name                            | Type                                  | Description                                                                                                                                                                                                                                                |
| -------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SendChallenge`                        | `func()`                              | Force a re-challenge for this request even though the client already has a cookie (e.g. when fingerprint mismatches indicate the cookie may have been replayed).                                                                                           |
| `SetChallengeDifficulty`               | `func(level str)`                     | Override the proof-of-work difficulty for the next challenge issued. See [Challenge difficulty levels](#challenge-difficulty-levels).                                                                                                                      |
| `EvaluateMismatches`                   | `func() MismatchReport`               | Run the configured mismatch checks against the fingerprint and return a structured report. Result is cached per request. See [The `MismatchReport` object](#the-mismatchreport-object).                                                                    |
| `fingerprint`                          | `FingerprintData`                     | The decoded fingerprint object. See [The `fingerprint` object](#the-fingerprint-object).                                                                                                                                                                   |
| `fingerprint.UAMobileMismatch`         | `func() bool`                         | `true` if the mobile signals carried by the fingerprint contradict the User-Agent header.                                                                                                                                                                  |
| `fingerprint.AcceptLanguageMismatch`   | `func(req http.Request) bool`         | `true` if the `Accept-Language` header is inconsistent with the languages reported by the fingerprint.                                                                                                                                                     |
| `fingerprint.TimezoneCountryMismatch`  | `func(country str) bool`              | `true` if the timezone reported by the fingerprint is inconsistent with the given country code (typically obtained from a GeoIP lookup on the client IP).                                                                                                  |

#### Example

```yaml
on_challenge:
  - filter: EvaluateMismatches().High() >= 1
    apply:
      - SendChallenge()
```

### `on_challenge_submit`

This hook fires when a client POSTs a challenge response to `/crowdsec-internal/challenge/submit`, **after** the AppSec component has cryptographically validated the submission and decrypted the fingerprint, but **before** the success cookie is issued. This is the right place to refuse cookies to clients the challenge has positively identified as automation. **In-band only.**

#### Available helpers

| Helper Name             | Type                                       | Description                                                                                                                                                                                                                            |
| ----------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RejectSubmission`      | `func(reason str, verbosity str?)`         | Refuse to issue a challenge cookie despite a valid crypto submission. `reason` is recorded in logs. Optional `verbosity`: `"minimal"`, `"info"` (default), `"verbose"` — controls how much fingerprint detail is logged.               |
| `GrantChallengeCookie`  | `func(reason str, ttl str?)`               | Issue the challenge cookie inline as part of the submit response (no 307 redirect). `reason` is recorded in logs; optional `ttl` (a Go duration like `"24h"`) overrides the configured `cookie_ttl`.                                  |
| `LogAccepted`           | `func(msg str, verbosity str?)`            | Emit a structured "submission accepted" log line. Same `verbosity` semantics as `RejectSubmission`.                                                                                                                                    |
| `EvaluateMismatches`    | `func() MismatchReport`                    | Same as in `on_challenge` — run the mismatch checks against the just-decrypted fingerprint.                                                                                                                                            |
| `fingerprint`           | `FingerprintData`                          | The decoded fingerprint object — see [The `fingerprint` object](#the-fingerprint-object).                                                                                                                                              |

#### Example

```yaml
on_challenge_submit:
  - filter: fingerprint.FastBotDetection.Bool() == true
    apply:
      - RejectSubmission("fast-bot-detection")
  - apply:
      - LogAccepted("challenge submission accepted")
```

## Detailed Helpers Information

### `SetRemediation*`

When using `SetRemediation*` helpers, the only special value is `allow`: the remediation component won't block the request.
Any other values (including `ban` and `captcha`) are transmitted as-is to the remediation component.

### Request body size handling

Before the request body is handed over to the rules engine, the Application Security Component reads it into memory itself. To protect the engine from oversized requests, the body is bounded by a maximum size (defaults to **10MB**).

This limit is independent from the Coraza-level [`request_body_in_memory_limit`](configuration.md#inband_options) option: it controls how much of the body CrowdSec buffers in the first place, before any rule is evaluated.

You can tune this behavior from an `on_load` hook:

- `SetMaxBodySize(size)` sets the maximum body size, in bytes. The value must be a positive integer.
- `SetBodySizeExceededAction(action)` controls what happens when a body exceeds the maximum size:

  | Action           | Behavior                                                                                                                                                   |
  | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `drop` (default) | The request is blocked using the default remediation, without inspecting the body.                                                                         |
  | `partial`        | The body is truncated to the maximum size and the kept portion is inspected. Content beyond the truncation point is discarded and will not match any rule. |
  | `allow`          | The body is not inspected and the request is allowed to proceed (other zones are still evaluated).                                                         |

```yaml
name: crowdsecurity/my-appsec-config
default_remediation: ban
inband_rules:
  - crowdsecurity/base-config
on_load:
  - apply:
      - SetMaxBodySize(20971520) # 20MB
      - SetBodySizeExceededAction("partial")
```

#### `DisableBodyInspection`

`DisableBodyInspection()` can be called from a `pre_eval` hook to skip body inspection for the current request only. When body inspection is disabled:

- the request body is not read or processed, so body-based zones (`BODY_ARGS`, `RAW_BODY`, …) won't match;
- the maximum body size check is bypassed as well: a request that would otherwise be dropped for exceeding the limit is allowed through, because the operator has explicitly accepted that this body won't be processed.

```yaml
pre_eval:
  - filter: req.URL.Path startsWith "/upload"
    apply:
      - DisableBodyInspection()
```

### `req` object

The `pre_eval`, `on_match` and `post_eval` hooks have access to a `req` variable that represents the HTTP request that was forwarded to the appsec.

It's a Go [http.Request](https://pkg.go.dev/net/http#Request) object, so you can directly access all the details about the request.

For example:

- To get the requested URI: `req.URL.Path`
- To get the client IP: `req.RemoteAddr`
- To get the HTTP method: `req.Method`
- To get the FQDN: `req.Host`

### Challenge difficulty levels

`SetChallengeDifficulty(level)` accepts the following levels. Numbers are approximate proof-of-work iteration counts and rough wall-clock solve times on a modern desktop browser; mobile is meaningfully slower.

| Level          | Approx. iterations | Approx. solve time | When to use                                                                                                                  |
| -------------- | ------------------ | ------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `"disabled"`   | 0 (any nonce wins) | instant            | Functional smoke testing or when you only care about the fingerprint, not the proof-of-work.                                |
| `"low"`        | ~1 024             | 0.2 – 2 s          | Latency-sensitive endpoints, mobile-heavy traffic.                                                                           |
| `"medium"`     | ~4 096             | 1 – 8 s            | **Default.** Reasonable trade-off between user experience and attacker cost.                                                 |
| `"high"`       | ~32 768            | 7 – 60 s           | Routes under active abuse; clients you already suspect.                                                                      |
| `"impossible"` | unsolvable         | n/a                | Hard block: the AppSec component rejects the submission server-side. Use to fully block a client without leaking the reason. |

### The `fingerprint` object

In `on_challenge` and `on_challenge_submit` hooks, `fingerprint` exposes the device data collected by the in-browser library. The most commonly used fields:

| Field                       | Type     | Description                                                                                                                                          |
| --------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fingerprint.FastBotDetection.Bool()` | `bool`   | `true` if the in-browser fast-bot-detection library raised any signal (CDP, headless, automation framework, impossible device profile, …). |
| `fingerprint.Signals`       | object   | Raw category roll-ups: device, browser, automation, graphics, codecs, locale.                                                                       |
| `fingerprint.Bot`           | object   | Convenience accessor for the individual bot signals.                                                                                                |
| `fingerprint.Allowlisted`   | `bool`   | `true` if the cookie was minted via `GrantChallengeCookie(...)` rather than a real challenge submission.                                            |
| `fingerprint.AllowlistReason` | `str`  | Operator-supplied reason from `GrantChallengeCookie(reason, ...)`, copied through to logs.                                                          |
| `fingerprint.FSID`          | `str`    | Per-fingerprint identifier, stable across the cookie's lifetime. Useful for correlating logs.                                                       |

For the higher-level bot detection workflow (what the library actually detects, how to allowlist legitimate bots, behavioral scenarios), see [Bot detection](bot_detection/intro.md).

### The `MismatchReport` object

`EvaluateMismatches()` returns a cached-per-request `MismatchReport` summarising every mismatch signal that fired against the current fingerprint.

| Method                       | Returns    | Description                                                                |
| ---------------------------- | ---------- | -------------------------------------------------------------------------- |
| `.Count()`                   | `int`      | Total number of signals fired.                                             |
| `.Empty()`                   | `bool`     | `true` if no signal fired.                                                 |
| `.High() / .Medium() / .Low()` | `int`    | Count of fired signals by severity.                                        |
| `.Has(reason str)`           | `bool`     | `true` if the specific signal `reason` fired.                              |
| `.Reasons()`                 | `[]string` | Stable-ordered list of fired reason keys.                                  |
| `.String()`                  | `str`      | Compact human-readable form: `"reason1(sev),reason2(sev)"`. Useful in logs. |

Example:

```yaml
on_challenge_submit:
  - filter: EvaluateMismatches().High() >= 1 && EvaluateMismatches().Has("cdp")
    apply:
      - RejectSubmission("high-severity-mismatch")
```
