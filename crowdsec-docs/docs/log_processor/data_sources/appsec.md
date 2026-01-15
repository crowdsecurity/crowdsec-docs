---
id: appsec
title: Application Security Component
---


This module allows you to enable the `Application Security Component` as a data source.

A more detailed documentation is available [here](/appsec/intro.md).

A quickstart tutorial is available for [Nginx/OpenResty](/appsec/quickstart/nginxopenresty.mdx) and [Traefik](/appsec/quickstart/traefik.mdx).

## Configuration example

To start an Application Security Component on port 7422, listening on 127.0.0.1, using the `crowdsecurity/appsec-default` configuration:

```yaml
source: appsec
listen_addr: 127.0.0.1:7422
path: /
appsec_configs:
  - crowdsecurity/appsec-default
labels:
  type: appsec
```

## Parameters

### `listen_addr`

The address and port to listen on.
Defaults to `127.0.0.1:7422`.

### `path`

The path the Application Security Component will respond to.
Defaults to `/`.

### `appsec_configs`

The list of appsec-configs to use (as seen in `cscli appsec-configs list`).

### `appsec_config`

**Deprecated**, use [`appsec_configs`](#appsec_configs)

### `appsec_config_path`

**Deprecated**, use [`appsec_configs`](#appsec_configs)

### `routines`

Number of routines to use to process the requests. Defaults to 1.

### `auth_cache_duration`

How long to cache the auth token for. Accepts value supported by [time.ParseDuration](https://golang.org/pkg/time/#ParseDuration).
Defaults to 1m.

### `cert_file`

Path to the cert file to allow HTTPS communication between the remediation component and the appsec component.

### `key_file`

Path to the key file to allow HTTPS communication between the remediation component and the appsec component.

## DSN and command-line

This module does not support acquisition from the command line.
