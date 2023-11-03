---
slug: crowdsec_firewall_freebsd
title: How to install CrowdSec Firewall Bouncer on FreeBSD
author: Sofian Brabez
author_url: https://github.com/sbz
tags: [bouncer, firewall, crowdsec]
---

This tutorial will give you all the needed configuration steps to have an *up and running* firewall protection with Crowdsec Agent on FreeBSD systems.

<!--truncate-->

## Packages installation

* Update the current package database and install the following packages. Make sure your systems is configured with a FreeBSD official repository either `latest` or `quaterly`

```
pkg -vvv|awk '/Repositories:/,/}/'
Repositories:
  FreeBSD: { 
    url             : "pkg+http://pkg.FreeBSD.org/FreeBSD:12:amd64/latest",
    enabled         : yes,
...
```

_You can edit the repository config file by editing `/etc/pkg/FreeBSD.conf`. By default, it should have been setup correctly during the OS installation._

```
sudo pkg update
sudo pkg install crowdsec crowdsec-firewall-bouncer
```

## Firewall Configuration

* The FreeBSD firewall `pf` is not loaded by default, you need to load the kernel module:

```
sudo kldload pf
```

* Enable it in your `/etc/rc.conf` permanently:

```
pf_enable="YES"
```

In order to be able to block and drop traffic, you need to append this minimal `/etc/pf.conf` configuration in your pf rules:

```
# create crowdsec table
table <crowdsec-blacklists> persist

# create crowdsec6 table
table <crowdsec6-blacklists> persist

block drop in quick from <crowdsec-blacklists> to any
block drop in quick from <crowdsec6-blacklists> to any
```

For more details on the firewall configuration, you could refer to the [pf.conf(5)](https://www.freebsd.org/cgi/man.cgi?query=pf.conf) man pages.

* Reload the rules and check config

```
sudo pfctl -f /etc/pf.conf
sudo pfctl -sr
sudo service pf check
sudo service pf status
```

## Agent Configuration

* Copy the sample config:

```
sudo cp /usr/local/etc/crowdsec/config.yaml.sample /usr/local/etc/crowdsec/config.yaml
```

Review the YAML settings in the file and updates accordingly.

* Enable it in your `/etc/rc.conf`:

```
crowdsec_enable="YES"
crowdsec_config="/usr/local/etc/crowdsec/config.yaml"
crowdsec_flags=" -info"
```

* Start the service Crowdsec Agent

```
sudo service crowdsec start
sudo service crowdsec status
```

* List your current machine Agent settings

```
crowdsec-cli machines list
-------------------------------------------------------------------------------------------------------------
 NAME                                              IP ADDRESS  LAST UPDATE           STATUS  VERSION         
-------------------------------------------------------------------------------------------------------------
 7fb0531dc09a40d288299c8377d6cfe5nJtGyC7TFsUR3XYZ  127.0.0.1   2021-07-22T09:41:47Z  ✔️       v1.1.1-freebsd 
-------------------------------------------------------------------------------------------------------------
```

## Bouncer Configuration

* Copy the sample config

```
sudo cp /usr/local/etc/crowdsec-firewall-bouncer/crowdsec-firewall-bouncer.yaml.sample /usr/local/etc/crowdsec-firewall-bouncer/crowdsec-firewall-bouncer.yaml
```

* Add the new bouncer and it will generate the token for `{your_api_key}` to use

```
crowdsec-cli bouncers add --name freebsd-pf-bouncer
```

* Edit the YAML settings in the file. Make sure the bouncer backend `mode` is `pf` (automatically set at installation time). `api_url` and `api_key` are mandatory to be set.

```
api_url: http://localhost:8080/
api_key: <your_api_key>
```

* List your current bouncers config

```
$ crowdsec-cli bouncers list
---------------------------------------------------------------------------------------------------------
 NAME                IP ADDRESS  VALID  LAST API PULL         TYPE                       VERSION         
---------------------------------------------------------------------------------------------------------
 freebsd-pf-bouncer  127.0.0.1   ✔️      2021-07-22T09:59:33Z  crowdsec-firewall-bouncer  v0.0.13-freebsd 
---------------------------------------------------------------------------------------------------------
```

* Enable it in your `/etc/rc.conf`:

```
crowdsec_firewall_enable="YES"
```

* Start the service Crowdsec Firewall

```
sudo service crowdsec_firewall start
sudo service crowdsec_firewall status
```

## Scenarios, Parsers and Collections

* Use the following scenarios, parsers and collections from the Hub:

```
sudo crowdsec-cli scenarios install crowdsecurity/ssh-bf
sudo crowdsec-cli parsers install crowdsecurity/sshd-logs
sudo crowdsec-cli parsers install crowdsecurity/syslog-logs
sudo crowdsec-cli collections install crowdsecurity/sshd 
```

* Restart the crowdsec agent

```
sudo service crowdsec restart
```

_You should now benefit from the Crowdsec signals from the community and your own and be protected against malevolant behaviour._