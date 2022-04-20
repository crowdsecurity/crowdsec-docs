---
title: Troubleshooting Guide
id: troubleshooting
---

## How to list banned IPs

```bash
cscli decisions list
```

## How to unban an IP

```bash
cscli decisions delete -i x.x.x.x
```

## I want to prevent Crowdsec from banning a given IP

Inspired from the existing [default whitelist for private IP addresses](https://hub.crowdsec.net/author/crowdsecurity/configurations/whitelists), you can craft your own (and drop it in `/etc/crowdsec/parsers/s01-parse/mywhitelist.yaml`) :

```yaml
name: crowdsecurity/mywhitelists
description: "Whitelist events from private ipv4 addresses"
whitelist:
  reason: "private ipv4/ipv6 ip/ranges"
  ip: 
    - "127.0.0.1"
    - "::1"
  cidr:
    - "192.168.0.0/16"
    - "10.0.0.0/8"
    - "172.16.0.0/12"
```

## Scenario XXX keeps triggering, it's a false positive

To avoid a specific scenario that is bothering you, you have several options :
 - set it in [simulation mode](/docs/cscli/cscli_simulation_enable) : you will see the alerts, but no decisions will be applied
 - purely [remove](/docs/cscli/cscli_scenarios_remove/) the scenario : it will be completely disabled



## My bouncer doesn't start/work (common causes)

1. Bouncer cannot connect to the local API
  - **error** message might look like:
```
level=error msg="auth-api: auth with api key failed return nil response, error: dial tcp 127.0.0.1:8080: connect: connection refused"
```
  - **solution** verify that the local API runs on the configured IP

2. Bouncer cannot authenticate to the local API
  - **error** message might look like:
```
time="19-04-2022 15:43:07" level=error msg="API error: access forbidden"
```
  - **solution** regenerate an API key via [cscli bouncers](/docs/cscli/cscli_bouncers_add)
