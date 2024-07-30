---
id: install_crowdsec_pfsense
title: pfSense
---

The CrowdSec package for pfSense requires some manual installation steps, as it is not yet available in the official repositories.

Three types of setup are supported:

**Small** (remediation only) - the pfSense machine receives blocklists from a
Security Engine that you are running on a different machine.
Attacking traffic is blocked at the firewall by (configurable) pfSense rules.

**Medium** (small+log processor) - in addition to enforcing blocklists, the pfSense
machine can detect attacks directed at the firewall itself, for example port scans.
The data about the attacks is sent (for analysis and possibly sharing) to a Security Engine
that you are running on a different machine.

**Large** (medium+LAPI) - deploy a fully autonomous Security Engine on the firewall
system and allow other Log Processors to connect to it. Requires a persistent `/var`
directory (no RAM disk) and a slightly larger pfSense machine, depending on the amount
of data to be processed.

If you are not already a CrowdSec user, the Large setup is the easiest: just leave the default
values to enable remediation, log processor and Local API.

:::info
The CrowdSec configuration is not transferred when you restore a pfSense backup, and you'll need
to reconfigure it or backup separately. Major pfSense upgrades may also require you to re-install
or re-configure CrowdSec so please verify that it's running afterwards. We have submitted the package
for inclusion in the official repository which should smooth out these issues.
:::

