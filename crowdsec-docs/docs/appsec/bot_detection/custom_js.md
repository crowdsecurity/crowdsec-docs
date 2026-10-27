---
id: custom_js
title: "Custom Detection Scripts"
sidebar_label: "Custom detection scripts"
description: "Extend the CrowdSec bot-detection fingerprint with your own JavaScript: ship detection scripts through an appsec-config, report custom signals, clear false positives, and act on them in hooks."
sidebar_position: 5
---

The challenge page collects a fixed set of device signals with the built-in fingerprinting library. Custom detection scripts let you extend it: small JavaScript modules, declared in an appsec-config, that run in the visitor's browser right after the built-in collection and before the fingerprint is submitted. A script can:

- **report its own signals** in `fp.custom`, which your hooks then read as [`fingerprint.Custom`](#reading-custom-signals-in-hooks).
- **correct the built-in detection**, for example clear a signal that is a known false positive for your audience.

Scripts are shipped as appsec-config data files, so the hub can distribute new detections and false-positive fixes without a CrowdSec release, and you can add your own the same way.

## Writing a script

A detection script is an ES module that exports one function, `collectSignals`. It receives the collected fingerprint object, and can modify it in place:

```js
// /var/lib/crowdsec/data/challenge/mycorp-detections.js
export function collectSignals(fp) {
  fp.custom = fp.custom || {};

  // Report a signal of your own
  fp.custom.mycorp_no_touch_on_mobile =
    /Mobi/.test(navigator.userAgent) && navigator.maxTouchPoints === 0;

  // Clear a built-in signal that misfires for your audience
  if (fp.fastBotDetectionDetails?.hasUTCTimezone) {
    fp.fastBotDetectionDetails.hasUTCTimezone.detected = false;
  }
}
```

`collectSignals` can be `async`, for checks that need to wait on a browser API.

The rules a script has to follow:

- **It must be self-contained.** `import`, `require()` and dynamic `import()` of another file or package are refused: put everything the script needs in the file itself.
- **It must export a function named `collectSignals`.** A script without it is refused.
- **`fp.custom` may not exist yet**: create it if needed, and add keys to it rather than replacing it, since several scripts can contribute to it.
- **Values in `fp.custom`** can be a boolean, a string, a number, an array of strings or an array of numbers. Any other shape (objects, mixed arrays) is ignored.
- **Keep `fp.custom` small.** It is stored in the challenge cookie, whose size is capped by [`max_cookie_size`](configuration.md#advanced-tuning). If it doesn't fit, the custom signals are dropped from the cookie and CrowdSec logs a warning.
- **Use a `dest_file` made of letters, digits and `._/-` only.** A script with any other character in its name is refused.

Fields of the built-in fingerprint are listed in [The `fingerprint` object](hooks.md#the-fingerprint-object). The built-in signals live in `fp.fastBotDetectionDetails`, each as `{ detected: <bool> }` under its camel-case name (`hasCDP`, `hasUTCTimezone`, `hasWebdriver`, …). After the scripts have run, the overall bot verdict is recomputed from them, so clearing a signal also clears the verdict when it was the only one. The fingerprint id (`fsid`) is computed before the scripts run, and isn't affected by them.

### Failures and time budget

Each script is isolated: a script that fails to build is refused at startup and the others are still loaded, and a script that throws in the browser only loses its own changes. The challenge always completes.

All the scripts share a time budget, set by [`custom_js_timeout`](configuration.md#advanced-tuning) (`500ms` by default). It is time the visitor spends looking at the challenge page, so keep it short. Once it is spent, the challenge is submitted without waiting for the scripts still running.

## Loading a script

Scripts are declared in the `data:` section of an appsec-config, with the `challenge-js` type. `dest_file` is relative to the CrowdSec data directory (`/var/lib/crowdsec/data/` by default):

```yaml
# /etc/crowdsec/appsec-configs/mycorp-detections.yaml
name: mycorp/appsec-bot-detections
data:
  - dest_file: challenge/mycorp-detections.js
    type: challenge-js
```

You can also set a `source_url` in your own appsec-configs. `cscli hub upgrade` then downloads the script to `dest_file`, and downloads it again on every later `cscli hub upgrade`. It is only fetched by `cscli hub upgrade`, so run it once after adding the appsec-config, before reloading CrowdSec:

```yaml
data:
  - source_url: https://example.com/crowdsec/mycorp-detections.js
    dest_file: challenge/mycorp-detections.js
    type: challenge-js
```

```bash
sudo cscli hub upgrade
sudo systemctl reload crowdsec
```

Without a `source_url`, put the file at `dest_file` yourself.

Load the appsec-config from your AppSec acquisition, like any other [overlay](customization.md#recipes), and reload CrowdSec. Scripts from all the loaded appsec-configs are combined, and run in the order they are declared. A `dest_file` declared more than once is only loaded once.

On startup, CrowdSec logs which scripts were loaded, along with a short version digest:

```
level=info msg="loaded 1 custom detection scripts" bytes=1342 scripts=challenge/mycorp-detections.js version=3fa2c1d8
```

A script that was refused is logged with the reason and, when possible, the line it failed on:

```
level=error msg="custom detection script challenge/mycorp-detections.js rejected: challenge/mycorp-detections.js:1:14: cannot import \"./util.js\": a detection module must be self-contained"
```

The combined script is served to the browser at `/crowdsec-internal/challenge/custom.js` (see [Internal challenge endpoints](challenge_protocol.md#internal-challenge-endpoints)).

## Reading custom signals in hooks

The values reported in `fp.custom` are available in `on_challenge_submit` and, since they are stored in the challenge cookie, in `on_challenge` on the client's later requests:

| Field / helper | Type | Description |
|---|---|---|
| `fingerprint.Custom["key"]` | object | The value reported under `key`. Read it with the field matching its type: `.Bool`, `.Str`, `.Number`, `.Strings` or `.Floats`. A key that wasn't reported reads as `false`, `""`, `0` or an empty list. |
| `fingerprint.HasCustom(key)` | `func(key str) bool` | `true` if a script reported `key`, whatever its value. Use it to tell a signal reported as `false` from one that was never reported. |
| `fingerprint.CustomKeys()` | `func() []str` | The reported keys, sorted. |

For example, to score the signal reported by the script above:

```yaml
name: mycorp/appsec-bot-detections
data:
  - dest_file: challenge/mycorp-detections.js
    type: challenge-js
inband:
  on_challenge_submit:
    - filter: fingerprint.Custom["mycorp_no_touch_on_mobile"].Bool
      apply:
        - AddRequestScore(30, "mycorp_no_touch_on_mobile")
```

Custom signals also show up in the output of [`DumpFingerprint`](hooks.md#dumpfingerprint), under `custom`, which is the easiest way to check what your script reports.

## Content-Security-Policy

Detection scripts can use WebAssembly, so the challenge page's `Content-Security-Policy` allows `'wasm-unsafe-eval'` in `script-src`. A policy set by your web server must allow it too if your scripts rely on WebAssembly. See [Content-Security-Policy](enable.md#content-security-policy).
