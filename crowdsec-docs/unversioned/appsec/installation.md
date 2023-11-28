---
id: install
title: Installation
sidebar_position: 2
---

#  Pre-requisite

To have a functional application security engine, you need:
 - Crowdsec security engine >= 1.5.6
 - One of the compatible bouncers:


<!-- @kka min nginx version-->
| Name | Minimum Version |
| --- | --- |
| nginx | X.Y.Z |


# Configuration : Application Security Engine

In Crowdsec, the application security engine is available as a data source. To enable it, we need to add the data source. This can be done by editing `/etc/crowdsec/acquis.yaml` or adding a new data source file in `/etc/crowdsec/acquis.d/`. We are going to add an application security engine focused on detecting and blocking the exploitation of well-known vulnerabilities (virtual patching):

```yaml
#the interface we want to listen on. Here we assume that the remediation component and the application security engine are running on the same host
listen_addr: 127.0.0.1
#the port we want to listen on
listen_port: 4241
#path, source and labels should stay as is and are relevant for more advanced configurations
path: /
source: waf
labels:
  type: waf
#you can increase the number of goroutines dedicated to the application security engine
#routines: 1
#the waap config indicates which rules are loaded for each phases and how we need to react.
waap_config: crowdsecurity/vpatch
```


