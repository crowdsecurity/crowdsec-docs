---
id: bot_detections
title: "Contributing Bot Detections"
sidebar_label: "Bot Detections"
description: "How to contribute a bot detection to the CrowdSec hub: the appsec-config conventions, the experimental score category a new signal ships under, and how a detection is validated without hubtest support."
---

A bot detection is an appsec-config, optionally paired with a JavaScript module that collects extra data in the browser. It ships through the hub, without an engine release.

Read [Signals](/appsec/bot_detection/signals.md) first. The shared PR workflow is on [Contributing to the Hub](intro.md).

## What a contribution looks like

Add an appsec-config named `appsec-bot-challenge-detect-NAME` under `appsec-configs/AUTHOR/`, with rules in the `on_challenge_submit` hook. Replace `NAME` with a short name for what the detection checks, and `AUTHOR` with your hub author name. The config takes one of two forms.

**Reading data the challenge already collects.** Prefer this when the fingerprint or the request headers already hold what you need: it costs the visitor nothing, and there is no script for a client to notice or block. For example:

```yaml
name: crowdsecurity/appsec-bot-challenge-detect-form-factor
inband:
  on_challenge_submit:
    # Every browser on iOS is WebKit, so Blink's window.chrome surface
    # cannot exist there.
    - filter: 'req.UserAgent() contains "iPhone" && string(fingerprint.Signals.Browser.Features.Chrome) == "true"'
      apply:
        - AddRequestScore(0, "ios_blink_surface", "detect-experimental-form-factor")  # intended weight: 100
```

**Collecting new data.** Declare a [detection script](/appsec/bot_detection/custom_js.md) in `data:` with `type: challenge-js`:

```yaml
data:
  - source_url: https://hub-data.crowdsec.net/custom-bot-detections/fonts-v1.js
    dest_file: challenge/fonts.js
    type: challenge-js
```

The script reports into `fp.custom`, and the config scores it through `fingerprint.Custom[...]`.

:::note
Scripts are served from `hub-data.crowdsec.net` and published separately from your pull request. Open an issue before writing one.
:::

## Conventions

**Ship experimental.** Every rule in a new config uses `AddRequestScore(0, …)` with a `detect-experimental-MODULE` category, and records the intended weight in a comment:

```yaml
- AddRequestScore(0, "arm_platform_on_x86_ios", "detect-experimental-cpu")  # intended weight: 100
```

**Register the category with `warn-experimental`.** `appsec-bot-challenge-warn-experimental` raises alerts for a fixed list of categories, not for every `detect-experimental-*` prefix. Add your new category to its filter, or your signal fires without anyone seeing it.

**Use one category for the whole file**, so operators can cap or cancel the family with `SetRequestScore` without naming each signal.

**Guard every rule on its input being present**, so a signal scores nothing when the measurement was impossible. The client-hints rules check that the hint was sent:

```yaml
- filter: >-
    req.Header.Get("Sec-CH-UA-Platform") != "" &&
    req.UserAgent() contains "Windows NT" &&
    !(req.Header.Get("Sec-CH-UA-Platform") contains "Windows")
```

**Report whether the script ran.** Add a rule per reported key, so a script that never ran is distinguishable from one that found nothing:

```yaml
- filter: '!fingerprint.HasCustom("cfFontBase")'
  apply:
    - AddRequestScore(0, "missing_cf_font_base", "detect-experimental-fonts")
```

Write every key on every run, with a sentinel when the measurement is impossible, so an absent key always means the script failed.

**Justify the weight and name the false positives.** Add a comment per rule explaining what the signal catches and which real clients also trigger it. For example:

> Scored at 50, not 100: the same policy is reachable by a real visitor through uBlock Origin's optional WebRTC toggle or an enterprise `WebRtcIPHandling` policy. No mainstream browser ships it as a default.

**Don't match on a category prefix.** `RequestScoreReasons()` renders `CATEGORY:NAME`, and the category changes when a signal is promoted. A rule that depends on another rule should match the name, for example `# contains ":os_font_missing_"`, not `hasPrefix(#, "detect:…")`.

## Test your detection

`cscli hubtest` cannot exercise `on_challenge_submit`, build a fingerprint or assert on a score, so no CI job catches a regression in a detection. Instead:

- **Exclusions.** [`cscli bot match`](/cscli/cscli_bot_match.md) runs the same check as `MatchKnownBot()`.
- **Fingerprint signals.** [`cscli bot fsid`](/cscli/cscli_bot_fsid.md) decodes a client's fingerprint id, and [`DumpFingerprint`](/appsec/bot_detection/hooks.md#dumpfingerprint) writes whole fingerprints to disk.
- **Detections.** Run the automation you target and a real browser through the config and compare, then deploy at weight 0 and read the `crowdsecurity/suspicious-browser-submission` alerts.

## Acceptance bar

**For a new detection:** a measurement you can describe, a named false-positive population, weight 0 under an experimental category, and membership of [`appsec-bot-challenge-detections-extra`](https://app.crowdsec.net/hub/author/crowdsecurity/collections/appsec-bot-challenge-detections-extra).

**For a new good-bot exclusion:** the crawler must publish verifiable IP ranges, or support forward-confirmed reverse DNS. `MatchKnownBot()` verifies the network, never the User-Agent, so a bot identifiable only by its UA cannot be exempted. Add the bot description file under `legit_bots/` and declare it in the config's `data:` section, as described in [Authoring your own known-bot files](/appsec/bot_detection/customization.md#authoring-your-own-known-bot-files).

## Collection membership

A new config must join one of these collections:

| Collection | For |
|---|---|
| `appsec-bot-challenge-detections-extra` | opt-in detections |
| `appsec-bot-challenge-detections` | detections enabled by default |
| `appsec-bot-challenge-good-bots` | identity exclusions |
| `appsec-bot-challenge-exclude-paths` | path exclusions |

Don't send changes to `appsec-bot-challenge-scoring*`. Its thresholds and built-in weights affect every install.
