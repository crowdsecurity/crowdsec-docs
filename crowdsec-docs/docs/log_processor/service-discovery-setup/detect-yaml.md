---
id: detect-yaml
title: detect.yaml file format
sidebar_position: 1
---

# File layout: `detect.yaml`
A minimal detection file is a YAML map with a top‐level `detect:` key. Under it, each entry describes one service plan:

```yaml
# detect.yaml
---
detect:
  apache2-file-apache2:
    when:
      - Systemd.UnitInstalled("apache2.service") or len(Path.Glob("/var/log/apache2/*.log")) > 0
    hub_spec:
      collections:
        - crowdsecurity/apache2
    acquisition_spec:
      filename: apache2.yaml
      datasource:
        source: file
        filenames:
          - /var/log/apache2/*.log
        labels:
          type: apache2
```

Fields

- `when`: a list of boolean expressions evaluated on the host. Examples include:
  - `Systemd.UnitInstalled("<unit>")`, `Windows.ServiceEnabled("<name>")`
  - `Host.OS == "linux"`, `Host.OS == "windows"`
  - `Path.Exists("/path/file")`, `len(Path.Glob("/path/*.log")) > 0`
  - `System.ProcessRunning("<binary>")`
- `hub_spec`: which Hub items to install (collections/parsers/scenarios, etc.). Unknown item types are preserved and passed through.
- `acquisition_spec`: how to generate a per‐service acquisition file:
  - `filename`: base name (no slashes). The actual path will be `acquis.d/setup.<filename>.yaml`.
  - `datasource`: a map validated against the selected `source` (e.g., `file`, `journalctl`, `docker`, `wineventlog`, `cloudwatch`, `kinesis`, …). Required fields vary per source; the CLI validates them for you.

Examples

Basic OS / Hub only:

```yaml
detect:
  linux:
    when:
      - Host.OS == "linux"
    hub_spec:
      collections: [crowdsecurity/linux]
```

`journalctl` source with a filter:

```yaml
detect:
  caddy-journal:
    when:
      - Systemd.UnitInstalled("caddy.service")
      - len(Path.Glob("/var/log/caddy/*.log")) == 0
    hub_spec:
      collections: [crowdsecurity/caddy]
    acquisition_spec:
      filename: caddy.yaml
      datasource:
        source: journalctl
        labels: {type: caddy}
        journalctl_filter:
          - "_SYSTEMD_UNIT=caddy.service"
```

Windows event log:

```yaml
detect:
  windows_auth:
    when: [ Host.OS == "windows" ]
    hub_spec:
      collections: [crowdsecurity/windows]
    acquisition_spec:
      filename: windows_auth.yaml
      datasource:
        source: wineventlog
        event_channel: Security
        event_ids: [4625, 4623]
        event_level: information
        labels: {type: eventlog}
```


## Expression Helpers Reference

Expressions run against an environment that exposes helpers and facts via these names:

- Host — host facts from gopsutil/host.InfoStat. See https://pkg.go.dev/github.com/shirou/gopsutil/host#InfoStat
    Example: Host.OS == "linux".

- Path — filesystem helpers:
  - Path.Exists(path) -> bool
  - Path.Glob(pattern) -> []string
    Example: len(Path.Glob("/var/log/nginx/*.log")) > 0.

- System — process helpers:
  - System.ProcessRunning(name) -> bool (by process name)

- Systemd (Linux) — systemd unit helpers:
  - Systemd.UnitInstalled(unit) -> bool
  - Systemd.UnitConfig(unit, key) -> string (empty string if unit missing; error if key missing)
  - Systemd.UnitLogsToJournal(unit) -> bool (true if stdout/stderr go to journal or journal+console)

- Windows (Windows builds only):
  - Windows.ServiceEnabled(service) -> bool (true if the service exists and is Automatic start; returns false on non-Windows builds)

- Version — semantic version checks (can be used with Host.PlatformVersion):
  - Version.Check(version, constraint) -> bool
  - Supports operators like =, !=, <, <=, >, >=, ranges (1.1.1 - 1.3.4), AND with commas (>1, <3), and ~ compatible ranges.


