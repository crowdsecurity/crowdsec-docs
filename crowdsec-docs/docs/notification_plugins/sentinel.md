---
id: sentinel
title: Sentinel Plugin
---

The sentinel plugin is by default shipped with your CrowdSec installation. The following guide shows how to enable it.

## Enabling the plugin:

In your profile file (by default `/etc/crowdsec/profiles.yaml`) , uncomment the section
```
#notifications:
# - sentinel_default 
```

## Configuring the plugin: 

### Adding the plugin configuration 

By default there would be a sentinel config at `/etc/crowdsec/notifications/sentinel.yaml`.
You will need to specify:
 - customer_id
 - shared_key
 - log_type 

Example config: 

```yaml
type: sentinel          # Don't change
name: sentinel_default  # Must match the registered plugin in the profile

# One of "trace", "debug", "info", "warn", "error", "off"
log_level: info
# group_wait:         # Time to wait collecting alerts before relaying a message to this plugin, eg "30s"
# group_threshold:    # Amount of alerts that triggers a message before <group_wait> has expired, eg "10"
# max_retry:          # Number of attempts to relay messages to plugins in case of error
# timeout:            # Time to wait for response from the plugin before considering the attempt a failure, eg "10s"

#-------------------------
# plugin-specific options

# The following template receives a list of models.Alert objects
# The output goes in the http request body
format: |
  {{.|toJson}}

customer_id: XXX-XXX
shared_key: XXXXXXX
log_type: crowdsec

```

**Note** that the `format` is a [go template](https://pkg.go.dev/text/template), which is fed a list of [Alert](https://pkg.go.dev/github.com/crowdsecurity/crowdsec@master/pkg/models#Alert) objects.

### Configuration options

#### customer_id

Also known as the `workspace id`.
You can get it from the azure portal in `Log Analytics workspace` -> `YOUR_WORKSPACE` -> `Settings` -> `Agents`

#### shared_key

Also known as the `primary key`.
You can get it from the azure portal in `Log Analytics workspace` -> `YOUR_WORKSPACE` -> `Settings` -> `Agents`

#### log_type

The log type is the name of the log that will be sent to azure.

Assuming you chose `crowdsec`, it will appear as `crowdsec_CL` in azure.


## Final Steps:

Let's restart crowdsec

```bash
sudo systemctl restart crowdsec
```

You can verify whether the plugin is properly working by triggering scenarios using tools like wapiti, nikto etc. 