---
id: intro
title: Introduction
sidebar_position: 1
---

To be able to detect things, crowdsec needs to access logs.
DataSources are configured via the [acquisition](/configuration/crowdsec_configuration.md#acquisition_path) configuration, or specified via the command-line when performing cold logs analysis.


Name | Type | Stream | One-shot
-----|------|--------|----------
file | single files, glob expressions and .gz files | yes | yes
journald | journald via filter | yes | yes
aws cloudwatch | single stream or log group | yes | yes
syslog service | read logs received via syslog protocol | yes | no


While various data sources are supported, they all share the same common configuration structure :

```yaml
source: <source>
labels:
 type: syslog
#log_level: <log_level>
<specific>:
  ...
```

All the data sources supports :
 - a `log_level` to configure verbosity of given source (trace, debug, info, warning, error)
 - a `labels` map with a mandatory `type` field
 - a `source` indicating which implementation the configuration referes to (file, journald, syslog, cloudwatch ...)
 - and a section that is specific to the data source implemention, see dedicated sections bellow

:::warning
 The `labels` and `type` subsection are crucial as this is what is going to indicate which parsers pickup the log line.
:::