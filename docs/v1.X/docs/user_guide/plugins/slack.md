CrowdSec supports plugins written in any language. The plugins are fed with new alerts when available. In this guide, we'll see how to configure and install a slack plugin written in golang. The plugin will send a simple message to the configured slack webhook whenever crowdsec detects any attacks. 

## Installing the plugin:

```bash
<TODO>
```

### Plugin conventions

1. Plugins don't work if they are not owned by the root user and root group.
2. Plugins follow the naming <plugin_type>-<plugin_subtype> . In this example `plugin_type=notification` and  `plugin_subtype=slack`. Currently only `plugin_type=notification` is supported. 
3. CrowdSec looks for plugin binaries/scripts in the `/etc/crowdsec/plugins/` directory by default. 
4. CrowdSec looks for configuration files of plugins with  `plugin_type=notification` in the  `/etc/crowdsec/notifications/` diectory by default. 

## Configuring the plugin: 

### Adding the plugin configuration 

By default there would be a slack config at `/etc/crowdsec/notifications/slack.yaml`. Specify your
`webhook` and `format`. 

Example config: 

{% raw %}
```yaml
type: slack # required for all plugins. This is used to determine which binary/script  to feed this config.
name: slackperiodicreport # required for all plugins. This allows different configs for the same script/binary. Should be unique amongst other configs.   
group_wait: 15s # optional, the duration for which crowdsec "accumulates" the alerts before dispatching them to this plugin
format: |   # required, go template to specify how to format message sent to the plugin. 
     Received  {{len .}} alerts in last 15 seconds.
     Malicious Actors are: 
     {{range .}}
      {{range .Decisions}}
       {{.Value}}
      {{end}}
     {{end}}

webhook: https://hooks.slack.com/services/xxxxxxxxxxxxxxxxxxxxxxxxxxx # Replace this with your actual webhook URL. This is a slack plugin-specific config.

```
{% endraw %}

**Don't forget to replace the webhook with your own webhook**

See [slack guide](https://slack.com/intl/en-in/help/articles/115005265063-Incoming-webhooks-for-Slack) for instructions to obtain webhook.

**Note**  that the filename `/etc/crowdsec/notifications/slack.yaml` has no significance. You may as well define other configs for slack plugin for new channels in another file in  `/etc/crowdsec/notifications/`.

**Note** that the `format` is a [go template](https://pkg.go.dev/text/template), which is fed a list of [Alert](https://pkg.go.dev/github.com/crowdsecurity/crowdsec@v1.1.1/pkg/models#Alert) objects.

### Registering the plugin in a profile.

Plugins are registered at the profile level. Alerts that don't satisfy some profile, won't be sent to the plugins owned by this profile.

```yaml
name: default_ip_remediation
#debug: true
filters:
 - Alert.Remediation == true && Alert.GetScope() == "Ip"
decisions:
 - type: ban
   duration: 4h
on_success: break
notifications:
 - slackperiodicreport
```

## Final Steps:

Let's restart crowdsec

```bash
sudo systemctl restart crowdsec
```

You can verify whether the plugin is properly working by triggering scenarios using tools like wapiti, nikto etc. 