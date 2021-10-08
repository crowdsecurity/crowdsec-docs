## Enabling the plugin:

In your profile file (by default `/etc/crowdsec/profiles.yaml`) , uncomment the section
```
#notifications:
# - http_default
```

## Configuring the plugin:

By default there would be a http config at `/etc/crowdsec/notifications/http.yaml`. Simply replace the whole content in this file with this example below.

Example config: 

```yaml
# Don't change this
type: http

name: http_default # this must match with the registered plugin in the profile
log_level: debug # Options include: trace, debug, info, warn, error, off

format: |
  {
    "type": "message",
    "attachments": [
      {
        "contentType": "application/vnd.microsoft.card.adaptive",
        "content": {
          "$schema": "https://adaptivecards.io/schemas/adaptive-card.json",
          "type": "AdaptiveCard",
          "version": "1.2",
          {{- range . -}}
          {{- $decisions_len := len .Decisions -}}
          {{- range $index, $element := .Decisions -}}
          "body": [
            {
              "type": "TextBlock",
              "text": "[Info] CrowdSec",
              "wrap": true,
              "size": "large",
              "weight": "bolder",
              "fontType": "Default"
            },
            {
              "type": "FactSet",
              "facts": [
                {
                  "title": "IP:",
                  "value": "{{$element.Value}}"
                },
                {
                  "title": "Duration:",
                  "value": "{{$element.Duration}}"
                },
                {
                  "title": "Reason:",
                  "value": "{{$element.Scenario}}"
                },
                {
                  "title": "Origin:",
                  "value": "{{$element.Origin}}"
                },
                {
                  "title": "Simulation:",
                  "value": "{{$element.Simulated}}"
                }
              ]
            },
            {
              "type": "RichTextBlock",
              "inlines": [
                {
                  "type": "TextRun",
                  "text": "\"{{ $element.Value }}\" got a ban for {{ $element.Duration }}."
                }
              ]
            },
            {
              "type": "ActionSet",
              "actions": [
                {
                  "type": "Action.OpenUrl",
                  "title": "Whois",
                  "url": "https://www.whois.com/whois/{{ $element.Value }}",
                  "style": "positive"
                },
                {
                  "type": "Action.OpenUrl",
                  "title": "Shodan",
                  "url": "https://www.shodan.io/host/{{ $element.Value }}",
                  "style": "positive"
                },
                {
                  "type": "Action.OpenUrl",
                  "title": "AbuseIPDB",
                  "url": "https://www.abuseipdb.com/check/{{ $element.Value }}",
                  "style": "positive"
                }
              ]
            },
            {
            "type": "ActionSet",
            "actions": [
                {
                    "type": "Action.OpenUrl",
                    "title": "Unban IP in CAPI",
                    "url": "https://crowdsec.net/unban-my-ip/",
                    "style": "positive"
                }
            ],
            }
            {{- if lt $index (sub $decisions_len 1) -}}
            ,
            {{- end -}}
            {{- end -}}
          {{- end -}}
          ]
        }
      }
    ]
  }

# CrowdSec-Channel
url: https://mycompany.webhook.office.com/webhookb2/{TOKEN}

# Test netcat
#url: "http://127.0.0.1:5555"

method: POST # eg either of "POST", "GET", "PUT" and other http verbs is valid value. 

headers:
  Content-Type: application/json
#   Authorization: token 0x64312313
# skip_tls_verification:  # either true or false. Default is false
# group_wait: # duration to wait collecting alerts before sending to this plugin, eg "30s"
# group_threshold: # if alerts exceed this, then the plugin will be sent the message. eg "10"
# max_retry: # number of tries to attempt to send message to plugins in case of error.
# timeout: # duration to wait for response from plugin before considering this attempt a failure. eg "10s"
```

**Note**

* Don't forget to replace the webhook with your own webhook
* See [microsoft docs](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook) for instructions to obtain a webhook.
* The `format` is a [go template](https://pkg.go.dev/text/template), which is fed a list of [Alert](https://pkg.go.dev/github.com/crowdsecurity/crowdsec@master/pkg/models#Alert) objects.

## Final Steps:

Let's restart crowdsec

```bash
sudo systemctl restart crowdsec
```

You can verify whether the plugin is properly working by triggering scenarios using tools like wapiti, nikto etc.
