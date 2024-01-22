---
title: FAQ / Troubleshooting
id: intro
---

:::info
You may see CrowdSec referred to as "Security Engine" and Bouncers referred to as "Remediation Components" within new documentation. This is to better reflect the role of each component within the CrowdSec ecosystem.
:::

# Troubleshooting

We have extended our troubleshooting documentation to cover more common issues and questions. If you have any suggestions for this please open an [issue here](https://github.com/crowdsecurity/crowdsec-docs).

### [Security Engine](/troubleshooting/security_engine.mdx)

### [Remediation Components](/troubleshooting/remediation_components.mdx)

## Community support

Please try to resolve your issue by reading the documentation. If you're unable to find a solution, don't hesitate to seek assistance in:

- [Discourse](https://discourse.crowdsec.net/)
- [Discord](https://discord.gg/crowdsec)

# FAQ

## Security Engine

### What is CrowdSec Security Engine ?

CrowdSec Security Engine is a open-source security software. See the [overview](/docs/next/intro).

### I've installed the Security Engine, it detects attacks but doesn't block anything ?!

Yes, the Security Engine is in charge of detecting attacks, and [Remediation Component](/u/bouncers/intro) are applying decisions.
If you want to block the detected IPs, you should deploy a Remediation Component, such as the ones found on the [hub](https://hub.crowdsec.net/browse/#bouncers) !

### What language is it written in ?

CrowdSec Security Engine is written in [Golang](https://golang.org/).

### What resources are needed to run Security Engine ?

Security Engine itself is rather light, and in a small to medium setup should use less than 100Mb of memory.

During intensive logs processing, CPU is going to be the most used resource, and memory should grow slightly.

#### What is the performance impact ?

As the Security Engine only works on logs, it shouldn't impact your production.
When it comes to [remediation components](/u/bouncers/intro), please refer to their [documentation](/u/bouncers/intro).

### What license is provided ?

The Security Engine and Remediation Components are provided under [MIT license](https://en.wikipedia.org/wiki/MIT_License).

### How fast is it

The Security Engine can easily handle several thousands of events per second on a rich pipeline (multiple parsers, geoip enrichment, scenarios and so on). Logs are a good fit for sharding by default, so it is definitely the way to go if you need to handle higher throughput.

If you need help for large scale deployment, please get in touch with us on the [Form](https://contact.crowdsec.net/business-request), we love challenges ;)

### How to set up proxy

Setting up a proxy works out of the box, the [net/http golang library](https://golang.org/src/net/http/transport.go) can handle those environment variables:

* `HTTP_PROXY`
* `HTTPS_PROXY`
* `NO_PROXY`

For example:

```bash
export HTTP_PROXY=http://<proxy_url>:<proxy_port>
```

#### Systemd variable
On Systemd devices you have to set the proxy variable in the environment section for the CrowdSec service. To avoid overwriting the service file during an update, a folder is created in `/etc/systemd/system/crowdsec.service.d` and a file in it named `http-proxy.conf`. The content for this file should look something like this:

```bash title="systemctl edit crowdsec.service"
[Service]
Environment=HTTP_PROXY=http://myawesomeproxy.com:8080
Environment=HTTPS_PROXY=https://myawesomeproxy.com:443
```

After this change you need to reload the systemd daemon using:
`systemctl daemon-reload`

Then you can restart CrowdSec like this:
`systemctl restart crowdsec`

#### Sudo
If you use `sudo cscli`, just add this line in `visudo` after setting up the previous environment variables:

```
Defaults        env_keep += "HTTP_PROXY HTTPS_PROXY NO_PROXY"
```

### Tor

You can configure `cscli` and `crowdsec` to use [tor](https://www.torproject.org/) to anonymously interact with our API.

All (http) requests made to the central API to go through the [tor network](https://www.torproject.org/).

With tor installed, setting `HTTP_PROXY` and `HTTPS_PROXY` environment variables to your socks5 proxy will do the trick.

#### Edit crowdsec systemd unit to push/pull via tor

```bash title="systemctl edit crowdsec.service"
[Service]
Environment="HTTPS_PROXY=socks5://127.0.0.1:9050"
Environment="HTTP_PROXY=socks5://127.0.0.1:9050"
```

#### Running the wizard with tor

```bash
$ sudo HTTPS_PROXY=socks5://127.0.0.1:9050 HTTP_PROXY=socks5://127.0.0.1:9050  ./wizard.sh --bininstall
```

:::caution

Do not use the wizard in interactive (`-i`) mode if you're concerned, as it will start the service at the end of the setup, leaking your IP address.

:::

#### cscli

```bash
$ sudo HTTP_PROXY=socks5://127.0.0.1:9050 HTTPS_PROXY=socks5://127.0.0.1:9050 cscli capi register
```

### How to report a bug

To report a bug, please open an issue on the affected component's repository:

[CrowdSec Repo](https://github.com/crowdsecurity/crowdsec/issues/new/choose)

[CrowdSec Hub Repo](https://github.com/crowdsecurity/hub/issues/new/choose)

:::info
CrowdSec Hub should be used when you have an issue with a parser, scenario or collection.
:::

### How to disable the central API

To disable the central API, simply comment out the [`online_client` section of the configuration file](/docs/next/configuration/crowdsec_configuration#online_client).

### Why are some scenarios/parsers "tainted" or "custom" ? 

When using `cscli` to list your parsers, scenarios and collections, some might appear as "tainted" or "local".

"tainted" items:
 - Originate from the hub
 - Were locally modified
 - Will not be automatically updated/upgraded by `cscli` operations (unless `--force` or similar is specified)
 - Won't be sent to Central API and won't appear in the Console (unless `cscli console enable tainted` has been specified)

"local" items:
 - Have been locally created by the user
 - Are not managed by `cscli` operations
 - Won't be sent to Central API and won't appear in the Console (unless `cscli console enable custom` has been specified)

### Which information is sent to your services ?

See [CAPI documentation](/docs/next/central_api/intro).

### How to know if my setup is working correctly ? Some of my logs are unparsed, is it normal ?

Yes, security engine parsers only parse the logs that are relevant for scenarios.

Take a look at `cscli metrics` [and understand what do they mean](/docs/next/observability/cscli) to know if your setup is correct.

You can take an extra step and use [`cscli explain` to understand what log lines are parsed, and how.](/docs/next/cscli/cscli_explain) :

![cscli-explain](/img/cscli_explain.png)

### Why are X logs not parsed in `cscli metrics` ?

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
This command will allow you to see each parser behavior.

:::warning
Do **not** use `cscli explain` on big log files, as this command will buffer a lot of information in memory to achieve this.
If you want to check crowdsec's behaviour on big log files, please see [replay mode](/docs/next/user_guides/replay_mode/).
:::

### I want to add collection X : how to add log files, and how to test if it works ?

When adding a collection to your setup, the [hub](https://hub.crowdsec.net) will usually specify log files to add.

Those lines need to be added in your acquisition file (`/etc/crowdsec/acquis.yaml` or `/etc/crowdsec/acquis.d/myfile.yaml`).

After restart, `cscli metrics` will allow you to see if lines are read and/or parsed.
