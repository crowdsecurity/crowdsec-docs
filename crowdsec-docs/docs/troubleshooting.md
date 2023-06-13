---
title: Troubleshooting Guide
id: troubleshooting
---

:::info
You may see CrowdSec referred to as "Security Engine" and Bouncers referred to as "Remediation Components" within new documentation. This is to better reflect the role of each component within the CrowdSec ecosystem.
:::

## How to list current decisions

```bash
cscli decisions list
```

## How to remove a decision on a IP

```bash
cscli decisions delete -i x.x.x.x
```

## I want to prevent the Security Engine from banning a given IP

Inspired from the existing [default whitelist for private IP addresses](https://hub.crowdsec.net/author/crowdsecurity/configurations/whitelists), you can craft your own (and drop it in `/etc/crowdsec/parsers/s01-parse/mywhitelist.yaml`) :

```yaml
name: crowdsecurity/mywhitelists
description: "Whitelist events from private ipv4 addresses"
whitelist:
  reason: "private ipv4/ipv6 ip/ranges"
  ip: 
    - "127.0.0.1"
    - "::1"
  cidr:
    - "192.168.0.0/16"
    - "10.0.0.0/8"
    - "172.16.0.0/12"
```

## Where is the configuration related to the Security Engine local API?
> While you don't need to modify these file with a simple installation, you need to edit them when you want to use Security Engine in a multi machine setup.

- For the Security Engine Local API Server listen URL:

This information is stored in `/etc/crowdsec/config.yaml` in the `api.server.listen_uri` option.

More information [here](/docs/configuration/crowdsec_configuration#listen_uri).

- For the CrowdSec Security Engine client API:

The URL of the local API that the engine should communicate with is stored in `/etc/crowdsec/local_api_credentials.yaml`.

You can edit the `url` option according to your local API URL.


- For Remediation Components:

Each Remediation Component has its own configuration file, which is located in the `/etc/crowdsec/bouncers/` folder.

They all have an `api_url` option to set the local API URL.


## My Remediaton Component doesn't start/work (common causes)

By default you will find a relevant log file for each bouncer in `/var/log/` folder (e.g. `/var/log/crowdsec-firewall-bouncer.log` for the firewall bouncer). Within this file you will find the error message that prevents the bouncer from starting.

Here are some common causes and solutions:

1. Cannot connect to the local API
  - **error** message might look like:
```
level=error msg="auth-api: auth with api key failed return nil response, error: dial tcp 127.0.0.1:8080: connect: connection refused"
```
  - **solution** verify that the local API runs on the logged IP and port. If the logged IP and port is incorrect, you can edit the bouncer configuration file. If the logged IP and port is correct, verify that the local API is running.

2. Cannot authenticate to the local API
  - **error** message might look like:
```
time="19-04-2022 15:43:07" level=error msg="API error: access forbidden"
```
  - **solution** regenerate the API key via [cscli bouncers](/docs/cscli/cscli_bouncers_add) and replace the old one in the bouncer configuration file. Do not attempt to use the same name for the API key as it will not work.


## My Remediaton Component is not showing any error messages within its log file but its failing to start/work

Most likely means the bouncer is failing to decode the configuration file provided. To find which line is causing the issue, you can use systemd/journalctl to get the error message:

```bash
sudo systemctl status <bouncer-service-name> -l
```

```bash
sudo journalctl -u <bouncer-service-name> -l
```

## I can't find the logs of my Remediaton Component?

By default you will find a relevant log file for each bouncer in `/var/log/` folder (e.g. `/var/log/crowdsec-firewall-bouncer.log` for the firewall bouncer). However, since this is a configurable option you can check the bouncer configuration file to find the exact location of the log file. 

## I can't find the configuration file of my Remediaton Component?

Bouncers configuration files by default are located in:

- **Linux** `/etc/crowdsec/bouncers/`
- **Freebsd** `/usr/local/etc/crowdsec/bouncers/`
- **Windows** `C:\Program Files\CrowdSec\bouncers\`

## My scenario is triggered with less logs than the scenario capacity

During the installation, the CrowdSec [Wizard](/docs/user_guides/building#using-the-wizard) is ran, which detects the basic logs files to add in the [acquisition](/docs/concepts#acquisition) configuration.
If you re-run the `wizard.sh` script after the installation and you have common log files, they might be set up multiple times in your acquisition configuration. This means that CrowdSec will read each logs line as many time as you have the logs file configured in your acquisition configuration.


## Scenario XXX keeps triggering, it's a false positive

To avoid a specific scenario that is bothering you, you have several options:

 - set it in [simulation mode](/docs/cscli/cscli_simulation_enable): you will see the alerts, but no decisions will be applied
 - purely [remove](/docs/cscli/cscli_scenarios_remove/) the scenario: it will be completely disabled


## I need to whitelist a specific event pattern

For example, I don't want to disable the simulation mode for a scenario nor remove it, but it triggers false positives when i access the admin panel of my website.

I can then whitelist the admin panel URLs and so keep the scenario:

```yaml title="/etc/crowdsec/parsers/s02-enrich/my_whitelist.yaml"
name: crowdsecurity/my_whitelist
description: "Whitelist URL starting with '/admin' "
whitelist:
  reason: "False positive on admin panel"
  expression: 
    - "evt.Parsed.request startsWith '/admin'"
```

## I receive few IPs in the community-blocklist

The community-blocklist that you receive is based on your installed scenarios, if they are neither tainted nor custom.

For example, if your `crowdsecurity/ssh-bf` scenario is tainted, you will not receive IPs concerning this scenario in the `community-blocklist`.


## I want to set a custom/tainted scenario in simulation mode

If you want to set a custom/tainted scenario in simulation mode, you need to provide the scenario's filename instead of its name.

For example, i have a scenario called `crowdsecurity/my-custom-scenario` located in `/etc/crowdsec/scenarios/my_custom_scenario.yaml`.

To enable the simulation mode for this scenario, i need to run:

```bash
sudo cscli simulation enable my_custom_scenario.yaml
```

## Why are XXX logs not parsed in `cscli metrics` ?

If you are facing logs that doesn't seem to be parsed correctly, please use [`cscli explain`](/docs/cscli/cscli_explain) :

```
# cscli explain --log "May 16 07:50:30 sd-126005 sshd[10041]: Invalid user git from 78.142.18.204 port 47738" --type syslog
line: May 16 07:50:30 sd-126005 sshd[10041]: Invalid user git from 78.142.18.204 port 47738
	├ s00-raw
	|	└ 🟢 crowdsecurity/syslog-logs (first_parser)
	├ s01-parse
	|	├ 🔴 crowdsecurity/iptables-logs
	|	├ 🔴 crowdsecurity/mysql-logs
	|	├ 🔴 crowdsecurity/nginx-logs
	|	└ 🟢 crowdsecurity/sshd-logs (+6 ~1)
	├ s02-enrich
	|	├ 🟢 crowdsecurity/dateparse-enrich (+2 ~1)
	|	├ 🟢 crowdsecurity/geoip-enrich (+13)
	|	├ 🔴 crowdsecurity/http-logs
	|	└ 🟢 crowdsecurity/whitelists (unchanged)
	├-------- parser success 🟢
	├ Scenarios
		├ 🟢 crowdsecurity/ssh-bf
		├ 🟢 crowdsecurity/ssh-bf_user-enum
		├ 🟢 crowdsecurity/ssh-slow-bf
		└ 🟢 crowdsecurity/ssh-slow-bf_user-enum
```
This command will allow you to see each parser behaviour.

:::warning
Do **not** use `cscli explain` on big log files, as this command will buffer a lot of information in memory to achieve this.
If you want to check crowdsec's behaviour on big log files, please see [replay mode](/docs/user_guides/replay_mode/).
:::

## Is scenario XXX working on my logs ?

You can replay old logs with [replay mode](/docs/user_guides/replay_mode/), which will allow you to see which scenarios would have been triggered. If no scenario seem to trigger, you can have a closer look at potential parsing errors with [`cscli explain`](/docs/cscli/cscli_explain).


## I want to add collection XXX : how to add log files, and how to test if it works ?

When adding a collection to your setup, the [hub](https://hub.crowdsec.net) will usually specify log files to add.
Those lines need to be added in your acquisition file (`/etc/crowdsec/acquis.yaml` or `/etc/crowdsec/acquis.d/myfile.yaml`).
After restart, `cscli metrics` will allow you to see if lines are read and/or parsed.
