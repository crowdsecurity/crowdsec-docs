---
id: usage_metrics
title: Usage Metrics
sidebar_position: 6
---

:::info
Usage metrics require at least CrowdSec v1.6.3

Remediation component support is a work in progress, and we are working to add usage metrics to more of them.
:::

Logs processors and remediation components can send more detailed information about their usage to LAPI in order to provide more insights about their behavior in a single place.

## Remediation Components

Remediation components can send detailed information about themselves and what they are blocking.

The exact metrics sent differs based on the type of remediation component used.

For example, the firewall remediation component will be able to report metrics about the amount of dropped bytes or packets and the openresty remediation component will be able to report metrics about the amount of dropped HTTP requests.

The same goes for interpreting the metrics: if blocking at the firewall level, most bots/attackers will stop as soon as they see they cannot establish a connection to the target server, meaning the numbers of dropped packets or bytes should be interpreted as being relative to each other (ie, this is not the number of packets that would have been transmitted if the IP was not blocked, but more of an indication of the effectiveness of various blocking sources between each other).

In contrast, HTTP-based bouncers are more likely to count each individual blocked request, as attackers might not stop when receiving a 403.

Where possible, the remediation components will break down the values of blocked traffic per origin (ie, the source of the decision).

Currently, CrowdSec supports the following origins:
 - `crowdsec`: an automated decision based on behavioral analysis of your logs
 - `CAPI`: a decision coming from the community blocklist
 - `cscli`: a manual decision added with `cscli decisions add`
 - `cscli-import`: decisions that were imported with `cscli decisions import`
 - `appsec`: the request was blocked by an appsec rule
 - `console`: a manual decision added from the [console](https://app.crowdsec.net)
 - `lists:XXX`: a decision coming from a blocklist subscribed in the [console](https://app.crowdsec.net). `XXX` is the name of the blocklist.


You can view those metrics using `cscli metrics show bouncers`:

![usage metrics csli](/img/usage_metrics_cscli_example.png)


Remediation components will also send the version of the OS they are running on. You can see this information with `cscli bouncers inspect XXX`:

![usage metrics bouncer OS](/img/usage_metrics_bouncer_os.png)

## Log processors

Logs processors can also send more information about themselves to LAPI:
 - Their OS
 - Number of datasources configured per type
 - Enabled features flags
 - Hub state (list of collections, scenarios, parsers, ... that are installed) 


You can show this data by using `cscli machines inspect XXX`:

![usage metrics LP](/img/usage_metrics_lp_cscli.png)

By default, only the collections are shown in order to keep the output readable.

If you want to see the entire hub state of a given Log Processor, you can use `cscli machines inspect --hub XXX`. 