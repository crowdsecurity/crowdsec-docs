---
id: intro
title: Introduction
sidebar_position: 1
---

Scenarios are YAML files that allow to detect and qualify a specific behavior, usually an attack.

Scenarios receive {{v1X.event.htmlname}}(s) and can produce {{v1X.alert.htmlname}}(s) using the [leaky bucket](https://en.wikipedia.org/wiki/Leaky_bucket) algorithm.

As an {{v1X.event.htmlname}} can be the representation of a log line, or an overflow, it  allows scenarios to process both logs or overflows to allow inference.

Scenarios can be of different types (leaky, trigger, counter), and are based on various factors, such as :

  - the speed/frequency of the [leaky bucket](https://en.wikipedia.org/wiki/Leaky_bucket)
  - the capacity of the [leaky bucket](https://en.wikipedia.org/wiki/Leaky_bucket)
  - the characteristic(s) of eligible {{v1X.event.htmlname}}(s) : "log type XX with field YY set to ZZ"
  - various filters/directives that can alter the bucket's behavior, such as [groupby](/Crowdsec/v1/references/scenarios/#groupby), [distinct](/Crowdsec/v1/references/scenarios/#distinct) or [blackhole](/Crowdsec/v1/references/scenarios/#blackhole)

Behind the scenes, CrowdSec is going to create one or more buckets when events with matching characteristics arrive to the scenario. When any of these buckets overflows, the scenario has been triggered.

_Bucket partitioning_ : One scenario usually leads to many buckets creation, as each bucket is only tracking a specific subset of events. For example, if we are tracking brute-force, each "offending peer" get its own bucket.


