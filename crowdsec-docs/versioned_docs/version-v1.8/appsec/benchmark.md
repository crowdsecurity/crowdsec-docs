---
id: benchmark
title: WAF Component Benchmark
toc_max_heading_level: 4
description: "What the CrowdSec WAF costs per request: in-band latency and throughput measured against the Application Security Component itself, with virtual patching rules and with the full OWASP CRS."
sidebar_position: 80
---

What the Application Security Component costs per request, and how many requests a
core will carry. Add these figures to what your stack already does.

| Test bed | |
| --- | --- |
| Instance | AWS `c6i.4xlarge`, `v1.8.2` — engine on 4 physical cores |
| CPU | Xeon Platinum 8375C @ 2.90 GHz |
| Hub | 206 vpatch rules, the full CRS |

In-band time is the engine's own `cs_appsec_inband_parsing_time_seconds`. Percentiles
are taken at half of saturation.

## Rule sets

| Name | In-band | Out-of-band |
| --- | --- | --- |
| none | `crowdsecurity/base-config` — no detection rules | - |
| vpatch | `base-config` + `crowdsecurity/vpatch-*` — 206 rules | - |
| CRS | `crowdsecurity/crs` — the full OWASP Core Rule Set | - |
| vpatch + CRS out-of-band | `base-config` + `vpatch-*` | `crowdsecurity/crs` |

## What a request costs

At a sustainable rate, 4 routines:

| Rule set | In-band mean | p50 | p95 | p99 |
| --- | --- | --- | --- | --- |
| none | 0.030 ms | 0.15 ms | 0.53 ms | 0.96 ms |
| vpatch | 0.233 ms | 0.33 ms | 1.39 ms | 2.15 ms |
| **CRS** | **1.058 ms** | 1.15 ms | 3.44 ms | 5.57 ms |

Virtual patching is effectively free; the full CRS costs about **1 ms** in-band, p95
3.4 ms.

## Throughput ceiling

| Rule set | 4 routines | 8 routines | Engine busy at 8 | CPU per request |
| --- | --- | --- | --- | --- |
| none | 53 112 req/s | 61 834 req/s | 90% | 0.116 ms |
| vpatch | 13 317 req/s | 16 030 req/s | 98% | 0.491 ms |
| CRS | 3 377 req/s | 4 287 req/s | 99% | 1.855 ms |

With rules loaded the engine is CPU-bound at 8 routines. Budget per physical core:
**1 000 CRS req/s**, **4 000** vpatch, **15 000** no rules.

## Scaling with routines

One coraza engine per routine, so rule evaluation parallelises well:

| Routines | none | vpatch | CRS |
| --- | --- | --- | --- |
| 1 | 20 369 | 5 892 | 1 199 |
| 2 | 34 530 (1.70x) | 8 577 (1.46x) | 2 114 (1.76x) |
| 4 | 53 112 (2.61x) | 13 317 (2.26x) | 3 377 (2.82x) |
| **8** | 61 834 (3.04x) | **16 030 (2.72x)** | **4 287 (3.58x)** |
| 16 | 63 772 (3.13x) | 15 679 (2.66x) | 4 059 (3.38x) |

Set `routines` to the hardware threads you give the engine: 8 here, where CRS peaks at
3.58x. Past that the engines oversubscribe the cores, in-band time rises from 1.70 ms
to 2.67 ms and throughput falls.

## Request bodies

In-band mean, 4 routines, urlencoded form bodies:

| Rule set | clean GET | POST 1 KB | POST 4 KB | POST 16 KB |
| --- | --- | --- | --- | --- |
| none | 0.034 ms | 0.075 ms | 0.103 ms | 0.195 ms |
| vpatch | 0.287 ms | 0.384 ms | 0.416 ms | 0.500 ms |
| **CRS** | **1.167 ms** | **7.27 ms** | **21.8 ms** | **79.5 ms** |

CRS cost is dominated by body size; virtual patching is flat. **Run CRS out-of-band if
you accept request bodies.**

Only `routines` requests are ever in rule evaluation at once, so your ceiling is:

```
max req/s  =  routines / in-band time
```

At 21.8 ms that is 183 req/s on 4 routines, with engine CPU at barely half. Here the
engine count binds before CPU does, so raising `routines` past your core count helps.

## Does malicious traffic cost more?

Same GET stream with 10% attack payloads, 4 routines:

| Rule set | Clean | 10% malicious | In-band mean | Blocked |
| --- | --- | --- | --- | --- |
| none | 53 112 | 53 106 req/s | 0.034 → 0.035 ms | 0.0% |
| vpatch | 13 317 | 12 856 req/s (-3%) | 0.287 → 0.285 ms | 2.1% |
| CRS | 3 377 | 2 816 req/s (-16%) | 1.167 → 1.235 ms | 9.4% |

Rule evaluation barely moves, since a request that trips a rule stops early. Most of
the 16% is the cost of building an alert and delivering it to the Local API, so budget
for the remediation path. Virtual patching catches 2.1% of the malicious 10%: it is a
targeted rule set.

## In-band or out-of-band

Out-of-band rules run after the verdict is returned, so the client never waits. All
three at a fixed 2 000 req/s, 4 routines:

| Config | In-band | Out-of-band | p95 | p99 | Engine busy |
| --- | --- | --- | --- | --- | --- |
| vpatch in-band | 0.229 ms | - | 0.56 ms | 1.11 ms | 11% |
| CRS in-band | 1.087 ms | - | 4.13 ms | 6.22 ms | 36% |
| **vpatch + CRS out-of-band** | **0.291 ms** | 1.201 ms | **1.69 ms** | 4.04 ms | 48% |

The tiered setup cuts in-band time **73%** and p95 **59%** while still evaluating every
CRS rule, for **33% more** engine CPU since both rule sets now run. It trades CPU for
latency.

:::warning
Out-of-band evaluation is bounded by a queue. If it fills, requests are skipped
silently and your out-of-band rules stop seeing traffic. Watch
`cs_appsec_outofband_dropped_total`.
:::

## Sizing guidance

1. Run virtual patching in-band unconditionally (0.23 ms). CRS in-band suits GET-heavy
   traffic only.
2. Divide `routines` by your own in-band time for your ceiling.
3. Set `routines` to the hardware threads you give the engine. More only helps when
   per-request cost is high enough for the engine count to bind first.
4. Per physical core: **1 000 CRS req/s**, **4 000** vpatch, **15 000** no rules.
5. Add headroom for remediation: blocked requests cost more than finding them.

## Reproducing

Harness, seeded request-stream generator and raw per-run CSVs:
[crowdsec-benchmark](https://github.com/crowdsecurity/crowdsec-benchmark).
