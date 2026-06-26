---
id: intro
title: Bot detection
sidebar_position: 1
---

<!--
  Several hub names below are placeholders pending publication; they are written
  as `_XX_<DESCRIPTIVE_NAME>_XX_` so they can be `sed`-swept once the final
  names land.
-->

Bot detection allows you to block automation before it reaches the application. Where the rest of the WAF reacts to *what a user does* — the payloads they send, the endpoints they hit, the patterns they trigger — bot detection answers a different question: *what a user is*, a real browser or a script pretending to be one.

## What bot detection does

Bot detection separates humans from automation. Real browsers pass the check transparently and continue as usual; bots, headless browsers and clients that don't execute JavaScript are filtered out — by the AppSec component for the obvious cases, and by CrowdSec scenarios for the repeat offenders.

It runs as an extra layer on top of your existing WAF, sharing the same hooks system and event pipeline. See the [request lifecycle](../request-lifecycle.md) for where it fits.

## Prerequisites

- A working AppSec setup. If you don't have one yet, follow the [general AppSec quickstart](../quickstart/general.mdx).
- A **compatible bouncer**. Bot detection requires the bouncer to forward the challenge endpoints to the AppSec component, so not every bouncer can serve it. The currently compatible ones (look for the **Bot Detection** badge at the top of their page) are:
  - [Nginx](/u/bouncers/nginx)
  - [HAProxy SPOA](/u/bouncers/haproxy_spoa)

## Enable bot detection

Install the collection that bundles everything (appsec-config + hooks + scenarios):

```bash
sudo cscli collections install _XX_HUB_COLLECTION_BOT_DETECTION_XX_
```

Then make sure the bundled appsec-config is actually loaded by your AppSec acquisition. Open the AppSec datasource file (typically `/etc/crowdsec/acquis.d/appsec.yaml`) and either list the new appsec-config explicitly:

```yaml
listen_addr: 127.0.0.1:7422
appsec_configs:
  - crowdsecurity/appsec-default
  - _XX_APPSEC_CONFIG_BOT_DETECTION_XX_
labels:
  type: appsec
```

…or use a wildcard so any installed `crowdsecurity/*` appsec-config is picked up automatically:

```yaml
listen_addr: 127.0.0.1:7422
appsec_configs:
  - crowdsecurity/*
labels:
  type: appsec
```

Reload CrowdSec for the change to take effect:

```bash
sudo systemctl reload crowdsec
```

:::info
If your acquisition already loads appsec-configs via a wildcard, no acquisition change is needed — installing the collection is enough.
:::

The rest of this section describes what is inside the collection, so you know what behavior you just enabled. None of it requires an extra install step.

### The appsec-config it installs

The collection ships `_XX_APPSEC_CONFIG_BOT_DETECTION_XX_`, an appsec-config whose top-level `challenge:` block carries the bot-detection runtime settings:

```yaml
name: _XX_APPSEC_CONFIG_BOT_DETECTION_XX_

challenge:
  # All fields below are optional and have sane defaults — see the
  # Configuration page for what they mean and when to override them.
  # master_secret: "..."
  # key_rotation_interval: 5m
  # cookie_ttl: 12h
  # crypto_obfuscation_pool_size: 3
```

