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


# Configuration: Collection install

As often in crowdsec, the relevant pieces of configuration can be acquired by installing a collection. We are going to use the `crowdsecurity-waap/cisa-virtual-patching` collection, which can be installed as any other collection.

Before jumping into the action, let's review the type of configuration items that are involved into the appsec component configuration:
 - **acquisition configuration** tells on which interface and port is the service exposed, as well as the associated AppSec component configuration it will use.
<!--@sbl we need anchor for the on_whatever and expr helpers -->
 - **appsec component configuration** tells which rules are loaded in inband (blocking) and out-of-band (non-blocking) 
phases. [it as well allows you to tweak the behavior of the component via the powerfull expr bindings](/appsec/rules.md)
 - **rules** allow you to write a signature to detect and/or block malevolent requests. [You can find more information about the syntax here](/appsec/rules.md)

With that covered, we can now install our collection. This will bring the appsec component configuration, alongside with a set of rules for virtual patching. It will as well install some scenarios that are here to laverage the alerts from the appsec component, banning attackers that trigger too many rules:

```
cscli collections install crowdsecurity-waap/cisa-virtual-patching
```

Now that this is done, let's configure crowdsec to run the application security component.

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

Mostly, the important lines are `listen_addr` that indicates on which interface/port the service listens too, and `appsec_config` that tells which configuration the appsec component will run.

Once this is done, you should be able to start crowdsec and test the aplication security component:

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
# netstat -laputen | grep 4241    
tcp        0      0 127.0.0.1:4241          0.0.0.0:*               LISTEN      0          6923691    779516/crowdsec     

```

## Testing the appsec engine

Before moving to the configuration of the remediation component, we can quickly check that our appsec component is working correctly. At the time of writting, the following appsec rule is part of the `cisa-virtual-patching`, and we will deliberately try to trigger it, by sending a request with an URI ending with `/rpc2`:

> cat /etc/crowdsec/appsec-rules/vpatch-CVE-2023-42793.yaml
```yaml
name: crowdsecurity/vpatch-CVE-2023-42793
description: "Detect CVE-2023-42793"
rules:
  - zones:
    - URI
    transform:
    - lowercase
    match:
      type: endsWith
      value: /rpc2
labels:
  type: exploit
  service: http
  confidence: 3
  spoofable: 0
  behavior: "http:exploit"
  label: "JetBrains Teamcity auth bypass (CVE-2023-42793)"
  classification:
   - cve.CVE-2023-42793
   - attack.T1595
   - attack.T1190
   - cwe.CWE-288
```

Let's add a dedicated remediation component API Key for our test:

```bash
cscli bouncers add appsec_test -k this_is_a_bad_password
```

We can now query our appsec component (it uses the same auth mechanism as bouncers):

```bash
▶ curl -X POST localhost:4242/ -i -H 'x-crowdsec-appsec-ip: 42.42.42.42' -H 'x-crowdsec-appsec-uri: /rpc2' -H 'x-crowdsec-appsec-host: google.com' -H 'x-crowdsec-appsec-verb: POST' -H 'x-crowdsec-appsec-api-key: this_is_a_bad_password'
HTTP/1.1 403 Forbidden
Date: Tue, 05 Dec 2023 11:17:51 GMT
Content-Length: 16
Content-Type: text/plain; charset=utf-8

{"action":"ban"}
```

And we see the alert appearing in `crowdsec.log` :

```
...
INFO[2023-12-05 12:17:52] (test) alert : crowdsecurity/vpatch-CVE-2023-42793 by ip 42.42.42.42
...
```

And in `cscli alerts list` : 

```
╭────┬────────────────┬─────────────────────────────────────┬─────────┬────┬───────────┬───────────────────────────────╮
│ ID │     value      │               reason                │ country │ as │ decisions │          created_at           │
├────┼────────────────┼─────────────────────────────────────┼─────────┼────┼───────────┼───────────────────────────────┤
│ 1  │ Ip:42.42.42.42 │ crowdsecurity/vpatch-CVE-2023-42793 │         │    │           │ 2023-12-05 11:17:51 +0000 UTC │
╰────┴────────────────┴─────────────────────────────────────┴─────────┴────┴───────────┴───────────────────────────────╯

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

and if we try to trigger the same rule we did while testing our AppSec component directly:

