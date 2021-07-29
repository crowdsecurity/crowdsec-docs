CrowdSec supports plugins written in any language. The plugins are fed with new alerts when available. In this guide, we'll see how to configure and install a splunk plugin written in golang. The plugin will create a splunk evnet whenever crowdsec detects any attacks. 

## Installing the plugin:

```bash
<TODO>
```

### Plugin conventions

1. Plugins don't work if they are not owned by the root user and root group.
2. Plugins follow the naming <plugin_type>-<plugin_subtype> . In this example `plugin_type=notification` and  `plugin_subtype=splunk`. Currently only `plugin_type=notification` is supported. 
3. CrowdSec looks for plugin binaries/scripts in the `/etc/crowdsec/plugins/` directory by default. 
4. CrowdSec looks for configuration files of plugins with  `plugin_type=notification` in the  `/etc/crowdsec/notifications/` diectory by default. 

## Configuring the plugin: 

### Adding the plugin configuration 

By default there would be a splunk config at `/etc/crowdsec/notifications/splunk.yaml`. Specify your
`url`, `token` and `format` . 

Example config: 

{% raw %}
```yaml

name: splunky
type: splunk
format: |
  Alerts
  {{range .}}
    {{range .Decisions}}
      {{.Value}}
    {{end}}
  {{end}}

token: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
url: https://xxx.yyyy.splunkcloud.com:8088/services/collector

```
{% endraw %}


See [splunk guide](https://docs.splunk.com/Documentation/Splunk/8.2.1/Data/UsetheHTTPEventCollector) for instructions to obtain the token and  url.

**Note**  that the filename `/etc/crowdsec/notifications/splunk.yaml` has no significance. You may as well define other configs for splunk plugin for new channels in another file in  `/etc/crowdsec/notifications/`.

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
 - splunky
```

## Final Steps:

Let's restart crowdsec

```bash
sudo systemctl restart crowdsec
```

You can verify whether the plugin is properly working by triggering scenarios using tools like wapiti, nikto etc. 