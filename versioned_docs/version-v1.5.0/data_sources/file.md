---
id: file
title: File(s)
---


This module allows the `Security Engine` to acquire logs from text files (in one-shot and streaming mode), and GZ files in one-shot mode.

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

### `exclude_regexps`

A list of regular expressions to exclude from the acquisition. Can be used to exclude files from a glob pattern (ie, `*` but not `*.log.gz`).

### `poll_without_inotify`

:::info
This was not the default for version 1.4.6 and below. So users upgrading to 1.5 may encounter some issues with certain file systems. See [this issue](https://github.com/crowdsecurity/crowdsec/issues/2223)
:::

> default: `false`

If set to `true`, will poll the files using `os.Stat` instead of using inotify. This is useful if you want to watch files on a network share, for example. However, this will increase CPU usage significantly per file that is open.


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