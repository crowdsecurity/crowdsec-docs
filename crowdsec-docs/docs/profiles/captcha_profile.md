---
id: captcha_profile
title: Captcha
sidebar_position: 2
---

Here is an example of a profile that provides users with a captcha challenge when they trigger a HTTP scenario.

```yaml
name: captcha_remediation
filters:
  - Alert.Remediation == true && Alert.GetScope() == "Ip" && Alert.GetScenario() contains "http"
## Any scenario with http in its name will trigger a captcha challenge
decisions:
 - type: captcha
   duration: 4h
on_success: break
---
name: default_ip_remediation
filters:
 - Alert.Remediation == true && Alert.GetScope() == "Ip"
decisions:
 - type: ban
   duration: 4h
#duration_expr: "Sprintf('%dh', (GetDecisionsCount(Alert.GetValue()) + 1) * 4)"
on_success: break
```

However, you may want to provide a limit to captcha challenges within a period of time to a given IP address because they may ignore your captcha challenges and still cause load on your server.

You can use the `GetDecisionsCount` or `GetDecisionsSinceCount` helper to achieve this:

```yaml
name: captcha_remediation
filters:
  - Alert.Remediation == true && Alert.GetScope() == "Ip" && Alert.GetScenario() contains "http" && GetDecisionsSinceCount(Alert.GetValue(), "24h") <= 3
## Same as above but only 3 captcha decision per 24 hours before ban
decisions:
 - type: captcha
   duration: 4h
on_success: break
---
name: default_ip_remediation
filters:
 - Alert.Remediation == true && Alert.GetScope() == "Ip"
decisions:
 - type: ban
   duration: 4h
#duration_expr: "Sprintf('%dh', (GetDecisionsCount(Alert.GetValue()) + 1) * 4)"
on_success: break
```