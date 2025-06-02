---
id: intro
title: Acquisition Datasources Introduction
sidebar_position: 1
---

## Datasources

To be able to monitor applications, the Security Engine needs to access logs.
DataSources are configured via the [acquisition](/configuration/crowdsec_configuration.md#acquisition_path) configuration, or specified via the command-line when performing cold logs analysis.


Name | Type | Stream | One-shot
-----|------|--------|----------
[Appsec](/log_processor/data_sources/appsec.md) | expose HTTP service for the Appsec component | yes | no
[AWS cloudwatch](/log_processor/data_sources/cloudwatch.md) | single stream or log group | yes | yes
[AWS kinesis](/log_processor/data_sources/kinesis.md)| read logs from a kinesis strean | yes | no
[AWS S3](/log_processor/data_sources/s3.md)| read logs from a S3 bucket | yes | yes
[docker](/log_processor/data_sources/docker.md) | read logs from docker containers | yes | yes
[file](/log_processor/data_sources/file.md) | single files, glob expressions and .gz files | yes | yes
[HTTP](/log_processor/data_sources/http.md) | read logs from an HTTP endpoint | yes | no
[journald](/log_processor/data_sources/journald.md) | journald via filter | yes | yes
[Kafka](/log_processor/data_sources/kafka.md)| read logs from kafka topic | yes | no
[Kubernetes Audit](/log_processor/data_sources/kubernetes_audit.md) | expose a webhook to receive audit logs from a Kubernetes cluster  | yes | no
[Loki](/log_processor/data_sources/loki.md) | read logs from loki | yes | yes
[VictoriaLogs](/log_processor/data_sources/victorialogs.md) | read logs from VictoriaLogs | yes | yes
[syslog service](/log_processor/data_sources/syslog_service.md) | read logs received via syslog protocol | yes | no
[Windows Event](/log_processor/data_sources/windows_event_log.md)| read logs from windows event log | yes | yes

## Common configuration parameters

Those parameters are available in all datasources.

### `log_level`

Log level to use in the datasource. Defaults to `info`.

### `source`

Which type of datasource to use. It is mandatory except for file acquisition.

### `transform`

An expression that will run after the acquisition has read one line, and before the line is sent to the parsers.

It allows to modify an event (or generate multiple events from one line) before parsing.

For example, if you acquire logs from a file containing a JSON object on each line, and each object has a `Records` array with multiple events, you can use the following to generate one event per entry in the array:
```
map(JsonExtractSlice(evt.Line.Raw, "Records"), ToJsonString(#))
```

The expression must return:
 - A string: it will replace `evt.Line.Raw` in the event
 - A list of strings: One new event will be generated based on the source event per element in the list. Each element will replace the `evt.Line.Raw` from the source event.

If the expression returns an error or an invalid type, the event will not be modified before sending it to the parsers.

### `use_time_machine`

By default, when reading logs in real-time, crowdsec will use the time at which the log was read as the log timestamp instead of extracting it from the log itself.

Setting this option to `true` will force crowdsec to use the timestamp from the log as the time of the event.

It is mandatory to set this if your application buffers logs before writting them (for example, IIS when writing to a log file, or logs written to S3 from almost any AWS service).<br/>
If not set, then crowdsec will think all logs happened at once, which can lead to some false positive detections.

### `labels`

A map of labels to add to the event.
The `type` label is mandatory, and used by the Security Engine to choose which parser to use.

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
The `labels` and `type` fields are necessary to dispatch the log lines to the right parser.

Also note between each datasource is `---` this is needed to separate multiple YAML documents (each datasource) in a single file.
:::
