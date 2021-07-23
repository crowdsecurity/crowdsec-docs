# Writing {{v1X.crowdsec.Name}} custom profiles

Profiles are used to decide what kind of decision we want to apply when a scenario is triggered.

The default profiles configuration will issue a 4h ban:

```
name: default_ip_remediation
filters:
 - Alert.Remediation == true && Alert.GetScope() == "Ip"
decisions:
 - type: ban
   duration: 4h
on_success: break
```

You can use the profiles to customize the decisions you take.

For example, let's say we want to apply a 24h ban if someone triggers the `ssh-bf` scenario, but only a 10 minutes ban if someone triggers the `http-bad-user-agent` scenario:

!!! warning
    Profiles are evaluated in the order they appear in the configuration.

    This means that they should be ordered from the most precise one to the least precise (ie, the default remediation should be last)

```
#If ssh-bf, apply a 24h ban
name: ssh_bf_ban
filters:
 - Alert.Remediation == true && Alert.GetScope() == "Ip" && Alert.GetScenario() == "crowdsecurity/ssh-bf"
decisions:
 - type: ban
   duration: 24h
on_success: break
---
#If http-bad-user-agent, apply a 10m ban
name: bad_ua_ban
filters:
 - Alert.Remediation == true && Alert.GetScope() == "Ip" && Alert.GetScenario() == "crowdsecurity/http-bad-user-agent"
decisions:
 - type: ban
   duration: 10m
on_success: break
---
#keep a default decision for all other scenarios
name: default_ip_remediation
filters:
 - Alert.Remediation == true && Alert.GetScope() == "Ip"
decisions:
 - type: ban
   duration: 4h
on_success: break
```

As you can see, we always filter on the `Ip` scope, but this some scenarios (such as [ban-defcon-drop_range](https://hub.crowdsec.net/author/crowdsecurity/configurations/ban-defcon-drop_range) have a `Range` scope, which means that the default remediation won't do anything.

In order to correctly apply decisions taken by this scenario, we must add a new profile which targets the `Range` scope:

```
#Ban on range
name: ban_range
filters:
 - Alert.Remediation == true && Alert.GetScope() == "Range"
decisions:
 - type: ban
   duration: 4h
on_success: break
---
#keep a default decision for all other scenarios
name: default_ip_remediation
filters:
 - Alert.Remediation == true && Alert.GetScope() == "Ip"
decisions:
 - type: ban
   duration: 4h
on_success: break
```
