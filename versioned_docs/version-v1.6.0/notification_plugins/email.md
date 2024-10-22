---
id: email
title: Email Plugin
---

The Email plugin is shipped by default with CrowdSec. This guide shows how to enable it.

## Enabling the plugin:

In the profile configuration (by default `/etc/crowdsec/profiles.yaml`) , uncomment the section:

```
#notifications:
# - email_default 
```

Every alert that passes the profile's filter will be dispatched to the `email_default` plugin.

## Configuring the plugin:

The default configuration for the email plugin is located at `/etc/crowdsec/notifications/email.yaml`.
You need to provide the credentials for the SMTP server here.

### Example configuration for Gmail

Here's an example configuration that sends alerts to `receiver@gmail.com`:

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

## Final Steps:

Restart CrowdSec with the following command:

```bash
sudo systemctl restart crowdsec
```

To verify if the plugin is functioning correctly, you can trigger scenarios using tools like wapiti, nikto etc. 
