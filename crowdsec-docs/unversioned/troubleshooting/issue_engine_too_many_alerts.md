---
title: Engine Too Many Alerts
id: issue_engine_too_many_alerts
---

The **Engine Too Many Alerts** issue appears when your Security Engine generates an abnormally high volume of alerts—more than 250,000 in a 6-hour period. This usually indicates a misconfigured scenario, false positives, or an ongoing large-scale attack.

## What Triggers This Issue

- **Trigger condition**: More than 250,000 alerts in 6 hours
- **Criticality**: High
- **Impact**: May indicate false positives, performance issues, or a real attack

## Common Root Causes

- **Misconfigured or overly sensitive scenario**: A scenario with thresholds set too low or matching too broadly can trigger excessive alerts.
- **Log duplication**: The same log file is being read multiple times due to acquisition misconfiguration.
- **Actual large-scale attack**: A genuine distributed attack (DDoS, brute force campaign) targeting your infrastructure.
- **Parser creating duplicate events**: A parser issue causing the same log line to generate multiple events.

## How to Diagnose

### Check alert volume by scenario

Identify which scenarios are generating the most alerts:

```bash
# On host
sudo cscli alerts list -l 100

# Docker
docker exec crowdsec cscli alerts list -l 100

# Kubernetes
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli alerts list -l 100
```

Look for patterns:
- Is one scenario dominating the alert count?
- Are the same IPs repeatedly triggering alerts?
- Are alerts legitimate threats or false positives?

### Check metrics for scenario overflow

```bash
# On host
sudo cscli metrics show scenarios

# Docker
docker exec crowdsec cscli metrics show scenarios

# Kubernetes
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli metrics show scenarios
```

Look for scenarios with extremely high "Overflow" counts or "Current count" numbers.

### Check for log duplication

Review acquisition configuration to ensure log files aren't listed multiple times:

```bash
# On host
sudo cat /etc/crowdsec/acquis.yaml
sudo ls -la /etc/crowdsec/acquis.d/

# Docker
docker exec crowdsec cat /etc/crowdsec/acquis.yaml

# Kubernetes
kubectl get configmap -n crowdsec crowdsec-config -o yaml | grep -A 20 acquis
```

Also check metrics for duplicate acquisition sources:

```bash
sudo cscli metrics show acquisition
```

## How to Resolve

### For misconfigured scenarios

#### Put the problematic scenario in simulation mode

This allows you to investigate without generating alerts:

```bash
# On host
sudo cscli simulation enable crowdsecurity/scenario-name

# Docker
docker exec crowdsec cscli simulation enable crowdsecurity/scenario-name

# Kubernetes
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli simulation enable crowdsecurity/scenario-name
```

Then reload:
```bash
sudo systemctl reload crowdsec
```

#### Tune the scenario threshold

If the scenario is triggering too easily, you can create a custom version with adjusted thresholds. See the [scenario documentation](/docs/scenarios/intro) for details on customizing scenarios.

#### Use whitelists

If specific IPs or patterns are causing false positives, create a whitelist. See [Parser Whitelists](/docs/log_processor/whitelist/intro) or [Profiles](/docs/local_api/profiles/intro).

### For log duplication

Remove duplicate entries from your acquisition configuration:

1. Edit acquisition files: `/etc/crowdsec/acquis.yaml` or files in `/etc/crowdsec/acquis.d/`
2. Ensure each log source appears only once
3. Restart CrowdSec: `sudo systemctl restart crowdsec`

### For legitimate large-scale attacks

If you're experiencing a real attack:

1. **Verify your remediation components are working** to block attackers
2. **Check that decisions are being applied**: `cscli decisions list`
3. **Consider increasing timeout durations** in profiles if attackers are returning
4. **Subscribe to Community Blocklist** for proactive blocking of known malicious IPs
5. **Monitor your infrastructure** for the attack's impact

### For parser issues

If a parser is creating duplicate events:

1. Use `cscli explain` to test parsing:
   ```bash
   sudo cscli explain --log "<sample log line>" --type <type>
   ```
2. Check if the log line generates multiple events incorrectly
3. Review parser configuration or report the issue to the [CrowdSec Hub](https://github.com/crowdsecurity/hub/issues)

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
- [LP No Logs Parsed](/u/troubleshooting/lp_no_logs_parsed) - If parsing is creating unusual events

## Getting Help

If you need assistance analyzing alert patterns:

- Share anonymized alert samples on [Discourse](https://discourse.crowdsec.net/)
- Ask on [Discord](https://discord.gg/crowdsec) with your `cscli metrics show scenarios` output
- Use the [CrowdSec Playground](https://playground.crowdsec.net/) to test scenario behavior
