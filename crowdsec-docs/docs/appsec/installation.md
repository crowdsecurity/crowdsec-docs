---
id: installation
title: Installation
sidebar_position: 3
---

# AppSec Component

We will explore a fundamental configuration of the **AppSec Component**, emphasizing a rule set dedicated to virtual patching.

**Virtual patching** rules focus on preventing the exploitation of well-known vulnerabilities and are a great way to deter and slow down someone scanning your web application.

The following configuration is crafted to offer the best ROI for your web application firewall!

## Pre-requisites

To have a functional AppSec Component, you need:

- Crowdsec security engine >= 1.5.6
- One of the compatible bouncers: Nginx, OpenResty or Traefik.

## Overview

Before diving into the practical steps, it's crucial to familiarize yourself with the core configuration aspects of the AppSec Component:

- **acquisition configuration**: Specifies how to acquire the AppSec Component stream of data
- **AppSec Component configuration**: Tells which rules are loaded in inband (blocking) and out-of-band (non-blocking)
  phases, [and allows tweaking the behavior of the component via the powerful expr bindings](/appsec/hooks.md). <!--@sbl we need anchor for the on_whatever and expr helpers -->
- **rules** allow writing a [signature to detect and/or block malevolent requests](/appsec/rules_syntax.md).

With that covered, let's jump into the installation.

_In the following sections, we'll start with retrieving items from the CrowdSec hub to have a base to work on and then customize them._

## Initialize AppSec configuration and rules

As often in CrowdSec, the relevant pieces of configuration can be acquired by installing a collection.  
We are going to use a collection targeting vulnerabilities that are popular and might be exploited by bad actors trying to break into your server and our collection of generic attack vectors:

<!-- @tko fix collection name -->

```
cscli collections install crowdsecurity/appsec-virtual-patching
cscli collections install crowdsecurity/appsec-generic-rules
```

These collections provide you:

- The config for the AppSec Component (`crowdsecurity/appsec-default`)
- All our virtual patching rules
- The CrowdSec Parser for AppSec
- The CrowdSec Scenario(s) for AppSec

If you want to learn how to write your own rules you can check our [rule writing tutorial](/appsec/create_rules.md).

## Configure the AppSec Component acquisition

The AppSec Component acts as a data source, sending request data to the security engine. We'll connect this data source using an acquisition file, just like we do with other data sources.

This can be done by editing `/etc/crowdsec/acquis.yaml` or adding a new YAML file in `/etc/crowdsec/acquis.d/`

For this type of data-source we'll declare the **address** and **port** through which the AppSec Component will communicate with the security engine to relay request data and get the verdict.

The important lines are:

 - `listen_addr` that indicates on which interface/port the service listens to
 - `appsec_config` is the configuration name that the AppSec Component will use. For this example, we're employing `crowdsecurity/appsec-default` that we obtained from the hub, but feel free to create and name your own configuration. You can locate them in `/etc/crowdsec/...`

```bash
mkdir  -p /etc/crowdsec/acquis.d
cat > /etc/crowdsec/acquis.d/appsec.yaml << EOF
listen_addr: 127.0.0.1:7422
appsec_config: crowdsecurity/appsec-default
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

And you should be able to see CrowdSec starting the AppSec Component in the logs (`/var/log/crowdsec.log`):

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

Configuring the AppSec component [accross remediation components](/appsec/installation#pre-requisites) can vary:

| Name      | Minimum Version | Public Doc |
| --------- | --------------- | ----------- |
| nginx     | 1.0.6rc         | [Public Doc](/u/bouncers/nginx#application-security-component-configuration) |
| openresty | 1.0.1rc         | [Public Doc](/u/bouncers/openresty#application-security-component-configuration) |
| traefik | 1.2.0 | [Public Doc](https://github.com/maxlerebourg/crowdsec-bouncer-traefik-plugin/blob/main/examples/appsec-enabled/README.md) |


:::info
The remediation component uses the same API key for both AppSec and LAPI communication._  
_Make sure your bouncer has a valid API and is properly connected to the LAPI via_ `sudo cscli metrics`
:::

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
