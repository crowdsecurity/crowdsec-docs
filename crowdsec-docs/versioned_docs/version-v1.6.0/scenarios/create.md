---
id: create
title: Creating scenarios
sidebar_position: 4
---

import AcademyPromo from '@site/src/components/AcademyPromo';

:::caution

All the examples assume that you have read the [Creating parsers](/docs/next/parsers/create) documentation.

:::

## Foreword

This documentation assumes you're trying to create a scenario for crowdsec with the intent of submitting to the hub, and thus create the associated functional testing.
The creation of said functional testing will guide our process and will make it easier.

We're going to create a scenario for an imaginary service "myservice" from the following logs of failed authentication :

```
Dec  8 06:28:43 mymachine myservice[2806]: unknown user 'toto' from '1.2.3.4'
Dec  8 06:28:43 mymachine myservice[2806]: bad password for user 'admin' from '1.2.3.4'
Dec  8 06:28:43 mymachine myservice[2806]: bad password for user 'admin' from '1.2.3.4'
Dec  8 06:28:43 mymachine myservice[2806]: bad password for user 'admin' from '1.2.3.4'
Dec  8 06:28:43 mymachine myservice[2806]: bad password for user 'admin' from '1.2.3.4'
Dec  8 06:28:43 mymachine myservice[2806]: bad password for user 'admin' from '1.2.3.4'
```

