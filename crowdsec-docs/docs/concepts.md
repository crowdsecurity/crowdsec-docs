---
id: concepts
title: Concepts
sidebar_position: 1
---


## Global overview

This page defines the core CrowdSec concepts and how the components interact. It focuses on how detection is done, where data is stored, and where remediation is enforced.

## Security Engine

> The Security Engine is the CrowdSec software you install (an IDS: Intrusion Detection System).
> It detects threats and produces alerts. The Local API can turn alerts into decisions using [profiles](/local_api/profiles/intro.md).
> Threat prevention (blocking) is enforced by Remediation Components (bouncers).
> Internally, the Security Engine is made of two main components: the Log Processor (detection) and the Local API (storage and decision distribution).

A Security Engine can run [standalone](intro.mdx#architecture) (Log Processor + Local API on the same host) or in a [distributed setup](intro.mdx#deployment-options) (multiple Log Processors sending alerts to a shared Local API). This lets you adapt CrowdSec to your infrastructure and constraints.

In a distributed setup, detection content (collections/parsers/scenarios) runs on the Log Processor machines, while the Local API focuses on storing data and serving decisions. See the [multi-server setup guide](/u/user_guides/multiserver_setup) for a concrete deployment pattern.

## Key objects

These are the objects you will see throughout the documentation and in tools like `cscli`:

- **Collections**: bundles of parsers, scenarios, and other items installed together. See [Collections](/log_processor/collections/introduction.md) and [Hub management](/cscli/cscli_hub.md).
- **Scenarios**: behavior detections evaluated by the Log Processor. See [Scenarios](/log_processor/scenarios/introduction.mdx).
- **AppSec rules**: WAF rules evaluated by the AppSec component. See [AppSec](/appsec/intro.md).
- **Alerts**: records created when a scenario/AppSec rule triggers; stored in the Local API. See [`cscli alerts`](/cscli/cscli_alerts.md).
- **Decisions**: remediation instructions (for example `ban`, sometimes other types depending on your setup) created by Local API [profiles](/local_api/profiles/intro.md) or manually via `cscli`; consumed by bouncers. See [`cscli decisions`](/cscli/cscli_decisions.md) and [Bouncers API](/local_api/bouncers-api.md).


## Log Processor (LP)

> The Log Processor is the part of the Security Engine in charge of detecting malicious behavior based on your logs and HTTP traffic.

The Log Processor (abbreviated as `LP`) detects malicious behavior in two main ways:
- It [acquires](/log_processor/data_sources/introduction.md) logs, [parses](/log_processor/parsers/introduction.mdx) and [enriches](/log_processor/parsers/enricher.md) events, then matches them against [scenarios](/log_processor/scenarios/introduction.mdx).
- It receives [HTTP requests](/log_processor/data_sources/appsec.md) and matches them against [AppSec rules](/appsec/intro.md).

When a scenario or an AppSec rule is triggered, the Log Processor sends an alert to the `LAPI`.

Related documentation:
- Installation and updates of detection content: [Collections](/log_processor/collections/introduction.md), [Hub management](/cscli/cscli_hub.md)
- Add context to alerts (visible in `cscli`/Console): [Alert context](/log_processor/alert_context/intro.md)
- AppSec request inspection and compatible integrations: [AppSec](/appsec/intro.md)

## Local API (LAPI)

> The Local API is the part of the Security Engine that stores alerts/decisions and acts as the middleman between Log Processors, Remediation Components, and the Central API.

The Local API (abbreviated as `LAPI`) has several roles:
- Receive alerts from Log Processors and (optionally) create decisions based on configured [profiles](/local_api/profiles/intro.md).
- Expose decisions to [Remediation Components](/u/bouncers/intro) so they can enforce them.
- Interact with the Central API to share signals and receive community blocklists.

For implementation details, see:
- Local API configuration for distributed setups: [Local API configuration](/local_api/configuration.md)
- How bouncers consume decisions: [Bouncers API](/local_api/bouncers-api.md)
- Authentication methods: [Local API authentication](/local_api/authentication.md)
- Notifications: [Notification plugins](/local_api/notification_plugins/intro.md)
- Storage: [Databases](/local_api/database.md)
- Controlling exemptions: [AllowLists](/local_api/allowlists.md)

### Example: from a log line to a block

This is a typical flow for a log-based scenario (for example, SSH brute-force):

0. **Install detection content**: you typically install a [collection](/log_processor/collections/introduction.md) from the Hub (parsers + scenarios) using `cscli` (see [Hub management](/cscli/cscli_hub.md)).
1. **Acquire**: the Log Processor reads your service logs via an [acquisition configuration](/log_processor/data_sources/introduction.md) (for example, a file tail on `/var/log/auth.log`).
2. **Parse + enrich**: [parsers](/log_processor/parsers/introduction.mdx) extract fields (source IP, service, status, ...) and [enrichers](/log_processor/parsers/enricher.md) add context (GeoIP/ASN, ...).
3. **Detect**: a [scenario](/log_processor/scenarios/introduction.mdx) correlates events over time (for example, many failed logins from the same IP) and triggers an **alert**.
4. **Store + decide**: the Log Processor sends the alert to the `LAPI`. The `LAPI` applies your [profiles](/local_api/profiles/intro.md) to create a **decision** (for example, `ban` for a given duration).
5. **Enforce**: a [Remediation Component (bouncer)](/u/bouncers/intro) pulls decisions from the `LAPI` and enforces them where it matters (firewall, reverse proxy, web server, ...).


## Remediation Components (Bouncers)

> The Remediation Components (also called `Bouncers`) are external components in charge of enforcing decisions.

Remediation Components rely on the Local API to receive decisions about malicious IPs to be blocked *(or other remediation types such as CAPTCHA, supported by some bouncers).*    
*Note that they also support [CrowdSec's Blocklist as a Service](/u/integrations/intro).*

Those decisions can come from detections made by the `LP` or from blocklists.

Remediation Components leverage existing parts of your infrastructure to block malicious IPs where it matters most (firewall, reverse proxy, web server, ...). You can find them on our [Remediation Components Hub](https://app.crowdsec.net/hub/remediation-components).

## Central API (CAPI)

> The Central API (CAPI) serves as the gateway for network participants to connect and communicate with CrowdSec's network.

The Central API (abbreviated as `CAPI`) receives attack signals from participating Security Engines and signal partners. It then redistributes curated community decisions (the [Community Blocklist](/central_api/blocklist.md)).

The Central API is also at the heart of CrowdSec centralized [blocklist services](/u/blocklists/intro).

For details about what data is sent (and when), see the [Central API introduction](/central_api/intro.md).
If you want to disable sharing to the Central API, see [how to disable the Central API](/u/troubleshooting/security_engine#how-to-disable-the-central-api).

## Console

> The CrowdSec Console is a web-based interface for reporting, alerting, and management across your CrowdSec products (from your fleet of Security Engines to CTI-related actions).

The [Console](https://app.crowdsec.net) allows you to:
- [Manage alerts](/u/console/alerts/intro) from your security stack.
- [Manage decisions](/u/console/decisions/decisions_intro) in real time.
- View and use [blocklists and integrations](/u/blocklists/intro).
- Manage your API keys ([CTI API](/u/cti_api/intro), [Service API](/u/console/service_api/getting_started)).

To connect an instance to the Console, see [Console enrollment](/u/getting_started/post_installation/console) and the `cscli` command reference: [`cscli console enroll`](/cscli/cscli_console_enroll.md).
