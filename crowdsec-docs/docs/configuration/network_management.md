---
title: Network Management
id: network_management
---


# Ports inventory

 - `tcp/8080` exposes a [REST API](https://crowdsecurity.github.io/api_doc/lapi/) for bouncers, `cscli` and communication between crowdsec agent and local api
 - `tcp/6060` (endpoint `/metrics`) exposes [prometheus metrics](/observability/prometheus.md)
 - `tcp/6060` (endpoint `/debug`) exposes pprof debugging metrics

# Outgoing connections

 - Local API connects to `tcp/443` on `api.crowdsec.net` (signal push and blocklists pull)
 - Local API connects to `tcp/443` on `blocklists.api.crowdsec.net` (blocklists pull)
 - Local API connects to `tcp/443` on `papi.api.crowdsec.net` (console management)
 - `cscli` connects to `tcp/443` on `cdn-hub.crowdsec.net` to fetch scenarios, parsers etc. (1)
 - `cscli` connects to `tcp/443` on `version.crowdsec.net` to check latest version available. (2)
 - `cscli` connects to `tcp/443` on `hub-data.crowdsec.net` to fetch external data loaded by parsers, scenario and postoverflows. (2)
 - Dashboard-related functionality may connect to external services for configuration
 - Installation script is hosted on `install.crowdsec.net` over HTTPS.
 - Repositories are hosted on `packagecloud.io` over HTTPS.

__(1) - This FQDN routes traffic to CrowdSec's GitHub repositories through CloudFront, which helps avoid GitHub rate limits.__
[AWS publishes the CloudFront IP ranges](https://ip-ranges.amazonaws.com/ip-ranges.json); CloudFront entries are tagged `CLOUDFRONT`.

__(2) - This FQDN routes traffic to CrowdSec's GitHub repository through Cloudflare, which helps avoid GitHub rate limits.__
[Cloudflare publishes its IP ranges](https://www.cloudflare.com/ips/): [IPv4](https://cloudflare.com/ips-v4) and [IPv6](https://cloudflare.com/ips-v6).


# Communication between components

## Bouncers -> Local API

 - Bouncers are using Local API on `tcp/8080` by default

## Agents -> Local API

 - Agents connect to local API on port `tcp/8080` (only relevant )

:::warning
If there is an error in the agent configuration, it will also cause the Local API to fail if both of them are running in the same machine !
Both components need proper configuration to run (we decide to keep this behavior to detect agent or local API errors on start).
:::

## Local API -> Central API

 - Central API is reached on port `tcp/443` by Local API. The FQDN is `api.crowdsec.net`

## Local API -> Database

 - When using a networked database (PostgreSQL or MySQL), only the local API needs to access the database, agents don't have to be able to communicate with it.

## Prometheus -> Agents

 - If you're scrapping prometheus metrics from your agents or your local API, you need to allow inbound connections to `tcp/6060`

## Notes on proxy use

 - It's possible to use crowdsec through proxy, it will honor the `HTTP_PROXY` environment variable. More on the configuration how to use crowdsec through a proxy [here](/u/troubleshooting/security_engine#how-to-set-up-a-proxy)
