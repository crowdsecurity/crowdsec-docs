---
id: email
title: Email Plugin
---

The Email plugin is shipped by default with CrowdSec. The following guide shows how to configure, test and enable it.

## Configuring the plugin

By default the configuration for Email plugin is located at these default location per OS:

- **Linux** `/etc/crowdsec/notifications/email.yaml`
- **FreeBSD** `/usr/local/etc/crowdsec/notifications/email.yaml`
- **Windows** `C:\ProgramData\CrowdSec\config\notifications\email.yaml`

### Base configuration

Here is the base configuration for the Email plugin:

```yaml
type: email           # Don't change
name: email_default   # Must match the registered plugin in the profile

# One of "trace", "debug", "info", "warn", "error", "off"
log_level: info

# group_wait:         # Time to wait collecting alerts before relaying a message to this plugin, eg "30s"
# group_threshold:    # Amount of alerts that triggers a message before <group_wait> has expired, eg "10"
# max_retry:          # Number of attempts to relay messages to plugins in case of error
timeout: 20s          # Time to wait for response from the plugin before considering the attempt a failure, eg "10s"

#-------------------------
# plugin-specific options

# The following template receives a list of models.Alert objects
# The output goes in the email message body
format: |
  <html><body>
  {{range . -}}
    {{$alert := . -}}
    {{range .Decisions -}}
      <p><a href="https://www.whois.com/whois/{{.Value}}">{{.Value}}</a> will get <b>{{.Type}}</b> for next <b>{{.Duration}}</b> for triggering <b>{{.Scenario}}</b> on machine <b>{{$alert.MachineID}}</b>.</p> <p><a href="https://app.crowdsec.net/cti/{{.Value}}">CrowdSec CTI</a></p>
    {{end -}}
  {{end -}}
  </body></html>

smtp_host:            # example: smtp.gmail.com
smtp_username:        # Replace with your actual username
smtp_password:        # Replace with your actual password
smtp_port:            # Common values are any of [25, 465, 587, 2525]
auth_type:            # Valid choices are "none", "crammd5", "login", "plain"
sender_name: "CrowdSec"
sender_email:         # example: foo@gmail.com
email_subject: "CrowdSec Notification"
receiver_emails:
# - email1@gmail.com
# - email2@gmail.com

# One of "ssltls", "starttls", "none"
encryption_type: "ssltls"

# If you need to set the HELO hostname:
# helo_host: "localhost"

# If the email server is hitting the default timeouts (10 seconds), you can increase them here
#
# connect_timeout: 10s
# send_timeout: 10s

---

# type: email
# name: email_second_notification
# ...
```

The `format` configuration directive is a [go template](https://pkg.go.dev/text/template), which receives a list of [Alert](https://pkg.go.dev/github.com/crowdsecurity/crowdsec@master/pkg/models#Alert) objects.

Typical port and TLS/SSL settings

| Port | Encryption Type |
|------|-----------------|
| 25   | none            |
| 465  | ssltls          |
| 587  | starttls        |

:::warning
Port 25 should be avoided at all costs as it is commonly blocked by ISPs and email providers and is insecure as it sends in plain text.
:::

:::info
Port settings above are common, but may vary depending on your email provider. Please refer to your email provider's documentation for the correct settings.
:::

## Testing the plugin

Before enabling the plugin it is best to test the configuration so the configuration is validated and you can see the output of the plugin. 

```bash
cscli notifications test email_default
```

:::note
If you have changed the `name` property in the configuration file, you should replace `email_default` with the new name.
:::

## Enabling the plugin

In your profiles you will need to uncomment the `notifications` key and the `email_default` plugin list item.

```
#notifications:
# - email_default
```

:::note
If you have changed the `name` property in the configuration file, you should replace `email_default` with the new name.
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
  - email_default
on_success: break
```

</details>

## Final Steps:

Restart CrowdSec with the following command:

```bash
sudo systemctl restart crowdsec
```