There's a [yaml schema
available](https://github.com/crowdsecurity/crowdsec-yaml-schemas/blob/main/scenario_schema.yaml)
for the scenario and linked at
[SchemaStore](https://github.com/SchemaStore/schemastore/blob/master/src/api/json/catalog.json)
for general public availability inside most common editors. You will
be able see if the scenario comply to the schema directly in your
editor, and you will have some kind of syntax highlighting and
suggestions. The only requirement for this is to write your scenario
using the directory structure of the hub to make the editor detects
that the file has to comply to the yaml schema. This means that you
will have to write the scenario in one subdirectory of the `scenarios`
directory. This subdirectory is named after your name, or your
organization name. As an example `scenarios/crowdsecurity/ssh-bf.yaml`
matches this directory structure. Note that extension of the scenario
has to be `.yaml`.

## Pre-requisites

1. [Create a local test environment](https://doc.crowdsec.net/docs/contributing/contributing_test_env)

2. Clone the hub

```bash
git clone https://github.com/crowdsecurity/hub.git
```

## Create our test

From the root of the hub repository :

```bash
▶ cscli hubtest create myservice-bf --type syslog --ignore-parsers

  Test name                   :  myservice-bf
  Test path                   :  /home/dev/github/hub/.tests/myservice-bf
  Log file                    :  /home/dev/github/hub/.tests/myservice-bf/myservice-bf.log (please fill it with logs)
  Parser assertion file       :  /home/dev/github/hub/.tests/myservice-bf/parser.assert (please fill it with assertion)
  Scenario assertion file     :  /home/dev/github/hub/.tests/myservice-bf/scenario.assert (please fill it with assertion)
  Configuration File          :  /home/dev/github/hub/.tests/myservice-bf/config.yaml (please fill it with parsers, scenarios...)
```

**note: we specify the `--ignore-parsers` flag because we don't want to test the parsers, only the scenarios.**

## Configure our test

Let's add our parser and scenario to the test configuration (`.tests/myservice-bf/config.yaml`) file.

```yaml
parsers:
  - crowdsecurity/syslog-logs
  - crowdsecurity/dateparse-enrich
  - ./parsers/s01-parse/crowdsecurity/myservice-logs.yaml
scenarios:
  - ./scenarios/crowdsecurity/myservice-bf.yaml
postoverflows:
  - ""
log_file: myservice-bf.log
log_type: syslog
ignore_parsers: true
```

**note: as our custom parser and scenario are not yet part of the hub, we specify their path relative to the root of the hub directory.**

## Scenario creation

Let's create a simple scenario to detect bruteforce attemp on `myservice`:

```yaml
# myservice bruteforce
type: leaky
name: crowdsecurity/myservice-bf
description: "Detect myservice bruteforce"
filter: "evt.Meta.log_type == 'myservice_failed_auth'"
leakspeed: "10s"
capacity: 5
groupby: evt.Meta.source_ip
blackhole: 1m
reprocess: true
labels:
  service: myservice
  confidence: 3
  spoofable: 0
  classification:
    - attack.T1110
  behavior: "myservice:bruteforce"
  label: "myservice bruteforce"
  service: myservice
  remediation: true
```

:::note

We filter on `evt.Meta.log_type == 'myservice_failed_auth'` because in the parser `myservice-logs` (created in the [Creating parsers](/docs/next/parsers/create) part) we set the `log_type` to `myservice_failed_auth` for bad password or bad user attempt.

:::

We have the following fields:

- a [type](/scenarios/format.md#type): the type of bucket to use (trigger or leaky).
- a [name](/scenarios/format.md#name)
- a [description](/scenarios/format.md#description)
- a [filter](/scenarios/format.md#type): the filter to apply on events to be filled in this bucket.
- a [leakspeed](/scenarios/format.md#leakspeed)
- a [capacity](/scenarios/format.md#capacity): the number of events in the bucket before it overflows.
- a [groupby](/scenarios/format.md#groupby): a field from the event to partition the bucket. It is often the `source_ip` of the event.
- a [blackhole](/scenarios/format.md#blackhole): the number of minute to not retrigger this scenario for the same `groupby` field.
- a [reprocess](/scenarios/format.md#reprocess): ingest the alert in crowdsec for further processing.
- some [labels](/scenarios/format.md#labels): Some labels are mandatory and the scenario will not be validated by the Hub if they are missing. Don't forget to set `remediation: true` if you want the IP to be blocked by bouncers.

We can then "test" our scenario like this :

```bash
▶ cscli hubtest run myservice-bf
INFO[01-10-2021 12:41:21 PM] Running test 'myservice-bf'
WARN[01-10-2021 12:41:24 PM] Assert file '/home/dev/github/hub/.tests/myservice-bf/scenario.assert' is empty, generating assertion:

len(results) == 1
"1.2.3.4" in results[0].Overflow.GetSources()
results[0].Overflow.Sources["1.2.3.4"].IP == "1.2.3.4"
results[0].Overflow.Sources["1.2.3.4"].Range == ""
results[0].Overflow.Sources["1.2.3.4"].GetScope() == "Ip"
results[0].Overflow.Sources["1.2.3.4"].GetValue() == "1.2.3.4"
results[0].Overflow.Alert.Events[0].GetMeta("datasource_path") == "myservice-bf.log"
results[0].Overflow.Alert.Events[0].GetMeta("datasource_type") == "file"
results[0].Overflow.Alert.Events[0].GetMeta("log_subtype") == "myservice_bad_user"
results[0].Overflow.Alert.Events[0].GetMeta("log_type") == "myservice_failed_auth"
results[0].Overflow.Alert.Events[0].GetMeta("service") == "myservice"
results[0].Overflow.Alert.Events[0].GetMeta("source_ip") == "1.2.3.4"
results[0].Overflow.Alert.Events[0].GetMeta("username") == "toto"
....
results[0].Overflow.Alert.GetScenario() == "crowdsecurity/myservice-bf"
results[0].Overflow.Alert.Remediation == true
results[0].Overflow.Alert.GetEventsCount() == 6

...


Please fill your assert file(s) for test 'myservice-bf', exiting

```

What happened here ?

- The scenario has been triggered and is generating some assertion (for functional test)
- In production environment, an alert would have been send to the CrowdSec Local API.

We can again understand more of what is going on thanks to `cscli hubtest explain` :

```bash
▶ cscli hubtest explain myservice-bf
line: Dec  8 06:28:43 mymachine myservice[2806]: unknown user 'toto' from '1.2.3.4'
	├ s00-raw
	|	└ 🟢 crowdsecurity/syslog-logs
	├ s01-parse
	|	└ 🟢 crowdsecurity/myservice-logs
	├ s02-enrich
	|	└ 🟢 crowdsecurity/dateparse-enrich
	├-------- parser success 🟢
	├ Scenarios
		└ 🟢 crowdsecurity/myservice-bf

line: Dec  8 06:28:43 mymachine myservice[2806]: bad password for user 'admin' from '1.2.3.4'
	├ s00-raw
	|	└ 🟢 crowdsecurity/syslog-logs
	├ s01-parse
	|	└ 🟢 crowdsecurity/myservice-logs
	├ s02-enrich
	|	└ 🟢 crowdsecurity/dateparse-enrich
	├-------- parser success 🟢
	├ Scenarios
		└ 🟢 crowdsecurity/myservice-bf

line: Dec  8 06:28:43 mymachine myservice[2806]: bad password for user 'admin' from '1.2.3.4'
	├ s00-raw
	|	└ 🟢 crowdsecurity/syslog-logs
	├ s01-parse
	|	└ 🟢 crowdsecurity/myservice-logs
	├ s02-enrich
	|	└ 🟢 crowdsecurity/dateparse-enrich
	├-------- parser success 🟢
	├ Scenarios
		└ 🟢 crowdsecurity/myservice-bf

line: Dec  8 06:28:43 mymachine myservice[2806]: bad password for user 'admin' from '1.2.3.4'
	├ s00-raw
	|	└ 🟢 crowdsecurity/syslog-logs
	├ s01-parse
	|	└ 🟢 crowdsecurity/myservice-logs
	├ s02-enrich
	|	└ 🟢 crowdsecurity/dateparse-enrich
	├-------- parser success 🟢
	├ Scenarios
		└ 🟢 crowdsecurity/myservice-bf

line: Dec  8 06:28:43 mymachine myservice[2806]: bad password for user 'admin' from '1.2.3.4'
	├ s00-raw
	|	└ 🟢 crowdsecurity/syslog-logs
	├ s01-parse
	|	└ 🟢 crowdsecurity/myservice-logs
	├ s02-enrich
	|	└ 🟢 crowdsecurity/dateparse-enrich
	├-------- parser success 🟢
	├ Scenarios
		└ 🟢 crowdsecurity/myservice-bf

line: Dec  8 06:28:43 mymachine myservice[2806]: bad password for user 'admin' from '1.2.3.4'
	├ s00-raw
	|	└ 🟢 crowdsecurity/syslog-logs
	├ s01-parse
	|	└ 🟢 crowdsecurity/myservice-logs
	├ s02-enrich
	|	└ 🟢 crowdsecurity/dateparse-enrich
	├-------- parser success 🟢
	├ Scenarios
		└ 🟢 crowdsecurity/myservice-bf


```

## Closing word

We have now a fully functional scenario for myservice to detect brute forces!
We can either deploy it to our production systems to do stuff, or even better, contribute to the hub !

If you want to know more about directives and possibilities, take a look at [the scenario reference documentation](/scenarios/format.md) !

See as well [this blog article](https://crowdsec.net/blog/how-to-write-crowdsec-parsers-and-scenarios) on the topic.

<AcademyPromo
  image="parsers_and_scenarios.svg"
  description="Watch a short series of videos on how to create Scenarios, as well as Parsers"
  title="More ways to learn"
  course="writing-parsers-and-scenarios"
  utm="?utm_source=docs&utm_medium=banner&utm_campaign=scenario-page&utm_id=academydocs"
/>
