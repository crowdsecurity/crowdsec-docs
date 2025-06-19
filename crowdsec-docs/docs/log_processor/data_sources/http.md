---
id: http
title: HTTP
---

This module allows the `Security Engine` to acquire logs from an HTTP endpoint.

## Configuration examples

To receive logs from an HTTP endpoint with basic auth:
```yaml
source: http
listen_addr: 127.0.0.1:8081
path: /test
auth_type: basic_auth
basic_auth:
  username: test
  password: test
labels:
  type: mytype
```

To receive logs from an HTTP endpoint with headers:
```yaml
source: http
listen_addr: 127.0.0.1:8081
path: /test
auth_type: headers
headers:
    MyHeader: MyValue
labels:
  type: mytype
```

To receive logs from an HTTP endpoint with TLS and headers:

```yaml
source: http
listen_addr: 127.0.0.1:8081
path: /test
auth_type: headers
headers:
  MyHeader: MyValue
tls:
  server_cert: server.crt
  server_key: server.key
labels:
  type: mytype
```

To receive logs from an HTTP endpoint with mTLS:

```yaml
source: http
listen_addr: 127.0.0.1:8081
path: /test
auth_type: mtls
tls:
  server_cert: server.crt
  server_key: server.key
  ca_cert: ca.crt
labels:
  type: mytype
```

:::info
If most of cases when the logs are sent in JSON format, you can use the [`transform`](https://docs.crowdsec.net/docs/next/data_sources/intro/#transform) expression to parse the logs.
:::

For example, if the logs are sent in the following format:
```json
{
  "Records": [
    {
      "message": "test",
      "timestamp": "2021-01-01T00:00:00Z"
    }
  ]
}
```

the `transform` expression can be:
```yaml
transform: map(JsonExtractSlice(evt.Line.Raw, "Records"), ToJsonString(#))
```


Look at the `configuration parameters` to view all supported options.

## Parameters


### `listen_addr`

The address to listen on (e.g., `127.0.0.1:8088`).

At least one of `listen_addr` or `listen_socket` is required.

### `listen_socket`

Unix socket to listen on (e.g., `/var/run/crowdsec_http.sock`).

At least one of `listen_addr` or `listen_socket` is required.

### `path`

The endpoint path to listen on.

:::info
The request method is always `POST`.
:::

Optional, default is `/`.

### `auth_type`

The authentication type to use.

Can be `basic_auth`, `headers`, or `mtls`.

Required.

### `basic_auth`

The basic auth credentials.

### `basic_auth.username`

The basic auth username.

Optional, to use when `auth_type` is `basic_auth`.

### `basic_auth.password`

The basic auth password.

Optional, to use when `auth_type` is `basic_auth`.

### `headers`

The headers to send.

Optional, to use when `auth_type` is `headers`.

### `tls`

TLS configuration.

### `tls.server_cert`

The server certificate path.

Optional, to use when `auth_type` is `mtls`.

### `tls.server_key`

The server key path.

Optional, to use when `auth_type` is `mtls`.

### `tls.ca_cert`

The CA certificate path.

Optional, to use when `auth_type` is `mtls`.

### `custom_status_code`

The custom status code to return.

Optional.

### `custom_headers`

The custom headers to return.

Optional.

### `max_body_size`

The maximum body size to accept.

Optional.

### `timeout`

The timeout to read the body.

:::info
The timeout is in duration format, e.g., `5s`.
:::

Optional.

## DSN and command-line

This datasource does not support acquisition from the command line.

