---
id: file
title: File Plugin
---

The File plugin is by default shipped with your CrowdSec installation and allows you to write Alerts to an external file that can be monitored by external applications. The following guide shows how to configure, test and enable it.

## Configuring the plugin

By default the configuration for Email plugin is located at these default location per OS:

- **Linux** `/etc/crowdsec/notifications/file.yaml`
- **FreeBSD** `/usr/local/etc/crowdsec/notifications/file.yaml`
- **Windows** `C:\ProgramData\CrowdSec\config\notifications\file.yaml`

### Base configuration

Example config which writes Alerts to a file using NDJson (**N**ewline **D**elimiter **J**ava**S**cript **O**bject **N**otation) format to `/tmp/crowdsec_alerts.json`.

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

### SIEM Integration

:::warning
Please note if you change the format that is printed to the file you must also configure the collector on the SIEM side to also expect the same format
:::

#### Filebeat

Filebeat has a set of reserved top level keys and should not be used in the ndjson format. The following format can be used to be compatible with Filebeat:

```yaml
format: |
  {{range . -}}
   { "time": "{{.StopAt}}", "source": "crowdsec", "alert": {{. | toJson }} }
  {{ end -}}
```
#### Wazuh

Wazuh has set of reserved top level keys and may cause logs not to be sent by the agent. The following format can be used to be compatible with Wazuh:

```yaml
format: |
  {{range . -}}
   { "crowdsec": { "time": "", "program": "crowdsec", "alert": {{. | toJson }} }}
  {{ end -}}
```

## Testing the plugin

Before enabling the plugin it is best to test the configuration so the configuration is validated and you can see the output of the plugin. 

```bash
cscli notifications test file_default
```

:::note
If you have changed the `name` property in the configuration file, you should replace `file_default` with the new name.
:::

## Enabling the plugin

In your profiles you will need to uncomment the `notifications` key and the `file_default` plugin list item.

```
#notifications:
# - file_default
```

:::note
If you have changed the `name` property in the configuration file, you should replace `file_default` with the new name.
:::

:::warning
Ensure your YAML is properly formatted the `notifications` key should be at the top level of the profile.
:::

<details>

<summary>Example profile with file plugin enabled</summary>

```yaml
name: default_ip_remediation
#debug: true
filters:
 - Alert.Remediation == true && Alert.GetScope() == "Ip"
decisions:
 - type: ban
   duration: 4h
#duration_expr: Sprintf('%dh', (GetDecisionsCount(Alert.GetValue()) + 1) * 4)
#highlight-next-line
notifications:
#highlight-next-line
  - file_default
on_success: break
```

</details>

## Final Steps:

Let's restart crowdsec

```bash
sudo systemctl restart crowdsec
```
