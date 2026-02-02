---
title: Security Engine Too Many Alerts
id: issue_se_too_many_alerts
---

The **Engine Too Many Alerts** issue appears when your Security Engine generates an abnormally high volume of alerts. This usually indicates a misconfigured scenario or an ongoing large-scale attack.

## What Triggers This Issue

- **Trigger condition**: More than 250,000 alerts in 6 hours
- **Criticality**: ⚠️ High
- **Impact**: May indicate misconfiguration, performance issues, or a real large scale attack.

## Common Root Causes

- [**Misconfigured or overly sensitive scenario**](#misconfigured-or-overly-sensitive-scenario): A scenario with thresholds set too low or matching too broadly can trigger excessive alerts.
- [**Parser creating duplicate events**](#parser-creating-duplicate-events): A parser issue causing the same log line to generate multiple events.
- [**Actual large-scale attack**](#legitimate-large-scale-attack): A genuine distributed attack (DDoS, brute force campaign) targeting your infrastructure.
- [**Custom scenario misconfigured *blackhole***](#custom-scenario-missing-blackhole-param): A custom scenario without proper [*`blackhole`*](https://doc.crowdsec.net/docs/next/log_processor/scenarios/format/#blackhole) param may result in alert spam.

## Diagnosis & Resolution

### Misconfigured or Overly Sensitive Scenario

CrowdSec scenarios are likely not misconfigured. Here we're talking about custom or third party scenarios or scenarios you altered yourself.  

If you don't have any non default scenarios you can still investigate but the issue will more likely be upstream (acquisition, profile or logging).

#### 🔎 Identify problematic scenarios

1. Identify which scenarios are generating the most alerts:

```bash
sudo cscli alerts list -l 100
```

<details>
   <summary>Run this command for Docker or Kubernetes</summary>

Docker
```bash
docker exec crowdsec cscli alerts list -l 100
```

Kubernetes
```bash
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli alerts list -l 100
```

</details>

2. Look for patterns:

- Is one scenario dominating the alert count?
- Are the same IPs repeatedly triggering alerts?
- Are alerts legitimate threats or false positives?

3. Check metrics for scenario overflow:

```bash
sudo cscli metrics show scenarios
```

<details>
   <summary>Run this command for Docker or Kubernetes</summary>

```bash
docker exec crowdsec cscli metrics show scenarios
```

```bash
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli metrics show scenarios
```

</details>

Look for scenarios with extremely high "Overflow" counts or "Current count" numbers.

#### 🛠️ Tuning or Disabling the scenario

If you identify that the scenario is the reason you can try the folllowing

##### Tuning the scenario threshold

If the scenario is triggering too easily, you can create a custom version with adjusted thresholds. See the [scenario documentation](/docs/scenarios/intro) for details on customizing scenarios.

##### Disabling the scenario temporarily

You have multiple ways to do this, among which the following 2:

* Removing the scenario
* Whitelisting it in [postoverflow](/log_processor/whitelist/create_postoverflow/#allow-event-for-a-specific-scenario)

### Parser Creating Duplicate Events

#### 🔎 Test parsing with sample log lines

Use `cscli explain` to test parsing:

```bash
sudo cscli explain --log "<sample log line>" --type <type>
```

Check if the log line generates multiple events incorrectly.

#### 🛠️ Review parser configuration or report issue

Review parser configuration or report the issue to the [CrowdSec Hub](https://github.com/crowdsecurity/hub/issues).

### Legitimate Large-Scale Attack

#### 🔎 Review alert patterns to confirm genuine attack

Review alert patterns to confirm a genuine attack:

```bash
# On host
sudo cscli alerts list -l 100

# Docker
docker exec crowdsec cscli alerts list -l 100

# Kubernetes
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli alerts list -l 100
```

Look for:

- Multiple different source IPs targeting the same services
- Realistic attack patterns (brute force, scanning, etc.)
- Alerts matching known attack signatures

#### 🛠️ Verify remediation is blocking attackers

If you're experiencing a real attack:

1. **Verify your remediation components are working** to block attackers
2. **Check that decisions are being applied**: `cscli decisions list`
3. **Consider increasing timeout durations** in profiles if attackers are returning
4. **Subscribe to Community Blocklist** for proactive blocking of known malicious IPs
5. **Monitor your infrastructure** for the attack's impact

### Custom scenario missing blackhole param

#### 🔎 Check scenario bucket configuration

If you have custom scenarios, verify they have proper bucket lifecycle settings (blackhole parameter) to prevent unlimited bucket accumulation:

```bash
# Check custom scenarios
sudo cscli scenarios list | grep -i local

# Inspect scenario configuration
sudo cat /etc/crowdsec/scenarios/my-custom-scenario.yaml
```

Look for the `blackhole` parameter in the scenario configuration. This parameter sets how long a bucket should live after not receiving events.

#### 🛠️ Add blackhole parameter to your custom scenarios

If your custom scenario is missing the `blackhole` parameter, add it to prevent unlimited bucket accumulation:

```yaml
type: leaky
name: my-org/my-custom-scenario
description: "Custom scenario description"
filter: "evt.Meta.service == 'my-service'"
leakspeed: "10s"
capacity: 5
blackhole: 5m  # Add this: buckets expire 5 minutes after last event
labels:
  remediation: true
```

The `blackhole` parameter defines how long a bucket persists after no longer receiving events. Without it, buckets can accumulate indefinitely, consuming memory and generating excessive alerts.

## Verify Resolution

After making changes:

1. Restart or reload CrowdSec: `sudo systemctl restart crowdsec`
2. Monitor alert generation for 30 minutes:
   ```bash
   watch -n 30 'cscli alerts list | head -20'
   ```
3. Check metrics: `sudo cscli metrics show scenarios`
4. Verify alert volume has returned to normal levels

## Performance Impact

Excessive alerts can impact performance:

- **High memory usage**: Each active scenario bucket consumes memory
- **Database growth**: Large numbers of alerts increase database size
- **API latency**: Bouncers may experience slower decision pulls

If performance is degraded, consider:
- Cleaning old alerts: `cscli alerts delete --all` (after investigation)
- Reviewing database maintenance: [Database documentation](/docs/local_api/database)

## Related Issues

- [Security Engine Troubleshooting](/u/troubleshooting/security_engine) - General Security Engine issues
- [Log Processor No Logs Parsed](/u/troubleshooting/issue_lp_no_logs_parsed) - If parsing is creating unusual events

## Getting Help

If you need assistance analyzing alert patterns:

- Share anonymized alert samples on [Discourse](https://discourse.crowdsec.net/)
- Ask on [Discord](https://discord.gg/crowdsec) with your `cscli metrics show scenarios` output
