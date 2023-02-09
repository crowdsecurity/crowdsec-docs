---
id: intro
title: Introduction
sidebar_position: 1
---

## Datasources

To be able to monitor applications, crowdsec needs to access logs.
DataSources are configured via the [acquisition](/configuration/crowdsec_configuration.md#acquisition_path) configuration, or specified via the command-line when performing cold logs analysis.


Name | Type | Stream | One-shot
-----|------|--------|----------
[file](./file) | single files, glob expressions and .gz files | yes | yes
[journald](./journald) | journald via filter | yes | yes
[AWS cloudwatch](./cloudwatch) | single stream or log group | yes | yes
[syslog service](./syslog) | read logs received via syslog protocol | yes | no
[docker](./docker) | read logs from docker containers | yes | yes
[AWS kinesis](./kinesis)| read logs from a kinesis strean | yes | no
[Kafka](./kafka)| read logs from kafka topic | yes | no
[Windows Event](./windows_evt_log)| read logs from windows event log | yes | no


## Acquisition configuration example

```yaml title="/etc/crowdsec/acquis.yaml"
filenames:
  - /var/log/nginx/*.log
labels:
  type: nginx
---
filenames:
 - /var/log/auth.log
 - /var/log/syslog
labels:
  type: syslog
---
source: docker
container_name_regexp:
 - .*caddy*
labels:
  type: caddy
---
...
```

:::warning
The `labels` and `type` section is crucial as this informs crowdsec which parsers to use for this datasource.

Also note between each datasource is `---` this is needed to inform yaml there is separation between entities
:::