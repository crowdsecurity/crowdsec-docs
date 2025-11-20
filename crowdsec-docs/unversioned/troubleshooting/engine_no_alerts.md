---
title: Engine No Alerts
id: engine_no_alerts
---

The **Engine No Alerts** issue appears when your Security Engine has been running but hasn't generated any alerts in the last **48 hours**. This usually indicates that logs aren't being processed properly or scenarios aren't matching any threats.

## What Triggers This Issue

- **Trigger condition**: No alerts generated for 48 hours
- **Criticality**: ⚠️ High
- **Impact**: Your detection system may not be working as expected

## Common Root Causes

### No logs being read
The acquisition configuration may be missing, disabled, or pointing to empty log sources.

### No logs being parsed
Logs are being read but parsers can't process them due to format mismatches or missing collections.

### Scenarios in simulation mode
Detection scenarios are installed but set to simulation mode, preventing actual alerts.

### Legitimate low-activity environment
In some cases, truly clean environments with no malicious activity may not trigger alerts.

## How to Diagnose

### Check metrics to identify the issue

Run the metrics command to see the full pipeline:

```bash
# On host
sudo cscli metrics show acquisition parsers scenarios

# Docker
docker exec crowdsec cscli metrics show acquisition parsers scenarios

# Kubernetes
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli metrics show acquisition parsers scenarios
```

Look for:
- **Acquisition Metrics**: Are log lines being read? (non-zero "Lines read")
- **Parser Metrics**: Are logs being parsed successfully? (non-zero "Lines parsed")
- **Scenario Metrics**: Are scenarios evaluating events? (check "Current count" or "Overflow")

### Check recent alerts

```bash
# On host
sudo cscli alerts list

# Docker
docker exec crowdsec cscli alerts list

# Kubernetes
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli alerts list
```

If the list is empty, proceed with the resolution steps below.

## How to Resolve

### If no logs are being read

This is the most common cause. Follow the [LP No Logs Read troubleshooting guide](/u/troubleshooting/lp_no_logs_read) for detailed steps.

**Quick checks:**
- Verify acquisition configuration exists (`/etc/crowdsec/acquis.yaml` or `acquis.d/`)
- Ensure log files exist and are accessible
- Check file permissions allow CrowdSec to read logs

### If logs are read but not parsed

Follow the [LP No Logs Parsed troubleshooting guide](/u/troubleshooting/lp_no_logs_parsed) for detailed steps.

**Quick checks:**
- Verify collections are installed: `cscli collections list`
- Check log format matches parser expectations
- Use `cscli explain --log "<sample log line>" --type <type>` to test parsing

### If scenarios are in simulation mode

Check if scenarios are in simulation:

```bash
sudo cscli simulation status
```

If scenarios are in simulation mode, they will be listed. To disable simulation for all scenarios:

```bash
sudo cscli simulation disable --all
sudo systemctl reload crowdsec
```

Or for specific scenarios:

```bash
sudo cscli simulation disable crowdsecurity/ssh-bf
sudo systemctl reload crowdsec
```

### If this is a low-activity environment

In genuinely clean environments, you can:

1. **Test with dummy scenarios** using the [Health Check guide](/u/getting_started/health_check) to verify detection works
2. **Subscribe to Community Blocklist** decisions in the Console to add proactive blocking
3. **Monitor metrics regularly** to ensure the pipeline stays healthy

## Verify Resolution

After making changes:

1. Restart CrowdSec: `sudo systemctl restart crowdsec`
2. Wait a few minutes for log processing
3. Check metrics again: `sudo cscli metrics show scenarios`
4. Trigger a test alert using the [Health Check detection tests](/u/getting_started/health_check#-detection-checks)

## Related Issues

- [LP No Logs Read](/u/troubleshooting/lp_no_logs_read) - If acquisition is not working
- [LP No Logs Parsed](/u/troubleshooting/lp_no_logs_parsed) - If parsing is failing
- [Security Engine Troubleshooting](/u/troubleshooting/security_engine) - General Security Engine issues

## Getting Help

If you've verified logs are being read and parsed correctly but still see no alerts:

- Check [Discourse](https://discourse.crowdsec.net/) for similar cases
- Ask on [Discord](https://discord.gg/crowdsec) with your `cscli metrics` output
- Review your scenarios and log samples using [CrowdSec Playground](https://playground.crowdsec.net/)