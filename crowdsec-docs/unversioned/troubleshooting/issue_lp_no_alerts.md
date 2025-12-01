---
title: Log Processor No Alerts
id: issue_lp_no_alerts
---

The **Log Processor No Alerts** issue appears when a specific Log Processor is running and communicating with the Local API but hasn't generated any alerts in the last 48 hours.   

This is similar to [Security Engine No Alerts](/u/troubleshooting/issue_se_no_alerts) but applies to individual Log Processor instances in distributed setups.

## What Triggers This Issue

- **Trigger condition**: Log Processor online but no alerts for 48 hours
- **Criticality**: ⚠️ High
- **Impact**: Detection may not be working on this specific agent

## Common Root Causes

- **Scenarios in simulation mode**: Detection scenarios are installed but running in simulation mode on this agent.
- **Low-activity monitored service**: The service monitored by this Log Processor may genuinely have no malicious activity.

## Other Issues

- 🔗 **[No logs being read](/u/troubleshooting/issue_lp_no_logs_read)**: The acquisition configuration on this specific Log Processor may be missing, disabled, or pointing to empty sources.
- 🔗 **[No logs being parsed](/u/troubleshooting/issue_lp_no_logs_parsed)**: Logs are being read but parsers can't process them due to format mismatches or missing collections.

If it's not due to other issues above, continue with the diagnosis and resolutions below.

## Diagnosis & Resolution

Refer to the [Security Engine No Alerts](/u/troubleshooting/issue_se_no_alerts#diagnosis--resolution) section.

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
- [Log Processor No Logs Read](/u/troubleshooting/issue_lp_no_logs_read) - If acquisition is not working
- [Log Processor No Logs Parsed](/u/troubleshooting/issue_lp_no_logs_parsed) - If parsing is failing
- [Log Processor Offline](/u/troubleshooting/issue_lp_offline) - If the agent is not communicating at all

## Getting Help

If you've verified logs are being read and parsed but still see no alerts:

- Share your setup details on [Discourse](https://discourse.crowdsec.net/)
- Ask on [Discord](https://discord.gg/crowdsec) with `cscli metrics` output
