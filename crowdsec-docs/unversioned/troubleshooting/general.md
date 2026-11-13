---
title: "CrowdSec FAQ: license, resources, performance, data sharing"
id: general
description: License, language, resource usage, performance and data sharing of the CrowdSec Security Engine.
---

## What is CrowdSec Security Engine?

CrowdSec Security Engine is open-source security software that detects malicious behavior in your logs and HTTP requests, blocks scrapers and headless browsers with [bot detection](/docs/appsec/bot_detection/intro), and shares and receives signals with the CrowdSec network. See the [overview](/docs/intro).

## What license is provided?

The Security Engine and the Remediation Components are provided under the [MIT license](https://en.wikipedia.org/wiki/MIT_License).

## What language is it written in?

The Security Engine is written in [Go](https://go.dev/).

## What resources are needed to run Security Engine?

Memory depends on what you install and on how much traffic you process:

- A Security Engine with a few collections, at rest, uses around 100 MB. We measured 110 MB with the `linux` and `nginx` collections on v1.8.2.
- Each installed scenario and AppSec rule adds to it. A host with several hundred scenarios and the AppSec collections uses around 300 MB at rest.
- Under heavy load, memory grows with the number of active source IPs: see the [Log Processor benchmark](/docs/log_processor/benchmark).

CPU is the main resource used during intensive log processing.

## How fast is it?

On a 16 vCPU machine, one Log Processor handles about 3,600 fully parsed nginx lines per second with one parsing routine, and about 8,500 with four. Logs are easy to shard across several Log Processors if you need more. See the [Log Processor benchmark](/docs/log_processor/benchmark) for the method and the figures, and the [AppSec benchmark](/docs/appsec/benchmark) for the WAF.

If you need help with a large-scale deployment, [contact us](https://www.crowdsec.net/contact-crowdsec).

### What is the performance impact?

The Log Processor reads logs: it isn't in the path of your production traffic. Remediation Components and the WAF are, so check their own documentation: see [Remediation Components](/u/bouncers/intro) and the [AppSec benchmark](/docs/appsec/benchmark).

## Which information is sent to your services?

See the [Central API documentation](/docs/central_api/intro). To stop sharing entirely, see [How to disable the central API](/u/troubleshooting/configuration#how-to-disable-the-central-api).
