---
id: gotify
title: Gotify
---

CrowdSec can forward Alerts to Gotify via the HTTP plugin. This guide will show you how to configure the HTTP plugin to send alerts to your Gotify instance.

## Configuring the plugin

By default the configuration for HTTP plugin is located at these default location per OS:

- **Linux** `/etc/crowdsec/notifications/http.yaml`
- **FreeBSD** `/usr/local/etc/crowdsec/notifications/http.yaml`
- **Windows** `C:\ProgramData\CrowdSec\config\notifications\http.yaml`

### Base configuration

You can replace the file contents with the following configuration:

Then replace the `<GOTFIY_URL>` and the `<GOTIFY_API_KEY>` of the plugin's config so that it send the events to your Gotify instance.

```yaml
type: http          # Don't change
name: http_default # Must match the registered plugin in the profile

# One of "trace", "debug", "info", "warn", "error", "off"
log_level: info

# group_wait:         # Time to wait collecting alerts before relaying a message to this plugin, eg "30s"
# group_threshold:    # Amount of alerts that triggers a message before <group_wait> has expired, eg "10"
# max_retry:          # Number of attempts to relay messages to plugins in case of error
# timeout:            # Time to wait for response from the plugin before considering the attempt a failure, eg "10s"

#-------------------------
# plugin-specific options

# The following template receives a list of models.Alert objects
# The output goes in the http request body
format: |
  {{ range . -}}
  {{ $alert := . -}}
  {
    "extras": {
      "client::display": {
      "contentType": "text/markdown"
    }
  },
  "priority": 3,
  {{range .Decisions -}}
  "title": "{{.Type }} {{ .Value }} for {{.Duration}}",
  "message": "{{.Scenario}}  \n\n[crowdsec cti](https://app.crowdsec.net/cti/{{.Value -}})  \n\n[shodan](https://shodan.io/host/{{.Value -}})"
  {{end -}}
  }
  {{ end -}}

# The plugin will make requests to this url, eg:  https://www.example.com/
url: https://<GOTFIY_URL>/message

# Any of the http verbs: "POST", "GET", "PUT"...
method: POST

headers:
  X-Gotify-Key: <GOTIFY_API_KEY>
  Content-Type: application/json
# skip_tls_verification:  # true or false. Default is false
```

## Testing the plugin

Before enabling the plugin it is best to test the configuration so the configuration is validated and you can see the output of the plugin. 

```bash
cscli notifications test http_default
```

:::note
If you have changed the `name` property in the configuration file, you should replace `http_default` with the new name.
:::

## Enabling the plugin

In your profiles you will need to uncomment the `notifications` key and the `http_default` plugin list item.

```
#notifications:
# - http_default 
```

:::note
If you have changed the `name` property in the configuration file, you should replace `http_default` with the new name.
:::

:::warning
Ensure your YAML is properly formatted the `notifications` key should be at the top level of the profile.
:::

<details>

<summary>Example profile with http plugin enabled</summary>

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
  - http_default
on_success: break
```

</details>

## Final Steps:

Let's restart crowdsec

```bash
sudo systemctl restart crowdsec
```

You can verify whether the plugin is properly working by triggering scenarios using tools like wapiti, nikto.
