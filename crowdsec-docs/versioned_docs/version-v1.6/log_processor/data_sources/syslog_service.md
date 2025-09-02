---
id: syslog
title: Syslog Server
---


This module allows the `Security Engine` to expose a syslog server, and ingest logs directly from another syslog server (or any software that knows how to forward logs with syslog).

Only UDP is supported.

Syslog messages must conform either to [RFC3164](https://datatracker.ietf.org/doc/html/rfc3164) or [RFC5424](https://datatracker.ietf.org/doc/html/rfc5424), and can be up to 2048 bytes long by default (this value is configurable).


## Configuration example

A basic configuration is as follows:

```yaml
source: syslog
listen_addr: 127.0.0.1
listen_port: 4242
labels:
 type: syslog
```

## Parameters

### `listen_addr`

Address on which the syslog will listen. Defaults to 127.0.0.1.

### `listen_port`

UDP port used by the syslog server. Defaults to 514.

### `max_message_len`

Maximum length of a syslog message (including priority and facility). Defaults to 2048.

### `source`

Must be `syslog`.




## DSN and command-line

This module does not support command-line acquisition.


:::warning
This syslog datasource is currently intended for small setups, and is at risk of losing messages over a few hundreds events/second.
To process significant amounts of logs, rely on dedicated syslog server such as [rsyslog](https://www.rsyslog.com/), with this server writting logs to files that Security Engine will read from.
This page will be updated with further improvements of this data source.
:::