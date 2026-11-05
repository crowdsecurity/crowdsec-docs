---
id: whats_included
title: "Bot Detection Default Configuration"
sidebar_label: "Default Configuration"
description: "What the crowdsecurity/appsec-bot-challenge collection installs: the two scoring and threshold appsec-configs, plus the behavioral scenarios it ships with."
sidebar_position: 3
---

Everything on this page comes from the [`crowdsecurity/appsec-bot-challenge`](https://app.crowdsec.net/hub/author/crowdsecurity/collections/appsec-bot-challenge) collection. [Installing it](enable.md) turns all of it on.

## The two appsec-configs it installs

Bot detection is split in two: one config computes a score, another decides what score is too high. Because the two are separate, you can add signals or re-weight the ones that don't suit your traffic in a config of your own, leaving both shipped configs untouched. See [Customization & recipes](customization.md).

[`appsec-bot-challenge-scoring`](https://app.crowdsec.net/hub/author/crowdsecurity/waf-configurations/appsec-bot-challenge-scoring) serves the challenge and scores what comes back, weighted as in [How a request is scored](#how-a-request-is-scored). It never rejects.

[`appsec-bot-challenge-scoring-balanced`](https://app.crowdsec.net/hub/author/crowdsecurity/waf-configurations/appsec-bot-challenge-scoring-balanced) is the threshold, and holds the only rule that rejects. It is a single score comparison, so changing strictness means installing a different threshold config.

## How a request is scored

Every signal that fires adds points. Scores accumulate, so a client tripping two moderate signals can cross a threshold that neither would reach alone.

:::note
Signals are added over time, so this table is a snapshot and will differ from what your version ships. Treat it as examples. The accurate list for your install is the `score_reasons` on your own alerts.
:::

| Points | Signals | Why this weight |
|---|---|---|
| 100 | `cdp`, `webdriver`, `webdriver_writable`, `selenium`, `playwright`, `webdriver_iframe`, `webdriver_worker`, `bot_user_agent` | An automation framework is driving the browser, or the client declares itself a bot in its User-Agent. There is no honest reason for these to be present on a client that solved the challenge. |
| 50 | `headless_screen_resolution`, `missing_chrome_object`, `impossible_memory`, `inconsistent_etsl`, `mismatch_webgl_worker`, `mismatch_platform_iframe`, `mismatch_platform_worker` | Headless environments and cross-context inconsistencies. Hard to fake away, but each has a thin tail of real clients. |
| 30 | `platform_mismatch`, `gpu_mismatch`, `high_cpu_count` | Suspicious, but reachable by odd-but-real setups: VMs and remote desktops. |
| 15 | `utc_timezone`, `ua_mobile`, `accept_language` | Common enough among real visitors that acting on one alone would be a false positive. Servers, VPNs and privacy tooling all produce a UTC timezone. |
| 5 | `swiftshader_renderer`, `mismatch_languages`, `timezone_country` | Only meaningful in aggregate. `timezone_country` fires on any traveller or VPN user. |

A headless Chrome driven over CDP in a UTC container scores `cdp=100` plus `utc_timezone=15`, so 115, over every threshold the collection ships.

That table covers the signals the engine computes itself. Signals shipped by the hub's detection configs feed the same score. See [Signals](signals.md).

## Choosing a threshold

Three bundles ship the same scoring engine and exclusions, and differ only in where they reject:

| Collection | Rejects at | Use when |
|---|---|---|
| `crowdsecurity/appsec-bot-challenge` | `>= 75` | The default. Catches automation frameworks and headless browsers without acting on weak signals. |
| `crowdsecurity/appsec-bot-challenge-strict` | `>= 45` | You would rather turn away a few real visitors than let a bot through. |
| `crowdsecurity/appsec-bot-challenge-permissive` | `>= 100` | Only near-certain automation. Minimises false positives. |

Install exactly one of them. To change strictness later, install a different one: editing a hub config marks it [tainted](../configuration_creation_testing.md), which stops it receiving updates.

They are also built from reusable collections, if you want to compose your own bundle:

| Collection | Contains |
|---|---|
| `crowdsecurity/appsec-bot-challenge-scoring` | The scoring engine, which serves the challenge and computes the score but never rejects |
| `crowdsecurity/appsec-bot-challenge-detections` | The detection configs, which add [signals](signals.md) beyond the engine's built-in ones |
| `crowdsecurity/appsec-bot-challenge-good-bots` | The verified-bot exclusion configs |
| `crowdsecurity/appsec-bot-challenge-exclude-paths` | The path exclusion configs |

## The alerts it produces

A submission over the threshold is refused its cookie and logged. The log line carries the score in `reason` and the signals that fired in `signals`, so you can tell a false positive from a real bot without reproducing the request.

Rejections also become alerts. There are two kinds, and they answer different questions:

| Aspect | Per-submission alert | Behavioral scenario alert |
|---|---|---|
| Scenario | `crowdsecurity/rejected-browser-submission` | `crowdsecurity/appsec-bot-challenge-too-many-*` |
| Kind | `bot-detection` | `crowdsec` |
| Fires | Once per rejected submission | Once an IP crosses a rate over time |
| Answers | Why was this client refused? | Which IP is worth blocking? |
| Remediation | Alert only | Block |

Only the behavioral scenarios create decisions. A single rejected submission tells you what happened, it does not ban anyone.

A third scenario, `crowdsecurity/suspicious-browser-submission`, covers submissions that were accepted but flagged. The client keeps its cookie, and CrowdSec still raises an alert.

Both per-submission scenarios carry the `bot-detection` kind, so `cscli alerts list --kind bot-detection` separates them from your WAF and log-based alerts. The behavioral scenarios are ordinary `crowdsec` alerts.

### Reading a rejection

The collection ships the `crowdsecurity/appsec-bot-detection` alert context so a rejection stays explainable after the fact. Inspect one with `cscli alerts inspect <id> -d`, and read `score_reasons` first. It breaks the score down per signal, so a decisive `cdp=100` is easy to separate from weak signals that only just added up. The first is a bot. The second usually means your threshold is too low for your traffic.

`fingerprint_id` (the `fsid`) is stable per device profile, so a scraper rotating addresses keeps the same `fsid`. [`cscli bot fsid`](/cscli/cscli_bot_fsid.md) decodes it.

The same context in the Console:

![Score breakdown on a bot-detection alert in the Console](/img/appsec/bot_detection/console-alert-context.png)

The shipped context exposes a readable subset of what the event carries. To surface more, see [Event fields for alert context](hooks.md#event-fields-for-alert-context).

## Behavioral scenarios it installs

Per-request hooks only see the request in front of them. The collection also installs two scenarios that look across requests and create decisions for repeat offenders:

| Scenario | Type | What it catches | Outcome |
|---|---|---|---|
| `crowdsecurity/appsec-bot-challenge-too-many-requests` | leaky | An IP is served the challenge page repeatedly but never submits it. | Block |
| `crowdsecurity/appsec-bot-challenge-too-many-submissions` | leaky | An IP submits the challenge many times, typical of an automated solver or a script brute-forcing the fingerprint. | Block |

## Known bots it lets through

Search-engine crawlers, uptime probes and AI crawlers will never solve a JavaScript challenge, and blocking them costs you indexing and monitoring. The collection exempts them.

To be exempted, a client's IP must belong to the vendor's published ranges or pass a forward-confirmed reverse-DNS lookup. A User-Agent on its own proves nothing: a bot claiming to be Googlebot from an address that isn't Google's gets challenged like anything else, so the exemption cannot be turned into a bypass.

The families are split across separate configs so you can install only the ones you need:

| Appsec-config | Bots it verifies |
|---|---|
| [`crowdsecurity/appsec-bot-challenge-exclude-search-engines`](https://app.crowdsec.net/hub/author/crowdsecurity/waf-configurations/appsec-bot-challenge-exclude-search-engines) | Search-engine crawlers |
| [`crowdsecurity/appsec-bot-challenge-exclude-ai-crawlers`](https://app.crowdsec.net/hub/author/crowdsecurity/waf-configurations/appsec-bot-challenge-exclude-ai-crawlers) | AI crawlers and assistant user-agents |
| [`crowdsecurity/appsec-bot-challenge-exclude-google-ads`](https://app.crowdsec.net/hub/author/crowdsecurity/waf-configurations/appsec-bot-challenge-exclude-google-ads) | Google advertising crawlers |
| [`crowdsecurity/appsec-bot-challenge-exclude-wikimedia-citation`](https://app.crowdsec.net/hub/author/crowdsecurity/waf-configurations/appsec-bot-challenge-exclude-wikimedia-citation) | Wikimedia citation and reference-fetching services |
| [`crowdsecurity/appsec-bot-challenge-exclude-social`](https://app.crowdsec.net/hub/author/crowdsecurity/waf-configurations/appsec-bot-challenge-exclude-social) | Social-network link unfurlers |
| [`crowdsecurity/appsec-bot-challenge-exclude-monitoring`](https://app.crowdsec.net/hub/author/crowdsecurity/waf-configurations/appsec-bot-challenge-exclude-monitoring) | Uptime and monitoring probes |

Each family grows as vendors are added to the hub, so the rows link to their hub pages rather than listing bots here. [`cscli bot match`](/cscli/cscli_bot_match.md) answers whether a specific client would be exempted, and [Authoring your own known-bot files](customization.md#authoring-your-own-known-bot-files) covers adding one of your own.

## Path-exclusion configs

The exemptions above identify the *client*. These identify the *route*: some paths are hit by design by things that will never run JavaScript: crawler metadata, feeds, third-party webhooks, static assets, API endpoints. Challenging them produces nothing but false positives.

| Appsec-config | Exempts |
|---|---|
| `crowdsecurity/appsec-bot-challenge-exclude-crawler-files` | `/robots.txt`, `/.well-known/*`, `/security.txt`, `/sitemap.xml`, `/ads.txt`, … |
| `crowdsecurity/appsec-bot-challenge-exclude-feeds` | RSS/Atom feed paths (`/feed`, `/rss`, `/atom.xml`, …) |
| `crowdsecurity/appsec-bot-challenge-exclude-webhooks` | `/webhooks/*` |
| `crowdsecurity/appsec-bot-challenge-exclude-static` | static assets and media (`.css`, `.js`, images, fonts, `/manifest.json`, …) |
| `crowdsecurity/appsec-bot-challenge-exclude-api` | programmatic endpoints (`/api/*`, `/graphql`, `/wp-json/*`, `/oauth/*`, …) |

They are separate configs so you can drop any that don't apply to your app. Keeping all five on gives you fewer false positives. [Enable bot detection](enable.md#install-the-collection) shows how to load them from your acquisition. To add your own exclusions, ship a custom appsec-config rather than editing these.

For the request flow end to end and the device data the challenge collects, see [How it works](how_it_works.md).