## Installing the package

 * Choose [the release you want to install](https://github.com/crowdsecurity/pfSense-pkg-crowdsec/releases),
   click `Assets` for the list of packages to install.

 * Open an ssh connection to your pfSense box and run the following commands in the right order. Do not activate or run the services,
   because pfSense will take care of it.

```console
# setenv IGNORE_OSVERSION yes
# pkg add -f <link to abseil>
# pkg add -f <link to re2>
# pkg add -f <link to crowdsec-firewall-bouncer>
# pkg add -f <link to crowdsec>
# pkg add -f <link to pfSense-pkg-crowdsec>
```

The direct links are for the most popular Community Edition of pfSense, architecture amd64. If you run on ARM or a different base version 
of FreeBSD, you will find .tar files in the release assets containing the packages for the possible platforms.


## Configuration

Once the package and its dependencies are installed, go to `Service/CrowdSec`. The options *Remediation Component*,
*Log Processor* and *Local API* should be enabled. Click Save.

With the size analogy, the default is a "Large", autonomous installation. For a "Medium", disable *Local API* and fill the fields in the *Remote LAPI* section. For a "Small", disable *Log Processor* too.

CrowdSec on pfSense is fully functional from the command line but the web interface is read-only, with the exception of decision revocation (unban).
Most other actions require the shell or the [CrowdSec Console](https://app.crowdsec.net).
For simple things, `Diagnostics/Command Prompt` works as well as ssh.
You are free to edit the files in `/usr/local/etc/crowdsec`, although some setting may be overwritten by the pfSense package if they are mandatory.

:::caution
*Ram Disk*: unless you disable Local API, ensure that you are [not using a RAM disk](https://docs.netgate.com/pfsense/en/latest/config/advanced-misc.html#ram-disk-settings)
for the /var directory. The persistent CrowdSec database and GeoIP tables are in `/var/db`.
If you really need a RAM disk, you can still use the log processor and remediation but you will
need to connect them to a remote CrowdSec instance.
:::


## Service Status

In the page `Status/CrowdSec` you can see

 - registered log processors and bouncers
 - installed hub items (collections, scenarios, parsers, postoverflows)
 - alerts and local decisions

All tables are read-only with an exception: you can delete decisions one by one, to unban an IP for example.
An IP may have been banned for several reasons, which counts as separate decisions.

All hub objects are periodically upgraded with a cron job.


## Detecting attacks

If a Log Processor is running, the following scenarios are enabled by default:

 - portscan
 - ssh brute-force
 - pfSense admin UI brute-force
 - HTTP vulnerability probing

These will trigger a ban on the attacking IP (4 hours by default) and report it to the CrowdSec Central API
(meaning [timestamp, scenario, attacking IP](https://docs.crowdsec.net/docs/concepts/), for inclusion in the
Community Blocklist.

You can add scenarios to detect other types of attack on the pfSense server, or
[connect several log processors](https://doc.crowdsec.net/docs/next/user_guides/multiserver_setup)
to the same LAPI node.
Other types of remediation are possible (ex. captcha test for scraping attempts).

If disk space is not an issue, you can [increase the maximum size](https://docs.netgate.com/pfsense/en/latest/monitoring/logs/size.html)
of log files before they are compressed and rotated. This will help us in case you report
acquisition issues and we need to match the application behavior with the content of the acquired logs.

We recommend you to [register to the Console](https://app.crowdsec.net/), especially if you protect several machines.


## Processing logs

If a collection, parser or scenario can be applied to a software that you are running on pfSense,
you add it with `cscli collections install ...`, then you need to configure where CrowdSec will find the logs.

New acquisition files should go in `/usr/local/etc/crowdsec/acquis.d/`. See `pfsense.yaml` for an example.
The option `poll_without_inotify: true` is required if the log sources are symlinks.
Make sure to reload or restart CrowdSec when you add new data sources.


## Diagnostics

Under `Diagnostics/CrowdSec` you can check if the logs are acquired and the
events are triggered correctly. For real monitoring, you can fetch the same metrics with
[Prometheus](https://docs.crowdsec.net/docs/observability/prometheus/) (Grafana dashboard included)
Telegraf or your favorite solution.

If you are not running a LAPI or a Log Processor, some metrics are always empty.


## Logs

You can see the Security Engine logs in `Status/System Logs/Packages/crowdsec`.

Other logs not shown in the UI are in `/var/log/crowdsec/crowdsec_api.log`
and `crowdsec-firewall-bouncer.log`.


## Service Management

Both services, Security Engine (crowdsec) and Remediation (crowdsec-firewall-bouncer) can be
controlled from [Status/Services](/status_services.php).
The equivalent shell commands are `service crowdsec.sh start/stop/restart` and `service crowdsec_firewall.sh start/stop/restart`. Note the ending **.sh**!

## Viewing blocked IPs

You can see the tables of the blocked IPs in Diagnostics/Tables or from the shell, with the commands
`pfctl -T show -t crowdsec_blacklists` (IPv4) and `pfctl -T show -t crowdsec6_blacklists` (IPv6).

To show the same data with more context, use `cscli decisions list -a`.

## Testing

A quick way to test that everything is working correctly end-to-end is to
execute the following command.

Your ssh session should freeze and you should be kicked out from
the firewall. You will not be able to connect to it (from the same
IP address) for two minutes.

It might be a good idea to have a secondary IP from which you can
connect, should anything go wrong.

```console
# cscli decisions add -t ban -d 2m -i <your_ip_address>
````

You may have to disable the *Anti-lockout* rule in
`System/Advanced/Admin Access` for the time of the test.

This is a more secure way to test than attempting to brute-force
yourself: the default ban period is 4 hours, and CrowdSec reads the
logs from the beginning, so it could ban you even if you failed ssh
login 10 times in 30 seconds two hours before installing it.

It must be noted that the [Login Protection](https://docs.netgate.com/pfsense/en/latest/config/advanced-admin.html#login-protection) service which is enabled by default on pfSense can be triggered - and block a brute force attacker - before CrowdSec does, because it's more sensitive. Still, some attacks that are not detected by Login Protection will be detected by CrowdSec and shared.
If you need more CrowdSec tests you may want to temporarily disable Login Protection, depending on the scenario.

## LAN / private networks whitelist

Since crowdsec 1.6.3, private IP networks are whitelisted by default as well. This means for example an IP from a LAN or WAN which is on 192.168.x.y won't get blocked by a local decision
(community blocklists don't contain private IPs).

If you want to revert to the previous behavior, to block private IPs as well, you can remove the related parser.

```console
[root@OPNsense ~]# cscli parsers remove crowdsecurity/whitelists
```

If on the other hand you upgrade from a version before 1.6.3, you need to install the lists yourself.


## Uninstalling

In most cases, just remove the `crowdsec` package from
`System/Package Manager/Installed Packages`.
This won't remove the database or configuration files, just in case
you want to reinstall CrowdSec later.

If you need to make sure you removed all traces of CrowdSec, you can run the following commands:

```console
# pkg remove pfSense-pkg-crowdsec crowdsec crowdsec-firewall-bouncer
# rm -rf /usr/local/etc/crowdsec /usr/local/etc/rc.conf.d/crowdsec*
# rm -rf /var/db/crowdsec /var/log/crowdsec* /var/run/crowdsec*
```

For testing purposes, you may want to remove the &lt;crowdsec&gt; section
from `/conf/config.xml` as well.

