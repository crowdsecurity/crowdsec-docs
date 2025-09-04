---
id: splunk
title: Splunk Plugin
---

The splunk plugin is by default shipped with your CrowdSec installation. The following guide shows how to enable it.

## Configuring the plugin:

By default the configuration for Splunk plugin is located at these default location per OS:

- **Linux** `/etc/crowdsec/notifications/splunk.yaml`
- **FreeBSD** `/usr/local/etc/crowdsec/notifications/splunk.yaml`
- **Windows** `C:\ProgramData\CrowdSec\config\notifications\splunk.yaml`

### Base configuration

Here is the base configuration for the Splunk plugin:

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

## Testing the plugin

Before enabling the plugin it is best to test the configuration so the configuration is validated and you can see the output of the plugin. 

```bash
cscli notifications test splunk_default
```

:::note
If you have changed the `name` property in the configuration file, you should replace `splunk_default` with the new name.
:::

## Enabling the plugin

In your profiles you will need to uncomment the `notifications` key and the `splunk_default` plugin list item.

```
#notifications:
# - splunk_default
```

:::note
If you have changed the `name` property in the configuration file, you should replace `splunk_default` with the new name.
:::

:::warning
Ensure your YAML is properly formatted the `notifications` key should be at the top level of the profile.
:::

<details>

<summary>Example profile with Splunk plugin enabled</summary>

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
  - splunk_default
on_success: break
```

</details>

## Final Steps:

Let's restart crowdsec

```bash
sudo systemctl restart crowdsec
```

You can verify whether the plugin is properly working by triggering scenarios using tools like wapiti, nikto etc. 
