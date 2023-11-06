---
id: prometheus
title: Prometheus
sidebar_position: 4
---

import AcademyPromo from '@site/src/components/AcademyPromo';

CrowdSec can expose a [prometheus](https://github.com/prometheus/client_golang) endpoint for collection (on `http://127.0.0.1:6060/metrics` by default). You can edit the listen_addr in [config.yaml](/configuration/crowdsec_configuration.md#prometheus) to allow an external Prometheus to scrape the metrics.

The goal of this endpoint, besides the usual resources consumption monitoring, aims at offering a view of CrowdSec "applicative" behavior :

 - is it processing a lot of logs ? is it parsing them successfully ?
 - are a lot of scenarios being triggered ?
 - are a lot of IPs banned ?
 - etc.

All the counters are "since CrowdSec start".

### Metrics details

#### Scenarios

 - `cs_buckets` : number of scenario that currently exist
 - `cs_bucket_created_total` : total number of instantiation of each scenario 
 - `cs_bucket_overflowed_total` : total number of overflow of each scenario
 - `cs_bucket_underflowed_total` : total number of underflow of each scenario (bucket was created but expired because of lack of events)
 - `cs_bucket_poured_total` : total number of event poured to each scenario with source as complementary key 

<details>
  <summary>example</summary>


```
#2030 lines from `/var/log/nginx/access.log` were poured to `crowdsecurity/http-scan-uniques_404` scenario
cs_bucket_poured_total{name="crowdsecurity/http-scan-uniques_404",source="/var/log/nginx/access.log"} 2030
```

</details>


#### Parsers
 - `cs_node_hits_total` : how many times an event from a specific source was processed by a parser node :


<details>
  <summary>example</summary>


```
# 235 lines from `auth.log` were processed by the `crowdsecurity/dateparse-enrich` parser
cs_node_hits_total{name="crowdsecurity/dateparse-enrich",source="/var/log/auth.log"} 235
```

</details>

 - `cs_node_hits_ko_total` : how many times an event from a specific was unsuccessfully parsed by a specific parser

<details>
  <summary>example</summary>


```
# 2112 lines from `error.log` failed to be parsed by `crowdsecurity/http-logs`
cs_node_hits_ko_total{name="crowdsecurity/http-logs",source="/var/log/nginx/error.log"} 2112
```

</details>

 - `cs_node_hits_ok_total` : how many times an event from a specific source was successfully parsed by a specific parser

 - `cs_parser_hits_total` : how many times an event from a source has hit the parser
 - `cs_parser_hits_ok_total` : how many times an event from a source was successfully parsed
 - `cs_parser_hits_ko_total` : how many times an event from a source was unsuccessfully parsed


#### Acquisition

Acquisition metrics are split by datasource. The following metrics are available :

##### Cloudwatch

 - `cs_cloudwatch_openstreams_total` : number of opened stream within group (by group)
 - `cs_cloudwatch_stream_hits_total` : number of event read from stream (by group and by stream)

##### Files

 - `cs_filesource_hits_total` : Total lines that were read (by source file)
  
##### Journald

 - `cs_journalctlsource_hits_total` : Total lines that were read (by source filter)

##### Syslog

 - `cs_syslogsource_hits_total` : Total lines that were received (by the syslog server)
 - `cs_syslogsource_parsed_total` : Total lines that were successfully parsed by the syslog server

#### Local API

 - `cs_lapi_route_requests_total` : number of calls to each route per method
 - `cs_lapi_machine_requests_total` : number of calls to each route per method grouped by machines
 - `cs_lapi_bouncer_requests_total` : number of calls to each route per method grouped by bouncers
 - `cs_lapi_decisions_ko_total` : number of unsuccessfully responses when bouncers ask for an IP.
 - `cs_lapi_decisions_ok_total` : number of successfully responses when bouncers ask for an IP.

#### Info

 - `cs_info` : Information about CrowdSec (software version)

<AcademyPromo
  image="monitoring_crowdsec.svg"
  description="Watch a short series of videos on how to observe and monitor CrowdSec."
  title="More ways to learn"
  course="monitoring-crowdsec"
  utm="?utm_source=docs&utm_medium=banner&utm_campaign=prometheus-page&utm_id=academydocs"
/>

### Exploitation with prometheus server & grafana

Those metrics can be scraped by [prometheus server](https://prometheus.io/docs/introduction/overview/#architecture) and visualized with [grafana](https://grafana.com/). They [can be downloaded here](https://github.com/crowdsecurity/grafana-dashboards) :

![Overview](/img/grafana_overview.png)

![Insight](/img/grafana_insight.png)

![Details](/img/grafana_details.png)
