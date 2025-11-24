---
title: Console Health Check Issues
id: console_issues
---

The CrowdSec Console monitors the health of your CrowdSec stack *(Security Engines, Log Processors, remediation components and blocklist integrations)* and raises alerts when issues are detected.  
This page lists all possible health check issues, their trigger conditions, and links to detailed troubleshooting guides.

## Understanding Issue Criticality

- 🔥 **Critical**: Immediate attention required - core functionality is impaired
- ⚠️ **High**: Important issue that should be addressed soon - may impact protection effectiveness
- 💡 **Recomended**: Additionnal actions that will continue improving your security posture *(comming in next iterations of Stack Health)*
- 🌟 **Bonus** : Optimization advises and upper tier recommendation with great return on value *(comming in next iterations of Stack Health)*

## Health Check Issues Overview

| Issue | Criticality | Summary | Resolution |
|-------|-------------|---------|------------|
| **Security Engine Offline** | 🔥 Critical | Security Engine has not reported to Console for 24+ hours | [Troubleshooting](/u/troubleshooting/issue_security_engine_offline) |
| **Engine No Alerts** | ⚠️ High | No alerts generated in the last 48 hours | [Troubleshooting](/u/troubleshooting/issue_engine_no_alerts) |
| **Engine Too Many Alerts** | ⚠️ High | More than 250,000 alerts in 6 hours | [Troubleshooting](/u/troubleshooting/issue_engine_too_many_alerts) |
| **Log Processor Offline** | 🔥 Critical | Log Processor has not checked in with LAPI for 24+ hours | [Troubleshooting](/u/troubleshooting/issue_log_processor_offline) |
| **LP No Alerts** | ⚠️ High | Log Processor has not generated alerts in 48 hours | [Troubleshooting](/u/troubleshooting/issue_lp_no_alerts) |
| **LP No Logs Read** | 🔥 Critical | No logs acquired in the last 24 hours | [Troubleshooting](/u/troubleshooting/issue_lp_no_logs_read) |
| **LP No Logs Parsed** | 🔥 Critical | Logs read but none parsed in the last 48 hours | [Troubleshooting](/u/troubleshooting/issue_lp_no_logs_parsed) |
| **Firewall Integration Offline** | 🔥 Critical | Firewall has not pulled from BLaaS endpoint for 24+ hours | [Troubleshooting](/u/troubleshooting/issue_fw_integration_offline) |
| **RC Integration Offline** | 🔥 Critical | Remediation Component has not pulled from endpoint for 24+ hours | [Troubleshooting](/u/troubleshooting/issue_rc_integration_offline) |

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