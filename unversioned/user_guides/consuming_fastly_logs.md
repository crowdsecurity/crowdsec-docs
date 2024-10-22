---
id: consuming_fastly_logs
title: Consuming Fastly Logs
---

In this guide we're going to:

 1. Setup fastly to transport logs to a linux server with TLS configured.
 2. Setup crowdsec on log server to consume fastly logs.


## Transport fastly logs to linux server:

### Configuring Rsyslog with TLS
To receive logs from Fastly, you'll need to generate server and client certificates (the server certificate for machine which receives logs and client for Fastly). See this [guide](https://www.rsyslog.com/doc/master/tutorials/tls.html#setting-up-the-system) on how to do this.



### Configure rsyslog server on crowdsec

```shell
vim /etc/rsyslog.conf
```

```vcl
global(
  defaultNetstreamDriverCAFile="/etc/pki/ca.crt"
  defaultNetstreamDriverCertFile="/etc/pki/fastly.dev.crowdsec.net.crt" # Replace this with path to cert
  defaultNetstreamDriverKeyFile="/etc/pki/fastly.dev.crowdsec.net.key" # Replace this with path to key
)

module(
  load="imtcp"
  streamdriver.name="gtls" # use gtls netstream driver
  streamdriver.mode="1" # require TLS for the connection
  streamdriver.authmode="x509/certvalid" # accept with valid cert  
)

input(
  type="imtcp"
  port="4242"
)
```

Add new config file so it will be processed as final /etc/rsyslog.d/99-crowdsec.conf

```
template RemoteLogs,"/var/log/crowdsec_fastly.log"

if $hostname == 'ip-172-31-40-44' then ~
*.* ?RemoteLogs
& ~
```

We configure rsyslog to ignore local syslogs and keep only remote syslog. Then we send them to /var/log/crowdsec_fastly.log


## Install crowdsec with fastly collection

On the same machine, install crowdsec following as mentioned [here](/getting_started/introduction.md)

### Setup  acquisition

Append this config to the file /etc/crowdsec/acquisition.yaml

```yaml
---
filename: /var/log/crowdsec_fastly.log
labels:
  type: syslog
  external_format: fastly
```

### Install fastly collection

Install  the fastly collection via:

```shell
sudo cscli collections install crowdsecurity/fastly
```

### Reload crowdec
```
sudo systemctl reload crowdsec.service
```