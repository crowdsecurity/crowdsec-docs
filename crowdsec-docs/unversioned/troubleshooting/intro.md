---
title: FAQ / Troubleshooting
id: intro
---

:::info
You may see the **IDPS/WAF of CrowdSec** referred to as **"Security Engine"** and **Bouncers** referred to as **"Remediation Components"** within new documentation.  
This is to better reflect the role of each component within the CrowdSec ecosystem.
:::

# Troubleshooting

We have extended our troubleshooting documentation to cover more common issues and questions.  
If you have suggestions, please open an [issue here](https://github.com/crowdsecurity/crowdsec-docs).  

Also, check our 🩺 [**Stack Health-Check page**](/u/getting_started/health_check) to verify that **Detection**, **Community Sharing**, and **Remediation** are working properly.

## Console Health Check Issues

If you received a health check alert from the CrowdSec Console, check out the [**Console Health Check Issues**](/u/troubleshooting/console_issues) page for a complete list of issues, their trigger conditions, and dedicated troubleshooting guides.

## Troubleshooting by Topic

* [Security Engine Troubleshooting](/u/troubleshooting/security_engine)
* [Remediation Components Troubleshooting](/u/troubleshooting/remediation_components)
* [CTI Troubleshooting](/u/troubleshooting/cti)

## Debug with an AI agent

The [CrowdSec skill](https://github.com/crowdsecurity/crowdsec-skill) lets Claude Code, Codex and Claude.ai work through these pages with you. It knows the `cscli` commands, the config layout and the usual failure modes — logs not parsed, no alerts firing, a bouncer that blocks nothing — on bare metal, Docker, pfSense/OPNsense and Kubernetes.

```bash
npx skills add crowdsecurity/crowdsec-skill
```

On Claude Code, run `/plugin marketplace add crowdsecurity/crowdsec-skill` then `/plugin install crowdsec@crowdsecurity` instead. The skill's [README](https://github.com/crowdsecurity/crowdsec-skill#install) covers the other agents.

## Community support

Please try to resolve your issue by reading the documentation. If you're unable to find a solution, don't hesitate to seek assistance in:

-   [Discourse](https://discourse.crowdsec.net/)
-   [Discord](https://discord.gg/crowdsec)

## Enterprise plan

If you are on an Enterprise plan, you can use dedicated support via the Console:

### Stack Health issues list

<snippet-extract data-extract-copy="console_issues:stackhealth_issues_list"></snippet-extract>
