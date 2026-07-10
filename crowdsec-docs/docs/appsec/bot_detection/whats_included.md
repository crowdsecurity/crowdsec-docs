---
id: whats_included
title: What the collection ships
sidebar_position: 3
---

This page describes what is inside the [`crowdsecurity/appsec-bot-challenge`](https://app.crowdsec.net/hub/author/crowdsecurity/collections/appsec-bot-challenge) collection, so you know what behavior [installing it](enable.md) enables. None of it requires an extra install step.

## The appsec-config it installs

The collection ships `crowdsecurity/appsec-bot-challenge-simple`, the appsec-config that turns the challenge on. It is deliberately small — it only wires two hooks:

```yaml
name: crowdsecurity/appsec-bot-challenge-simple
inband:
  post_eval:
    # Challenge every request that is not a verified good bot.
    - filter: "!IsLegitimateBot(req.RemoteAddr, req.UserAgent(), req.URL.Path)"
      apply:
        - SendChallenge()
  on_challenge_submit:
    # Reject submissions whose fingerprint trips the fast bot detection.
    - filter: "fingerprint.IsBot()"
      apply:
        - RejectSubmission("known bot (fast bot detection)")
```

It carries **no** `challenge:` settings block, so the runtime settings (master secret, key rotation, cookie TTL, JS obfuscation) all run on their defaults. That is fine for a **single-instance** deployment. For **multi-instance / HA** deployments you must set `master_secret` (and keep `key_rotation_interval` consistent) across all WAF instances by shipping your own overlay — see [Key management](configuration.md#key-management) and [Where to set these values](configuration.md#where-to-set-these-values).

## Legitimate bots it lets through

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

- **Identity-verified bots** — for declared crawlers the User-Agent is necessary but not sufficient. `IsLegitimateBot()` also checks the client IP against the vendor's published ranges and/or a forward-confirmed reverse-DNS lookup (FCrDNS); a bot is exempted **only** when it can be network-verified. A spoofed UA on an IP that does not belong to the vendor is **not** recognised and goes through the normal challenge flow. The bot definitions live in [bot-description files](#authoring-your-own-legitimate-bot-files) that the collection's appsec-rules keep up to date (see below).
- **Path-based** — well-known endpoints that legitimate non-browser clients hit by design (e.g. `/.well-known/*`, `robots.txt`, feeds, webhooks). The collection ships opt-in [path-exclusion appsec-configs](#path-exclusion-configs) whose `pre_eval` calls `ExemptFromChallenge()` for those paths, which skips the challenge for that single request without minting a cookie.

:::note
`IsLegitimateBot()` and `ExemptFromChallenge()` exempt the **current request only** — they do not issue a cookie. `GrantChallengeCookie()` is the separate escape hatch that persists across requests; see the [Hooks reference](../hooks.md#legitimate-bots) for when to use each.
:::

The built-in bot families are split across four appsec-rules, so you can install only the ones you need:

| Appsec-rule | Bots it verifies |
|---|---|
| `crowdsecurity/appsec-bot-legit-search-engines` | googlebot, bingbot, applebot, amazonbot, yandex, baidu, yahoo, sogou, qwant, babbar, duckduckbot |
| `crowdsecurity/appsec-bot-legit-ai-crawlers` | gptbot, openai-searchbot, openai-chatgpt-user, perplexitybot |
| `crowdsecurity/appsec-bot-legit-social` | meta, discord, telegram, twitterbot, pinterest |
| `crowdsecurity/appsec-bot-legit-monitoring` | uptimerobot, cookiebot, datadog, pagerduty |

Each appsec-rule just declares the datafiles CrowdSec should download into `<datadir>/legit_bots/`; `IsLegitimateBot()` reads them at match time.

### Authoring your own legitimate-bot files

`IsLegitimateBot()` matches a request against bot-description files in `<datadir>/legit_bots/*.json` (typically `/var/lib/crowdsec/data/legit_bots/`). The appsec-rules above keep the built-in definitions up to date; to recognise a bot of your own, drop an extra `.json` file in the same directory.

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

## Bad bots it rejects

The shipped `appsec-bot-challenge-simple` config includes an `on_challenge_submit` hook that calls `RejectSubmission(...)` when the in-browser fast-bot-detection library has flagged the client (headless browser, automation framework, impossible device profile, …) — the `fingerprint.IsBot()` verdict:

```yaml
on_challenge_submit:
  - filter: "fingerprint.IsBot()"
    apply:
      - RejectSubmission("known bot (fast bot detection)")
```

The challenge runtime logs accepted submissions too, so both outcomes are visible in the log.

A rejected submission produces both a log line you can tail and a structured CrowdSec event — which means it shows up as an **alert in the CrowdSec console** (and in `cscli alerts list`) alongside the rest of your detection signals:

```
time="2026-06-03T13:57:49Z" level=info msg="on_challenge_submit rejected" automation=true bouncer=127.0.0.1 component=appsec_runtime_config fsid=FS1_000010000000000000000_00010h02ba_1920x1080c16m32b10011h22f04c_f1000111100010111100011111111e00000000p1100h793814_0h005997_1h-53968_en1tEurope-Paris_h-626_0100h3f9247 is_bot=true module=acquisition.appsec name="127.0.0.1:7422/" platform=Linux reason="Fast Bot Detection" request_uuid=9a822e6b-e20f-465c-8a52-b39ed62e7b7a signals="[cdp]" source=213.44.63.11 type=appsec ua="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36"
```

Accepted submissions get a matching `challenge submission accepted` line for the clients that pass — see the [Verification](enable.md#verification) section for what to expect in the log.

## Path-exclusion configs

Some routes are hit by design by clients that will never solve a challenge — crawler metadata files, syndication feeds, third-party webhooks, static assets, and programmatic API endpoints. Challenging them just produces false positives. The collection ships five opt-in appsec-configs whose `pre_eval` calls `ExemptFromChallenge()` for those paths (exempting the single request, no cookie minted):

| Appsec-config | Exempts |
|---|---|
| `crowdsecurity/appsec-bot-challenge-exclude-crawler-files` | `/robots.txt`, `/.well-known/*`, `/security.txt`, `/sitemap.xml`, `/ads.txt`, … |
| `crowdsecurity/appsec-bot-challenge-exclude-feeds` | RSS/Atom feed paths (`/feed`, `/rss`, `/atom.xml`, …) |
| `crowdsecurity/appsec-bot-challenge-exclude-webhooks` | `/webhooks/*` |
| `crowdsecurity/appsec-bot-challenge-exclude-static` | static assets and media (`.css`, `.js`, images, fonts, `/manifest.json`, …) |
| `crowdsecurity/appsec-bot-challenge-exclude-api` | programmatic endpoints (`/api/*`, `/graphql`, `/wp-json/*`, `/oauth/*`, …) |

They are separate configs so you can drop any that don't apply to your app — but keeping them on is the recommended default for fewer false positives. [Enable bot detection](enable.md#install-the-collection) shows how to load them from your acquisition. To add your own exclusions, ship a custom appsec-config rather than editing these.

## Behavioral scenarios it installs

Per-request hooks can only see the request in front of them. The collection therefore also installs four CrowdSec scenarios that watch the bigger picture — one alerts, the other three create decisions (i.e. blocks at the bouncer level) for repeat offenders:

| Scenario | Type | What it catches | Outcome |
|---|---|---|---|
| `crowdsecurity/appsec-bot-detected` | trigger | A known bot was detected and rejected by the challenge (a `rejected` event). | Alert only |
| `crowdsecurity/appsec-bot-challenge-too-many-requests` | leaky | An IP is served the challenge page repeatedly but never submits it. | Block |
| `crowdsecurity/appsec-bot-challenge-too-many-submissions` | leaky | An IP submits the challenge many times — typical of an automated solver or a script brute-forcing the fingerprint. | Block |
| `crowdsecurity/appsec-bot-challenge-request-with-no-submission` | counter | An IP requests the challenge page but never POSTs to `/submit` — typical of scripts that don't execute JavaScript. | Block |

These are regular scenarios, so they show up in `cscli alerts list`, in the console, and in your decision stream as you'd expect. The collection also ships the `crowdsecurity/appsec-bot-detection` alert context, which attaches the fingerprint id (`fsid`), operating system, User-Agent, the bot verdict, and the list of detected signals to those alerts.
