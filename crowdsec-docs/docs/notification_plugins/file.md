---
id: file
title: File Plugin
---

The File plugin is by default shipped with your CrowdSec installation. The following guide shows how to enable it.

## Enabling the plugin:

In your profile file (by default `/etc/crowdsec/profiles.yaml`) , uncomment the section

```
#notifications:
# - file_default 
```

Every alert which would pass the profile's filter would be dispatched to `file_default` plugin.

## Configuring the plugin: 

By default the configuration for File plugin is located at `/etc/crowdsec/notifications/file.yaml`.

### Adding the plugin configuration 

Example config which writes a ndjson file to `/tmp/crowdsec_alerts.json`.

```yaml
# Don't change this
type: file

name: file_default # this must match with the registered plugin in the profile
log_level: info # Options include: trace, debug, info, warn, error, off

# This template render all events as ndjson
format: |
  {{range . -}}
   { "time": "{{.StopAt}}", "program": "crowdsec", "alert": {{. | toJson }} }
  {{ end -}}

# group_wait: # duration to wait collecting alerts before sending to this plugin, eg "30s"
# group_threshold: # if alerts exceed this, then the plugin will be sent the message. eg "10"

#Use full path EG /tmp/crowdsec_alerts.json
log_path: "/tmp/crowdsec_alerts.json"
rotate:
  enabled: true # Change to false if you want to handle log rotate on system basis
  max_size: 10 # in MB
  max_files: 5 # Number of files to keep
  max_age: 5 # in days but may remove files before this if max_files is reached
  compress: true # Compress rotated files using gzip
```

**Note** that the `format` is a [go template](https://pkg.go.dev/text/template), which is fed a list of [Alert](https://pkg.go.dev/github.com/crowdsecurity/crowdsec@master/pkg/models#Alert) objects.

:::warning
Some SIEM agents may not support some top level keys we define in the default ndjson format. Please make sure to adjust the format to match your SIEM agent's requirements.
:::

## SIEM Integration

### Filebeat

Filebeat has a set of reserved top level keys and should not be used in the ndjson format. The following format can be used to be compatible with Filebeat:

```yaml
format: |
  {{range . -}}
   { "time": "{{.StopAt}}", "source": "crowdsec", "alert": {{. | toJson }} }
  {{ end -}}
```

## Final Steps:

Let's restart crowdsec

```bash
sudo systemctl restart crowdsec
```

You can verify whether the plugin is properly working by triggering scenarios using tools like wapiti, nikto etc. 