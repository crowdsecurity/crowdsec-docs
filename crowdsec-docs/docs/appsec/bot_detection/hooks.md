---
id: hooks
title: Hooks reference
sidebar_position: 6
---

This page references available expr helpers in the dedicated bot detection hooks (`on_challenge_submit` and `on_challenge`), alongside with the `fingerprint` object.


For the generic hook phases (`on_load`, `pre_eval`, `post_eval`, `on_match`) and generic helpers,
see the main [Hooks](../hooks.md) page.

## `on_challenge_submit`

This hook fires when a client POSTs a challenge response to `/crowdsec-internal/challenge/submit`, **after** the AppSec component has cryptographically validated the submission and decrypted the fingerprint, but **before** the success cookie is issued. This is the right place to refuse cookies to clients the challenge has positively identified as automation. **In-band only.**

Note that the default behavior is to accept (grant cookie) to client that submit a valid challenge response.

### Available helpers

| Helper Name             | Type                                       | Description                                                                                                                                                                                                                            |
| ----------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RejectSubmission`      | `func(reason str, verbosity str?)`         | Refuse to issue a challenge cookie despite a valid crypto submission. `reason` is recorded in logs. Optional `verbosity`: `"minimal"`, `"info"` (default), `"verbose"` — controls how much fingerprint detail is logged.               |
| `GrantChallengeCookie`  | `func(reason str, ttl str?)`               | Issue the challenge cookie inline as part of the submit response (no 307 redirect). `reason` is recorded in logs; optional `ttl` (a Go duration like `"24h"`) overrides the configured `cookie_ttl`.                                  |
| `LogAccepted`           | `func(msg str, verbosity str?)`            | Emit a structured "submission accepted" log line. Same `verbosity` semantics as `RejectSubmission`.                                                                                                                                    |
| `EvaluateMismatches`    | `func() MismatchReport`                    | Same as in `on_challenge` — run the mismatch checks against the just-decrypted fingerprint.                                                                                                                                            |
| `fingerprint`           | `object`                                   | The decoded fingerprint object — see [The `fingerprint` object](#the-fingerprint-object).                                                                                                                                              |
| `req`                   | `http.Request`                             | Original HTTP request received by the remediation component. Needed by fingerprint helpers that compare against request headers, e.g. `fingerprint.AcceptLanguageMismatch(req)`.                                                        |
| `DumpFingerprint`       | `func(label str) str`                      | Append the just-decrypted fingerprint (plus request context) as one JSONL line to a dump file, for offline analysis. Returns the file path. See [DumpFingerprint](#dumpfingerprint).                                                    |

### Example

```yaml
on_challenge_submit:
  - filter: fingerprint.IsBot()
    apply:
      - RejectSubmission("fast-bot-detection")
  - apply:
      - LogAccepted("challenge submission accepted") #this is optional, LogAccepted isn't needed to grant a cookie to the client.
