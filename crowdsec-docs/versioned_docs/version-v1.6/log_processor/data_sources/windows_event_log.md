---
id: windows_evt_log
title: Windows Event Log
---

This module allows the `Security Engine` to acquire logs from the Windows Event Log.


## Configuration example

To monitor all events with the ID 4625, from the `Security` channel (ie, authentication failed):

```yaml
source: wineventlog
log_level: info
event_channel: Security
event_ids:
 - 4625
event_level: information
labels:
 type: eventlog
```

You can also write a custom XPath query:

```yaml
source: wineventlog
xpath_query: |
    <QueryList><Query><Select Path=\"Security\">*[System[(EventID=42) and (Level=2)]]</Select></Query></QueryList>
labels:
 type: eventlog
```

## Parameters

### `event_channel`

The name of the channel to read events from.

Must be set if `xpath_query` is not set.

### `event_level`

The log level of the events to read.

Must be one of `VERBOSE`, `INFORMATION`, `WARNING`, `ERROR` or `CRITICAL`.

Only used if `event_channel` is specified.

### `event_ids`

List of event IDs you want to match.

Only used if `event_channel` is specified.

### `xpath_query`

A custom XPath query to read events.

Must be set if `event_channel` is not set.

You can refer to the Windows documentation for more informations: https://docs.microsoft.com/en-us/windows/win32/wes/consuming-events

### `pretty_name`

Pretty name to use for the datasource in the metrics (`cscli metrics`).

This parameter is optional, but strongly recommanded, as by default the full xpath query will be displayed in the metrics, which can be hard to read.

## DSN and command-line

This module supports acquisition directly from the command line, to replay content from event files.

A single wineventlog URI is accepted with the `-dsn` parameter:

```bash
crowdsec -type sysmon -dsn wineventlog://C:\\path\\to\\file.evtx
```

### Supported parameters

#### `log_level`

Change the log level for the acquisition:

```bash
crowdsec -type sysmon -dsn wineventlog://C:\\path\\to\\file.evtx?log_level=debug
```

#### `event_id`

Only process events with this ID.

This parameter can be specified multiple times to filter on multiple IDs.

```bash
crowdsec -type sysmon -dsn wineventlog://C:\\path\\to\\file.evtx?event_id=1&event_id=2
```

#### `event_level`

Only process events with this level.

Must be a number between 0 and 5.

The mapping between the number and the textual representation of the level is:

 Text | Number 
------|-----------
 INFORMATION | 0 
 CRITICAL | 1 
 ERROR | 2 
 WARNING | 3 
 INFORMATION | 4 
 VERBOSE | 5 