---
id: journald
title: Journald
---


This module allows the `Security Engine` to acquire logs from journalctl files in one-shot and streaming mode.

## Configuration example

To monitor SSH logs from journald:

```yaml
source: journalctl
journalctl_filter:
 - "_SYSTEMD_UNIT=ssh.service"
labels:
  type: syslog
```

Rather than specifying each systemd service, you can also acquire more information from journald by referencing a `_TRANSPORT` filter:

```yaml
---
source: journalctl
journalctl_filter:
  - "_TRANSPORT=journal"
labels:
  type: syslog
---
source: journalctl
journalctl_filter:
  - "_TRANSPORT=syslog"
labels:
  type: syslog
---
source: journalctl
journalctl_filter:
  - "_TRANSPORT=stdout"
labels:
  type: syslog
---
source: journalctl
journalctl_filter:
  - "_TRANSPORT=kernel"
labels:
  type: syslog
---
```
## Parameters

### `journalctl_filter`

A list of journalctl filters. This is mandatory.

:::info
this list is transformed into arguments passed to the journalctl binary, so any [arguments supported by journalctl](https://www.man7.org/linux/man-pages/man1/journalctl.1.html) can be defined here
:::

### `source`

Must be `journalctl`


## DSN and command-line

This module supports acquisition directly from the command line, to read journalctl logs in one shot.

A 'pseudo DSN' must be provided:

```bash
crowdsec -type syslog -dsn journalctl://filters=_SYSTEMD_UNIT=ssh.service&filters=_UID=42
```

You can specify the `log_level` parameter to change the log level for the acquisition :

```bash
crowdsec -type syslog -dsn journalctl://filters=MY_FILTER&filters=MY_OTHER_FILTER&log_level=debug
```
