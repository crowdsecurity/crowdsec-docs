---
id: usage_metrics
title: Usage Metrics
sidebar_position: 6
---

:::info
Usage metrics require at least CrowdSec v1.6.3

Support on Remediation Components are rolling out progressively. Please check the relevant [documentation](/u/bouncers/intro) to see if your Remediation Component has support.
:::

Logs processors and Remediation Components can provide detailed usage data to the [Local API (LAPI)](local_api/intro.md), allowing for a unified view of their behavior and better insights.

## Remediation Components

Remediation Components can send detailed information about themselves and what decisions they are acting on.

The specific metrics sent vary depending on the type of Remediation Component used.

For example, the [firewall Remediation Component](/u/bouncers/firewall) can report metrics on dropped bytes or packets, while the [OpenResty Remediation Component](/u/bouncers/openresty) can report metrics on dropped HTTP requests.

The same applies to interpreting the metrics: when blocking at the firewall level, most bots or attackers stop once they realize they can't connect to the target server. Therefore, the dropped packets or bytes should be seen as relative indicators of effectiveness between different blocking sources, not as the exact number of packets that would have been transmitted if the IP weren't blocked.

In contrast, HTTP-based Remediation Components typically count each handled request, as attackers are less likely to stop after receiving a 403 response or a Captcha challenge.

Whenever possible, the Remediation Components will break down the remediated traffic by the source of the decision.

Currently, CrowdSec supports the following origins:
 - `crowdsec`: an automated decision based on behavioral analysis of your logs
 - `CAPI`: a decision coming from the Community Blocklist
 - `cscli`: a manual decision added with [`cscli decisions add`](cscli/cscli_decisions_add.md)
 - `cscli-import`: decisions that were imported with [`cscli decisions import`](cscli/cscli_decisions_import.md)
 - `appsec`: the request was blocked by an appsec rule
 - `console`: a manual decision added from the [console](https://app.crowdsec.net)
 - `lists:XXX`: a decision coming from a blocklist subscribed in the [console](https://app.crowdsec.net). `XXX` is the name of the blocklist.


You can view the metrics locally using [`cscli metrics show bouncers`](cscli/cscli_metrics_show.md):

![usage metrics csli](/img/usage_metrics_cscli_example.png)

The Remediation Components will send the number of decisions that are actually enforced.

These numbers may differ from what is shown by [`cscli decisions list`](cscli/cscli_decisions_list.md) for several reasons:
- Filters are applied when querying LAPI (such as scope, scenarios, etc.).
- LAPI deduplicates decisions before sending. If an IP is listed in multiple sources, only the decision with the longest remaining time is sent (useful for assessing blocklist overlap).

Remediation components will also send the version of the OS they are running on. You can see this information with [`cscli bouncers inspect XXX`](cscli/cscli_bouncers_inspect.md):

![usage metrics bouncer OS](/img/usage_metrics_bouncer_os.png)

## Log Processors

:::info
Log Processors are the underlying component within the Security Engine that processes logs and sends Alerts to the LAPI. If you are running a multi-server setup, you will have multiple Log Processors.
:::

Logs processors can also send more information about themselves to LAPI:
 - Operating system information (version, distribution/platform)
 - Number of [datasources](/log_processor/data_sources/introduction.md) configured per type
 - Enabled [features flags](configuration/feature_flags.md)
 - Installed Hub files (including [custom / tainted](/u/troubleshooting/intro#why-are-some-scenariosparsers-tainted-or-custom-) files):
    - AppSec-Config
    - AppSec-Rules
    - Collections
    - Contexts
    - Parsers
    - Scenarios


You can show this data by using [`cscli machines inspect XXX`](cscli/cscli_machines_inspect.md):

![usage metrics LP](/img/usage_metrics_lp_cscli.png)

By default, only the collections are shown in order to keep the output readable.

If you want to see the entire hub state of a given Log Processor, you can use `cscli machines inspect --hub XXX`. 