---
title: Console Health Check Issues
id: console_issues
---

The CrowdSec Console monitors the health of your CrowdSec stack *(Security Engines, Log Processors, remediation components and blocklist integrations)* and raises alerts when issues are detected.  
This page lists all possible health check issues, their trigger conditions, and links to detailed troubleshooting guides.

## Understanding Issue Criticality

- 🔥 **Critical**: Immediate attention required - core functionality is impaired
- ⚠️ **High**: Important issue that should be addressed soon - may impact protection effectiveness
- 💡 **Recommended**: Additionnal actions that will continue improving your security posture *(comming in next iterations of Stack Health)*
- 🌟 **Bonus** : Optimization advises and upper tier recommendation with great return on value *(comming in next iterations of Stack Health)*

## Health Check Issues Overview

| Issue | Criticality   | Summary | Resolution |
|-------|---------------|---------|------------|
| **Integration for Firewall Offline** | 🔥 Critical | Firewall has not pulled from BLaaS endpoint for 24+ hours | [Troubleshooting](/u/troubleshooting/issue_integration_fw_offline) |
| **Integration for Firewall Pulling Zero IPs** | ⚠️ High | Firewall BLaaS integration is content is empty | [Troubleshooting](/u/troubleshooting/issue_integration_fw_zero_ips) |
| **Integration for RC Offline** | 🔥 Critical | Remediation Component has not pulled from endpoint for 24+ hours | [Troubleshooting](/u/troubleshooting/issue_integration_rc_offline) |
| **Log Processor No Alerts** | ⚠️ High | Log Processor has not generated alerts in 48 hours | [Troubleshooting](/u/troubleshooting/issue_lp_no_alerts) |
| **Log Processor No Logs Parsed** | 🔥 Critical | Logs read but none parsed in the last 48 hours | [Troubleshooting](/u/troubleshooting/issue_lp_no_logs_parsed) |
| **Log Processor No Logs Read** | 🔥 Critical | No logs acquired in the last 24 hours | [Troubleshooting](/u/troubleshooting/issue_lp_no_logs_read) |
| **Log Processor Offline** | 🔥 Critical | Log Processor has not checked in with LAPI for 24+ hours | [Troubleshooting](/u/troubleshooting/issue_lp_offline) |
| **Security Engine No Alerts** | ⚠️ High | No alerts generated in the last 48 hours | [Troubleshooting](/u/troubleshooting/issue_se_no_alerts) |
| **Security Engine No RC** | 💡 Reco. | Security Engine has no Remediation Component registered | [Troubleshooting](/u/troubleshooting/issue_se_no_rc) |
| **Security Engine No Active RC** | 🔥 Critical | All registered Remediation Components have been inactive for 24+ hours | [Troubleshooting](/u/troubleshooting/issue_se_no_active_rc) |
| **Security Engine Offline** | 🔥 Critical | Security Engine has not reported to Console for 24+ hours | [Troubleshooting](/u/troubleshooting/issue_se_offline) |
| **Security Engine Too Many Alerts** | ⚠️ High | More than 250,000 alerts in 6 hours | [Troubleshooting](/u/troubleshooting/issue_se_too_many_alerts) |

## Issue Dependencies

Some issues are related and share common root causes:

- **Engine No Alerts** may be caused by:
  - LP No Logs Read
  - LP No Logs Parsed
  - Scenarios not installed or in simulation mode

- **LP No Alerts** may be caused by:
  - LP No Logs Read
  - LP No Logs Parsed
  - Scenarios not matching the parsed events

Understanding these dependencies helps you troubleshoot more efficiently by addressing root causes first.

## Future Enhancements

For planned and experimental health checks, see [Future Console Health Check Issues](/u/troubleshooting/future_console_issues) page for planned features including:

- Enhanced configuration validation
- Blocklists optimization recommendations
- Collection update notifications
- False positive prevention checks
- Premium feature recommendation based on detected benefit

## Getting Help

If you've followed the troubleshooting guides and still need assistance:

- [Discourse](https://discourse.crowdsec.net/)
- [Discord](https://discord.gg/crowdsec)
- [GitHub Issues](https://github.com/crowdsecurity/crowdsec/issues)