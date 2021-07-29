CrowdSec supports plugins written in any language. The plugins are fed with new alerts when available. In this guide, we'll see how to configure and install a http plugin written in golang. The plugin will send a simple message to the configured http webhook whenever crowdsec detects any attacks. 

## Installing the plugin:

```bash
<TODO>
```

### Plugin conventions

1. Plugins don't work if they are not owned by the root user and root group.
2. Plugins follow the naming <plugin_type>-<plugin_subtype> . In this example `plugin_type=notification` and  `plugin_subtype=http`. Currently only `plugin_type=notification` is supported. 
3. CrowdSec looks for plugin binaries/scripts in the `/etc/crowdsec/plugins/` directory by default. 
4. CrowdSec looks for configuration files of plugins with  `plugin_type=notification` in the  `/etc/crowdsec/notifications/` diectory by default. 

## Configuring the plugin: 

### Adding the plugin configuration 

By default there would be a http config at `/etc/crowdsec/notifications/http.yaml`. Configure  how to make web requests by providing the `url`, `method`, `headers` etc. 

Example config: 

{% raw %}
```yaml
type: http # required for all plugins. This is used to determine which binary/script  to feed this config.
name: generichttp # required for all plugins. This allows different configs for the same script/binary. Should be unique amongst other configs.   
group_wait: 15s # optional, the duration for which crowdsec "accumulates" the alerts before dispatching them to this plugin
format: |   # required, go template to specify how to format message sent to the plugin. 
     Received  {{len .}} alerts in last 15 seconds.
     Malicious Actors are: 
     {{range .}}
      {{range .Decisions}}
       {{.Value}}
      {{end}}
     {{end}}

url: https://example.org/
headers:
 - Cache-control: no-cache

method: GET

```
{% endraw %}

**Don't forget to replace the webhook with your own webhook**

See [http guide](https://http.com/intl/en-in/help/articles/115005265063-Incoming-webhooks-for-http) for instructions to obtain webhook.

**Note**  that the filename `/etc/crowdsec/notifications/http.yaml` has no significance. You may as well define other configs for http plugin for new channels in another file in  `/etc/crowdsec/notifications/`.

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
 - generichttp
```

## Final Steps:

Let's restart crowdsec

```bash
sudo systemctl restart crowdsec
```

You can verify whether the plugin is properly working by triggering scenarios using tools like wapiti, nikto etc. 