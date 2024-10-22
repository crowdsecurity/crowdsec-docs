---
id: install_crowdsec_freebsd
title: FreeBSD
sidebar_position: 1
---

## Configuring the repositories

FreeBSD packages are available in the official repositories.

By default, the command `pkg install` should use the quarterly releases (January, April, July and October, updated with security fixes).

You can check `/etc/pkg/FreeBSD.conf` and [change **quarterly** to **latest**](https://wiki.freebsd.org/Ports/QuarterlyBranch) if you feel comfortable upgrading your system.


## Install the Security Engine

Before installing the package, you might want to check [the ports that security engine will use](/docs/next/configuration/network_management).

The CrowdSec package itself can be installed with:

```shell
$ sudo pkg install crowdsec
```

If the command installs the legacy v1.1.1, you will have a couple more steps to do, please have a look at the [related blog post](https://docs.crowdsec.net/blog/crowdsec_firewall_freebsd/).

You'll see a message that tells you how to activate the agent:

```shell
$ sudo sysrc crowdsec_enable="YES"
crowdsec_enable:  -> YES
$ sudo service crowdsec start
Fetching hub inventory
INFO[21-12-2021 03:13:35 PM] Wrote new 197364 bytes index to /usr/local/etc/crowdsec/hub/.index.json 
[...]
```

The service registers itself with the Central API on crowdsec.net, updates the plugin registry and downloads the "crowdsecurity/freebsd" collection of plugins.
This includes, for instance, a parsers for sshd logs and a database to correlate IP addresses with geographical information.

As opposed to its Linux counterparts, the FreeBSD package does not automatically detect the software that is running on the machine; please refer
to our documentation to add parsers, scenarios and more.

:::caution
Keep in mind that the crowdsec package is only in charge of the "detection", and won't block anything on its own.
You need to deploy a [bouncer](/u/bouncers/intro) to "apply" decisions.
:::


If all this sounds confusing, it might be a good moment to take a [tour](/getting_started/crowdsec_tour.mdx) of the software before continuing.

## Installing the firewall remediation component

This is a package that receives decisions to ban IP addresses and whole address ranges, if they are the source of verified attacks.

To install and enable it:

```shell
$ sudo pkg install crowdsec-firewall-bouncer
[...]
$ sudo sysrc crowdsec_firewall_enable=YES
crowdsec_firewall_enable:  -> YES
$ sudo service crowdsec_firewall start
Registered: cs-firewall-bouncer-ZjpcXlUx
```


The firewall remediation component is now running. It applies rules via the [Packet Filter](https://docs.freebsd.org/en/books/handbook/firewalls/#firewalls-pf).

Create the required tables by creating or appending this to `/etc/pf.conf`:

```
table <crowdsec-blacklists> persist
table <crowdsec6-blacklists> persist
block drop in quick from <crowdsec-blacklists> to any
block drop in quick from <crowdsec6-blacklists> to any
```

If Packet Filter is not enabled, you can do it now:

```shell
$ sudo sysrc pf_enable=YES
pf_enable: NO -> YES
$ sudo service pf start
Enabling pf.
```

Reload the rules with:

```shell
$ sudo pfctl -f /etc/pf.conf
```

You can check the configuration with:

```shell
$ sudo pfctl -sr
block drop in quick from <crowdsec-blacklists> to any
block drop in quick from <crowdsec6-blacklists> to any
$ sudo service pf check
Checking pf rules.
$ sudo service pf status
Status: Enabled for 0 days 00:00:02           Debug: Urgent
[...]
```

:::info
While we are suggesting the most common firewall bouncer, check our [hub](https://hub.crowdsec.net) for more of them.
Find a bouncer directly for your application ([nginx](https://hub.crowdsec.net/author/crowdsecurity/bouncers/cs-nginx-bouncer), [php](https://github.com/crowdsecurity/php-cs-bouncer), [wordpress](https://hub.crowdsec.net/author/crowdsecurity/bouncers/cs-wordpress-bouncer)) or your providers ([cloudflare](https://hub.crowdsec.net/author/crowdsecurity/bouncers/cs-cloudflare-bouncer), [AWS/GCP/...](https://hub.crowdsec.net/author/fallard84/bouncers/cs-cloud-firewall-bouncer)) 
:::


## Building from sources

Another option - and the only one if you have a [Tier-2 or unsupported platform](https://www.freebsd.org/platforms/) whose binaries are harder to find
or seldom updated - is to build the packages yourself by using our FreeBSD ports.

If you are not familiar with how ports work, be aware that mixing ports and binary packages might break your system.
Please read [the FreeBSD documentation](https://docs.freebsd.org/en/books/handbook/ports/#ports-using) and decide for yourself if it's the best method for your case.

If you are already familiar with ports, running `make install` in `/usr/ports/security/crowdsec` and `/usr/ports/security/crowdsec-firewall-bouncer`
will compile and install the packages and all their dependencies. Then configure them as you would normally do with `pkg install`.


## Troubleshooting

In some cases, CrowdSec is unable to generate the machine id and is unable to initialize properly.

We saw it happen with an APU board, likely due to the open source coreboot firmware.

Start `hostid` and `hostid_save`:

```
/etc/rc.d/hostid start
/etc/rc.d/hostid_save start
```

Then start again the CrowdSec' service  `service crowdsec start`.

## Enrolling your instance

The next step is to enroll your instance with the [CrowdSec Console](https://app.crowdsec.net/security-engines?enroll-engine=true).

For the benefits, please visit the [Console section](/u/console/intro).