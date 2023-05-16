---
id: multiserver_setup
title: About multi-server setup
sidebar_position: 10
---

Crowdsec's [architecture](/docs/intro#architecture) allows distributed setups, as most components communicate via [HTTP API](/docs/local_api/intro).

When doing such, a few considerations must be kept in mind to understand the role of each component:
 - The agent is in charge of [processing the logs](/docs/parsers/intro), matching them against [scenarios](/docs/scenarios/intro), and sending the resulting alerts to the [local API](/docs/local_api/intro)
 - The local API (LAPI from now on) receives the alerts and converts them into decisions based on your profile
 - The bouncer(s) query the LAPI to receive the decisions to be applied


A typical multi server setup should thus have:

1. **Agents push alerts to LAPI** : 
  - The [local_api_credentials.yaml](/docs/configuration/crowdsec_configuration#client) should point to LAPI's Ip
  - The agent should be registered to the local api

    **Using login/password authentication**
    - By running `cscli machines add MyMachine` on the LAPI (and c/c the generated credentials to the agent)
    - or by running `cscli lapi register --machine MyMachine --url http://<lapi>` on the agent and accepting the machine from LAPI with `cscli machines validate MyMachine`

    **Using client cert authentication**
    - By using setting the [client verification method](/docs/next/configuration/crowdsec_configuration#client_verification)
    - And setting the appropriate [allowed agents ou](/docs/next/configuration/crowdsec_configuration#agents_allowed_ou)

Once done, you can check that the agent can communicate with LAPI :

```bash
# cscli  lapi status
INFO[20-12-2021 01:31:33 PM] Loaded credentials from /etc/crowdsec/local_api_credentials.yaml 
INFO[20-12-2021 01:31:33 PM] Trying to authenticate with username xxxx on http://<LAPI IP>:8080/ 
INFO[20-12-2021 01:31:33 PM] You can successfully interact with Local API (LAPI) 

```


:::info
To avoid any confusion, disabling the LAPI service on the machine running the agent can be done by commenting out the api->server section in the `config.yaml` file
:::



2. **Bouncers speaking to LAPI**
  - :warning: Most of the bouncers installers are going to assume that LAPI is running on the same machine
  - You need to modify the bouncer's configuration (in `/etc/crowdsec/bouncers/`) to be sure they speak to the LAPI:
    - Create an API key from LAPI with `cscli bouncers add MyBouncer`
    - Or again, rely on [client certificate authentication](/docs/next/configuration/crowdsec_configuration#bouncers_allowed_ou) for the bouncers that support it
    - Edit the bouncer's configuration file to be sure it points to the LAPI uri and uses the newly generated API key



## Things to keep in mind

 - Parsers and Scenarios must be present on the agents. It's not useful to deploy them on LAPI
 - Decisions are made by LAPI. This is where you want to setup eventual custom profiles, and this is where you bouncers should point
 - You can use the [console](https://app.crowdsec.net), it supports multiserver setups!
 - If you have an important setup, switching LAPI backend from SQLite to MySQL/PgSQL is strongly advised

[This existing article](https://crowdsec.net/blog/multi-server-setup/) might as well be useful!
