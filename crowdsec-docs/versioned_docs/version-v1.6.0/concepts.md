---
id: concepts
title: Concepts
sidebar_position: 1
---


# Global overview

The Security Engine runtime revolves around a few simple concepts:

 - It reads logs (defined via [datasources](/data_sources/introduction.md) configuration)
 - Those logs are parsed via [parsers](/parsers/introduction.mdx) and eventually [enriched](/parsers/enricher.md)
 - Those normalized logs are matched against the [scenarios](/scenarios/introduction.mdx) that the user has deployed
 - When a scenario is "triggered", CrowdSec generates an [alert](/concepts.md#alerts) and eventually one or more associated [decisions](/concepts.md#decisions):
    - The alert is here mostly for traceability and will stay even after the decision expires
    - The decision, on the other hand, is short-lived and tells *what* action should be taken against the offending IP/range/user...
 - This information (the signal, the associated decisions) is then sent to [Local API](/local_api/intro.md) and stored in the database

As you might have guessed by now, the Security Engine itself does the detection part and stores those decisions.
Then, [remediation components](/u/user_guides/bouncers_configuration) can "consume" those decisions (via the very same [Local API](/local_api/intro.md) and apply the remediation.

## Crowd sourced aspect

 [[References](https://crowdsecurity.github.io/api_doc/capi/)]

Whenever the [Local API](/local_api/intro.md) receives an alert with associated decisions, it shares the alert's meta-information with our central API:

 - The source IP address that triggered the alert
 - The scenario that was triggered
 - The timestamp of the attack

This is the only data that is sent to our API, and it is processed on our side to be able to redistribute the relevant blocklists to all the participants. You can check the [central API documentation](central_api/intro) in the references link to have a comprehensive view of what might be shared between your instance and our services.

## Remediation Components

[[References](/u/bouncers/intro)]

Remediation Components are software packages in charge of acting upon decision's provided by the Security Engine.
To do so, the component queries the Local API to know if there is an existing decision against a given IP, range, username, etc. [You can find a list of existing Remediation Components on the hub](https://hub.crowdsec.net/browse/#bouncers)


# Configuration items

## Acquisition

[[References](/data_sources/introduction.md)]

Acquisition configuration defines which streams of information CrowdSec must process.

A stream of information can be a file, a journald event log, a cloudwatch stream, and more or less any kind of stream, such as a Kafka topic.

Acquisition configuration always contains a stream (ie. a file to tail) and a [tag](/data_sources/introduction.md) (ie. "these are in syslog format" "these are non-syslog nginx logs".md).

File acquisition configuration is defined as:

```yaml
filenames:
  - /var/log/auth.log
labels:
  type: syslog
```

The `labels` part is here to tag the incoming logs with a type. `labels.type` are used by the parsers to know which logs to process.

## Application Security Component

[[References](/appsec/intro.md)]

The Application Security Component is a special datasource that allows the supported remediation components to forward HTTP requests to crowdsec for analysis, before they can reach the application.
Because CrowdSec can analyse the request and take a decision before it reaches the application, the combo of the Application Security Component and the remediation components acts as a Web Application Firewall (WAF).

## Stages

[[References](/parsers/introduction.mdx#stages)]

The concept of stages is central to data parsing in CrowdSec, as it allows to have various "steps" of parsing. All parsers belong to a given stage. While users can add or modify the stages order, the following stages exist:

 - `s00-raw`: low-level parser, such as syslog
 - `s01-parse`:  most of the services' parsers (ssh, nginx, etc.)
 - `s02-enrich`: enrichment that requires parsed events (ie. geoip-enrichment) or generic parsers that apply on parsed logs (ie. second stage HTTP parser)


Every event starts in the first stage, and moves to the next stage once it has been successfully processed by a parser that has the `onsuccess` directive set to `next_stage`, and so on until it reaches the last stage, when it's going to start to be matched against scenarios. Thus an sshd log might follow this pipeline:

 - `s00-raw`: parsed by `crowdsecurity/syslog-logs` (will move the event to the next stage)
 - `s01-raw`: parsed by `crowdsecurity/sshd-logs` (will move the event to the next stage)
 - `s02-enrich`: parsed by `crowdsecurity/geoip-enrich` and `crowdsecurity/dateparse-enrich`

## Parsers

[[References](/parsers/introduction.mdx)]

For logs to be able to be exploited and analyzed, they need to be parsed and normalized, and this is where parsers are used.

A parser is a YAML configuration file that describes how a string is being parsed. The said string can be a log line, or a field extracted from a previous parser. While a lot of parsers rely on the **GROK** approach (a.k.a regular expression named capture groups), parsers can also reference enrichment modules to allow specific data processing.

A parser usually has a specific scope. For example, if you are using [Nginx](https://nginx.org), you will probably want to use the `crowdsecurity/nginx-logs` parser which allows your CrowdSec setup to parse Nginx's access and error logs.

Parsers are organized into stages to allow pipelines and branching in parsing.

See the [Hub](https://hub.crowdsec.net/browse/#configurations) to explore parsers, or see below some examples:

 - [apache2 access/error log parser](https://github.com/crowdsecurity/hub/blob/master/parsers/s01-parse/crowdsecurity/apache2-logs.yaml)
 - [iptables logs parser](https://github.com/crowdsecurity/hub/blob/master/parsers/s01-parse/crowdsecurity/iptables-logs.yaml)
 - [http logs post-processing](https://github.com/crowdsecurity/hub/blob/master/parsers/s02-enrich/crowdsecurity/http-logs.yaml)

You can as well [write your own](/parsers/create.md)!


## Enrichers

[[References](/parsers/enricher.md)]

Enrichment is a parser that adds extra context to a log event so that CrowdSec can later take a better decision. In most cases, you should be able to find the relevant enrichers on our [Hub](https://hub.crowdsec.net/browse/#configurations).

A common/simple type of enrichment would be [geoip-enrich](https://github.com/crowdsecurity/hub/blob/master/parsers/s02-enrich/crowdsecurity/geoip-enrich.yaml) of an event (adding information such as origin country, origin Autonomous System and origin IP range to an event).

Once again, you should be able to find the ones you're looking for on the [Hub](https://hub.crowdsec.net/browse/#configurations)!

## Scenarios

[[References](/scenarios/introduction.mdx)]

A scenario is the expression of a heuristic that allows you to qualify a specific event (usually an attack). It is a YAML file that describes a set of events characterizing a scenario. Scenarios in CrowdSec gravitate around the [leaky bucket](https://en.wikipedia.org/wiki/Leaky_bucket) principle.

A scenario description includes at least:

 - Event eligibility rules. For example, if we're writing an ssh brute-force detection, we only focus on logs of type `ssh_failed_auth`
 - Bucket configuration such as the leak speed or its capacity (in our same ssh brute-force example, we might allow 1 failed auth per 10s and no more than 5 in a short amount of time: `leakspeed: 10s` `capacity: 5`)
 - Aggregation rules: per source IP or other criteria (in our ssh brute-force example, we will group per source ip)

The description allows for many other rules to be specified (blackhole, distinct filters, etc.), to allow rather complex scenarios.

See [Hub](https://hub.crowdsec.net/browse/#configurations) to explore scenarios and their capabilities, or see below some examples:

 - [ssh brute-force detection](https://github.com/crowdsecurity/hub/blob/master/scenarios/crowdsecurity/ssh-bf.yaml)
 - [distinct http-404 scan](https://github.com/crowdsecurity/hub/blob/master/scenarios/crowdsecurity/http-scan-uniques_404.yaml)
 - [iptables port scan](https://github.com/crowdsecurity/hub/blob/master/scenarios/crowdsecurity/iptables-scan-multi_ports.yaml)

You can as well [write your own](/scenarios/create.md)!

## AppSec Rules

[[References](/appsec/intro.md)]

An AppSec rule is a YAML configuration file that describe a rule for the [Application Security Component](/appsec/intro.md).

An AppSec rule can match on various aspect of an HTTP request, such as the verb, the URI, the headers, the parameters, the body, etc.
You can use them to detect and block exploitation of specific vulnerabilities (virtual patching) or to write more generic WAF rules.

Contrary to scenarios, appsec rules can block a request before it reaches the application if configured in `in-band` mode.

## AppSec Configs

An Appsec Config file is a YAML configuration file that tell the [Application Security Component](/appsec/intro.md) which rules should be loaded, and in which band (in-band or out-of-band).

The config also expose hooks allowing you to customize at runtime the behavior of the AppSec component (disable a rule on a specific URL, apply a captcha if a specific rule is triggered, etc.)

  
[[References](/appsec/intro.md)]

## Collections

[[References](/collections/introduction.md)]

To make users' lives easier, "collections" are available, which are just a bundle of parsers and scenarios.
In this way, if you want to cover basic use-cases of let's say "Nginx", you can just install the `crowdsecurity/nginx` collection that is composed of `crowdsecurity/nginx-logs` parser, as well as generic HTTP scenarios such as `crowdsecurity/base-http-scenarios`.

As usual, these can be found on the [Hub](https://hub.crowdsec.net)!

## PostOverflows

[[References](/parsers/introduction.mdx)]

A postoverflow is a parser that is applied on overflows (scenario results) before the decision is written to the local DB or pushed to the API. Parsers in postoverflows are meant to be used for "expensive" enrichment/parsing processes that you do not want to perform on all incoming events, but rather on a decision that is about to be taken.

An example could be the slack/mattermost enrichment plugin that requires human confirmation before applying the decision or reverse-dns lookup operations.


# Runtime items

## Events

[[References](/expr/event.md)]

An `Event` is the runtime representation of an item being processed by CrowdSec: it can be a log line being parsed, or an Overflow being reprocessed.

The `Event` object is modified by parsers, scenarios, and directly via user [statics expressions](/parsers/format.md#statics) (for example).


<!--TBD: check ref-->

## Alerts

[[References](/expr/alert.md)]

An `Alert` is the runtime representation of a bucket overflow being processed by CrowdSec: it is embedded in an Event.

The `Alert` object is modified by post-overflows and [profiles](/profiles/intro.md).

## Decisions

[[References](/expr/decision.md)]

A `Decision` is the representation of the consequence of a bucket overflow: a decision against an IP address, an IP range, an AS, a Country, a User, a Session etc.

`Decisions` are generated by the Local API (LAPI) when an `Alert` is received, according to the existing [profiles](/profiles/intro.md)
