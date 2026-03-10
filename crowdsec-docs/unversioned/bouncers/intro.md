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

## Choosing the Right Remediation Component

CrowdSec offers two categories of remediation: **infrastructure-level** (Layer 3/4) and **application-level** (Layer 7). Choosing the right one depends on what you are protecting.

:::tip Protecting a web application?
Use a **WAF-capable** bouncer ([Nginx](/bouncers/nginx.mdx), [OpenResty](/bouncers/openresty.mdx), [Traefik](/bouncers/traefik.mdx), or [HAProxy SPOA](/bouncers/haproxy_spoa.mdx)) to get real-time WAF protection, virtual patching, and defense against application-layer attacks like SQL injection, XSS, and CVE exploitation. [Learn more about AppSec](/docs/next/appsec/intro).
:::

| What are you protecting? | Recommended Component | Why? |
| :--- | :--- | :--- |
| **Web app behind Nginx** | [crowdsec-nginx-bouncer](/bouncers/nginx.mdx) | In-band WAF + virtual patching via AppSec |
| **Docker/K8s with Traefik** | [traefik-bouncer-plugin](/bouncers/traefik.mdx) | Native middleware integration + AppSec |
| **High-performance proxy (HAProxy)** | [cs-haproxy-spoa-bouncer](/bouncers/haproxy_spoa.mdx) | SPOA offloading for L7 inspection + AppSec |
| **Web app behind OpenResty** | [crowdsec-openresty-bouncer](/bouncers/openresty.mdx) | Built-in Lua support + AppSec |
| **Infrastructure services (SSH, DB, SMTP)** | [crowdsec-firewall-bouncer](/bouncers/firewall.mdx) | Broad port protection at kernel level |
| **Cloudflare-fronted sites** | [crowdsec-cloudflare-bouncer](/bouncers/cloudflare.mdx) | Push decisions to the Cloudflare firewall |
| **Appliances (pfSense, Fortinet, etc.)** | [crowdsec-blocklist-mirror](/bouncers/blocklist-mirror.mdx) | Serve blocklists over HTTP |

:::info
Don't know which component suits your needs? Then join our [discord](https://discord.gg/crowdsec) and ask the community!
:::

**This is not an exhaustive list of remediation components. You can find more on the [hub](https://app.crowdsec.net/hub/remediation-components).**

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


