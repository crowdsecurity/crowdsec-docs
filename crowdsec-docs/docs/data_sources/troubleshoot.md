---
id: troubleshoot
title: Monitoring
sidebar_position: 10
---

The [prometheus](/observability/prometheus.md) instrumentation exposes metrics about acquisition and data sources.
Those can as well be view via `cscli metrics` :

```bash
INFO[19-08-2021 06:33:31 PM] Acquisition Metrics:                         
+-----------------------------------------------+------------+--------------+----------------+------------------------+
|                    SOURCE                     | LINES READ | LINES PARSED | LINES UNPARSED | LINES POURED TO BUCKET |
+-----------------------------------------------+------------+--------------+----------------+------------------------+
| file:/var/log/auth.log                        |       1231 |          580 |            651 |                    896 |
| file:/var/log/kern.log                        |       6035 | -            |           6035 | -                      |
| file:/var/log/messages                        |       6035 | -            |           6035 | -                      |
| file:/var/log/nginx/error.log                 |          5 | -            |              5 | -                      |
| file:/var/log/nginx/xxxxx.ro-http.access.log  |         10 |            5 |              5 |                     11 |
| file:/var/log/nginx/xxxxx.ro-https.access.log |         29 |           29 | -              |                     30 |
| file:/var/log/syslog                          |       6062 | -            |           6062 | -                      |
+-----------------------------------------------+------------+--------------+----------------+------------------------+

```

The columns are :


| Name | Explanation |
|------|-------------|
| SOURCE | Datasource in the format medium://details. (ie. `file:///path/to/log`) |
| LINES READ | Number of lines read from the given source since agent startup |
| LINES PARSED |  Number of lines *successfully* parsed by every parser the line was submitted to |
| LINES UNPARSED | Number of lines *unsuccessfully* parsed by at least one parser the line was submitted to |
| LINES POURED TO BUCKET | How many individual events were poured to bucket from this source. One line can be submitted to more than one scenario, and thus can be higher than `LINES READ` or `LINES PARSED` |

