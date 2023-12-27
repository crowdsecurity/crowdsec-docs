---
id: installation
title: Installation
sidebar_position: 3
---

# AppSec Component

We are going to cover a basic setup of the **AppSec component**, with a set of rules focused on virtual patching.

**Virtual patching** rules focus on preventing the exploitation of well-known vulnerabilities and are a great way to deter and slow down someone scanning your web application.

The following configuration is crafted to offer the best ROI for your web application firewall!

## Pre-requisites

To have a functional AppSec component, you need:

- Crowdsec security engine >= 1.5.6
- One of the compatible bouncers:

<!-- @kka min nginx & openresty version-->

| Name      | Minimum Version |
| --------- | --------------- |
| nginx     | 1.0.6rc         |
| openresty | 1.0.1rc         |

## Overview

Before jumping into the action, it's essential to understand the key configuration elements of the AppSec component:

- **acquisition configuration**: Specifies how to acquire the AppSec component stream of data
- **AppSec Component configuration**: Tells which rules are loaded in inband (blocking) and out-of-band (non-blocking)
  phases, [and allows tweaking the behavior of the component via the powerful expr bindings](/appsec/hooks.md). <!--@sbl we need anchor for the on_whatever and expr helpers -->
- **rules** allow writing a [signature to detect and/or block malevolent requests](/appsec/rules_syntax.md).

With that covered, let's jump into the installation.

_In the following sections, we'll start with retrieving items from the CrowdSec hub to have a base to work on and then customize them._

## Initialize AppSec configuration and rules

As often in CrowdSec, the relevant pieces of configuration can be acquired by installing a collection.  
We are going to use a collection targeting vulnerabilities that are popular and might be exploited by bad actors trying to break into your server:

<!-- @tko fix collection name -->

```
cscli collections install crowdsecurity/appsec-virtual-patching
```

This collection provides you:

- The config for the AppSec component (`crowdsecurity/virtual-patching`)
- All our virtual patching rules
  - The CrowdSec Parser for AppSec
  - The CrowdSec Scenario(s) for AppSec

## Configure the AppSec Component acquisition

The AppSec component works as a data-source by relaying the request's data to the security engine. We'll add this data-source similarly to other data-sources via an acquisition file.

This can be done by editing `/etc/crowdsec/acquis.yaml` or adding a new YAML file in `/etc/crowdsec/acquis.d/`

For this type of data-source we'll declare the **address** and **port** through which the AppSec component will communicate with the security engine to relay request data and get the verdict.

The important lines are:

- `listen_addr` that indicates on which interface/port the service listens to
- `appsec_config` is the name of the config that the appsec component will run. We'll be using `crowdsecurity/virtual-patching` we just got from the hub for this example, but you can create your config and name it as you'd like. you can find them in `/etc/crowdsec/...`

```bash
mkdir  -p /etc/crowdsec/acquis.d
cat > /etc/crowdsec/acquis.d/appsec.yaml << EOF
listen_addr: 127.0.0.1:7422
appsec_config: crowdsecurity/virtual-patching
name: myAppSecComponent
source: appsec
labels:
  type: appsec
EOF
```

We'll then restart CrowdSec:

```bash
systemctl restart crowdsec
```

And you should be able to see CrowdSec starting the AppSec component in the logs (`/var/log/crowdsec.log`):

```
INFO[2023-12-05 09:16:31] 1 appsec runner to start                      type=appsec
INFO[2023-12-05 09:16:31] Starting Appsec server on 127.0.0.1:7422/     type=appsec
INFO[2023-12-05 09:16:31] Appsec Runner ready to process event          type=appsec uuid=3b80fefe-6665-4f81-8567-a2a7f09a706a
```

As well as actively listening on the specified port:

```bash
# netstat -laputen | grep 7422
tcp        0      0 127.0.0.1:7422          0.0.0.0:*               LISTEN      0          6923691    779516/crowdsec

```

## Configuration : Remediation component

<!-- @kka fix version -->

At the time of writing, only the crowdsec nginx bouncer supports native integration with the AppSec component, and requires version >= X.Y.Z.

[If you don't have the bouncer installed, do it now !](https://docs.crowdsec.net/u/bouncers/nginx)

To enable the integration, you simply have to add a `APPSEC_URL` parameter to the existing bouncer remediation configuration:

Note: _Some remediation components might have different parameter name for the APPSEC_URL, directly check their documentation if APPSEC_URL doesn't work_

In your bouncer config file:

> /etc/crowdsec/bouncers/crowdsec-nginx-bouncer.conf

> /etc/crowdsec/bouncers/crowdsec-openresty-bouncer.conf

> ...

Add the communication URL with the port you want:

```
...
APPSEC_URL=http://127.0.0.1:7422
...
```

:warning: _The remediation component uses the same API key for both AppSec and LAPI communication._  
_Make sure your bouncer has a valid API and is properly connected to the LAPI via_ `sudo cscli metrics`:warning:

We can now restart our remediation component:

```bash
sudo systemctl restart nginx
```

## Making sure everything works

For testing purposes, let's trigger a rule that is part of the [Virtual Patching Collection](https://app.crowdsec.net/hub/author/crowdsecurity/collections/appsec-virtual-patching):

It is trivial, for example, let's trigger [the rule](https://app.crowdsec.net/hub/author/crowdsecurity/appsec-rules/vpatch-CVE-2023-42793) for `CVE-2023-42793` by trying to access an URI that ends with `/rpc2`:

```
▶ curl -I localhost/rpc2
HTTP/1.1 403 Forbidden
Server: nginx/1.18.0 (Ubuntu)
Date: Tue, 05 Dec 2023 14:26:03 GMT
Content-Type: text/html
Connection: keep-alive
```

And if we look at it in a browser, the user is presented with the HTML page emitted by the remediation component (that can be customized):

![appsec-denied](/img/appsec_denied.png)

## Et Voila !

Your application should now be protected from the most common exploitation attempts.  
[If you have already enrolled your instance in the console](/docs/next/console/enrollment), you will see alerts appearing there too!
