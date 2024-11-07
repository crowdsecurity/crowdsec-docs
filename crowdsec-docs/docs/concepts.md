---
id: concepts
title: Concepts
sidebar_position: 1
---


# Global overview

# Log Processor (LP)

> The Log Processor is in charge of the detection of bad behaviors, based on your logs or your HTTP trafic.

The Log Processor (abreviated as `LP`) detects bad behaviors via two main functions:
 - [Acquire](/log_processor/data_sources/introduction.md) logs, [parse](/log_processor/parsers/introduction.mdx), [enrich](/log_processor/parsers/enricher.md) and match them against [Scenarios](/log_processor/scenarios/introduction.mdx).
 - Receive [HTTP Requests](/log_processor/data_sources/appsc.md) and match them against the [Appsec Rules](/appsec/intro.md).

Alerts resulting from Scenarios or Appsec Rules being triggered are sent to the `LAPI`.

# Local API (LAPI)

> The Local API is the middleman between the Log Processors, the Remediation Components and the Central API.

The Local API (abreviated as `LAPI`) has several functions:
 - Receive alerts from Log Processors and create Decisions based on configured [Profiles](/local_api/profiles/intro.md)
 - Expose Decisions to [Remediation Components](/u/bouncers/intro)
 - Interact with the Central API to send Alerts receive Blocklists


# Remediation Components (Bouncers)

> The Remediation Components (also called `Bouncers`) are in charge of enforcing decisions.

Remediation Components rely on the Local API to receive decisions about malevolent IPs to be blocked.

Those Decisions can be based on behavioral detection made by the `LP` or from Blocklists.

[Remediations components](https://app.crowdsec.net/hub/remediation-components) laverage existing components of your infrastructure to block malevolent IPs where it matters most.

# Central API (CAPI)

> The Central API (CAPI) in CrowdSec serves as a pivotal component for aggregating and disseminating threat intelligence across its user community. 


The Central API (abreviated as `CAPI`) receives signal from Crowdsec instances and partner networks and will compute them to ultimately create [Cyber Threat Intelligence](/u/cti_api/intro) and [Blocklists](/u/blocklists/intro).

# Console

> The CrowdSec Console is a web-based interface that enhances the functionality of the CrowdSec security engine.

The [Console](https://app.crowdsec.net) allows you to:
 - [Manage alerts](/u/console/alerts/intro) of your security stack
 - [Manage decisions](/u/console/decisions/decisions_intro) in real-time
 - View and use [blocklists and integrations](/u/blocklists/intro)
 - Manage your API keys ([CTI API](/u/cti_api/intro), [Service API](/u/service_api/getting_started))

# Security Engine

> The Security Engine is a concept that encompasses the Log Processor and the Local API.

The Security Engine is the generic term to describe a Log Processor coupled to a Local API.
