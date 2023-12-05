---
id: install
title: Installation
sidebar_position: 2
---

# Objectives

We are going to cover a basic setup of the application security component, with a set of rules focused on virtual patching. Virtual patching rules focus on preventing exploitation of well-known vulnerabilities, and is a great way to deter and slow down someone scanning your web application. This configuration offers aims at offering the best ROI for your web application firewall!

# Pre-requisites

To have a functional aplication security component, you need:
 - Crowdsec security engine >= 1.5.6
 - One of the compatible bouncers:


<!-- @kka min nginx version-->
| Name | Minimum Version |
| --- | --- |
| nginx | X.Y.Z |

# Introduction

Before jumping into the action, let's review the type of configuration items that are involved into the appsec component configuration:

 - **acquisition configuration** tells on which interface and port is the service exposed, as well as the associated AppSec component configuration it will use.
 - **appsec component configuration** tells which rules are loaded in inband (blocking) and out-of-band (non-blocking) 
phases, [and allows to tweak the behavior of the component via the powerfull expr bindings](/appsec/rules.md). <!--@sbl we need anchor for the on_whatever and expr helpers -->

 - **rules** allow you to write a [signature to detect and/or block malevolent requests](/appsec/rules.md).

With that covered, let's jump into the installation!

# Configuration: Collection install

As often in crowdsec, the relevant pieces of configuration can be acquired by installing a collection, here we are going to use a collection inspired from the [CISA's catalog of known exploited vulnerabilities](https://www.cisa.gov/known-exploited-vulnerabilities-catalog). The goal is to target vulnerabilities that are popular and might be exploited by bad guys trying to break into your server:

<!-- @tko fix collection name -->

```
cscli collections install crowdsecurity-waap/cisa-virtual-patching
```

Installing this collection brings the relevant appsec-rules (attack signatures), and the `crowdsecurity/vpatch` appsec-configuration (configuration for the appsec component).

# Configuration: Application Security Component

The appsec component is available as a data-source in crowdsec, and allows us to expose a port that the remediation engine / bouncer will send requests to, and gets verdict from. To enable it, we need to add the data source. This can be done by editing `/etc/crowdsec/acquis.yaml` or adding a new data source file in `/etc/crowdsec/acquis.d/`. We are going to add an aplication security component focused on detecting and blocking the exploitation of well-known vulnerabilities (virtual patching):

```bash
mkdir  -p /etc/crowdsec/acquis.d
cat > /etc/crowdsec/acquis.d/appsec.yaml << EOF
listen_addr: 127.0.0.1:4242
appsec_config: crowdsecurity/vpatch
source: appsec
labels:
  type: appsec
EOF
```

The important lines are `listen_addr` that indicates on which interface/port the service listens too, and `appsec_config` that tells which configuration the appsec component will run.

Restart crowdsec:

```bash
systemctl restart crowdsec
```

You should be able to see crowdsec starting the aplication security component in the logs (`/var/log/crowdsec.log`):

```
INFO[2023-12-05 09:16:31] 1 appsec runner to start                      type=appsec
INFO[2023-12-05 09:16:31] Starting Appsec server on 127.0.0.1:4242/     type=appsec
INFO[2023-12-05 09:16:31] Appsec Runner ready to process event          type=appsec uuid=3b80fefe-6665-4f81-8567-a2a7f09a706a
```

and actively listening on the port:

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

:warning: The remediation component authenticates to the AppSec component using the same API KEY it uses to authenticate to LAPI. Your bouncer must thus have a valid api key for the LAPI the security engine running the AppSec component is connected to :warning:

We can now restart our remediation component:

```bash
sudo systemctl restart nginx
```

# Testing

We can try to trigger a rule that is part of the [CISA Virtual Patching Collection](https://hub.crowdsec.net), for example the rule for `CVE-2023-42793`. It is trivial, as it only requires us to try to access a URI that ends with `/rpc2`: <!-- @tko : fix link to collec when merged -->

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


# Next steps

Voila! Your application should now be protected from the most common exploitation attempts. [If you have already enrolled your instance in the console](/docs/next/console/enrollment), you will see alerts appearing there too!
