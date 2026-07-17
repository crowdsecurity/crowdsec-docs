---
id: intro
title: Bot detection
sidebar_position: 1
---

:::info Alpha feature
Bot detection is currently in **alpha**. It's ready to try and we'd love your feedback, but the configuration, helpers and shipped rules may still change between releases.
:::

Bot detection blocks automated traffic before it reaches your application. Where the rest of the WAF reacts to *what a user does* (the payloads they send, the patterns they trigger) bot detection answers a different question: *what a user is*, a real browser or a script pretending to be one.

:::tip Ready to turn it on?
You can head straight to [Enable bot detection](enable.md) for the install-and-verify steps, or read on for what it does for you.
:::

## Objectives

- **Real users are unaffected.** Legitimate browsers clear the check automatically and continue as usual. We try to avoid impacting their experience.
- **Automation is stopped at the edge.** Headless browsers, clients that don't run JavaScript, and known automation frameworks are filtered by the AppSec component before they reach the origin.
- **Repeat offenders are blocked at the bouncer.** Persistent probing is turned into CrowdSec decisions by the shipped [behavioral scenarios](whats_included.md#behavioral-scenarios-it-installs), so the bouncer blocks them over time, not just the one request.
- **Good bots are unaffected.** Verified search-engine crawlers, uptime probes and the like are [recognised and let past](whats_included.md#known-bots-it-lets-through) without a challenge.
- **Every verdict is a CrowdSec signal.** Detections show up as alerts in the console and in `cscli alerts list`, and the fingerprint verdict is [available to your own scenarios and appsec-configs](customization.md#using-the-bot-signal-in-appsec-configs-and-scenarios).

## How it works

Bot detection interposes a **browser-side proof-of-work + device-fingerprint check** between a visitor and your application:
 - Proof of work and collected device fingerprint are sent back to CrowdSec WAF
 - If PoW is correct and Fingerprint accepted, client receives a cooking, granting them access.
 - If the Device fingerprint is rejected, Pow is incorrect or no challenge is submited, client is filtered out.

For the full request flow, see [How it works](how_it_works.md).

## Prerequisites

- A working AppSec setup. If you don't have one yet, follow the [general AppSec quickstart](../quickstart/general.mdx).
- A **compatible bouncer**. The currently compatible ones (look for the **Bot Detection** badge at the top of their page) are:
  - [Nginx](/u/bouncers/nginx)
  - [OpenResty](/u/bouncers/openresty)
  - [HAProxy SPOA](/u/bouncers/haproxy_spoa)
  - [Traefik](/u/bouncers/traefik)
  - [Envoy](/u/bouncers/envoy)

## Next steps

- [Enable bot detection](enable.md) — install the collection, wire the acquisition, and verify it.
- [See default collection](whats_included.md) — the request flow, the appsec-config, known-bot handling, and behavioral scenarios you just enabled.
- [Customization & recipes](customization.md) — narrow the challenge to a path, allowlist a probe, and react to the bot signal in your own scenarios.
- [Configuration](configuration.md) — master secret, key rotation, cookie TTL, and JS obfuscation.
- [Hooks reference](../hooks.md) — full list of helpers and the `on_challenge` / `on_challenge_submit` stages.
