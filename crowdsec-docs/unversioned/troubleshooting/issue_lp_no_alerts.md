---
title: LP No Alerts
id: issue_lp_no_alerts
---

The **LP No Alerts** issue appears when a specific Log Processor (agent) is running and communicating with the Local API but hasn't generated any alerts in the last 48 hours. This is similar to [Engine No Alerts](/u/troubleshooting/issue_se_no_alerts) but applies to individual Log Processor instances in distributed setups.

## What Triggers This Issue

- **Trigger condition**: Log Processor online but no alerts for 48 hours
- **Criticality**: High
- **Impact**: Detection may not be working on this specific agent

## Common Root Causes

- **Scenarios in simulation mode**: Detection scenarios are installed but running in simulation mode on this agent.
- **Low-activity monitored service**: The service monitored by this Log Processor may genuinely have no malicious activity.

#### Other Issues
- 🔗 **[No logs being read](/u/troubleshooting/issue_lp_no_logs_read)**: The acquisition configuration on this specific Log Processor may be missing, disabled, or pointing to empty sources.
- 🔗 **[No logs being parsed](/u/troubleshooting/issue_lp_no_logs_parsed)**: Logs are being read but parsers can't process them due to format mismatches or missing collections.

## How to Diagnose

If it's not due to [other issues](#other-issues), here are the diagnosis and resolutions for other root causes.

### Identify the affected Log Processor

Check which machine is not generating alerts:

```bash
# On LAPI host
sudo cscli machines list
```

Look for the Last Update timestamp and verify which machine corresponds to the alert.

### Check metrics on the affected agent

Connect to the specific Log Processor host and check its metrics:

```bash
# On the Log Processor host
sudo cscli metrics show acquisition parsers scenarios

# Docker
docker exec crowdsec-agent cscli metrics show acquisition parsers scenarios

# Kubernetes - for specific agent pod
kubectl exec -n crowdsec -it <agent-pod-name> -- cscli metrics show acquisition parsers scenarios
```

Look for:
- **Acquisition Metrics**: Are log lines being read? (non-zero "Lines read")
- **Parser Metrics**: Are logs being parsed? (non-zero "Lines parsed")
- **Scenario Metrics**: Are scenarios evaluating events?

### Check recent alerts from this agent

```bash
# On the Log Processor host
sudo cscli alerts list

# Or filter by origin on LAPI
sudo cscli alerts list --origin <machine-name>
```

## How to Resolve

### If no logs are being read

Follow the [LP No Logs Read troubleshooting guide](/u/troubleshooting/issue_lp_no_logs_read) for detailed steps.

**Quick checks on the affected agent:**

```bash
# Verify acquisition configuration
sudo cat /etc/crowdsec/acquis.yaml
sudo ls -la /etc/crowdsec/acquis.d/

# Check log file existence and permissions
ls -la /var/log/nginx/  # or your specific log path

# Verify CrowdSec can access logs
sudo -u crowdsec cat /var/log/nginx/access.log | head -5
```

### If logs are read but not parsed

Follow the [LP No Logs Parsed troubleshooting guide](/u/troubleshooting/issue_lp_no_logs_parsed) for detailed steps.

**Quick checks on the affected agent:**

```bash
# Check installed collections
sudo cscli collections list

# Test parsing with a sample log line
sudo cscli explain --log "<sample log line>" --type <type>

# Example for nginx
sudo cscli explain --log '192.168.1.1 - - [01/Jan/2024:12:00:00 +0000] "GET / HTTP/1.1" 200 1234' --type nginx
```

### If scenarios are in simulation mode

Check and disable simulation mode on the affected agent:

```bash
# Check simulation status
sudo cscli simulation status

# Disable for all scenarios
sudo cscli simulation disable --all
sudo systemctl reload crowdsec

# Or for specific scenarios
sudo cscli simulation disable crowdsecurity/ssh-bf
sudo systemctl reload crowdsec
```

### If this is a low-activity service

For legitimately clean services:

1. **Test with dummy scenarios** using the [Health Check guide](/u/getting_started/health_check) to verify the detection pipeline works
2. **Verify the agent is processing logs** with `cscli metrics show acquisition`
3. **Accept the low alert rate** if the service truly has no malicious traffic

## Verify Resolution

After making changes on the affected Log Processor:

1. Restart the agent: `sudo systemctl restart crowdsec`
2. Wait a few minutes for processing
3. Check metrics: `sudo cscli metrics show scenarios`
4. Trigger a test alert: [Health Check detection tests](/u/getting_started/health_check#-detection-checks)
5. Verify alert appears: `sudo cscli alerts list`

## Distributed Setup Considerations

In multi-agent deployments:

- **Each agent processes its own logs independently**
- **Agents forward alerts to the Local API**
- **One agent having no alerts doesn't affect others**

If multiple agents show no alerts, review:
- Common configuration issues (e.g., centralized config management problems)
- Network connectivity between agents and LAPI
- Synchronized collection installations across all agents

## Related Issues

- [Engine No Alerts](/u/troubleshooting/issue_se_no_alerts) - Similar issue at the Security Engine level
- [LP No Logs Read](/u/troubleshooting/issue_lp_no_logs_read) - If acquisition is not working
- [LP No Logs Parsed](/u/troubleshooting/issue_lp_no_logs_parsed) - If parsing is failing
- [Log Processor Offline](/u/troubleshooting/issue_lp_offline) - If the agent is not communicating at all

## Getting Help

If you've verified logs are being read and parsed but still see no alerts:

- Share your setup details on [Discourse](https://discourse.crowdsec.net/)
- Ask on [Discord](https://discord.gg/crowdsec) with `cscli metrics` output
