---
id: appsec
title: Application Security Component
---


This module allows you to enable the `Application Security Component` as a data source.

A more detailed documentation is available [here](/docs/appsec/intro.md).

An introduction tutorial is available [here](/docs/user_guides/appsec.md).

## Configuration example

To start an Application Security Component on port 7422, listening on 127.0.0.1, using the `crowdsecurity/vpatch` config:

```yaml
source: appsec
listen_addr: 127.0.0.1:7422
path: /
appsec_config: crowdsecurity/virtual-patching
labels:
 type: appsec
```

## Parameters

### `listen_addr`

The address and port to listen on.
Defaults to `127.0.0.1:7442`.

### `path`

The path the Application Security Component will respond to.
Defaults to `/`.

### `appsec_config`

The name of the appsec-config to use (as seen in `cscli appsec-configs list`).

### `routines`

Number of routines to use to process the requests. Defaults to 1.

### `auth_cache_duration`

How long to cache the auth token for. Accepts value supported by [time.ParseDuration](https://golang.org/pkg/time/#ParseDuration).
Defaults to 1m.


## DSN and command-line

This module does not support acquisition from the command line.