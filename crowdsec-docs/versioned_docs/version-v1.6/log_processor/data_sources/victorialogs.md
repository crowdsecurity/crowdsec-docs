---
id: victorialogs
title: VictoriaLogs
---

This module allows the `Security Engine` to acquire logs from VictoriaLogs query.

## Configuration example

This will allow to read logs from VictoriaLogs, using the query `app:nginx`.
```yaml
source: victorialogs
mode: tail
log_level: info
url: http://localhost:9428/
limit: 1000
query: |
  app:nginx
auth:
  username: something
  password: secret
labels:
 type: nginx
```

:::info
The reader will always start at "now" for `tail` mode.
:::

Look at the `configuration parameters` to view all supported options.

## Parameters

### `mode`

Mode to fetch the logs, supported values: `tail` and `cat`.

Defaults to `tail`.

### `url`

The VictoriaLogs URL to connect to.

Required.

### `prefix`

The VictoriaLogs prefix (present in http path, useful if VictoriaLogs is behind a reverse-proxy).

Defaults to `/`.

### `query`

The [VictoriaLogs query](https://docs.victoriametrics.com/victorialogs/logsql/).

Required.

Note that `tail` requests have limitations for operators used query. See [this doc](https://docs.victoriametrics.com/victorialogs/querying/#live-tailing) for the details.

### `limit`

The maximum number of messages to be retried from VictoriaLogs at once.

### `headers`

Allows you to specify headers to be sent to VictoriaLogs, in the format:

```yaml
headers:
  foo: bar
  AccountID: 0
  ProjectID: 0
```

See this doc for more information: [VictoriaLogs headers](https://docs.victoriametrics.com/victorialogs/querying/#http-api)

### `wait_for_ready`

The retry interval at startup before giving on VictoriaLogs.

Defaults to `10 seconds`.

### `auth`

Login/password authentication for VictoriaLogs, in the format:

```yaml
auth:
  username: someone
  password: something
```

### `max_failure_duration`

The maximum duration VictoriaLogs is allowed to be unavailable (once startup is successful) before giving up on the data source.

Default to `30 seconds`.


## DSN and command-line

All the parameters above are available via DNS (one-shot mode), plus the following ones:

### `ssl`

if present, scheme will be set to `https`

### `since`

Allows to set the "start" duration for VictoriaLogs query.

### `log_level`

Set the `log_level` for VictoriaLogs datasource.

```bash
crowdsec -type foobar -dsn 'victorialogs://login:password@localhost:9428/?query=server:"demoVictoriaLogsVictoriaLogs"'
```
