---
title: FAQ / Troubleshooting
id: intro
---

:::info
You may see CrowdSec referred to as "Security Engine" and Bouncers referred to as "Remediation Components" within new documentation. This is to better reflect the role of each component within the CrowdSec ecosystem.
:::

# Troubleshooting

We have extended our troubleshooting documentation to cover more common issues and questions. If you have any suggestions for this please open an [issue here](https://github.com/crowdsecurity/crowdsec-docs).

### [Security Engine Troubleshooting](/troubleshooting/security_engine.mdx)

### [Remediation Components Troubleshooting](/troubleshooting/remediation_components.mdx)

### [CTI Troubleshooting](/troubleshooting/cti.mdx)

## Community support

Please try to resolve your issue by reading the documentation. If you're unable to find a solution, don't hesitate to seek assistance in:

-   [Discourse](https://discourse.crowdsec.net/)
-   [Discord](https://discord.gg/crowdsec)

# FAQ

## How to report a bug

To report a bug, please open an issue on the affected component's repository:

[CrowdSec Repo](https://github.com/crowdsecurity/crowdsec/issues/new/choose)

[CrowdSec Hub Repo](https://github.com/crowdsecurity/hub/issues/new/choose)

:::info
CrowdSec Hub should be used when you have an issue with a parser, scenario or collection.
:::

## What license is provided ?

The Security Engine and Remediation Components are provided under [MIT license](https://en.wikipedia.org/wiki/MIT_License).

### How fast is it

The Security Engine can easily handle several thousands of events per second on a rich pipeline (multiple parsers, geoip enrichment, scenarios and so on). Logs are a good fit for sharding by default, so it is definitely the way to go if you need to handle higher throughput.

If you need help for large scale deployment, please get in touch with us on the [Form](https://contact.crowdsec.net/business-request), we love challenges ;)


### Why are some scenarios/parsers "tainted" or "custom" ?

When using `cscli` to list your parsers, scenarios and collections, some might appear as "tainted" or "local".

"tainted" items:

-   Originate from the hub
-   Were locally modified
-   Will not be automatically updated/upgraded by `cscli` operations (unless `--force` or similar is specified)
-   Won't be sent to Central API and won't appear in the Console (unless `cscli console enable tainted` has been specified)

"local" items:

-   Have been locally created by the user
-   Are not managed by `cscli` operations
-   Won't be sent to Central API and won't appear in the Console (unless `cscli console enable custom` has been specified)

### Which information is sent to your services ?

See [CAPI documentation](/docs/next/central_api/intro).
