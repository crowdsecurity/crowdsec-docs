---
id: file
title: File(s)
---


This module allows `CrowdSec` to acquire logs from text files (in one-shot and streaming mode), and GZ files in one-shot mode.

## Configuration example

A basic configuration is as follows:

```yaml
source: file
filenames:
 - /tmp/foo/*.log
 - /var/log/syslog
labels:
 type: syslog

```

## Parameters

### `filename`

A single path to a file to tail. Globbing is supported. Required if `filenames` is not provided.

### `filenames`

A list of path to files to tail. Globbing is supported. Required if `filename` is not provided.

### `force_inotify`
> default: `false`

If set to `true`, force an inotify watch on the log files folder, even if there is no log in it.

### `source`

Must be `file`.

## DSN and command-line

This module supports acquisition directly from the command line, to read files in one shot.

A single file URI is accepted with the `-dsn` parameter, but globbing is supported for multiple files:

```bash
crowdsec -type syslog -dsn file:///var/log/*.log
```

### Supported parameters

#### `log_level`

Change the log level for the acquisition:

```bash
crowdsec -type syslog -dsn file:///var/log/*.log?log_level=info
```

#### `max_buffer_size`

Maximum length of a single line.

Defaults to 65536.

```bash
crowdsec -type syslog -dsn file:///var/log/*.log?max_buffer_size=42000
```

## Notes

By default, if a glob pattern does not match any files in an existing directory, this directory will not be watched for new files (ie, `/var/log/nginx/*.log` does not match, but `/var/log/nginx/` exists).
You can override this behaviour with the `force_inotify` parameter, which will put a watch on the directory.