```


## `on_challenge`

This hook fires for in-band requests that carry a valid `__crowdsec_challenge` cookie (clients that have already passed the JavaScript challenge). The decoded device `fingerprint` is available, so this is the right place to apply per-request decisions based on what the challenge learned about the client. Skipped if the request has no valid challenge cookie. **In-band only.**

### Available helpers

| Helper Name                            | Type                                  | Description                                                                                                                                                                                                                                                |
| -------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SendChallenge`                        | `func()`                              | Force a re-challenge for this request even though the client already has a cookie (e.g. when fingerprint mismatches indicate the cookie may have been replayed).                                                                                           |
| `SetChallengeDifficulty`               | `func(level str)`                     | Override the proof-of-work difficulty for the next challenge issued. See [Challenge difficulty levels](#challenge-difficulty-levels).                                                                                                                      |
| `SetRemediation`                       | `func(action str)`                    | Set the remediation returned to the bouncer for this request. The only special value is `allow` (don't block); any other value is passed through as-is. See [`SetRemediation*`](../hooks.md#setremediation).                                               |
| `SetReturnCode`                        | `func(code int)`                      | Set the HTTP status code returned to the bouncer for this request.                                                                                                                                                                                        |
| `DropRequest`                          | `func(reason str)`                    | Block this request immediately (using the config's default remediation) based on what the fingerprint revealed. `reason` is recorded in logs.                                                                                                              |
| `req`                                  | `http.Request`                        | Original HTTP request received by the remediation component. See [`req` object](../hooks.md#req-object).                                                                                                                                                   |
| `IsInBand`                             | `bool`                                | `true` if the request is in the in-band processing phase (always `true` here — `on_challenge` is in-band only).                                                                                                                                            |
| `EvaluateMismatches`                   | `func() MismatchReport`               | Run the configured mismatch checks against the fingerprint and return a structured report. Result is cached per request. See [The `MismatchReport` object](#the-mismatchreport-object).                                                                    |
| `fingerprint`                          | `object`                              | The decoded fingerprint object. See [The `fingerprint` object](#the-fingerprint-object).                                                                                                                                                                   |
| `fingerprint.UAMobileMismatch`         | `func() bool`                         | `true` if the mobile signals carried by the fingerprint contradict the User-Agent header.                                                                                                                                                                  |
| `fingerprint.AcceptLanguageMismatch`   | `func(req http.Request) bool`         | `true` if the `Accept-Language` header is inconsistent with the languages reported by the fingerprint.                                                                                                                                                     |
| `fingerprint.TimezoneCountryMismatch`  | `func(country str) bool`              | `true` if the timezone reported by the fingerprint is inconsistent with the given country code (typically obtained from a GeoIP lookup on the client IP).                                                                                                  |

### Example

```yaml
on_challenge:
  - filter: EvaluateMismatches().High() >= 1
    apply:
      - SendChallenge()
```

## Known bots

Two helpers, available in `pre_eval`, `post_eval` and `on_match`, let you keep legitimate non-browser clients out of the challenge flow.

### `MatchKnownBot`

`MatchKnownBot(ip, ua, path, ...files)` returns `true` when the request matches a bot definition in one of the named `files`. You pass the bot files to consult explicitly (e.g. `"legit_bots/gptbot.json"`); the helper only queries those, and matches if **any** of them matches. Matching a User-Agent alone is never enough: the source IP must also match the vendor's published ranges or pass a forward-confirmed reverse-DNS check (FCrDNS). The helper is **fail-closed** — an unparseable address, a DNS failure, or an unknown file returns `false`, so the request falls through to the normal challenge.

The bot definitions are loaded from `<datadir>/legit_bots/*.json`. The hub ships and updates them via the `crowdsecurity/appsec-bot-challenge-exclude-*` appsec-configs (search-engines, ai-crawlers, social, monitoring), which both call `MatchKnownBot` and declare the files they need in their `data:` section; you can add your own — see [Authoring your own known-bot files](whats_included.md#authoring-your-own-known-bot-files) for the file format. The shipped exclude-configs use it in `pre_eval` to exempt verified bots before the challenge is served:

```yaml
pre_eval:
  - filter: MatchKnownBot(req.RemoteAddr, req.UserAgent(), req.URL.Path, "legit_bots/gptbot.json")
    apply:
      - ExemptFromChallenge("gptbot")
```

Once `ExemptFromChallenge(reason)` has flagged a request, `SendChallenge()` becomes a no-op for the rest of that request, so the exempted client is never challenged.

### `ExemptFromChallenge` vs `GrantChallengeCookie`

Both keep a client out of the challenge, but at different scopes:

| Helper                  | Scope                          | Cookie | Use for                                                                              |
| ----------------------- | ------------------------------ | ------ | ----------------------------------------------------------------------------------- |
| `ExemptFromChallenge(reason)` | The current request only       | no     | Verified known bots, well-known paths (`robots.txt`, `/.well-known/*`, feeds, webhooks) and per-request allowlisting where no state should persist. `reason` labels the exemption in logs and the `cs_appsec_challenge_exempt_total` metric. |
| `GrantChallengeCookie(reason, ttl?)` | Persists across requests (until the cookie expires) | yes | Trusted user-agents or internal probes you want to let through for a whole session. |

## Challenge difficulty levels

`SetChallengeDifficulty(level)` accepts the following levels. Numbers are approximate proof-of-work iteration counts and rough wall-clock solve times on a modern desktop browser; mobile is meaningfully slower.

| Level          | Approx. iterations | Approx. solve time | When to use                                                                                                                  |
| -------------- | ------------------ | ------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `"disabled"`   | 0 (any nonce wins) | instant            | Functional smoke testing or when you only care about the fingerprint, not the proof-of-work.                                |
| `"low"`        | ~1 024             | 0.2 – 2 s          | Latency-sensitive endpoints, mobile-heavy traffic.                                                                           |
| `"medium"`     | ~4 096             | 1 – 8 s            | **Default.** Reasonable trade-off between user experience and attacker cost.                                                 |
| `"high"`       | ~32 768            | 7 – 60 s           | Routes under active abuse; clients you already suspect.                                                                      |
| `"impossible"` | unsolvable         | n/a                | Hard block: the AppSec component rejects the submission server-side. Use to fully block a client without leaking the reason. |

## DumpFingerprint

`DumpFingerprint(label)` is the fingerprint counterpart of [`DumpRequest`](../hooks.md#dumprequest): a threat-hunting aid that writes the decoded challenge fingerprint to disk so you can inspect it offline. It is available in the `post_eval` and `on_challenge_submit` hooks (the phases where a fingerprint is present).

Each call appends one JSON object per line (JSONL) — the fingerprint plus request context (client IP, remote address, User-Agent, host, URI, method, and a UTC timestamp) — to:

```
<datadir>/fingerprint_dumps/crowdsec_fp_dump_<label>.jsonl
```

The `label` names the file (so you can separate dumps by purpose, e.g. `"suspected-automation"`), and the call returns the path it wrote to. No configuration is required — the directory is created automatically. The call is a no-op (it logs a warning and returns an empty string) if no fingerprint is attached to the request or the dump directory cannot be created.

```yaml
on_challenge_submit:
  - filter: fingerprint.IsBot()
    apply:
      - DumpFingerprint("fast-bot-detection")
```

## The `fingerprint` object

In `on_challenge` and `on_challenge_submit` hooks, `fingerprint` exposes the device data collected by the in-browser library. It has three layers: **helper methods** for the common decisions, a **`Bot` roll-up** of the individual fast-bot signals, and the **raw signal tree** underneath when you need to branch on one specific measurement.

:::note Accessing numeric and boolean leaves
Most leaves under `fingerprint.Signals.*` are wrapped so a malformed value from the browser can't abort the whole submission. Read them through an accessor: `.Bool()` for booleans, `.Int()` for numbers — e.g. `fingerprint.Signals.Device.Memory.Int()` or `fingerprint.Signals.Automation.Webdriver.Bool()`. String leaves are read directly. The `fingerprint.Bot.*` booleans are read directly; only `fingerprint.Bot.DetectedCount` needs `.Int()`.
:::

This page enumerates the fields; the always-current source of truth is the exported Go type [`FingerprintData`](https://pkg.go.dev/github.com/crowdsecurity/crowdsec/pkg/appsec/challenge#FingerprintData).

### Top-level fields

| Field                          | Access   | Description                                                                                             |
| ------------------------------ | -------- | ------------------------------------------------------------------------------------------------------ |
| `fingerprint.IsBot`            | method   | See [verdict & signal helpers](#verdict-and-signal-helpers) — the recommended entry point.             |
| `fingerprint.FSID`             | `string` | Per-fingerprint identifier, stable across the cookie's lifetime. Useful for correlating logs.          |
| `fingerprint.Nonce`            | `string` | One-time nonce used in the challenge proof-of-work.                                                     |
| `fingerprint.Time`             | `int`    | Unix-millisecond timestamp of when the fingerprint was collected in the browser.                       |
| `fingerprint.URL`              | `string` | The URL the fingerprint was collected from.                                                            |
| `fingerprint.FastBotDetection` | `.Bool()`| The raw library verdict that `IsBot()` wraps.                                                           |
| `fingerprint.Allowlisted`      | `bool`   | `true` if the cookie was minted via `GrantChallengeCookie(...)` rather than a real challenge submission.|
| `fingerprint.AllowlistReason`  | `string` | Operator-supplied reason from `GrantChallengeCookie(reason, ...)`, copied through to logs.              |
| `fingerprint.Signals`          | object   | The full collected fingerprint tree. See [Raw signal tree](#raw-signal-tree).                          |
| `fingerprint.Bot`              | object   | Per-signal booleans, rolled up from the fast-bot-detection library. See [Bot signals](#bot-signals).  |

### Verdict and signal helpers

These methods roll the raw signals up into the decisions rules usually need — reach for these first:

| Helper                                     | Returns | Description                                                                                                            |
| ------------------------------------------ | ------- | -------------------------------------------------------------------------------------------------------------------- |
| `fingerprint.IsBot()`                      | `bool`  | The recommended verdict: `true` if the in-browser fast-bot-detection library flagged the client.                     |
| `fingerprint.HasBotSignal()`               | `bool`  | `true` if any fast-bot-detection signal fired.                                                                        |
| `fingerprint.BotSignalCount()`             | `int`   | How many distinct library signals fired.                                                                             |
| `fingerprint.BotSignals()`                 | `[]str` | The names of the library signals that fired, in stable order (e.g. `["cdp"]`). The custom mismatch checks (`ua_mobile`, `accept_language`, `timezone_country`) are **not** included here — use [`EvaluateMismatches()`](#the-mismatchreport-object) for those. |
| `fingerprint.HasAutomationSignal()`        | `bool`  | A webdriver / Selenium / CDP / Playwright / bot-UA indicator was seen.                                                |
| `fingerprint.HasHeadlessSignal()`          | `bool`  | Headless-browser indicators (headless screen resolution, missing Chrome object, SwiftShader renderer, inconsistent ETSL). |
| `fingerprint.HasMismatchSignal()`          | `bool`  | Cross-context / cross-API inconsistencies (iframe/worker webdriver, platform, WebGL, GPU, languages).                |
| `fingerprint.HasImpossibleDeviceSignal()`  | `bool`  | Device specs outside plausible bounds (impossible memory / high CPU count).                                          |

### Convenience accessors

Shortcuts that read one field out of the signal tree and hand back a native value (no `.Int()`/`.Bool()` needed):

| Helper                    | Returns  | Description                                                                                     |
| ------------------------- | -------- | ---------------------------------------------------------------------------------------------- |
| `fingerprint.UserAgent()` | `string` | The User-Agent reported by the browser.                                                        |
| `fingerprint.Platform()`  | `string` | Browser-reported platform, preferring the high-entropy client-hint value; falls back to `navigator.platform`. |
| `fingerprint.Timezone()`  | `string` | The IANA timezone reported by the browser.                                                     |
| `fingerprint.Language()`  | `string` | The browser's primary language.                                                                |
| `fingerprint.IsMobile()`  | `bool`   | `true` if the browser advertises a mobile form factor (via UA client hints).                   |
| `fingerprint.CPUCount()`  | `int`    | `navigator.hardwareConcurrency`.                                                                |
| `fingerprint.Memory()`    | `int`    | `navigator.deviceMemory`, in GB.                                                                |

### Atomic mismatch checks

These three predicates compare the fingerprint against request or geo context. [`EvaluateMismatches()`](#the-mismatchreport-object) aggregates them (and every library signal) into one report; call these directly when you only care about one.

| Helper                                          | Returns | Description                                                                                                                    |
| ----------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `fingerprint.UAMobileMismatch()`                | `bool`  | `true` if the User-Agent claims a mobile form factor but the reported viewport width is implausibly wide (≥ 1000px).          |
| `fingerprint.AcceptLanguageMismatch(req)`       | `bool`  | `true` if the request's `Accept-Language` header disagrees with the fingerprint's `navigator.language` at the base-language level. |
| `fingerprint.TimezoneCountryMismatch(country)`  | `bool`  | `true` if the fingerprint's timezone is implausible for the given ISO-3166 country code (typically from a GeoIP lookup). **Soft signal** — travelers and VPN users trigger it, so combine with other signals before blocking. |

### Bot signals

`fingerprint.Bot.*` exposes each individual fast-bot-detection signal as a boolean (read directly). The `Has*Signal()` helpers above are roll-ups over these; reach here to branch on one specific signal.

**Automation frameworks**

| Field                              | Description                                          |
| ---------------------------------- | --------------------------------------------------- |
| `fingerprint.Bot.Webdriver`        | `navigator.webdriver` is present.                   |
| `fingerprint.Bot.WebdriverWritable`| `navigator.webdriver` is writable.                  |
| `fingerprint.Bot.Selenium`         | A Selenium property was detected.                   |
| `fingerprint.Bot.CDP`              | Chrome DevTools Protocol was detected.              |
| `fingerprint.Bot.Playwright`       | Playwright was detected.                            |
| `fingerprint.Bot.BotUserAgent`     | The User-Agent matches a known-bot regex.           |

**Headless browser**

| Field                                          | Description                                            |
| ---------------------------------------------- | ----------------------------------------------------- |
| `fingerprint.Bot.HeadlessChromeScreenResolution` | Screen resolution matches headless Chrome.          |
| `fingerprint.Bot.MissingChromeObject`          | The `window.chrome` object is missing.                |
| `fingerprint.Bot.SwiftshaderRenderer`          | The GPU renderer is SwiftShader (software rendering). |
| `fingerprint.Bot.InconsistentEtsl`             | The `toString().length` probe disagrees with the claimed browser family. |

**Cross-context / cross-API mismatches**

| Field                                    | Description                                                    |
| ---------------------------------------- | ------------------------------------------------------------- |
| `fingerprint.Bot.WebdriverIframe`        | An iframe context reports `webdriver`.                        |
| `fingerprint.Bot.WebdriverWorker`        | A web-worker context reports `webdriver`.                     |
| `fingerprint.Bot.MismatchWebGLInWorker`  | WebGL output differs between the main context and a worker.   |
| `fingerprint.Bot.MismatchPlatformIframe` | The platform string differs inside an iframe.                 |
| `fingerprint.Bot.MismatchPlatformWorker` | The platform string differs inside a worker.                  |
| `fingerprint.Bot.PlatformMismatch`       | The UA-reported platform disagrees with `navigator.platform`. |
| `fingerprint.Bot.GPUMismatch`            | The GPU vendor/renderer differs between contexts.             |
| `fingerprint.Bot.MismatchLanguages`      | `navigator.languages` is internally inconsistent.             |

**Impossible device specs**

| Field                                   | Description                                    |
| --------------------------------------- | ---------------------------------------------- |
| `fingerprint.Bot.ImpossibleDeviceMemory`| Reported device memory is outside plausible bounds. |
| `fingerprint.Bot.HighCPUCount`          | CPU count is implausibly high.                 |

**Other heuristics and aggregates**

| Field                                | Description                                                                 |
| ------------------------------------ | --------------------------------------------------------------------------- |
| `fingerprint.Bot.UTCTimezone`        | Timezone is UTC (more common on VMs / headless environments).               |
| `fingerprint.Bot.AnyDetected`        | `true` if any of the signals above fired (backs `HasBotSignal()`).          |
| `fingerprint.Bot.DetectedCount.Int()`| How many fired (backs `BotSignalCount()`).                                   |

### Raw signal tree

`fingerprint.Signals.*` is the full collected fingerprint, grouped by category. The tables below cover the fields rules commonly branch on; the deeper, rarely-used sub-trees (`Browser.Features`, `Browser.Plugins`, `Browser.Extensions`, `Codecs`, ...) are shown in full in the [example](#full-example) below. Remember the `.Int()` / `.Bool()` accessors for numeric and boolean leaves.

**`fingerprint.Signals.Automation`**

| Field                          | Access    | Meaning                                     |
| ------------------------------ | --------- | ------------------------------------------- |
| `.Webdriver`                   | `.Bool()` | `navigator.webdriver` present.              |
| `.WebdriverWritable`           | `.Bool()` | `navigator.webdriver` is writable.          |
| `.Selenium`                    | `.Bool()` | Selenium property detected.                 |
| `.CDP`                         | `.Bool()` | Chrome DevTools Protocol detected.          |
| `.Playwright`                  | `.Bool()` | Playwright detected.                        |
| `.NavigatorPropertyDescriptors`| `string`  | Raw navigator property-descriptor probe.    |

**`fingerprint.Signals.Device`**

| Field                | Access    | Meaning                                              |
| -------------------- | --------- | ---------------------------------------------------- |
| `.CPUCount`          | `.Int()`  | `navigator.hardwareConcurrency`.                     |
| `.Memory`            | `.Int()`  | `navigator.deviceMemory`, in GB.                     |
| `.Platform`          | `string`  | `navigator.platform`.                                |
| `.ScreenResolution`  | object    | Screen/viewport geometry (see below).                |
| `.MultimediaDevices` | object    | Counts of speakers/microphones/webcams (see below).  |
| `.MediaQueries`      | object    | CSS media-query probes (see below).                  |

`fingerprint.Signals.Device.ScreenResolution`: `.Width`, `.Height`, `.PixelDepth`, `.ColorDepth`, `.AvailableWidth`, `.AvailableHeight`, `.InnerWidth`, `.InnerHeight` (`.Int()`), `.HasMultipleDisplays` (`.Bool()`).

`fingerprint.Signals.Device.MultimediaDevices`: `.Speakers`, `.Microphones`, `.Webcams` (`.Int()`).

`fingerprint.Signals.Device.MediaQueries`: `.PrefersColorScheme`, `.ColorGamut`, `.Pointer`, `.AnyPointer` (`string`); `.PrefersReducedMotion`, `.PrefersReducedTransparency`, `.Hover`, `.AnyHover` (`.Bool()`); `.ColorDepth` (`.Int()`).

**`fingerprint.Signals.Browser`** (top level — see the [example](#full-example) for the `Features` / `Plugins` / `Extensions` / `HighEntropyValues` / `ToSourceError` sub-trees)

| Field               | Access   | Meaning                                                            |
| ------------------- | -------- | ----------------------------------------------------------------- |
| `.UserAgent`        | `string` | The User-Agent string.                                            |
| `.ETSL`             | `.Int()` | `Function.prototype.toString().length` consistency probe.          |
| `.Maths`            | `string` | Hash of `Math` function outputs (engine fingerprint).             |
| `.Features`         | object   | ~28 browser-capability booleans.                                  |
| `.Plugins`          | object   | Plugin-array consistency probes.                                  |
| `.Extensions`       | object   | Detected-extension bitmask and list.                             |
| `.HighEntropyValues`| object   | UA client-hint high-entropy values (`platform`, `mobile`, `brands`, ...). |
| `.ToSourceError`    | object   | `toSource` probe (`.HasToSource` `.Bool()`, `.ToSourceError` `string`). |

**`fingerprint.Signals.Graphics`**

| Field                       | Access    | Meaning                                       |
| --------------------------- | --------- | --------------------------------------------- |
| `.WebGL.Vendor`             | `string`  | WebGL unmasked vendor.                        |
| `.WebGL.Renderer`           | `string`  | WebGL unmasked renderer.                      |
| `.WebGPU.Vendor`            | `string`  | WebGPU adapter vendor.                        |
| `.WebGPU.Architecture`      | `string`  | WebGPU adapter architecture.                  |
| `.WebGPU.Device`            | `string`  | WebGPU adapter device.                        |
| `.WebGPU.Description`       | `string`  | WebGPU adapter description.                   |
| `.Canvas.HasModifiedCanvas` | `.Bool()` | Canvas output looks tampered with.            |
| `.Canvas.CanvasFingerprint` | `string`  | Canvas-rendering hash.                        |

**`fingerprint.Signals.Locale`**

| Field                                | Access    | Meaning                              |
| ------------------------------------ | --------- | ------------------------------------ |
| `.Internationalization.Timezone`     | `string`  | IANA timezone.                       |
| `.Internationalization.LocaleLanguage`| `string` | `Intl`-reported locale language.     |
| `.Languages.Language`                | `string`  | `navigator.language`.                |
| `.Languages.Languages`               | `[]str`   | `navigator.languages`.               |

**`fingerprint.Signals.Contexts`**

| Field                        | Access    | Meaning                                           |
| ---------------------------- | --------- | ------------------------------------------------- |
| `.Iframe.Webdriver`          | `.Bool()` | `webdriver` seen from a nested iframe context.    |
| `.Iframe.UserAgent`          | `string`  | UA reported inside an iframe.                     |
| `.Iframe.Platform`           | `string`  | Platform reported inside an iframe.               |
| `.Iframe.Memory`             | `.Int()`  | `deviceMemory` reported inside an iframe.         |
| `.Iframe.CPUCount`           | `.Int()`  | `hardwareConcurrency` reported inside an iframe.  |
| `.Iframe.Language`           | `string`  | Language reported inside an iframe.               |
| `.WebWorker.Vendor`          | `string`  | WebGL vendor reported inside a worker.            |
| `.WebWorker.Renderer`        | `string`  | WebGL renderer reported inside a worker.          |
| `.WebWorker.UserAgent`       | `string`  | UA reported inside a worker.                      |
| `.WebWorker.Language`        | `string`  | Language reported inside a worker.                |
| `.WebWorker.Platform`        | `string`  | Platform reported inside a worker.                |
| `.WebWorker.Memory`          | `.Int()`  | `deviceMemory` reported inside a worker.          |
| `.WebWorker.CPUCount`        | `.Int()`  | `hardwareConcurrency` reported inside a worker.   |

### Full example

A complete decoded fingerprint as written by [`DumpFingerprint`](#dumpfingerprint) and exposed under `fingerprint` in expr. Every category is populated here so nothing is left to guess; the `Bot` roll-up and the helper methods above are all derived from this same data.

```json
{
  "signals": {
    "automation": {
      "webdriver": false,
      "webdriverWritable": false,
      "selenium": false,
      "cdp": false,
      "playwright": false,
      "navigatorPropertyDescriptors": "ok"
    },
    "device": {
      "cpuCount": 8,
      "memory": 8,
      "platform": "MacIntel",
      "screenResolution": {
        "width": 1920, "height": 1080, "pixelDepth": 24, "colorDepth": 24,
        "availableWidth": 1920, "availableHeight": 1055,
        "innerWidth": 1280, "innerHeight": 720, "hasMultipleDisplays": false
      },
      "multimediaDevices": { "speakers": 1, "microphones": 1, "webcams": 1 },
      "mediaQueries": {
        "prefersColorScheme": "light", "prefersReducedMotion": false,
        "prefersReducedTransparency": false, "colorGamut": "srgb",
        "pointer": "fine", "anyPointer": "fine", "hover": true, "anyHover": true,
        "colorDepth": 24
      }
    },
    "browser": {
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
      "features": {
        "bitmask": "1f3a", "chrome": true, "brave": false, "applePaySupport": false,
        "opera": false, "serial": true, "attachShadow": true, "caches": true,
        "webAssembly": true, "buffer": false, "showModalDialog": false, "safari": false,
        "webkitPrefixedFunction": true, "mozPrefixedFunction": false, "usb": true,
        "browserCapture": false, "paymentRequestUpdateEvent": true, "pressureObserver": true,
        "audioSession": false, "selectAudioOutput": true, "barcodeDetector": true,
        "battery": true, "devicePosture": false, "documentPictureInPicture": true,
        "eyeDropper": true, "editContext": true, "fencedFrame": false, "sanitizer": false,
        "otpCredential": true
      },
      "plugins": {
        "isValidPluginArray": true, "pluginCount": 5, "pluginNamesHash": "a1b2c3",
        "pluginConsistency1": true, "pluginOverflow": false
      },
      "extensions": { "bitmask": "00", "extensions": [] },
      "highEntropyValues": {
        "architecture": "arm", "bitness": "64",
        "brands": [
          { "brand": "Chromium", "version": "148" },
          { "brand": "Google Chrome", "version": "148" }
        ],
        "mobile": false, "model": "", "platform": "macOS",
        "platformVersion": "15.0.0", "uaFullVersion": "148.0.0.0"
      },
      "etsl": 33,
      "maths": "d41d8cd9",
      "toSourceError": { "toSourceError": "", "hasToSource": false }
    },
    "graphics": {
      "webGL": { "vendor": "Google Inc. (Apple)", "renderer": "ANGLE (Apple, Apple M3, OpenGL 4.1)" },
      "webgpu": { "vendor": "apple", "architecture": "metal-3", "device": "", "description": "" },
      "canvas": { "hasModifiedCanvas": false, "canvasFingerprint": "9f8e7d6c" }
    },
    "codecs": {
      "audioCanPlayTypeHash": "c1a2", "videoCanPlayTypeHash": "b3d4",
      "audioMediaSourceHash": "e5f6", "videoMediaSourceHash": "a7b8",
      "rtcAudioCapabilitiesHash": "c9d0", "rtcVideoCapabilitiesHash": "e1f2",
      "hasMediaSource": true
    },
    "locale": {
      "internationalization": { "timezone": "Europe/Paris", "localeLanguage": "en-US" },
      "languages": { "languages": ["en-US", "en", "fr"], "language": "en-US" }
    },
    "contexts": {
      "iframe": {
        "webdriver": false, "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ...",
        "platform": "MacIntel", "memory": 8, "cpuCount": 8, "language": "en-US"
      },
      "webWorker": {
        "vendor": "Google Inc. (Apple)", "renderer": "ANGLE (Apple, Apple M3, OpenGL 4.1)",
        "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ...",
        "language": "en-US", "platform": "MacIntel", "memory": 8, "cpuCount": 8
      }
    }
  },
  "fsid": "FS1_9f2c8a1b",
  "nonce": "b7c1e2f0",
  "time": 1770669806462,
  "url": "https://example.com/checkout",
  "fastBotDetection": false
}
```

For the higher-level bot detection workflow (what the library actually detects, how to allowlist legitimate bots, behavioral scenarios), see [Bot detection](intro.md).

## The `MismatchReport` object

`EvaluateMismatches()` returns a cached-per-request `MismatchReport` summarising every mismatch signal that fired against the current fingerprint. It aggregates the library-native bot signals **and** the CrowdSec custom checks (`ua_mobile`, `accept_language`, `timezone_country`) into one severity-scored report.

| Method                       | Returns    | Description                                                                |
| ---------------------------- | ---------- | -------------------------------------------------------------------------- |
| `.Count()`                   | `int`      | Total number of signals fired.                                             |
| `.Empty()`                   | `bool`     | `true` if no signal fired.                                                 |
| `.High() / .Medium() / .Low()` | `int`    | Count of fired signals by severity.                                        |
| `.BySeverity(sev str)`       | `int`      | Count of fired signals at the given severity (`"high"`, `"medium"`, `"low"`) — the generic form of `.High()` / `.Medium()` / `.Low()`. |
| `.Has(reason str)`           | `bool`     | `true` if the specific signal `reason` fired.                              |
| `.Reasons()`                 | `[]string` | Stable-ordered list of fired reason keys.                                  |
| `.String()`                  | `str`      | Compact human-readable form: `"reason1(sev),reason2(sev)"`. Useful in logs. |

### Reasons and severities

The reason keys accepted by `.Has(reason)` and returned by `.Reasons()`, with their severity:

| Reason                        | Severity | Meaning                                                                   |
| ----------------------------- | -------- | ------------------------------------------------------------------------- |
| `cdp`                         | high     | Chrome DevTools Protocol detected.                                        |
| `webdriver`                   | high     | `navigator.webdriver` present.                                            |
| `webdriver_writable`          | high     | `navigator.webdriver` is writable.                                        |
| `selenium`                    | high     | Selenium property detected.                                               |
| `playwright`                  | high     | Playwright detected.                                                      |
| `webdriver_iframe`            | high     | An iframe context reports `webdriver`.                                    |
| `webdriver_worker`            | high     | A web-worker context reports `webdriver`.                                 |
| `headless_screen_resolution` | high     | Screen resolution matches headless Chrome.                               |
| `missing_chrome_object`       | high     | `window.chrome` object missing.                                          |
| `impossible_memory`           | high     | Reported device memory outside plausible bounds.                          |
| `high_cpu_count`              | high     | CPU count implausibly high.                                              |
| `mismatch_webgl_worker`       | high     | WebGL output differs between main context and worker.                    |
| `mismatch_platform_iframe`    | high     | Platform string differs inside an iframe.                                |
| `mismatch_platform_worker`    | high     | Platform string differs inside a worker.                                 |
| `platform_mismatch`           | high     | UA-reported platform disagrees with `navigator.platform`.                |
| `gpu_mismatch`                | high     | GPU vendor/renderer differs between contexts.                            |
| `bot_user_agent`              | high     | User-Agent matches a known-bot regex.                                    |
| `inconsistent_etsl`           | high     | `toString().length` probe disagrees with the claimed browser family.     |
| `utc_timezone`                | medium   | Timezone is UTC (more common on VMs / headless).                         |
| `ua_mobile`                   | medium   | Mobile UA but implausibly wide viewport (see `UAMobileMismatch()`).      |
| `accept_language`             | medium   | `Accept-Language` header disagrees with `navigator.language`.            |
| `swiftshader_renderer`        | low      | GPU renderer is SwiftShader (software rendering).                        |
| `mismatch_languages`          | low      | `navigator.languages` is internally inconsistent.                       |
| `timezone_country`            | low      | Timezone implausible for the geolocated country. Soft signal.           |

:::note The reason set evolves
These reasons derive from the [fpscanner](https://github.com/antoinevastel/fpscanner) signals plus a few CrowdSec-authored checks, and may change as fpscanner and browsers evolve — treat the table above as the current shape, not a stable contract. The always-current source of truth is the exported Go API: [`KnownReasons()`](https://pkg.go.dev/github.com/crowdsecurity/crowdsec/pkg/appsec/challenge#KnownReasons) returns the full set the aggregator may emit, and [`SeverityFor(reason)`](https://pkg.go.dev/github.com/crowdsecurity/crowdsec/pkg/appsec/challenge#SeverityFor) gives each key's severity.
:::

Example:

```yaml
on_challenge_submit:
  - filter: EvaluateMismatches().High() >= 1 && EvaluateMismatches().Has("cdp")
    apply:
      - RejectSubmission("high-severity-mismatch")
```
