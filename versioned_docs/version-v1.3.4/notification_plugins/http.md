---
id: http
title: HTTP Plugin
---

The HTTP plugin is by default shipped with your CrowdSec installation. The following guide shows how to enable it.

## Enabling the plugin:

In your profile file (by default `/etc/crowdsec/profiles.yaml`) , uncomment the section
```
#notifications:
# - http_default 
```


Every alert which would pass the profile's filter would be dispatched to `http_default` plugin.
## Configuring the plugin: 

By default the configuration for HTTP plugin is located at `/etc/crowdsec/notifications/http.yaml`.
Configure how to make web requests by providing the `url`, `method`, `headers` etc. 

### Adding the plugin configuration 

By default there would be a http config at `/etc/crowdsec/notifications/http.yaml`. Configure  how to make web requests by providing the `url`, `method`, `headers` etc. 

Example config which posts the alerts serialized into json to localhost server.

```yaml
# Don't change this
type: http

name: http_default # this must match with the registered plugin in the profile
log_level: info # Options include: trace, debug, info, warn, error, off

format: |  # This template receives list of models.Alert objects. The request body would contain this. 
  {{.|toJson}}

url: http://localhost # plugin will make requests to this url. Eg value https://www.example.com/

method: POST # eg either of "POST", "GET", "PUT" and other http verbs is valid value. 

# headers:
#   Authorization: token 0x64312313

# skip_tls_verification:  # either true or false. Default is false

# group_wait: # duration to wait collecting alerts before sending to this plugin, eg "30s"

# group_threshold: # if alerts exceed this, then the plugin will be sent the message. eg "10"

# max_retry: # number of tries to attempt to send message to plugins in case of error.

# timeout: # duration to wait for response from plugin before considering this attempt a failure. eg "10s"

```

**Note** that the `format` is a [go template](https://pkg.go.dev/text/template), which is fed a list of [Alert](https://pkg.go.dev/github.com/crowdsecurity/crowdsec@master/pkg/models#Alert) objects.


## Final Steps:

Let's restart crowdsec

```bash
sudo systemctl restart crowdsec
```

You can verify whether the plugin is properly working by triggering scenarios using tools like wapiti, nikto etc. 