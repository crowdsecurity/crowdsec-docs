---
id: detect-yaml
title: detect.yaml syntax
sidebar_position: 1
---

# Syntax

A minimal detection file is a YAML map with a top‐level `detect:` key.

Under it, each entry describes one service plan:

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

## Fields

### `when`

A list of expression that must return a boolean.

If multiple expressions are provided, they must all return `true` for the service to be included.

```yaml
when:
 - Host.OS == "linux"
 - Systemd.UnitInstalled("<unit>")
```

You can use any of the helper referenced [here](/log_processor/service-discovery-setup/expr.md).

### `hub_spec`

A map of hub items to install.

Specifying an invalid item type or item will log an error but will not prevent the detection to continue.

```yaml
hub_spec:
 collections:
  - crowdsecurity/linux
 parsers:
  - crowdsecurity/nginx-logs
 scenarios:
  - crowdsecurity/http-bf
```

### `acquisition_spec`

This item defines the acquisition that will be written to disk

```yaml
acquisition_spec:
 filename: foobar.yaml
 datasource:
  source: docker
  container_name: foo
  labels:
   type: bar
```

The `filename` attribute will be used to generate the name of file in the form of `acquis.d/setup.<filename>.yaml`.

The content of `datasource` will be validated (syntax, required fields depending on the datasource configured) and be written as-is to the file.

## Examples

Basic OS / Hub only:

```yaml
detect:
  linux:
    when:
      - Host.OS == "linux"
    hub_spec:
      collections:
        - crowdsecurity/linux
```

`journalctl` source with a filter:

```yaml
detect:
  caddy-journal:
    when:
      - Systemd.UnitInstalled("caddy.service")
      - len(Path.Glob("/var/log/caddy/*.log")) == 0
    hub_spec:
      collections:
       - crowdsecurity/caddy
    acquisition_spec:
      filename: caddy.yaml
      datasource:
        source: journalctl
        labels:
         type: caddy
        journalctl_filter:
          - "_SYSTEMD_UNIT=caddy.service"
```

Windows event log:

```yaml
detect:
  windows_auth:
    when:
     - Host.OS == "windows"
    hub_spec:
      collections: 
       - crowdsecurity/windows
    acquisition_spec:
      filename: windows_auth.yaml
      datasource:
        source: wineventlog
        event_channel: Security
        event_ids: 
         - 4625
         - 4623
        event_level: information
        labels: 
         type: eventlog
```
