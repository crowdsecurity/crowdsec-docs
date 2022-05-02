---
id: splunk
title: Splunk Plugin
---

The splunk plugin is by default shipped with your CrowdSec installation. The following guide shows how to enable it.

## Enabling the plugin:

In your profile file (by default `/etc/crowdsec/profiles.yaml`) , uncomment the section
```
#notifications:
# - splunk_default
```

## Configuring the plugin: 

### Adding the plugin configuration 

By default there would be a splunk config at `/etc/crowdsec/notifications/splunk.yaml`. Specify your
`url`, `token` and `format` . 

Example configuration which posts creates splunk event containing alerts serialized to JSON: 

```yaml
# Don't change this
type: splunk

name: splunk_default # this must match with the registered plugin in the profile
log_level: info # Options include: trace, debug, info, warn, error, off

format: |  # This template receives list of models.Alert objects. Splunk event will be created with its contents.
  {{.|toJson}}

token: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
url: https://xxx.yyyy.splunkcloud.com:8088/services/collector


# group_wait: # duration to wait collecting alerts before sending to this plugin, eg "30s"

# group_threshold: # if alerts exceed this, then the plugin will be sent the message. eg "10"

# max_retry: # number of tries to attempt to send message to plugins in case of error.

# timeout: # duration to wait for response from plugin before considering this attempt a failure. eg "10s"
```


See [splunk guide](https://docs.splunk.com/Documentation/Splunk/8.2.1/Data/UsetheHTTPEventCollector) for instructions to obtain the token and  url.


**Note** that the `format` is a [go template](https://pkg.go.dev/text/template), which is fed a list of [Alert](https://pkg.go.dev/github.com/crowdsecurity/crowdsec@master/pkg/models#Alert) objects.

## Final Steps:

Let's restart crowdsec

```bash
sudo systemctl restart crowdsec
```

You can verify whether the plugin is properly working by triggering scenarios using tools like wapiti, nikto etc. 
