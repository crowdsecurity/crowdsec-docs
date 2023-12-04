---
id: install
title: Installation
sidebar_position: 2
---

# Objectives

We are going to cover a basic setup of the application security engine, with a set of rules focused on virtual patching. Virtual patching rules focus on preventing exploitation of well-known vulnerabilities, and is as well a great way to deter and slow down someone scanning your web application.

# Pre-requisites

To have a functional application security engine, you need:
 - Crowdsec security engine >= 1.5.6
 - One of the compatible bouncers:


<!-- @kka min nginx version-->
| Name | Minimum Version |
| --- | --- |
| nginx | X.Y.Z |


# Configuration: Collection install

As often in crowdsec, the relevant pieces of configuration can be acquired by installing a collection. We are going to use the `crowdsecurity-waap/cisa-virtual-patching` collection, which can be installed as any other collection:


```yaml
cscli collections install crowdsecurity-waap/cisa-virtual-patching
```

The collection contains the following items:
 - waap config : `crowdsecurity/vpatch`
 - virtual patching waap rules
 - parsers & scenarios to process the application security engine events

Now that this is done, let's configure crowdsec to run the application security engine.

# Configuration: Application Security Engine

In Crowdsec, the application security engine is available as a data source. This is the component that will actually receive HTTP requests from our remediation component, and decide if they can pass through or not. To enable it, we need to add the data source. This can be done by editing `/etc/crowdsec/acquis.yaml` or adding a new data source file in `/etc/crowdsec/acquis.d/`. We are going to add an application security engine focused on detecting and blocking the exploitation of well-known vulnerabilities (virtual patching):

```bash
mkdir  -p /etc/crowdsec/acquis.d
cat > /etc/crowdsec/acquis.d/appsec.yaml << EOF
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
EOF
```

Once this is done, you should be able to start crowdsec and test the application security engine:

```bash
systemctl start crowdsec
```

You should be able to see crowdsec starting the application security engine in the logs (`/var/log/crowdsec.log`):

```
time="2023-11-28 18:07:33" level=info msg="1 waf runner to start" type=waf
time="2023-11-28 18:07:33" level=info msg="Starting WAF server on 127.0.0.1:4241/" type=waf
time="2023-11-28 18:07:33" level=info msg="Waap Runner ready to process event" type=waf uuid=39a55b0b-deec-459d-894d-71264b06287f
```

and actively listening on the port:

```bash
# netstat -laputen | grep 4241    
tcp        0      0 127.0.0.1:4241          0.0.0.0:*               LISTEN      0          6923691    779516/crowdsec     

```



# Configuration : Remediation component