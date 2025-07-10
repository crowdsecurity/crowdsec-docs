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

Look at the `Parameters` section to view all supported options.

## Body format

The datasource expects to receive one or multiple JSON objects.

The datasource will also automatically decompress any request body in `gzip` format, as long as the `Content-Encoding` header is set to `gzip`.

The JSON object can be any format, crowdsec will pass it as-is to the parsers.

If you are sending multiple JSON object in the same request, they must be separated by a newline (NDJSON format):
```json
{"log": "log line 1", "timestamp": "2021-01-01T00:00:00Z"}
{"log": "log line 2", "timestamp": "2021-01-01T00:00:01Z"}
```

The objects will be processed by the parsers one-by-one.

If you send multiple log lines in a single JSON object, you can use a [transform](/docs/log_processor/data_sources/introduction.md#transform) expression to generate multiple events:

```json
{
  "Records": [
    {
      "message": "test",
      "timestamp": "2021-01-01T00:00:00Z"
    },
    {
      "message": "test2",
      "timestamp": "2021-01-01T00:00:01Z"
    }
  ]
}
```

Using the following `transform` expression will make the datasource generate one event per entry in the array:
```yaml
transform: |
  map(JsonExtractSlice(evt.Line.Raw, "Records"), ToJsonString(#))
```


## Status code and supported methods

The HTTP datasource expects to receive logs in a `POST` request, and will return a `200 OK`.

If an invalid body is received (invalid JSON), a `400 Bad Request` code will be returned.

The datasource will return a `200 OK` to `GET` and `HEAD` requests if the credentials provided in the request are valid.

A `405 Method Not Allowed` code will be returned for any other methods.

If the credentials provided are invalid, a `401 Unauthorized` code will be returned.

If the body size is bigger than the configured limit, a `413 Request Entity Too Large` code will be returned.

## Parameters


### `listen_addr`

The address to listen on (e.g., `127.0.0.1:8088`).

At least one of `listen_addr` or `listen_socket` is required.

### `listen_socket`

Unix socket to listen on (e.g., `/var/run/crowdsec_http.sock`).

At least one of `listen_addr` or `listen_socket` is required.

### `path`

The endpoint path to listen on.

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

