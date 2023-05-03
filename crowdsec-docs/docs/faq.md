---
title: FAQ
id: faq
---

# FREQUENTLY ASKED QUESTIONS

## What is CrowdSec ?

CrowdSec is a security open-source software. See the [overview](/intro.mdx).

## I've installed crowdsec, it detects attacks but doesn't block anything ?!

Yes, CrowdSec is in charge of detecting attacks, and [bouncers](/bouncers/intro.md) are applying decisions.
If you want to block the detected IPs, you should deploy a bouncer, such as the ones found on the [hub](https://hub.crowdsec.net/browse/#bouncers) !

## How to know if my setup is working correctly ? Some of my logs are unparsed, is it normal ?

Yes, crowdsec parsers only parse the logs that are relevant for scenarios.
Take a look at `cscli metrics` [and understand what do they mean](/observability/cscli.md) to know if your setup is correct.

You can take an extra step and use [`cscli explain` to understand what log lines are parsed, and how.](/docs/next/cscli/cscli_explain) :

![cscli-explain](/img/cscli_explain.png)



## What language is it written in ?

CrowdSec is written in [Golang](https://golang.org/).

## What resources are needed to run crowdsec ?

Crowdsec agent itself is rather light, and in a small to medium setup should use less than 100Mb of memory.

During intensive logs processing, CPU is going to be the most used resource, and memory usage shouldn't really grow.

## What licence is CrowdSec released under ?

CrowdSec is under [MIT license](https://github.com/crowdsecurity/crowdsec/blob/master/LICENSE).

## Which information is sent to the APIs ?

Our aim is to build a strong community that can share malevolent attackers IPs, for that we need to collect the bans triggered locally by each user.

The signal sent by your CrowdSec to the central API only contains only meta-data about the attack :

 - Attacker IP
 - Scenario name
 - Time of start/end of attack

Your logs are not sent to our central API, only meta-data about blocked attacks will be.


When pulling block-lists from the platform, the following information is shared as well :

 - list of [upstream installed scenarios](https://crowdsecurity.github.io/api_doc/capi/#/watchers/post_metrics)
 - list of [bouncers & number of machines](https://crowdsecurity.github.io/api_doc/capi/#/watchers/post_metrics)

## What is the performance impact ?

As CrowdSec only works on logs, it shouldn't impact your production.
When it comes to [bouncers](/bouncers/intro.md), it should perform **one** request to the database when a **new** IP is discovered thus have minimal performance impact.

## How fast is it ?

CrowdSec can easily handle several thousands of events per second on a rich pipeline (multiple parsers, geoip enrichment, scenarios and so on). Logs are a good fit for sharding by default, so it is definitely the way to go if you need to handle higher throughput.

If you need help for large scale deployment, please get in touch with us on the [Discourse](https://discourse.crowdsec.net/), we love challenges ;)

## What backend database does CrowdSec supports and how to switch ?

CrowdSec versions (after v1) supports SQLite (default), MySQL and PostgreSQL databases.
See [databases configuration](/local_api/database.md) for relevant configuration. Thanks to the [Local API](/local_api/intro.md), distributed architectures are resolved even with sqlite database.

SQLite by default as it's suitable for standalone/single-machine setups.

## How to control granularity of actions ? (whitelists, simulation etc.)

CrowdSec support both [whitelists](/whitelist/introduction.md) and [simulation](/scenarios/simulation.md) :

 - Whitelists allows you to "discard" events or overflows
 - Simulation allows you to simply cancel the decision that is going to be taken, but keep track of it

[Profiles](/profiles/intro.md) allows you to control which decision will be applied to which alert.

## How to add whitelists ?

You can follow this [guide](/whitelist/introduction.md)

## How to set up proxy ?

Setting up a proxy works out of the box, the [net/http golang library](https://golang.org/src/net/http/transport.go) can handle those environment variables:

* `HTTP_PROXY`
* `HTTPS_PROXY`
* `NO_PROXY`

For example:

```
export HTTP_PROXY=http://<proxy_url>:<proxy_port>
```
### Systemd variable
On Systemd devices you have to set the proxy variable in the environment section for the CrowdSec service. To avoid overwriting the service file during an update, a folder is created in `/etc/systemd/system/crowdsec.service.d` and a file in it named `http-proxy.conf`. The content for this file should look something like this:
```
[Service]
Environment=HTTP_PROXY=http://myawesomeproxy.com:8080
Environment=HTTPS_PROXY=https://myawesomeproxy.com:443
```
After this change you need to reload the systemd daemon using:
`systemctl daemon-reload`

Then you can restart CrowdSec like this:
`systemctl restart crowdsec`

### Sudo
If you use `sudo cscli`, just add this line in `visudo` after setting up the previous environment variables:

```
Defaults        env_keep += "HTTP_PROXY HTTPS_PROXY NO_PROXY"
```

## How to report a bug ?

To report a bug, please open an issue on the [repository](https://github.com/crowdsecurity/crowdsec/issues/new?assignees=&labels=bug&template=bug_report.md&title=Bug%2F).

## What about false positives ?

Several initiatives have been taken to tackle the false positives approach as early as possible :

 - The scenarios published on the hub are tailored to favor low false positive rates
 - You can find [generic whitelists](https://hub.crowdsec.net/author/crowdsecurity/collections/whitelist-good-actors) that should allow to cover most common cases (SEO whitelists, CDN whitelists etc.)
 - The [simulation configuration](/scenarios/simulation.md) allows you to keep a tight control over scenario and their false positives
 - Or add your own [whitelists](/whitelist/create.md)


## I need some help

Feel free to ask for some help to the [Discourse](https://discourse.crowdsec.net/) or directly in the [Discord](https://discord.gg/crowdsec) chat.

## How to have a dashboard without docker

See [the tutorial](/blog/metabase_without_docker)

## How to configure crowdsec/cscli to use Tor


It is possible to configure `cscli` and `crowdsec` to use [tor](https://www.torproject.org/) to anonymously interact with our API.
All (http) requests made to the central API to go through the [tor network](https://www.torproject.org/).


With tor installed, setting `HTTP_PROXY` and `HTTPS_PROXY` environment variables to your socks5 proxy will do the trick.


### Running the wizard with tor

```bash
$ sudo HTTPS_PROXY=socks5://127.0.0.1:9050 HTTP_PROXY=socks5://127.0.0.1:9050  ./wizard.sh --bininstall
```

:::caution

Do not use the wizard in interactive (`-i`) mode if you're concerned, as it will start the service at the end of the setup, leaking your IP address.

:::

### Edit crowdsec systemd unit to push/pull via tor

```bash
[Service]
Environment="HTTPS_PROXY=socks5://127.0.0.1:9050"
Environment="HTTP_PROXY=socks5://127.0.0.1:9050"
...
```
### Using cscli via tor

```bash
$ sudo HTTP_PROXY=socks5://127.0.0.1:9050 HTTPS_PROXY=socks5://127.0.0.1:9050 cscli capi register
```

## How to setup High Availability for Local API

When setting up High Availability for Local API, do not forget to share the same `CS_LAPI_SECRET` between your Local API instances : it is the secret used to signed JWT tokens. (By default it's generated from PRNG at startup)

## How to disable the central API

To disable the central API, simply comment out the [`online_client` section of the configuration file](/configuration/crowdsec_configuration.md#online_client).

## Why are some scenarios/parsers "tainted" or "custom" ? 

When using `cscli` to list your parsers, scenarios and collections, some might appear as "tainted" or "custom".

"tainted" items:
 - Originate from the hub
 - Were locally modified
 - Will not be automatically updated/upgraded by `cscli` operations (unless `--force` or similar is specified)
 - Won't be sent to Central API and won't appear in the Console (unless `cscli console enable tainted` has been specified)

"custom" items:
 - Have been locally created by the user
 - Are not managed by `cscli` operations
 - Won't be sent to Central API and won't appear in the Console (unless `cscli console enable custom` has been specified)
