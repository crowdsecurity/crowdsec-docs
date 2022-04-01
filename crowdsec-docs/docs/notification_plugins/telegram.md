---
id: telegram
title: Telegram
---

Telegram can be integrated with CrowdSec by using the HTTP plugin. Enable it by following these [instructions](/notification_plugins/http.md) .

Then replace the `chat_id` and the `TELEGRAM_APY_KEY` of the plugin's config so that it send the events to your Telegram chat.

An example configuration:

```yaml
type: http          # Don't change
name: http_default  # Must match the registered plugin in the profile

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
  {
   "chat_id": "-XXXXXXXXX", # Replace with your Telegram chat ID
   "text": "
     {{range . -}}  
     {{$alert := . -}}  
     {{range .Decisions -}}
     {{.Value}} will get {{.Type}} for next {{.Duration}} for  triggering {{.Scenario}}.\r\n https://www.shodan.io/host/{{.Value}}
     {{end -}}
     {{end -}}
   "
  }

url: https://api.telegram.org/bot<TELEGRAM_APY_KEY>/sendMessage # Replace <TELEGRAM_APY_KEY> with your APi key

method: POST
headers:
  Content-Type: "application/json"
```

## Final Steps:

Let's restart crowdsec

```bash
sudo systemctl restart crowdsec
```

You can verify whether the plugin is properly working by triggering scenarios using tools like wapiti, nikto.
