---
id: pid_profile
title: PID
sidebar_position: 1
---

:::info
We use PID to refer to a process ID based events.
:::

We provide collection for host based indicators of compromise (IOCs) that can be used to detect malicious activity on your hosts.

Collections:
  - [Auditd](https://hub.crowdsec.net/author/crowdsecurity/collections/auditd)
  - [Laurel](https://hub.crowdsec.net/author/crowdsecurity/configurations/laurel-logs)

Currently we cannot remediate these alerts, however, we can send you a notification when we detect them.

```yaml
name: pid_alert
filters:
 - Alert.GetScope() == "pid"
decisions: []
notifications:
  - slack_default
## Please edit the above line to match your notification name
on_success: break
---
```