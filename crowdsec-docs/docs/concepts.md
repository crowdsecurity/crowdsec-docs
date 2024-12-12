---
id: concepts
title: Concepts
sidebar_position: 1
---


# Global overview

# Security Engine

> The Security Engine is CrowdSec's IDS/IPS (Intrusion Detection System/Intrusion Prevention System)
> It is a rules and behavior detection engine comprised of Log Processor and the Local API.

A Security Engine can operate [independently](/intro#architecture) or in a [distributed manner](/intro#deployment-options), adapting to the specific needs and constraints of your infrastructure. For more information on CrowdSec's distributed approach, visit our documentation on collaborative operations and distributed deployments.


# Log Processor (LP)

> The Log Processor is the part of the Security Engine in charge of the detection of bad behaviors, based on your logs or your HTTP trafic.

The Log Processor (abreviated as `LP`) detects bad behaviors via two main functions:
 - [Acquire](/log_processor/data_sources/introduction.md) logs, [parse](/log_processor/parsers/introduction.mdx), [enrich](/log_processor/parsers/enricher.md) and match them against [Scenarios](/log_processor/scenarios/introduction.mdx).
 - Receive [HTTP Requests](/log_processor/data_sources/appsec.md) and match them against the [Appsec Rules](/appsec/intro.md).

Alerts resulting from Scenarios or Appsec Rules being triggered are sent to the `LAPI`.

# Local API (LAPI)

> The Local API is the part of the Security Engine acting as the middleman between the Log Processors, the Remediation Components and the Central API.

The Local API (abreviated as `LAPI`) has several functions:
 - Receive alerts from Log Processors and create Decisions based on configured [Profiles](/local_api/profiles/intro.md)
 - Expose Decisions to [Remediation Components](/u/bouncers/intro)
 - Interact with the Central API to send Alerts receive Blocklists


# Remediation Components (Bouncers)

> The Remediation Components (also called `Bouncers`) are external components in charge of enforcing decisions.

Remediation Components rely on the Local API to receive decisions about malevolent IPs to be blocked *(or other supported types or remediations such as Captcha, supported by some of our Bouncers).*    
*Note that they also support [CrowdSec's Blocklist as a Service](/u/integrations/intro).*

Those Decisions can be based on behavioral detection made by the `LP` or from Blocklists.

Remediations components leverage existing components of your infrastructure to block malevolent IPs where it matters most. You can find them on our [Remediation Components' HUB](https://app.crowdsec.net/hub/remediation-components)

# Central API (CAPI)

> The Central API (CAPI) serves as the gateway for network participants to connect and communicate with CrowdSec's network.

The Central API (abreviated as `CAPI`) receives attack signals from all participating Security Engines and signal partners, then re-distribute them curated community decisions ([Community Blocklist](/central_api/community_blocklist/)).   
It's also at the heart of CrowdSec centralized [Blocklist services](/u/blocklists/intro).

# Console

> The CrowdSec Console is a web-based interface providing reporting, alerting, management and QoL features to CrowdSec's products usages: from your park of Security Engines to the management of CTI related actions

The [Console](https://app.crowdsec.net) allows you to:
 - [Manage alerts](/u/console/alerts/intro) of your security stack
 - [Manage decisions](/u/console/decisions/decisions_intro) in real-time
 - View and use [blocklists and integrations](/u/blocklists/intro)
 - Manage your API keys ([CTI API](/u/cti_api/intro), [Service API](/u/service_api/getting_started))