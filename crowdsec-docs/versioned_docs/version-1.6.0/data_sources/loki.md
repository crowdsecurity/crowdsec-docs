---
id: loki
title: Loki
---

This module allows the `Security Engine` to acquire logs from loki query.

## Configuration example

This will allow to read logs from loki, using the query `{job="varlogs"}`.
```yaml
source: loki
log_level: info
url: http://localhost:3100/
limit: 1000
query: |
  {job="varlogs"}
auth:
  username: something
  password: secret
labels:
 type: apache2
```

:::info
The reader will always start at "now".
:::

Look at the `configuration parameters` to view all supported options.

## Parameters


### `url`

The loki URL to connect to.

Required.

### `prefix`

The loki prefix (present in http path, useful if loki is behind a reverse-proxy).

Defaults to `/`.

### `query`

The [loki query](https://grafana.com/docs/loki/latest/query/log_queries/).

Required.

### `limit`

The maximum number of messages to be retried from loki at once.

Defaults to `100` in stream mode and `5000` in one-shot mode.

### `headers`

Allows you to specify headers to be sent to loki, in the format:

```yaml
headers:
  foo: bar
```

### `wait_for_ready`

The retry interval at startup before giving on loki.

Defaults to `10 seconds`.

### `auth`

Login/password authentication for loki, in the format:

```yaml
auth:
  username: someone
  password: something
```

### `max_failure_duration`

The maximum duration loki is allowed to be unavailable (once startup is successful) before giving up on the data source.

Default to `30 seconds`.


## DSN and command-line

All the parameters above are available via DNS (one-shot mode), plus the following ones:

### `ssl`

if present, scheme will be set to `https`

### `since`

Allows to set the "since" duration for loki query.

### `log_level`

Set the `log_level` for loki datasource.

```bash
crowdsec -type foobar -dsn 'loki://login:password@localhost:3102/?query={server="demo"}'
```

