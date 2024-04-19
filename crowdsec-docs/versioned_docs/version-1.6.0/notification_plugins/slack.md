---
id: slack
title: Slack Plugin
---

The slack plugin is by default shipped with your CrowdSec installation. The following guide shows how to enable it.

## Enabling the plugin:

In your profile file (by default `/etc/crowdsec/profiles.yaml`) , uncomment the section
```
#notifications:
# - slack_default 
```

## Configuring the plugin: 

### Adding the plugin configuration 

By default there would be a slack config at `/etc/crowdsec/notifications/slack.yaml`. Specify your
`webhook`. 

Example config: 

```yaml
# Don't change this
type: slack

name: slack_default # this must match with the registered plugin in the profile
log_level: info # Options include: trace, debug, info, warn, error, off

format: |  # This template receives list of models.Alert objects. The message would be composed from this
  {{range . -}}
  {{$alert := . -}}
  {{range .Decisions -}}
  {{if $alert.Source.Cn -}}
  :flag-{{$alert.Source.Cn}}: <https://www.whois.com/whois/{{.Value}}|{{.Value}}> will get {{.Type}} for next {{.Duration}} for triggering {{.Scenario}} on machine '{{$alert.MachineID}}'. <https://www.shodan.io/host/{{.Value}}|Shodan>{{end}}
  {{if not $alert.Source.Cn -}}
  :pirate_flag: <https://www.whois.com/whois/{{.Value}}|{{.Value}}> will get {{.Type}} for next {{.Duration}} for triggering {{.Scenario}} on machine '{{$alert.MachineID}}'.  <https://www.shodan.io/host/{{.Value}}|Shodan>{{end}}
  {{end -}}
  {{end -}}

webhook: https://hooks.slack.com/services/xxxxxxxxxxxxxxxxxxxxxxxxxxx # Replace this with your actual webhook URL. This is a slack plugin-specific config.

```

**Don't forget to replace the webhook with your own webhook**

See [slack guide](https://slack.com/intl/en-in/help/articles/115005265063-Incoming-webhooks-for-Slack) for instructions to obtain webhook.

**Note**  that the filename `/etc/crowdsec/notifications/slack.yaml` has no significance. You may as well define other configs for slack plugin for new channels in another file in  `/etc/crowdsec/notifications/`.

**Note** that the `format` is a [go template](https://pkg.go.dev/text/template), which is fed a list of [Alert](https://pkg.go.dev/github.com/crowdsecurity/crowdsec@master/pkg/models#Alert) objects.


## Final Steps:

Let's restart crowdsec

```bash
sudo systemctl restart crowdsec
```

You can verify whether the plugin is properly working by triggering scenarios using tools like wapiti, nikto etc. 