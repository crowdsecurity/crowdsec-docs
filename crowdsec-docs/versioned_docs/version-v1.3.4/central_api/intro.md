---
id: intro
title: Introduction
sidebar_position: 1
---

The [Central API](https://crowdsecurity.github.io/api_doc/capi/) is the service where the Local API pushes [signal meta-data](https://crowdsecurity.github.io/api_doc/capi/#/watchers/post_signals) and from where it receives the [community blocklists](https://crowdsecurity.github.io/api_doc/capi/#/bouncers/get_decisions_stream).

## Data exchanged with the Central API

### Signal meta-data


:::info
This information is *only* going to be pushed when a scenario is coming from the hub and is unmodified. Custom scenarios, tainted scenarios and manual decisions are *not* pushed
:::

When CrowdSec blocks an attack, [unless you opt-out of it](/u/troubleshooting/intro#how-to-disable-the-central-api), CrowdSec is going to push "signal meta-data". Those meta-data are :
 - The name of the scenario that was triggered
 - The hash & version of the scenario that was triggered
 - The timestamp of the decision
 - Your machine_id
 - The offending IP address (along with its geoloc info when available)


### Scenario list

The community blocklist matches the scenarios deployed on the CrowdSec instance. For this reason, CrowdSec provides the list of enabled scenarios (from the hub only) during [the login process](https://crowdsecurity.github.io/api_doc/capi/#/watchers/post_watchers_login).

### Console metrics

With the upcoming release of the [console](https://app.crowdsec.net) and for genreal health monitoring of the project, crowdsec reports the following data to the Central API :
 - name and versions of the deployed bouncers
 - name and versions of the CrowdSec agents registered to the Local API



