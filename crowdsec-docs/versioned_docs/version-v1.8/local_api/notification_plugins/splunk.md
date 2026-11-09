---
id: splunk
title: Splunk Plugin
---

The splunk plugin is by default shipped with your CrowdSec installation. The following guide shows how to enable it.

## Configuring the plugin:

By default, the Splunk plugin configuration is located at the following paths, depending on the OS:

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

# ca_cert_path: # CA certificate to verify the Splunk server, in addition to the system ones
# skip_tls_verification: # either true or false. Default is false

# group_wait: # duration to wait collecting alerts before sending to this plugin, eg "30s"

# group_threshold: # if alerts exceed this, then the plugin will be sent the message. eg "10"

# max_retry: # number of tries to attempt to send message to plugins in case of error.

# timeout: # duration to wait for response from plugin before considering this attempt a failure. eg "10s"
```


See [splunk guide](https://docs.splunk.com/Documentation/Splunk/8.2.1/Data/UsetheHTTPEventCollector) for instructions to obtain the token and  url.


**Note** that the `format` is a [go template](https://pkg.go.dev/text/template), which is fed a list of [Alert](https://pkg.go.dev/github.com/crowdsecurity/crowdsec@master/pkg/models#Alert) objects.

### TLS

The plugin verifies the certificate of the Splunk server against the system CA certificates.

- `ca_cert_path`: path to a PEM file with one or more CA certificates to trust in addition to the system ones. Use it when your Splunk instance uses a certificate signed by a private CA.
- `skip_tls_verification`: set to `true` to disable certificate verification altogether. Only use it for testing: the token and the alerts are then sent to whatever answers at `url`.

:::warning
Up to CrowdSec 1.8.1, the Splunk plugin never verified the server certificate. It now does by default: if your Splunk instance uses a self-signed or privately signed certificate, set `ca_cert_path` (or, for testing, `skip_tls_verification: true`), or notifications will fail with a certificate error.
:::

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

Restart CrowdSec:

```bash
sudo systemctl restart crowdsec
```

You can verify whether the plugin is properly working by triggering scenarios using tools like wapiti, nikto etc. 
