---
id: slack
title: Slack Plugin
---

The slack plugin is by default shipped with your CrowdSec installation. The following guide shows how to enable it.

## Configuring the plugin: 

By default the configuration for Slack plugin is located at these default location per OS:

- **Linux** `/etc/crowdsec/notifications/slack.yaml`
- **FreeBSD** `/usr/local/etc/crowdsec/notifications/slack.yaml`
- **Windows** `C:\ProgramData\CrowdSec\config\notifications\slack.yaml`

### Base configuration

Here is the base configuration for the Slack plugin:

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

## Testing the plugin

Before enabling the plugin it is best to test the configuration so the configuration is validated and you can see the output of the plugin. 

```bash
cscli notifications test slack_default
```

:::note
If you have changed the `name` property in the configuration file, you should replace `slack_default` with the new name.
:::

## Enabling the plugin

In your profiles you will need to uncomment the `notifications` key and the `slack_default` plugin list item.

```
#notifications:
# - slack_default
```

:::note
If you have changed the `name` property in the configuration file, you should replace `slack_default` with the new name.
:::

:::warning
Ensure your YAML is properly formatted the `notifications` key should be at the top level of the profile.
:::

<details>

<summary>Example profile with email plugin enabled</summary>

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
  - slack_default
on_success: break
```

</details>

## Final Steps:

Let's restart crowdsec

```bash
sudo systemctl restart crowdsec
```
