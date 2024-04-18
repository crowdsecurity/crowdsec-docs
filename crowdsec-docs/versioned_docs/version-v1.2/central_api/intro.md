---
id: intro
title: Introduction
sidebar_position: 1
---

The [central API](https://crowdsecurity.github.io/api_doc/capi/) is the service where the local API pushes [signal meta-data](https://crowdsecurity.github.io/api_doc/capi/#/watchers/post_signals) and from where it receives the [community blocklists](https://crowdsecurity.github.io/api_doc/capi/#/bouncers/get_decisions_stream).

## Data exchanged with the central API

### Signal meta-data


:::info
This information is *only* going to be pushed when a scenario is coming from the Hub and is unmodified. Custom scenarios, tainted scenarios and manual decisions are *not* pushed
:::

When CrowdSec blocks an attack, [unless you opt-out of it](/u/troubleshooting/intro#how-to-disable-the-central-api), it is going to push "signal meta-data". Those meta-data are:
 - The name of the scenario that was triggered
 - The hash & version of the scenario that was triggered
 - The timestamp of the decision
 - Your machine_id
 - The offending IP (along with its geolocation information when available)


### Scenario list

The community blocklist matches scenarios deployed on the CrowdSec instance. For this reason, CrowdSec provides the list of enabled scenarios (from the Hub only) during [the login process](https://crowdsecurity.github.io/api_doc/capi/#/watchers/post_watchers_login).

### Console metrics

With the upcoming release of the [console](https://app.crowdsec.net) and for general health monitoring of the project, CrowdSec reports the following information to the central API:
 - name and versions of deployed bouncers
 - name and versions of registered CrowdSec agents to the local API



