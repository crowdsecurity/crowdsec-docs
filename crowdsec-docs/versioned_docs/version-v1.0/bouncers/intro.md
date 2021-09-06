---
id: intro
title: Introduction
sidebar_position: 1
---

# Bouncers

## Introduction

bouncers are standalone software pieces in charge of acting upon a decision taken by crowdsec : block an IP, present a captcha, enforce MFA on a given user, etc.

They can either be within the applicative stack, or work out of band :

[nginx bouncer](https://github.com/crowdsecurity/cs-nginx-bouncer) will check every unknown IP against the local API before letting go through or serving a *403* to the user, while a [firewall bouncer](https://hub.crowdsec.net/author/crowdsecurity/bouncers/cs-firewall-bouncer) or a [cloudflare bouncer](https://hub.crowdsec.net/author/crowdsecurity/bouncers/cs-cloudflare-bouncer) will simply "add" malevolent IPs to nftables/ipset set of blacklisted IPs.

Bouncers rely on [crowdsec's Local API](/docs/v1.0/local_api/intro) to be able to get informations about a given IP or such.


You can explore [available bouncers on the hub](https://hub.crowdsec.net/browse/#bouncers).


To be able for your bouncers to communicate with the local API, you have to generate an API token with `cscli` and put it in your bouncer configuration file:

```bash
sudo cscli bouncers add testBouncer
Api key for 'testBouncer':

   6dcfe93f18675265e905aef390330a35

Please keep this key since you will not be able to retrieve it!
```

:::info
This command must be run on the server where the local API is installed (or at least with a cscli that has valid credentials to communicate with the database used by the API). This is only necessary if you "manually" install a bouncer, packages and install scripts usually take care of this.
:::

If you were to create your own bouncers, look at [this section](/docs/v1.0/local_api/bouncers) of the local API documentation.




