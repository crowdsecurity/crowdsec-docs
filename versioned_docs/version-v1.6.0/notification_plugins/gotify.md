---
id: gotify
title: Gotify
---

Gotify can be integrated with CrowdSec by using the HTTP plugin. Enable it by following these [instructions](/notification_plugins/http.md) .

Then replace the `<GOTFIY_URL>` and the `<GOTIFY_API_KEY>` of the plugin's config so that it send the events to your Gotify instance.

An example configuration:

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

## Final Steps:

Let's restart crowdsec

```bash
sudo systemctl restart crowdsec
```

You can verify whether the plugin is properly working by triggering scenarios using tools like wapiti, nikto.
