---
id: cti_profile
title: CrowdSec CTI
sidebar_position: 1
---

Here is an example of a profile that uses the CTI module.

:::info
You **MUST** configure the CTI beforehand, see [CTI helpers](/expr/cti_helpers.md).
:::

### Background Noise Score

Background noise score can be used to inform you if the ip address is noisy or not. You can use this information to make the decision more or less aggressive.

```yaml
name: high_bn_score
on_error: continue
filters:
 - Alert.Remediation == true && Alert.GetScope() == "Ip" && CrowdsecCTI(Alert.GetValue()).GetBackgroundNoiseScore() > 6 && !CrowdsecCTI(Alert.GetValue()).IsFalsePositive()
decisions:
 - type: ban
   duration: 24h
on_success: break
---
name: mid_bn_score
on_error: continue
filters:
 - Alert.Remediation == true && Alert.GetScope() == "Ip" && CrowdsecCTI(Alert.GetValue()).GetBackgroundNoiseScore() >= 3 && !CrowdsecCTI(Alert.GetValue()).IsFalsePositive()
decisions:
 - type: ban
   duration: 12h
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

A key piece of profile to point out is the `on_error` directive. It is set to `continue` to ensure that the alert will continue to be evaluated even if your API key is rate limited.

You could also use the background noise within the `duration_expr` to make the ban duration proportional to the background noise score:

```yaml
name: bn_score
on_error: continue
filters:
 - Alert.Remediation == true && Alert.GetScope() == "Ip" && CrowdsecCTI(Alert.GetValue()).GetBackgroundNoiseScore() > 0 && !CrowdsecCTI(Alert.GetValue()).IsFalsePositive()
decisions:
 - type: ban
   duration: 12h
duration_expr: "Sprintf('%dm', (240 + (120 * CrowdsecCTI(Alert.GetValue()).GetBackgroundNoiseScore())))"
## 240 minutes (4 hours) + 120 minutes per point of background noise score
## 120 = 20 * 60 / 10 (Max Background Noise Score)
on_success: break
---
name: default_ip_remediation
filters:
 - Alert.Remediation == true && Alert.GetScope() == "Ip"
decisions:
 - type: ban
   duration: 4h
on_success: break
```

### Potential False Triggers

Send a notification about a potential false triggers and break the alert evaluation:

```yaml
name: false_positive
filters:
 - Alert.Remediation == true && Alert.GetScope() == "Ip" && CrowdsecCTI(Alert.GetValue()).IsFalsePositive()
notifications:
    - http_hive
on_success: break
---
name: default_ip_remediation
filters:
 - Alert.Remediation == true && Alert.GetScope() == "Ip"
decisions:
 - type: ban
   duration: 4h
on_success: break
```
