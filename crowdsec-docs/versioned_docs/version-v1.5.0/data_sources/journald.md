---
id: journald
title: Journald
---


This module allows `CrowdSec` to acquire logs from journalctl files in one-shot and streaming mode.

## Configuration example

To monitor SSH logs from journald:

```yaml
source: journalctl
journalctl_filter:
 - "_SYSTEMD_UNIT=ssh.service"
labels:
  type: syslog
```

## Parameters

### `journalctl_filter`

A list of journalctl filters. This is mandatory.

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