For a **single-instance** deployment you can use this as-is. For **multi-instance / HA** deployments you must set `master_secret` (and keep `key_rotation_interval` consistent) across all WAF instances — see [Key management](configuration.md#key-management).

### Legitimate bots it lets through

Some non-browser clients are legitimate and must not be challenged — search-engine crawlers, uptime probes, AI crawlers, and the like. The collection recognises them per-request and simply skips the challenge for them. Nothing is allowlisted with a persistent cookie: the decision is re-evaluated on every request, so a client only gets through for as long as it keeps looking legitimate.

The appsec-config gates the challenge on the `IsLegitimateBot()` helper — it only challenges requests that are *not* a known-good bot:

```yaml
inband:
  post_eval:
    - filter: '!IsLegitimateBot(req.RemoteAddr, req.UserAgent(), req.URL.Path)'
      apply:
        - SendChallenge()
```

Two kinds of exemption are shipped:

- **Identity-verified bots** — for declared crawlers (Googlebot, Bingbot, Applebot, Amazonbot, GPTBot), the User-Agent is necessary but not sufficient. `IsLegitimateBot()` also checks the client IP against the vendor's published ranges and/or a forward-confirmed reverse-DNS lookup (FCrDNS). A spoofed UA on an IP that does not belong to the vendor is **not** recognised and goes through the normal challenge flow. The bot definitions live in [bot-description files](#authoring-your-own-legitimate-bot-files) shipped by the hub.
- **Path-based** — well-known endpoints that legitimate non-browser clients hit by design (e.g. `/.well-known/*`, `robots.txt`, feeds, webhooks). Hooks shipped by the collection call `ExemptFromChallenge()` for those paths, which skips the challenge for that single request without minting a cookie.

:::note
`IsLegitimateBot()` and `ExemptFromChallenge()` exempt the **current request only** — they do not issue a cookie. `GrantChallengeCookie()` is the separate escape hatch that persists across requests; see the [Hooks reference](../hooks.md#legitimate-bots) for when to use each.
:::

#### Authoring your own legitimate-bot files

`IsLegitimateBot()` matches a request against bot-description files in `<datadir>/legit_bots/*.json` (typically `/var/lib/crowdsec/data/legit_bots/`). The hub keeps the built-in definitions up to date through the `crowdsecurity/legit-bots` appsec-rule; to recognise a bot of your own, drop an extra `.json` file in the same directory.

Each file is one or more newline-delimited JSON objects with these fields:

| Field        | Type        | Required | Meaning                                                                                                  |
| ------------ | ----------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `name`       | string      | yes      | Identifier for the bot, used in logs.                                                                    |
| `user_agent` | string      | no       | Case-insensitive regex the request User-Agent must match.                                                |
| `paths`      | `[]string`  | no       | Regexes; the request path must match at least one if present.                                            |
| `ips`        | `[]string`  | no\*     | Exact source IPs (IPv4 or IPv6).                                                                         |
| `ranges`     | `[]string`  | no\*     | Source CIDR ranges.                                                                                      |
| `rdns`       | `[]string`  | no\*     | Regexes matched against the **forward-confirmed** reverse-DNS name of the source IP. Anchor them (e.g. `\\.googlebot\\.com$`) to avoid false positives. |

\* At least one of `ips`, `ranges`, or `rdns` is required — a definition that only matches on `user_agent` is rejected at load time, since a User-Agent alone is trivial to spoof.

A request is recognised as a legitimate bot when:

```
(user_agent matches  AND  at least one path matches)  AND  (exact IP  OR  CIDR range  OR  FCrDNS)
```

The helper is **fail-closed**: an unparseable address or a DNS failure means "not a legitimate bot", never an error, so the request falls through to the normal challenge.

Example file:

```json
{"name":"googlebot","user_agent":"googlebot","rdns":["(^|\\.)googlebot\\.com$","\\.google\\.com$"]}
{"name":"uptimerobot","user_agent":"uptimerobot","paths":["^/health(/|$)","^/status$"],"ranges":["69.162.124.224/28"],"ips":["216.144.250.150"]}
{"name":"internal-scanner","ips":["10.1.2.3","2001:db8::42"]}
```

The reverse-DNS confirmation used by `rdns` goes through the engine's DNS cache; see [DNS cache](configuration.md#dns-cache) if you need to tune its TTL or size.

### Bad bots it rejects

The collection also ships an `on_challenge_submit` hook that calls `RejectSubmission(...)` when the in-browser fast-bot-detection library has flagged the client (headless browser, automation framework, impossible device profile, …):

```yaml
on_challenge_submit:
  - filter: fingerprint.FastBotDetection.Bool() == true
    apply:
      - RejectSubmission("fast-bot-detection")
  - apply:
      - LogAccepted("challenge submission accepted")
```

A rejected submission produces both a log line you can tail and a structured CrowdSec event — which means it shows up as an **alert in the CrowdSec console** (and in `cscli alerts list`) alongside the rest of your detection signals:

```
time="2026-06-03T13:57:49Z" level=info msg="on_challenge_submit rejected" automation=true bouncer=127.0.0.1 component=appsec_runtime_config fsid=FS1_000010000000000000000_00010h02ba_1920x1080c16m32b10011h22f04c_f1000111100010111100011111111e00000000p1100h793814_0h005997_1h-53968_en1tEurope-Paris_h-626_0100h3f9247 is_bot=true module=acquisition.appsec name="127.0.0.1:7422/" platform=Linux reason="Fast Bot Detection" request_uuid=9a822e6b-e20f-465c-8a52-b39ed62e7b7a signals="[cdp]" source=213.44.63.11 type=appsec ua="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36"
```

Accepted submissions are not logged by default.

### Behavioral scenarios it installs

Per-request hooks can only see the request in front of them. The collection therefore also installs three CrowdSec scenarios that watch the bigger picture and create proper decisions (i.e. blocks at the bouncer level) for repeat offenders:

| Scenario | What it catches |
|---|---|
| `_XX_SCENARIO_CHALLENGE_FAILED_SUBMITS_XX_` | An IP submits the challenge many times and keeps failing — typical of an automated solver or a script brute-forcing the fingerprint. |
| `_XX_SCENARIO_CHALLENGE_NEVER_SUBMITS_XX_` | An IP requests the challenge page repeatedly but never POSTs to `/submit` — typical of scripts that don't execute JavaScript. |
| `_XX_SCENARIO_CHALLENGE_SHARED_COOKIE_XX_` | The same `__crowdsec_challenge` cookie is presented by many distinct IPs — typical of cookie replay or a bot farm sharing state. |

These are regular scenarios, so they show up in `cscli alerts list`, in the console, and in your decision stream as you'd expect.

## Verification

Hit a protected route from a clean client (no cookie) — you should receive the challenge HTML rather than the real response:

```bash
curl -i https://your-protected-site.example/some/page
# expect a 200 with a small HTML body containing the challenge script,
# and a Set-Cookie for __crowdsec_challenge once the challenge is solved.
```

Tail the CrowdSec log and trigger a failed submission (e.g. with `curl` against `/crowdsec-internal/challenge/submit` with garbage payload) to see the `on_challenge_submit rejected` line. After enough failed submissions, the behavioral scenario should fire and appear in `cscli alerts list`.

## Recipes

The snippets below are **advanced** — for the helpers (`SendChallenge`, `GrantChallengeCookie`, `IsLegitimateBot`, `ExemptFromChallenge`, `RejectSubmission`, …) and the `fingerprint` object, see the [Hooks reference](../hooks.md).

### Restrict the challenge to a specific path

By default the appsec-config shipped by the collection challenges every request without a valid cookie. If you'd rather narrow the challenge to one section of your application — say a checkout flow — gate the `SendChallenge()` call with a path filter:

```yaml
inband:
  post_eval:
    - filter: req.URL.Path startsWith "/checkout/"
      apply:
        - SendChallenge()
```

:::note
A client that has already obtained a cookie via `GrantChallengeCookie(...)` is exempted from `SendChallenge()` **regardless of the path** — the allowlist cookie short-circuits the challenge globally, not per-route.
:::

### Allowlist an internal probe by header

Useful for synthetic monitoring or internal health checks that don't run JavaScript:

```yaml
inband:
  pre_eval:
    - filter: req.Header.Get("X-Internal-Probe") == "my-shared-secret"
      apply:
        - GrantChallengeCookie("internal-probe", "24h")
```

:::warning
This recipe trusts whoever knows the shared secret. If `my-shared-secret` ever leaks — into a log, a screenshot, a public dashboard — anyone who learns it can present that header and bypass bot detection entirely. Prefer pairing the header check with a source-IP filter (`req.RemoteAddr`) or rotating the secret regularly.
:::

### Reject submissions flagged by the fast-bot-detection library

This is what the collection ships by default — shown here so you can adapt it (e.g. tighten / loosen the filter, change the reject reason):

```yaml
on_challenge_submit:
  - filter: fingerprint.FastBotDetection.Bool() == true
    apply:
      - RejectSubmission("fast-bot-detection")
```

## Using the bot signal in appsec-configs and scenarios

The information the challenge collects about a client is not locked inside the bot-detection collection — it's surfaced as a regular CrowdSec event and made available to both appsec-config hooks and scenario expressions. That means you can react to a "this client is automation" verdict anywhere in your CrowdSec stack, not just inside the dedicated `on_challenge_submit` hook.

### From an appsec-config

Inside `on_challenge` and `on_challenge_submit` hooks, the in-flight challenge exposes a `fingerprint` object you can branch on. The most useful entry point is the high-level boolean and its companion counters / helpers:

| Expression                                  | Returns | Description                                                                                              |
| ------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------- |
| `fingerprint.IsBot()`                       | `bool`  | The bottom-line verdict: `true` if any bot-detection signal fired (automation, headless, impossible device…). |
| `fingerprint.BotSignalCount()`              | `int`   | How many distinct signals fired — useful for "more than N" thresholds.                                   |
| `fingerprint.HasAutomationSignal()`         | `bool`  | A webdriver / Selenium / Playwright / CDP indicator was seen.                                            |
| `fingerprint.HasHeadlessSignal()`           | `bool`  | Headless-browser indicators (no GPU, no real plugins, …).                                                |
| `fingerprint.HasMismatchSignal()`           | `bool`  | Cross-context inconsistencies (UA vs platform, language vs timezone, …).                                 |
| `fingerprint.HasImpossibleDeviceSignal()`   | `bool`  | Device specs that don't exist in the wild (e.g. 256 cores, 0 GB RAM).                                    |
| `fingerprint.BotSignals()`                  | `[]str` | The full list of signal names that fired, for logging.                                                   |

Example — reject only clients with multiple, independent signals so you don't punish a flaky headless screenshot bot for tripping a single check:

```yaml
on_challenge_submit:
  - filter: fingerprint.IsBot() && fingerprint.BotSignalCount() >= 2
    apply:
      - RejectSubmission("multiple bot signals")
```

See the [Hooks reference](../hooks.md#the-fingerprint-object) for the full list of fingerprint methods.

### From a scenario

Every step of the challenge lifecycle (requested / submitted / failed / rejected / solved) emits a CrowdSec event with `source: crowdsec-appsec-challenge`, distinct from `crowdsec-appsec` events emitted by WAF rule matches. The most important fingerprint signals are also flattened into `evt.Parsed` so scenario `filter` expressions can match on them cheaply, and the full fingerprint object is available under `evt.Unmarshaled.fingerprint` for richer queries.

Flat fields exposed in `evt.Parsed`:

| Field                                  | Values                              | Meaning                                                                                                   |
| -------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `source`                               | `crowdsec-appsec-challenge`         | Distinguishes challenge events from WAF rule events.                                                      |
| `challenge_event`                      | `requested` / `submitted` / `failed` / `rejected` / `solved` | Which step of the lifecycle produced the event. `failed` is a crypto/PoW failure; `rejected` is an `on_challenge_submit` hook calling `RejectSubmission(reason)`. |
| `challenge_difficulty`                 | integer string                      | The PoW difficulty applied to this moment.                                                                |
| `challenge_fail_reason`                | string (on `failed` or `rejected`)  | On `failed`, the raw protocol error (`invalid HMAC`, `invalid proof-of-work`, …). On `rejected`, the operator-supplied reason from `RejectSubmission()`. |
| `fsid`                                 | string                              | Per-fingerprint identifier. Stable across the cookie's lifetime — useful for `groupby`.                   |
| `fingerprint_bot`                      | `"true"` / `"false"`                | Set when a fingerprint was attached to the event.                                                         |
| `fingerprint_allowlisted`              | `"true"` / `"false"`                | Whether this cookie was issued via `GrantChallengeCookie(...)` rather than a real submission.             |
| `fingerprint_allowlist_reason`         | string                              | The reason argument passed to `GrantChallengeCookie(...)` (only set when allowlisted).                    |
| `user_agent`                           | string                              | The client's User-Agent at the time of the event.                                                         |

This makes it straightforward to write your own scenarios on top of the built-in ones. For example, alerting on any client the challenge identified as automation:

```yaml
type: leaky
name: mycorp/appsec-bot-detected
filter: |
  evt.Parsed.source == "crowdsec-appsec-challenge" &&
  evt.Parsed.fingerprint_bot == "true"
groupby: evt.Meta.source_ip
capacity: 1
leakspeed: 1m
labels:
  type: appsec
  service: bot-detection
```

Or, more targeted, alerting on repeat offenders that fail submission for the same automation reason:

```yaml
type: leaky
name: mycorp/appsec-automation-repeat
filter: |
  evt.Parsed.source == "crowdsec-appsec-challenge" &&
  evt.Parsed.challenge_event == "rejected" &&
  evt.Parsed.challenge_fail_reason == "fast-bot-detection"
groupby: evt.Meta.source_ip
capacity: 5
leakspeed: 10m
```

For deeper queries that the flat fields don't cover, `evt.Unmarshaled.fingerprint` exposes the same helper methods as the in-hook `fingerprint` object:

```yaml
filter: |
  evt.Parsed.source == "crowdsec-appsec-challenge" &&
  evt.Unmarshaled.fingerprint.HasAutomationSignal()
```

## Metrics

Bot detection exposes the challenge lifecycle as Prometheus counters and surfaces a summary in `cscli`. The funnel is `requested` → `submitted` → `accepted` (`solved` or `granted`) or `rejected` (`protocol`, `submission`, or `cookie`).

The dedicated `bot-detection` section shows the per-engine breakdown:

```
$ sudo cscli metrics show bot-detection
```

<!-- TODO: paste real `cscli metrics show bot-detection` output once captured against a running stack -->

The top-level appsec table also gains a three-column challenge summary:

```
$ sudo cscli metrics show appsec-engine
```

<!-- TODO: paste real `cscli metrics show appsec-engine` output showing the new Ch. Requested / Ch. Accepted / Ch. Rejected columns -->

The full list of Prometheus metric names and labels lives in the [Application Security Engine section of the Prometheus reference](../../observability/prometheus.md#application-security-engine).

## Next steps

- [Bot detection configuration](configuration.md) — tune the master secret, key rotation, cookie TTL, and JS obfuscation pool sizes.
- [Hooks reference](../hooks.md) — full list of helpers and the new `on_challenge` / `on_challenge_submit` stages.
- [Request lifecycle](../request-lifecycle.md) — where the challenge runs relative to WAF rules.
- [Metrics](#metrics) — Prometheus counters and the `cscli metrics show bot-detection` table.
