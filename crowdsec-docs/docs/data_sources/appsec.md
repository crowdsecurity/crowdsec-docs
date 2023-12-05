---
id: appsec
title: Application Security Component
---


This module allows you to enable the `Application Security Component` as a data source.

A more detailed documentation is available [here](/docs/appsec/intro.md).

An introduction tutorial is available [here](/docs/user_guides/waap.md).

## Configuration example

To start an Application Security Component on port 7422, listening on 127.0.0.1, using the `crowdsecurity/vpatch` config:

```yaml
source: waap
listen_addr: 127.0.0.1
listen_port: 7422
path: /
waap_config: crowdsecurity/vpatch
labels:
 type: waap
```

## Parameters

### `listen_addr`

The address to listen on.
Mandatory.

### `listen_port`

The port to listen on.
Mandatory.

### `path`

The path the Application Security Component will respond to.

### `waap_config`

The WAAP config to use.

### `routines`

Number of routines to use to process the requests. Defaults to 1.

### `auth_cache_duration`

How long to cache the auth token for. Accepts value supported by [time.ParseDuration](https://golang.org/pkg/time/#ParseDuration). 
Defaults to 1m.


## DSN and command-line

This module does not support acquisition from the command line.