---
id: benchmark
title: Log Processor Benchmark
sidebar_label: "Benchmark"
toc_max_heading_level: 4
description: "How many log lines per second one CrowdSec Log Processor handles, and what CPU and memory that takes: measured for a fully parsed source (nginx) and a mostly unparsed one (kernel and auditd over syslog)."
sidebar_position: 90
---

How fast a Log Processor handles different kinds of log, and what CPU and memory that
takes.

Figures cover the whole pipeline up to alerts reaching the Local API, net of the fixed
~2.7 s startup cost. To measure your own:

```bash
crowdsec -c config.yaml -no-api -dsn file:///path/to/corpus.log -type nginx
```

| Test bed | |
| --- | --- |
| Instance | AWS `c6i.4xlarge` — 16 vCPU (8 physical cores + SMT), 30.8 GiB |
| CPU | Xeon Platinum 8375C @ 2.90 GHz |
| Version | `v1.8.2`, official release binary |
| Hub | `linux`, `nginx`, `sshd`, `base-http-scenarios`, `http-cve`, both appsec collections — 56 scenarios |

| Corpus | Type | Content | Parsed |
| --- | --- | --- | --- |
| `nginx.log` | `nginx` | 200 000 lines combined format, 50 000 source IPs, 45% static, 45% dynamic, 7% errors, 3% scanner paths | 100% |
| `syslog-noise.log` | `syslog` | 1 000 000 lines of kernel, auditd, systemd, cron and snapd, with 3% sshd auth failures | 3% |

## A fully parsed source: nginx

| Routines | Lines/s | vs 1 routine | CPU per line | Peak RSS |
| --- | --- | --- | --- | --- |
| 1 | 3 612 | 1.00x | 732 µs | 1.4 GB |
| 2 | 5 671 | 1.57x | 792 µs | 1.9 GB |
| **4** | **8 480** | **2.35x** | 965 µs | 2.5 GB |
| 8 | 9 130 | 2.53x | 1 086 µs | 2.8 GB |
| 16 | 10 669 | 2.95x | 1 133 µs | 3.2 GB |

Four routines is the knee. Past it the process never uses much more than **two thirds
of the machine** — 10.6 of 16 hardware threads at 16 routines.

## A mostly unparsed source: kernel and auditd over syslog

An edge case: it applies to a catch-all syslog socket or a kernel/auditd stream, not
to a host whose logs you have parsers for. Skip this section if that is not you.

| Routines | Lines/s | vs 1 routine | CPU per line | System CPU |
| --- | --- | --- | --- | --- |
| **1** | **16 650** | **1.00x** | 117 µs | 22 s |
| 2 | 16 049 | 0.96x | 169 µs | 54 s |
| 4 | 15 465 | 0.93x | 240 µs | 108 s |
| 8 | 13 992 | 0.84x | 287 µs | 147 s |
| 16 | 12 724 | 0.76x | 364 µs | 207 s |

