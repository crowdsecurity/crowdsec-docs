---
id: quickstart
title: Quickstart
sidebar_position: 2
---

## Objectives

The goal of this quickstart is to set up the [AppSec Component](/appsec/intro.md#introduction) to safeguard web applications running on [Nginx](https://nginx.com). We'll deploy a [set of rules](https://app.crowdsec.net/hub/author/crowdsecurity/collections/appsec-virtual-patching) designed to block [well-known attacks](https://app.crowdsec.net/hub/author/crowdsecurity/collections/appsec-generic-rules) and [currently exploited vulnerabilities](https://app.crowdsec.net/hub/author/crowdsecurity/collections/appsec-virtual-patching). Additionally, we'll show how to monitor these alerts through the [console](https://app.crowdsec.net/).

## Pre-requisites

1. If you're new to the [AppSec Component](/appsec/intro.md#introduction) or **W**eb **A**pplication **F**irewalls, start with the [Introduction](/appsec/intro.md#introduction) for a better understanding.

2. It's assumed that you have already installed:
   - **Crowdsec [Security Engine](/docs/next/intro)**: for installation, refer to the [QuickStart guide](/docs/getting_started/install_crowdsec). The AppSec Component, which analyzes HTTP requests, is included within the security engine.
   - One of the supported web servers (here: nginx) and its **[Remediation Component](/u/bouncers/intro)**: installation instructions are available in the [QuickStart guide](/u/bouncers/nginx). This component intercepts HTTP requests at the webserver or reverse-proxy level and forwards them to the AppSec Component for analysis and action.

## AppSec Component Setup

### Collection installation

To begin setting up the AppSec Component, the initial step is to install a relevant set of rules. We will utilize the [`crowdsecurity/appsec-virtual-patching`](https://app.crowdsec.net/hub/author/crowdsecurity/collections/appsec-virtual-patching) collection, which offers a wide range of rules aimed at identifying and preventing the exploitation of known vulnerabilities. This [collection](/concepts.md#collections) is regularly updated to include protection against newly discovered vulnerabilities. Upon installation, it receives automatic daily updates to ensure your protection is always current.
Furthermore we also install the [`crowdsecurity/appsec-generic-rules`](https://app.crowdsec.net/hub/author/crowdsecurity/collections/appsec-generic-rules) collection. This collection contains detection scenarios for generic attack vectors. It provides some protection in cases where specific scenarios for vulnerabilities do not exist (yet).

On the machine where the Security Engine is installed, just execute the following command:

:::info
You can always view the content of a [collection on the hub](https://app.crowdsec.net/hub/author/crowdsecurity/collections/appsec-virtual-patching)
:::

```
sudo cscli collections install crowdsecurity/appsec-virtual-patching
sudo cscli collections install crowdsecurity/appsec-generic-rules
```

Executing this command will install the following items:

- The [*AppSec Rules*](/appsec/rules_syntax.md) contain the definition of malevolent requests to be matched and stopped
- The [*AppSec configuration*](/appsec/configuration.md#appsec-configuration) links together a set of rules to provide a coherent set
- The [*CrowdSec Parser*](/concepts.md#parsers) and [*CrowdSec Scenario(s)*](/concepts.md#scenarios) bans for a longer duration repeating offenders

### Setup the acquisition

Having installed the required components, it's time to configure the CrowdSec [Acquisition](/concepts.md#acquisition) to connect the Application Security Component with our Nginx web server. This configuration allows our Nginx server to send requests to the AppSec Component for evaluation and decision-making.

 - Create the `/etc/crowdsec/acquis.d/` directory with `mkdir -p /etc/crowdsec/acquis.d/` (if it doesn't exist on your machine)
 - Put the following content in `/etc/crowdsec/acquis.d/appsec.yaml` :

```yaml title="/etc/crowdsec/acquis.d/appsec.yaml"
appsec_config: crowdsecurity/appsec-default
labels:
  type: appsec
listen_addr: 127.0.0.1:7422
source: appsec
```

The two important directives in this configuration file are:

 - `appsec_config` is the name of the [*AppSec configuration*](/appsec/configuration.md#appsec-configuration) that was included in the [collection](/concepts.md#colleccollectionstion) we just installed.
 - the `listen_addr` is the IP and port the AppSec Component will listen to.

:::info
You can find more about the [supported options for the acquisition here](/data_sources/appsec.md)
:::

You can now restart CrowdSec:

```bash
sudo systemctl restart crowdsec
```

<details>
  <summary>(Optional) Manually testing the AppSec Component with `curl`</summary>

Before we proceed with configuring the Remediation Component, let's verify that all our current setups are functioning correctly.

1. Create a Remediation Component (Bouncer) API Key:

```bash
sudo cscli bouncers add test_waf -k this_is_a_bad_password
API key for 'test_waf':

   this_is_a_bad_password

Please keep this key since you will not be able to retrieve it!
```

2. Emit a legitimate request to the AppSec Component:

```bash
curl -X POST localhost:7422/ -i -H 'x-crowdsec-appsec-uri: /test' -H 'x-crowdsec-appsec-ip: 42.42.42.42' -H 'x-crowdsec-appsec-host: foobar.com' -H 'x-crowdsec-appsec-verb: POST' -H 'x-crowdsec-appsec-api-key: this_is_a_bad_password'
```

Which will give us an answer such as:

```bash
HTTP/1.1 200 OK
Date: Tue, 30 Jan 2024 15:43:50 GMT
Content-Length: 36
Content-Type: text/plain; charset=utf-8

{"action":"allow","http_status":200}
```

3. Emit a malevolent request to the Appsec Component:

:::info
We're trying to access a `.env` file, a [common way to get access to some credentials forgotten by a developer.](https://app.crowdsec.net/hub/author/crowdsecurity/appsec-rules/vpatch-env-access)
:::

```bash
curl -X POST localhost:7422/ -i -H 'x-crowdsec-appsec-uri: /.env' -H 'x-crowdsec-appsec-ip: 42.42.42.42' -H 'x-crowdsec-appsec-host: foobar.com' -H 'x-crowdsec-appsec-verb: POST' -H 'x-crowdsec-appsec-api-key: this_is_a_bad_password'

```

Our request is detected and blocked by the AppSec Component:

```bash
HTTP/1.1 403 Forbidden
Date: Tue, 30 Jan 2024 15:57:08 GMT
Content-Length: 34
Content-Type: text/plain; charset=utf-8

{"action":"ban","http_status":403}
```

Let's now delete our test API Key:

```bash
sudo cscli bouncers delete test_waf
```

</details>


## Remediation Component Setup

With our AppSec Component active within CrowdSec, it's time to configure the remediation component to forward requests to it.

:::info
Different Remediation Components may offer various options for this setup, so consult the documentation for your specific component.
:::

To setup forwarding of requests in the Nginx remediation component, we'll modify its configuration file (`/etc/crowdsec/bouncers/crowdsec-nginx-bouncer.conf`) by adding the following entries:

```bash title="/etc/crowdsec/bouncers/crowdsec-nginx-bouncer.conf"
APPSEC_URL=http://127.0.0.1:7422
```



This instructs our Nginx plugin (the remediation component) to communicate with the AppSec Component at `http://127.0.0.1:7422`. Once configured, all incoming HTTP requests will be sent there for analysis. The snippet above assumes that the AppSec Component is running on the same machine.

We can now restart the service:

```bash
sudo systemctl restart nginx
```

### Testing the AppSec Component + Nginx

:::note
We're assuming Nginx is installed on the same machine and is listening on port 80. Please adjust your testing accordingly if this is not the case.
:::

if now try to access `http://localhost/.env` from a browser, our If you now attempt to access `http://localhost/.env` from a browser, your request will be blocked, resulting in the display of the following HTML page: will be blocked, and we will see the following HTML page:

![appsec-denied](/img/appsec_denied.png)

We can also look at the metrics from `cscli metrics`. Amongst other things, it will show:
 - the number of requests processed by the AppSec Component
 - Individual rule matches

<details>
  <summary>cscli metrics output example</summary>

```bash
▶ sudo cscli metrics

...
Appsec Metrics:
╭─────────────────┬───────────┬─────────╮
│  Appsec Engine  │ Processed │ Blocked │
├─────────────────┼───────────┼─────────┤
│ 127.0.0.1:7422/ │ 2         │ 1       │
╰─────────────────┴───────────┴─────────╯

Appsec '127.0.0.1:7422/' Rules Metrics:
╭─────────────────────────────────┬───────────╮
│             Rule ID             │ Triggered │
├─────────────────────────────────┼───────────┤
│ crowdsecurity/vpatch-env-access │ 1         │
╰─────────────────────────────────┴───────────╯

```
</details>


### Explanation

What happened in the test that we just did is:

 1. We did a request (`localhost/.env`) to our local nginx webserver
 2. Nginx, thanks to the Remediation Component configuration, forwarded the request to `http://127.0.0.1:7422`
 3. Our AppSec Component, listening on `http://127.0.0.1:7422` analyzed the request
 4. The request matches the [AppSec rule to detect .env access](https://app.crowdsec.net/hub/author/crowdsecurity/appsec-rules/vpatch-env-access)
 5. The AppSec Component thus answered with [HTTP 403](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403) to Nginx, indicating that the request must be blocked
 6. Nginx presented us with the default "request blocked" page provided by the Remediation Component 

## Integration with the console

<!-- fix link to this guide once done -->
If you haven't yet, follow the guide about [how to enroll your Security Engine in the console](/docs/getting_started/install_crowdsec).

Once done, all your alerts, including the ones generated by the AppSec Component, are going to appear in the console:

![appsec-console](/img/appsec_console.png)


## Next steps

You are now running the AppSec Component on your Crowdsec Security Engine, congrats!

As the next steps, you can:
 - [Explore the hub](https://hub.crowdsec.net) to find more rules for your use case
 - Look at the [Rules syntax](/appsec/rules_syntax.md) and [creation process](/appsec/create_rules.md) to create your own and contribute
 - Take a look at [the benchmarks](/appsec/benchmark.md)