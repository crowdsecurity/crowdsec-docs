---
id: install
title: Installation
sidebar_position: 2
---

## AppSec Component Installation

We are going to cover a basic setup of the **AppSec component**, with a set of rules focused on virtual patching.  

**Virtual patching** rules focus on preventing exploitation of well-known vulnerabilities and are a great way to deter and slow down someone scanning your web application.

The following configuration is crafted to offer the best ROI for your web application firewall!

# Pre-requisites

To have a functional AppSec component, you need:
 - Crowdsec security engine >= 1.5.6
 - One of the compatible bouncers:


<!-- @kka min nginx version-->
| Name | Minimum Version |
| --- | --- |
| nginx | X.Y.Z |

## Overview

Before jumping into the action, it's essential to understand the key configuration elements of the AppSec component:  

 - **acquisition configuration**: Specifies how to acquire the AppSec component stream of data
 - **AppSec Component configuration**: Tells which rules are loaded in inband (blocking) and out-of-band (non-blocking) 
phases, [and allows to tweak the behavior of the component via the powerfull expr bindings](/appsec/rules.md). <!--@sbl we need anchor for the on_whatever and expr helpers -->
 - **rules** allow writing a [signature to detect and/or block malevolent requests](/appsec/rules.md).

With that covered, let's jump into the installation.  

*In the following sections, we'll start with retrieving items from the CrowdSec hub to have a base to work on and then customize them.*

# Initialise AppSec configuration and rules

As often in CrowdSec, the relevant pieces of configuration can be acquired by installing a collection.  
We are going to use a collection targeting vulnerabilities that are popular and might be exploited by bad actors trying to break into your server:

<!-- @tko fix collection name -->

```
cscli collections install crowdsecurity/appsec-virtual-patching
```

This collection provides you:
- The config for the AppSec component (`crowdsecurity/virtual-patching`)
- All our virtual patching rules


# Configure the AppSec Component acquisition

The AppSec component works as a data-source by relaying the request's data to the security engine. We'll add this data-source similarly to other data-sources via an acquisition file.  

This can be done by editing `/etc/crowdsec/acquis.yaml` or adding a new yaml file in `/etc/crowdsec/acquis.d/`  

For this type of data-source we'll declare the **address** and **port** through which the AppSec component will communicate with the security engine to relay request data and get the verdict.  

The important lines are:
- `listen_addr` that indicates on which interface/port the service listens to
- `appsec_config` is the name of the config that the appsec component will run. We'll be using `crowdsecurity/virtual-patching` we just got from the hub for this example, but you can create your own config and name it as you'd like. you can find them in `/etc/crowdsec/...`

```bash
mkdir  -p /etc/crowdsec/acquis.d
cat > /etc/crowdsec/acquis.d/appsec.yaml << EOF
listen_addr: 127.0.0.1:4242
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
INFO[2023-12-05 09:16:31] Starting Appsec server on 127.0.0.1:4242/     type=appsec
INFO[2023-12-05 09:16:31] Appsec Runner ready to process event          type=appsec uuid=3b80fefe-6665-4f81-8567-a2a7f09a706a
```

As well as actively listening on the specified port:

```bash
# netstat -laputen | grep 4242    
tcp        0      0 127.0.0.1:4242          0.0.0.0:*               LISTEN      0          6923691    779516/crowdsec     

```

# Configuration : Remediation component

<!-- @kka fix version -->
At the time of writting, only the crowdsec nginx bouncer supports native integration with the AppSec component, and requires version >= X.Y.Z.

[If you don't have the bouncer installed, do it now !](https://docs.crowdsec.net/u/bouncers/nginx)

To enable the integration, you simply have to add a `APPSEC_URL` parameter to the existing nginx bouncer remediation configuration :

> /etc/crowdsec/bouncers/crowdsec-nginx-bouncer.conf
```
...
APPSEC_URL=http://127.0.0.1:4242
...
```

:warning:*The remediation component uses the same API key for both AppSec and LAPI communication.*  
*Make sure your bouncer have a valid API and is properly connected to the LAPI via* `sudo cscli metrics`:warning:

We can now restart our remediation component:

```bash
sudo systemctl restart nginx
```

# Making sure everything works

For testing purposes, lets trigger a rule that is part of the [CISA Virtual Patching Collection](https://hub.crowdsec.net):

It is trivial, for example, lets trigger the rule for `CVE-2023-42793` by trying to access an URI that ends with `/rpc2`:<!-- @tko : fix link to collec when merged -->

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


# Et Voila !

Your application should now be protected from the most common exploitation attempts. [If you have already enrolled your instance in the console](/docs/next/console/enrollment), you will see alerts appearing there too!
