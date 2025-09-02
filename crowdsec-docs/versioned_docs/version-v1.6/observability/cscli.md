---
id: cscli
title: Cscli metrics
sidebar_position: 2
---

# Crowdsec Metrics

Crowdsec is instrumented using [prometheus](https://prometheus.io/) to provide detailed metrics and tracability about what is going on.
The `cscli metrics` allows you to see a subset of the metrics exposed by crowdsec. For a more industrial solution, look into the [Grafana](/docs/next/observability/prometheus) integration.

The best way to get an overview of the available metrics is to use `cscli metrics list`:
 Type          | Title                        | Description 
---------------|------------------------------|-------------
acquisition	 | Acquisition Metrics | 	Measures the lines read, parsed, and unparsed per datasource. Zero read lines indicate a misconfigured or inactive datasource. Zero parsed lines means the parser(s) failed. Non-zero parsed lines are fine as crowdsec selects relevant lines.
alerts	 | Local API Alerts	 | Tracks the total number of past and present alerts for the installed scenarios.
appsec-engine	 | Appsec Metrics	 | Measures the number of parsed and blocked requests by the AppSec Component.
appsec-rule	 | Appsec Rule Metrics	 | Provides “per AppSec Component” information about the number of matches for loaded AppSec Rules.
bouncers	 | Bouncer Metrics	 | Network traffic blocked by bouncers.
decisions	 | Local API Decisions	 | Provides information about all currently active decisions. Includes both local (crowdsec) and global decisions (CAPI), and lists subscriptions (lists).
lapi | 	Local API Metrics | 	Monitors the requests made to local API routes.
lapi-bouncer	 | Local API Bouncers Metrics	 | Tracks total hits to remediation component related API routes.
lapi-decisions | 	Local API Bouncers Decisions	 | Tracks the number of empty/non-empty answers from LAPI to bouncers that are working in "live" mode.
lapi-machine	 | Local API Machines Metrics | 	Tracks the number of calls to the local API from each registered machine.
parsers	 | Parser Metrics	 | Tracks the number of events processed by each parser and indicates success of failure. Zero parsed lines means the parser(s) failed. Non-zero unparsed lines are fine as crowdsec select relevant lines.
scenarios	 | Scenario Metrics	 | Measure events in different scenarios. Current count is the number of buckets during metrics collection. Overflows are past event-producing buckets, while Expired are the ones that didn’t receive enough events to Overflow.
stash	 | Parser Stash Metrics	 | Tracks the status of stashes that might be created by various parsers and scenarios.
whitelists	 | Whitelist Metrics	 | Tracks the number of events processed and possibly whitelisted by each parser whitelist.

# Metrics sections

You can use aliases to view metrics related to specific areas (`cscli metrics show $alias`):

 - `engine` : Security Engine dedicated metrics (acquisition, parsers, scenarios, whitelists)
 - `lapi` : local api dedicated metrics (bouncer api calls, local api decisions, machines decisions etc.)
 - `appsec` : application Security Engine - WAF specifics (requests processed, rules evaluated and triggered)

You can as well combine various metrics sections (listed in `cscli metrics list`).


## Example : Security Engine Metrics

Using `cscli metrics show engine` will display the metrics sections relative to the Security Engine itself : acquisition, parsers, scenarios, whitelists and stash.

```bash title="Command Output"
Acquisition Metrics:
╭────────────────────────────────┬────────────┬──────────────┬────────────────┬────────────────────────┬───────────────────╮
│             Source             │ Lines read │ Lines parsed │ Lines unparsed │ Lines poured to bucket │ Lines whitelisted │
├────────────────────────────────┼────────────┼──────────────┼────────────────┼────────────────────────┼───────────────────┤
│ file:/var/log/auth.log         │ 636        │ -            │ 636            │ -                      │ -                 │
│ file:/var/log/nginx/access.log │ 24         │ 24           │ -              │ 1                      │ -                 │
│ file:/var/log/syslog           │ 1.55k      │ -            │ 1.55k          │ -                      │ -                 │
╰────────────────────────────────┴────────────┴──────────────┴────────────────┴────────────────────────┴───────────────────╯

Parser Metrics:
╭─────────────────────────────────┬───────┬────────┬──────────╮
│             Parsers             │ Hits  │ Parsed │ Unparsed │
├─────────────────────────────────┼───────┼────────┼──────────┤
│ child-crowdsecurity/http-logs   │ 72    │ 48     │ 24       │
│ child-crowdsecurity/nginx-logs  │ 24    │ 24     │ -        │
│ child-crowdsecurity/syslog-logs │ 2.18k │ 2.18k  │ -        │
│ crowdsecurity/dateparse-enrich  │ 24    │ 24     │ -        │
│ crowdsecurity/geoip-enrich      │ 24    │ 24     │ -        │
│ crowdsecurity/http-logs         │ 24    │ 24     │ -        │
│ crowdsecurity/nginx-logs        │ 24    │ 24     │ -        │
│ crowdsecurity/non-syslog        │ 24    │ 24     │ -        │
│ crowdsecurity/syslog-logs       │ 2.18k │ 2.18k  │ -        │
╰─────────────────────────────────┴───────┴────────┴──────────╯

Scenario Metrics:
╭──────────────────────────────────────┬───────────────┬───────────┬──────────────┬────────┬─────────╮
│               Scenario               │ Current Count │ Overflows │ Instantiated │ Poured │ Expired │
├──────────────────────────────────────┼───────────────┼───────────┼──────────────┼────────┼─────────┤
│ crowdsecurity/http-crawl-non_statics │ -             │ -         │ 1            │ 1      │ 1       │
╰──────────────────────────────────────┴───────────────┴───────────┴──────────────┴────────┴─────────╯

Parser Stash Metrics:
╭──────┬──────┬───────╮
│ Name │ Type │ Items │
╰──────┴──────┴───────╯

Whitelist Metrics:
╭──────────────────────────┬─────────────────────────────┬──────┬─────────────╮
│        Whitelist         │           Reason            │ Hits │ Whitelisted │
├──────────────────────────┼─────────────────────────────┼──────┼─────────────┤
│ crowdsecurity/whitelists │ private ipv4/ipv6 ip/ranges │ 12   │ 12          │
╰──────────────────────────┴─────────────────────────────┴──────┴─────────────╯
```

