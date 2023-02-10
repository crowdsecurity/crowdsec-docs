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
[file](/data_sources/file.md) | single files, glob expressions and .gz files | yes | yes
[journald](/data_sources/journald.md) | journald via filter | yes | yes
[AWS cloudwatch](/data_sources/cloudwatch.md) | single stream or log group | yes | yes
[syslog service](/data_sources/syslog.md) | read logs received via syslog protocol | yes | no
[docker](/data_sources/docker.md) | read logs from docker containers | yes | yes
[AWS kinesis](/data_sources/kinesis.md)| read logs from a kinesis strean | yes | no
[Kafka](/data_sources/kafka.md)| read logs from kafka topic | yes | no
[Windows Event](/data_sources/windows_event_log.md)| read logs from windows event log | yes | no


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
