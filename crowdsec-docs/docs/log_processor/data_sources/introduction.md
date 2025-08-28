---
id: intro
title: Acquisition Datasources
sidebar_position: 1
---

To monitor applications, the Security Engine needs to read logs.
DataSources define where to access them (either as files, or over the network from a centralized logging service).

They can be defined:

- in [Acquisition files](/configuration/crowdsec_configuration.md#acquisition_path). Each file can contain multiple DataSource definitions.
- for cold log analysis, you can also specify acquisitions via the command line.


### Service detection (automated setup)

When CrowdSec is installed via a package manager on a fresh system, the package may run [`cscli setup`](/cscli/cscli_setup) in **unattended** mode.

The `cscli setup` command will:

- detect installed services and common log file locations
- install the related Hub collections
- generate acquisition files under `acquis.d/` as `setup.<service>.yaml` (e.g., `setup.linux.yaml`)

Generated files are meant to be managed by CrowdSec; don’t edit them in place. If you need changes, delete the generated file and create your own.

When upgrading or reinstalling CrowdSec, it detects non-generated or modified files and won’t overwrite your custom acquisitions.

:::caution

Make sure the same data sources are not ingested more than once: duplicating inputs can artificially increase scenario sensitivity.

Examples:

- If an application logs to both `journald` and `/var/log/*`, you usually only need one of them.
- If an application writes to `/var/log/syslog` or `/var/log/messages`, it’s already acquired by `setup.linux.yaml` (since 1.7) or `acquis.yam`. You don’t need to add a separate acquisition for the same logs.

:::

For config-managed deployments (e.g., Ansible), set the environment variable `CROWDSEC_SETUP_UNATTENDED_DISABLE` to any non-empty value to skip the automated setup.
In that case, ensure you configure at least one data source and install the OS collection (e.g., crowdsecurity/linux).

### Assisted service detection (semi-automated setup)

If you installed new applications and want to detect the service detection again, running [`cscli setup`](/cscli/cscli_setup) yourself will guide you through the
automated setup, with confirmation prompts. You will receive a warning if you already configured some acquisition yourself but they won't be
modified by `cscli`.

Note that `cscli setup` will not remove any collection or acquisition file in `acquis.d/setup.<service>.yaml`, even if the service has been uninstalled since the file creation.


## Datasources modules

Name | Type | Stream | One-shot
-----|------|--------|----------
[Appsec](/log_processor/data_sources/appsec) | expose HTTP service for the Appsec component | yes | no
[AWS cloudwatch](/log_processor/data_sources/cloudwatch) | single stream or log group | yes | yes
[AWS kinesis](/log_processor/data_sources/kinesis)| read logs from a kinesis strean | yes | no
[AWS S3](/log_processor/data_sources/s3)| read logs from a S3 bucket | yes | yes
[docker](/log_processor/data_sources/docker) | read logs from docker containers | yes | yes
[file](/log_processor/data_sources/file) | single files, glob expressions and .gz files | yes | yes
[HTTP](/log_processor/data_sources/http) | read logs from an HTTP endpoint | yes | no
[journald](/log_processor/data_sources/journald) | journald via filter | yes | yes
[Kafka](/log_processor/data_sources/kafka)| read logs from kafka topic | yes | no
[Kubernetes Audit](/log_processor/data_sources/kubernetes_audit) | expose a webhook to receive audit logs from a Kubernetes cluster  | yes | no
[Loki](/log_processor/data_sources/loki) | read logs from loki | yes | yes
[VictoriaLogs](/log_processor/data_sources/victorialogs) | read logs from VictoriaLogs | yes | yes
[syslog service](/log_processor/data_sources/syslog_service) | read logs received via syslog protocol | yes | no
[Windows Event](/log_processor/data_sources/windows_event_log)| read logs from windows event log | yes | yes

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

## Acquisition configuration examples

```yaml title="/etc/crowdsec/acquis.d/nginx.yaml"
filenames:
  - /var/log/nginx/*.log
labels:
  type: nginx
```

```yaml title="/etc/crowdsec/acquis.d/linux.yaml"
filenames:
 - /var/log/auth.log
 - /var/log/syslog
labels:
  type: syslog
```

```yaml title="/etc/crowdsec/acquis.d/docker.yaml"
source: docker
container_name_regexp:
 - .*caddy*
labels:
  type: caddy
---
source: docker
container_name_regexp:
 - .*nginx*
labels:
  type: nginx
```

:::warning
The `labels` and `type` fields are necessary to dispatch the log lines to the right parser.

In the last example we defined multiple datasources separated by the line `---`, which is the standard YAML marker.
:::
