---
id: quickstart
title: Quickstart
sidebar_position: 2
---

## Objectives

The objective(s) of this quickstart is to cover a functional setup of the [AppSec Component](/appsec/intro.md#introduction) to protect web applications exposed via [Nginx](https://nginx.com). We will then deploy a comprehensive [set of rules](https://app.crowdsec.net/hub/author/crowdsecurity/collections/appsec-virtual-patching) focused on preventing the exploitation of well-known and [actively exploited vulnerabilities](https://app.crowdsec.net/hub/author/crowdsecurity/collections/appsec-virtual-patching). We will also cover the visualization of those alerts in the [console](https://app.crowdsec.net/).

## Pre-requisites

1. If you're not familiar with the [AppSec Component](/appsec/intro.md#introduction) or **W**eb **A**pplication **F**irewalls, take a look at the [Introduction](/appsec/intro.md#introduction) first.

2. We assume you already installed:
   - **Crowdsec [Security Engine](/docs/next/intro)**: see [QuickStart here](/docs/getting_started/install_crowdsec). The AppSec Component is part of the security engine and will be used to analyze the HTTP requests.
   - Nginx and its **[Remediation Component](/u/bouncers/intro)**: see [QuickStart here](/u/bouncers/nginx). The Remediation Component will be used to intercept the HTTP requests at the webserver/reverse-proxy level and forward them to the AppSec Component for analysis and remediation.

## AppSec Component Setup

### Collection installation

The first thing to do to set up the AppSec Component is to install a set of relevant rules. We are going to use the [`crowdsecurity/appsec-virtual-patching`](https://app.crowdsec.net/hub/author/crowdsecurity/collections/appsec-virtual-patching) collection to get a comprehensive set of rules. This [collection](/concepts.md#collections) focuses on detecting and blocking the exploitation of well-known vulnerabilities and is updated when new vulnerabilities appear. Once installed, it is automatically updated daily for always up-to-date protection.

On the machine where you installed the Security Engine, simply run:

:::info
You can always view the content of a [collection on the hub](https://app.crowdsec.net/hub/author/crowdsecurity/collections/appsec-virtual-patching)
:::

```
sudo cscli collections install crowdsecurity/appsec-virtual-patching
```

This command is going to install the following configuration items:

- The [*AppSec Rules*](/appsec/rules_syntax.md) contain the definition of malevolent requests to be matched and stopped
- The [*AppSec configuration*](/appsec/configuration.md#appsec-configuration) links together a set of rules to provide a coherent set
- The [*CrowdSec Parser*](/concepts.md#parsers) and [*CrowdSec Scenario(s)*](/concepts.md#scenarios) bans for a longer duration repeating offenders

### Setup the acquisition

Now that we have installed the necessary items, we need to set up the CrowdSec [Acquisition](/concepts.md#acquisition) to expose the Application Security Component to our Nginx web server. This step is needed so that our Nginx server can forward requests to the AppSec Component for analysis and verdict.

 - Create the `/etc/crowdsec/acquis.d/` directory with `mkdir -p /etc/crowdsec/acquis.d/` (if it doesn't exist on your machine)
 - Put the following content in `/etc/crowdsec/acquis.d/appsec.yaml` :

```yaml title="/etc/crowdsec/acquis.d/appsec.yaml"
appsec_config: crowdsecurity/virtual-patching
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

### First test

Before moving on with the Remediation Component, let's ensure that everything we already setup works as expected.

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

## Remediation Component Setup

Now that our AppSec Component is running in CrowdSec, we need to set up the remediation component to interact with it.

:::info
Various Remediation Components might have different options for this, look at your dedicated component documentation.
:::

To set up the AppSec in the Nginx remediation component, let's edit its configuration file (`/etc/crowdsec/bouncers/crowdsec-nginx-bouncer.conf`), to add the following:

```bash title="/etc/crowdsec/bouncers/crowdsec-nginx-bouncer.conf"
APPSEC_URL=http://127.0.0.1:7422
# in case the AppSec run on the same machine, else provide the AppSec IP
```

This tells our nginx plugin (the remediation component) that we want it to interact with the AppSec Component that is located at `http://127.0.0.1:7422`. With this configuration set, every incoming HTTP request will be forwarded there for validation.

We can now restart the service:

```bash
sudo systemctl restart nginx
```

### Testing the AppSec Component + Nginx

:::note
We're assuming that nginx runs on the same machine and listens on the port 80. Adapt your test otherwise.
:::

if now try to access `http://localhost/.env` from a browser, our request will be blocked, and we will see the following HTML page:

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