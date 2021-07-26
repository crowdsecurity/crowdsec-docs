CrowdSec supports plugins written in any language. The plugins are fed with new alerts when available. In this guide we'll see how to configure and install a slack plugin written in golang. The plugin will send a simple message to the configured slack webhook whenever crowdsec detects any attacks. 

## Installing the plugin:

```
git clone --depth 1 https://github.com/sbs2001/crowdsec-slack-plugin
cd crowdsec-slack-plugin
sudo ./install.sh
```

**Note** that the content of `install.sh` are as following: 

```
cat ./install.sh
sudo systemctl stop crowdsec
go build . -o notification-slack
sudo chown root notification-slack
sudo chgrp root notification-slack
sudo mkdir -p  /etc/crowdsec/plugins/
sudo mkdir -p  /etc/crowdsec/notifications/
sudo cp ./notification-slack /etc/crowdsec/plugins/
sudo systemctl start crowdsec
```

This is interesting because:

1. Plugins don't work if they are not owned by the root user and root group.
2. Plugins follow the naming <plugin_type>-<plugin_subtype> . In this example `plugin_type=notification` and  `plugin_type=slack`. Currently only `plugin_type=notification` is supported. 
3. CrowdSec looks for plugin binaries/scripts in the `/etc/crowdsec/plugins/` directory by default. 
4. CrowdSec looks for configuration files of plugins with  `plugin_type=notification` in the  `/etc/crowdsec/notifications/` diectory by default. 

## Configuring the plugin: 

### Adding the plugin configration 

Let's paste the following config at a new file at `/etc/crowdsec/notifications/slackconfig.yaml` 
{% raw %}
```
type: slack # required for all plugins. This is used to determine which binary/script  to feed this config.
name: slackperiodicreport # required for all plugins. This allows different configs for same script/binary. 
group_wait: 15s # optional, duration for which crowdsec "accumulates" the alerts before dispatching them to this plugin
format: |   # required, go template to specify how to format message sent to the plugin. 
     Received  {{len .}} alerts in last 15 seconds.
     Malicious Actors are: 
     {{range .}}
      {{range .Decisions}}
       {{.Value}}
      {{end}}
     {{end}}

webhook: https://hooks.slack.com/services/xxxxxxxxxxxxxxxxxxxxxxxxxxx # Replace this with your actiual webhook url. This is slack plugin specific config.

```
{% endraw %}

**Don't forget to replace the webhook with your own webhook**

See [slack guide](https://slack.com/intl/en-in/help/articles/115005265063-Incoming-webhooks-for-Slack) for instructions to obtain webhook.

**Note**  that the filename `slackconfig.yaml` has no significance. 

**Note** that the `format` is a [go template](https://pkg.go.dev/text/template), which is fed a list of [Alert](https://pkg.go.dev/github.com/crowdsecurity/crowdsec@v1.1.1/pkg/models#Alert) objects.

### Registering the plugin in a profile.

Plugins are registered at the profile level. Alerts which don't satisy some profile, won't be sent to the plugins owned by this profile.

```
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

```
sudo systemctl restart crowdsec
```

You can verify whether the plugin is properly working by triggering scenarios using tools like wapiti, nikto etc. 