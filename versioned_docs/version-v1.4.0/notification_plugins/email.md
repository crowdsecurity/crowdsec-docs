---
id: email
title: Email Plugin
---

The Email plugin is by default shipped with your CrowdSec installation. The following guide shows how to enable it.

## Enabling the plugin:

In your profile file (by default `/etc/crowdsec/profiles.yaml`) , uncomment the section
```
#notifications:
# - email_default 
```

Every alert which would pass the profile's filter would be dispatched to `email_default` plugin.
## Configuring the plugin: 

By default the configuration for email plugin is located at `/etc/crowdsec/notifications/email.yaml`.
You'll need to fill the credentials for the SMTP server here. 

### Example configuration for Gmail

Example config which mail's the alerts to `receiver@gmail.com`.

```yaml
# Don't change this
type: email

name: email_default # this must match with the registered plugin in the profile
log_level: info # Options include: trace, debug, info, warn, error, off

format: |  # This template receives list of models.Alert objects
  {{range . -}}
    {{$alert := . -}}
    {{range .Decisions -}}
      <a href=https://www.whois.com/whois/{{.Value}}>{{.Value}}</a> will get <b>{{.Type}}</b> for next <b>{{.Duration}}</b> for triggering <b>{{.Scenario}}</b>. <a href=https://www.shodan.io/host/{{.Value}}>Shodan</a>  
    {{end -}}
  {{end -}}

smtp_host: smtp.gmail.com
smtp_username: myemail@gmail.com
smtp_password: mypassword 
smtp_port: 587
sender_email: myemail@gmail.com
receiver_emails:
 - receiver@gmail.com
encryption_type: ssltls # Required
auth_type: login # "plain" also works
email_subject: CrowdSec Notification

# group_wait: # duration to wait collecting alerts before sending to this plugin, eg "30s"

# group_threshold: # if alerts exceed this, then the plugin will be sent the message. eg "10"

# max_retry: # number of tries to attempt to send message to plugins in case of error.

timeout: 20s # duration to wait for response from plugin before considering this attempt a failure. eg "10s"

```

**Note** that the `format` is a [go template](https://pkg.go.dev/text/template), which is fed a list of [Alert](https://pkg.go.dev/github.com/crowdsecurity/crowdsec@master/pkg/models#Alert) objects.


## Final Steps:

Let's restart crowdsec

```bash
sudo systemctl restart crowdsec
```

You can verify whether the plugin is properly working by triggering scenarios using tools like wapiti, nikto etc. 