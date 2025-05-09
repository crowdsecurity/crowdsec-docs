---
id: intro
title: Introduction
sidebar_position: 1
---

# Remediation Components

:::info
You may see Remediation Components referred to as "bouncers" in the documentation and/or within cscli commands.
:::

## Introduction

Remediation Components are software packages in charge of acting upon decisions provided by the Security Engine. Depending on where you would like to remediate the decision, you will need to install the appropriate Remediation Component.

:::info
Don't know which component suits your needs? Then join our [discord](https://discord.gg/crowdsec) and ask the community!
:::

- [nginx](/bouncers/nginx.mdx) will check requester IP against the local API before granting or denying access.
- [firewall](/bouncers/firewall.mdx) will add IPs to nftables/ipset set.
- [cloudflare](/bouncers/cloudflare.mdx) will add IPs to the Cloudflare firewall.
- [blocklist](/bouncers/blocklist-mirror.mdx) will serve the blocklist to a appliance such as pfsense, fortinet, untangle via a http server.

**The above is not an exhaustive list of remediation components, you can find more on the [hub](https://app.crowdsec.net/hub/remediation-components).**

Remediation Components interact with [crowdsec's Local API](/docs/next/local_api/intro) to retrieve active decisions and remediate appropriately.

For your remediation components to communicate with the local API, you have to generate an API token with `cscli` and put it in the associated configuration file:

```bash
sudo cscli bouncers add testBouncer
Api key for 'testBouncer':

   6dcfe93f18675265e905aef390330a35

Please keep this key since you will not be able to retrieve it!
```

:::info
This command must be run on the server where the local API is installed (or at least with a cscli that has valid credentials to communicate with the database used by the API). This is only necessary if you "manually" install a remediation, packages and install scripts usually take care of this.
:::

If you wish to create your own Remediation Component, look at [this section](/docs/next/local_api/bouncers) of the local API documentation.

## Remediation Component Badges

As CrowdSec has evolved over the years we have added support for various technologies and services. The following badges indicate the level of support for each remediation component.

| Badge | Description |
| --- | --- |
| AppSec | Can forward HTTP requests to the AppSec Component [more information](/docs/next/appsec/intro) |
| Mode | Can be configured into different modes, typically live (send a request to LAPI for each remediation check) or stream (downloads all current decisions to a local cache and checks periodically for new / deleted ones) <br/><br/>**note these are the naming schemes live/stream are used by first party remediation components** |
| Metrics | Can send detailed metrics to the LAPI [more information](/docs/next/observability/usage_metrics) |
| MTLS | Supports Mutual TLS authentication to the LAPI [more information](/docs/next/local_api/tls_auth) |
| Prometheus | Can expose Prometheus metrics |


