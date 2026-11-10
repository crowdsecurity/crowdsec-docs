---
title: Troubleshooting & FAQ
id: intro
description: Start from what you see — a Console alert, an error, no detection, no blocking, a false positive — and find the page that fixes it.
---

# Troubleshooting & FAQ

Start from what you're seeing:

| What you see | Where to go |
| --- | --- |
| The Console sent me a Stack Health alert | [Stack Health alerts](/u/troubleshooting/console_issues) |
| CrowdSec or a Remediation Component won't start, or logs errors | [Won't start or logs errors](/u/troubleshooting/startup_errors) |
| The Central API returns 403 Forbidden, or I'm rate limited | [Central API 403 / CAPI rate limiting](/u/troubleshooting/capi_403) |
| Attacks show in my logs but CrowdSec raises no alerts | [Not detecting attacks](/u/troubleshooting/not_detecting) |
| CrowdSec raises alerts, but the attacker isn't blocked | [Detects but doesn't block](/u/troubleshooting/not_blocking) |
| CrowdSec blocks legitimate traffic, or I banned myself | [Blocks legitimate traffic](/u/troubleshooting/false_positives) |
| The WAF (AppSec) blocks or misses requests | [AppSec troubleshooting](/docs/appsec/troubleshooting) |
| Bot detection rejects real visitors, challenges my monitoring, or lets a bot through | [Bot detection issues](/u/troubleshooting/bot_detection) |
| My IP is flagged by CrowdSec or listed in a blocklist | [My IP is flagged](/u/troubleshooting/cti) |
| I need a configuration path, a hub update, a proxy | [Configuration and operations](/u/troubleshooting/configuration) |
| License, resources, performance, data sharing | [General questions](/u/troubleshooting/general) |
| Invoices, payment method, tax ID | [Billing & plans](/u/troubleshooting/billing_faq) |
| I'd rather have an AI agent diagnose it on my server | [CrowdSec skill for Claude Code](#let-an-ai-agent-troubleshoot-for-you) |

To check the whole stack end to end (detection, community sharing and remediation), run the 🩺 [Stack Health-Check](/u/getting_started/health_check).

## Let an AI agent troubleshoot for you

The [CrowdSec skill](https://github.com/crowdsecurity/crowdsec-skill) teaches Claude Code how to install, configure and debug CrowdSec. It runs the same checks as these pages (`cscli metrics`, `cscli explain`, logs, bouncer status) on your server, and walks you through the fix. It covers bare-metal, Docker, Kubernetes and OPNsense.

Install it from Claude Code:

```text
/plugin marketplace add crowdsecurity/crowdsec-skill
/plugin install crowdsec@crowdsecurity
```

Then describe your issue, for example "CrowdSec detects attacks but nothing gets blocked".

:::info
The **Security Engine** is the CrowdSec agent you install: it reads logs, detects attacks and makes decisions. **Remediation Components**, also called bouncers, enforce those decisions in your firewall, web server or CDN.
:::

## Get help

If the documentation doesn't solve your issue:

- Ask the community on [Discourse](https://discourse.crowdsec.net/) or [Discord](https://discord.gg/crowdsec).
- On a paid plan, contact the support team from the Console: see [Premium support](/u/console/premium_upgrade/premium_support).
- To report a bug, see [How to report a bug](/u/troubleshooting/startup_errors#how-to-report-a-bug).

Missing an answer? [Open an issue](https://github.com/crowdsecurity/crowdsec-docs/issues) on the documentation repository.