**Adding routines makes it slower here.** Unparsed lines are six times cheaper than
parsed ones (117 µs against 732 µs), but that does not improve with concurrency. Cause
and fix: [the grok backend](#the-grok-backend-on-mostly-unparsed-sources).

## Startup cost

Paid once per process. Significant only if you run many short-lived ones.

| Log type | Startup wall | Startup CPU |
| --- | --- | --- |
| `nginx` | 2.70 s | 1.98 s |
| `syslog` | 2.66 s | 1.88 s |

## Trading memory for throughput

At the knee the limit is allocation: **45% of CPU goes to allocation, GC and
scheduling**, against 27% in re2 matching and 11% in scenario filters. Pacing the
collector more loosely is a bigger lever than adding routines:

| GOGC at 8 routines | Lines/s | vs default | User CPU | Peak RSS |
| --- | --- | --- | --- | --- |
| 100 (default) | 9 133 | - | 179 s | 2.9 GB |
| 200 | 9 764 | +7% | 150 s | 4.0 GB |
| **400** | **10 974** | **+20%** | 136 s | 5.9 GB |
| 800 | 10 609 | +16% | 126 s | 7.6 GB |


:::tip
`GOGC` is a Go runtime environment variable, not a CrowdSec setting. Set it in the
unit file (`Environment=GOGC=400`) or the container environment, and watch memory.
:::

It does not fix the knee. The gain is close to flat at every routine count:

| Routines | GOGC=100 | GOGC=400 | Gain | Peak RSS |
| --- | --- | --- | --- | --- |
| 4 | 8 533 | 10 109 | +18% | 2.5 -> 4.9 GB |
| 8 | 9 133 | 10 974 | +20% | 2.8 -> 5.8 GB |
| 16 | 10 127 | 12 744 | +26% | 3.3 -> 5.9 GB |

**`GOGC=400` at 4 routines (10 109) matches the default at 16 routines (10 127)**: the
same throughput for twice the memory instead of four times the goroutines.

## The grok backend on mostly-unparsed sources

Since 1.8, grok patterns are matched with the C++ `re2` library by default on Linux.
That suits logs that parse and hurts logs that do not. On the syslog corpus the
`re2_disable_grok_support` feature flag **restores scaling**:

| Routines | Default (`re2`) | `re2` disabled | Change | System CPU, default |
| --- | --- | --- | --- | --- |
| 1 | 16 697 | 21 359 | +28% | 22 s |
| 2 | 16 619 | 30 362 | +83% | 51 s |
| 4 | 16 719 | 47 215 | +182% | 99 s |
| 8 | 15 018 | 72 360 | +382% | 137 s |
| **16** | **13 048** | **98 138** | **+652%** | 199 s |

### Should you set it?

Compare `cs_parser_hits_ok_total` against `cs_parser_hits_ko_total` in
[the metrics](../observability/prometheus.md).

- **Mostly lines that parse** (a web server log): leave the default. Turning it off
  costs 12-30% on the nginx corpus.
- **Mostly lines that nothing parses** (kernel, auditd, a catch-all syslog socket):
  set it, and expect the gain to grow with your routine count.

Add to `feature.yaml` next to `config.yaml`:

```yaml
- re2_disable_grok_support
```

Or set `CROWDSEC_FEATURE_RE2_DISABLE_GROK_SUPPORT=true` in the environment.

## Sizing guidance

1. Count the lines per second you need to parse, per source.
2. Multiply by `CPU per line` for the closest corpus and round up. At 732 µs/line,
   1 000 nginx lines/s needs three quarters of a core; unparsed syslog, a tenth.
3. Add memory for buckets, roughly proportional to **distinct active source IPs** over
   a bucket window, not to the log rate: 2 000 IPs instead of 50 000 cut peak memory
   39% at the same throughput.
4. Set the three routine counts to **4** and stop. Never more than your core count.

   ```yaml
   crowdsec_service:
     pipeline:
       parser: { routines: 4 }
       bucket: { routines: 4 }
       output: { routines: 4 }
   ```

   The flat `parser_routines`, `buckets_routines` and `output_routines` keys still
   work, but `pipeline` wins wherever both are set.
5. If 4 is not enough, raise `GOGC` before the routine counts: ~20% for double the
   memory, at any routine count.
6. Budget the Local API separately. Under heavy alert volume (8 700 alerts per
   200 000 lines) it costs about two thirds of a core; the database behind it does not
   change parsing throughput.

If a Log Processor cannot keep up, compare `cs_parser_hits_total` against the lines
your acquisition read, and watch `cs_bucket_pour_seconds` and
`cs_postoverflow_queue_depth`. See [prometheus](../observability/prometheus.md) and
[pprof](../observability/pprof.md).

## Reproducing

Harness, seeded corpus generator and raw per-run CSVs:
[crowdsec-benchmark](https://github.com/crowdsecurity/crowdsec-benchmark).
