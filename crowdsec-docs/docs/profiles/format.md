---
id: format
title: Format
sidebar_position: 2
---

## Profile configuration example

```yaml title="/etc/crowdsec/profiles.yaml"
name: default_ip_remediation
#debug: true
filters:
 - Alert.Remediation == true && Alert.GetScope() == "Ip"
decisions:
 - type: ban
   duration: 4h
#duration_expr: "Sprintf('%dh', (GetDecisionsCount(Alert.GetValue()) + 1) * 4)"
notifications:
  - slack_default  # Set the webhook in /etc/crowdsec/notifications/slack.yaml before enabling this.
on_success: break

---
name: another_profile
...
```


## Profile directives

### `name`

```yaml
name: foobar
```

A label for the profile (used in logging)

### `debug`

```yaml
debug: true
```

A boolean flag that provides contextual debug.

### `filters`

```yaml
filters:
 - Alert.Remediation == true && Alert.GetScope() == "Session"
 - Alert.Remediation == true && Alert.GetScope() == "Ip"
```

If any `filter` of the list returns `true`, the profile is eligible and the `decisions` will be applied (note: `filter` can use [expr helpers](/expr/intro.md)).

The filter allows you to then create custom decisions for some specific scenarios for example:

```yaml
name: specific_remediation
#debug: true
filters:
 - Alert.Remediation == true && Alert.GetScope() == "Ip" && Alert.GetScenario() in ["crowdsecurity/ssh-bf", "crowdsecurity/ssh-user-enum"]
decisions:
 - type: ban
   duration: 8h
notifications:
  - slack_default  # Set the webhook in /etc/crowdsec/notifications/slack.yaml before enabling this.
on_success: break
---
...
```

This allows you as well to setup various notifications or profiles depending on the scope :

```yaml
name: notif_only
#debug: true
filters:
 - Alert.GetScope() == "Country"
notifications:
  - slack_default  # Set the webhook in /etc/crowdsec/notifications/slack.yaml before enabling this.
on_success: break
---
...
```

### `decisions`

```yaml
decisions:
 - type: captcha
   duration: 1h
   scope: custom_app1_captcha
 - type: ban
   duration: 2h
```

If the profile applies, decisions objects will be created for each of the sources that triggered the scenario.

It is a list of `models.Decision` objects. The following fields, when present, allows to alter the resulting decision :

 - `scope` : defines the scope of the resulting decision
 - `duration` : defines for how long will the decision be valid. The format must comply with [golang's ParseDuration](https://pkg.go.dev/time#ParseDuration)
 - `type` : defines the type of the remediation that will be applied by available bouncers, for example `ban`, `captcha`
 - `value` : define a hardcoded value for the decision (ie. `1.2.3.4`)

### `duration_expr`

```yaml
duration_expr: "Sprintf('%dh', (GetDecisionsCount(Alert.GetValue()) + 1) * 4)"
```

If the profile applies, and the `duration_expr` generates a valid [golang's duration](https://pkg.go.dev/time#ParseDuration), it will replace the decision duration.

It can be used to have custom duration. For example, you can have an increased duration every time an attacker comes back.
It relies on [expr helpers](/expr/intro.md).

### `on_success`

```yaml
on_success: break
```

If the profile applies and `on_success` is set to `break`, decisions processing will stop here and it won't evaluate against following profiles.

### `on_failure`

```yaml
on_failure: break
```

If the profile didn't apply and `on_failure` is set to `break`, decisions processing will stop here and it won't evaluate against following profiles.

### `notifications`

```yaml
notifications:
  - notification_plugin1
  - notification_plugin2
```

The [list of notification plugins](/notification_plugins/intro.md) to which the alert should be fed.
