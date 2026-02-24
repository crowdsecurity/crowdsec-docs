---
title: Security Engine No Alerts
id: issue_se_no_alerts
---

The **Engine No Alerts** issue appears when your Security Engine has been running but hasn't forwarded any alerts to the Central API in the last **48 hours**.

## What Triggers This Issue

- **Trigger condition**: No alerts generated for 48 hours
- **Criticality**: ⚠️ High
- **Impact**: Your detection system may not be working as expected

## Common Root Causes

- [**Appropriate collections not installed**](#appropriate-collections-not-installed): Make sure you have detection scenarios and/or AppSec rules that cover your services
- [**Events massively whitelisted**](#events-massively-whitelisted): Due to misconfiguration, proxying issues, or faulty custom whitelisting
- [**Scenarios in simulation mode**](#scenarios-in-simulation-mode): Detection scenarios are installed but set to simulation mode, preventing actual alerts.
- [**Legitimate low-activity environment**](#legitimate-low-activity-environment): Your proactive defenses might be good enough that you don't detect additional malicious behaviors (CrowdSec blocklists or other protections may already deflect all malicious activity)

#### **Other Issues**
- 🔗 **[No logs being read](/u/troubleshooting/issue_lp_no_logs_read)**: The acquisition configuration may be missing, disabled, or pointing to empty log sources.
- 🔗 **[No logs being parsed](/u/troubleshooting/issue_lp_no_logs_parsed)**: Logs are being read but parsers can't process them due to format mismatches or missing collections.

## Diagnosis & Resolution

If it is not due to [other issues](#other-issues), use the diagnosis and resolutions below.

### Appropriate collections not installed

#### 🔎 Check installed collections match your services

Verify you have collections matching your protected services:

```bash
sudo cscli collections list
```
<details>
   <summary>Run this command for Docker or Kubernetes</summary>

```bash
docker exec crowdsec cscli collections list
```

```bash
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli collections list
```

</details>

Compare your installed collections against your actual services (nginx, apache, ssh, etc.). Missing collections means no detection rules for those services.

You can try to run a test on your logs to spot issues. See the [cscli explain documentation](/cscli/cscli_explain/)

#### 🛠️ Install required collections for your services

Visit the [CrowdSec Hub](https://hub.crowdsec.net/) to find collections for your stack by browsing or searching. A collection bundles parsers and scenarios for a given service. For example, the NGINX collection includes NGINX parsers and scenarios for common HTTP attacks.

Collections are packaged for various type of services:

- **Web servers**: `crowdsecurity/nginx`, `crowdsecurity/apache2`, `crowdsecurity/caddy`
- **SSH**: `crowdsecurity/sshd`
- **Linux base**: `crowdsecurity/linux`
- **AppSec/WAF**: `crowdsecurity/appsec-*` collections for application-level protection

Install collections using:

```bash
sudo cscli collections install crowdsecurity/nginx
```
```bash
sudo systemctl reload crowdsec
```

<details>
   <summary>Run this command for Docker or Kubernetes</summary>

**Docker**
```bash
docker exec crowdsec cscli collections install crowdsecurity/nginx
```

```bash
docker restart crowdsec
```

**Kubernetes**
```bash
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli collections install crowdsecurity/nginx
```

```bash
kubectl rollout restart deployment/crowdsec -n crowdsec
```

</details>

### Events massively whitelisted

Misconfigured whitelists can cause alerts to be ignored.

#### 🔎 Check whitelisting metrics

Check whether many (or all) lines are being whitelisted.

```bash
sudo cscli metrics show acquisition
```
<details>
   <summary>Run this command for Docker or Kubernetes</summary>

**Docker**
```bash
docker exec crowdsec cscli metrics show scenarios
```

**Kubernetes**
```bash
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli metrics show scenarios
```

</details>

**Look at the Lines whitelisted column**

```
╭────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ Acquisition Metrics                                                                                │
├───────────────────────┬──────────────┬────────────────┬────────────────────────┬───────────────────┤
│ Source   │ Lines read │ Lines parsed │ Lines unparsed │ Lines poured to bucket │ Lines whitelisted │
├──────────┼────────────┼──────────────┼────────────────┼────────────────────────┼───────────────────┤
│ file:... │ 743        │ 635          │ 108            │ -                      │ 185               │
╰──────────┴────────────┴──────────────┴────────────────┴────────────────────────┴───────────────────╯
```

#### 🛠️ Make sure the IP in your logs are public IPs

Due to misconfiguration or log source choice, source IPs can be private/internal addresses instead of **X-Forwarded-For** client IPs.

Look at your log files and make sure any proxy in front of your service provides X-Forwarded-For source IPs.

#### 🛠️ Review and adjust your custom whitelist configuration

If you create custom whitelist configuration via `s02-enrich`, make sure it does not discard legitimate alerts.  
Check our [whitelisting documentation](/u/getting_started/post_installation/whitelists/).

### Scenarios in simulation mode

#### 🔎 Check if scenarios are in simulation mode

Verify whether your scenarios are set to simulation mode:

```bash
sudo cscli simulation status
```
<details>
   <summary>Run this command for Docker or Kubernetes</summary>

**Docker**
```bash
docker exec crowdsec cscli simulation status
```

**Kubernetes**
```bash
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli simulation status
```

</details>

If scenarios are listed, they are in simulation mode and are not sent to CrowdSec Console (they should still appear in `cscli alerts list`).

#### 🛠️ Disable simulation mode to generate alerts

Disable simulation mode to allow alerts to be generated:

```bash
sudo cscli simulation disable --all
sudo systemctl reload crowdsec
```
<details>
   <summary>Run this command for Docker or Kubernetes</summary>

**Docker**
```bash
docker exec crowdsec cscli simulation disable --all
```

```bash
docker restart crowdsec
```

**Kubernetes**
```bash
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli simulation disable --all
```

```bash
kubectl rollout restart deployment/crowdsec -n crowdsec
```

</details>

You can also disable simulation for specific scenarios only:

```bash
sudo cscli simulation disable crowdsecurity/ssh-bf
```
```bash
sudo systemctl reload crowdsec
```

### Legitimate low-activity environment

If you have protection measures in front of your services, they may already block unwanted traffic.  
Given background internet noise, publicly exposed services usually still receive reconnaissance traffic, but CrowdSec blocklists may already block most malicious traffic.  
Let’s check.

#### 🔎 Check traffic volume being processed

Check how much traffic your service is processing:

```bash
sudo cscli metrics show acquisition parsers
```

<details>
   <summary>Run this command for Docker or Kubernetes</summary>

**Docker**
```bash
docker exec crowdsec cscli metrics show acquisition parsers
```

**Kubernetes**
```bash
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli metrics show acquisition parsers
```

</details>

Look at "Lines parsed" - if this number is very low (dozens or hundreds per day), you may simply have insufficient traffic volume for malicious activity to appear.

#### 🔎 Check if blocklists are blocking threats upstream

Check whether proactive defenses are blocking threats upstream. You can do this with `cscli` or [Console remediation metrics](/u/console/remediation_metrics) if you have a compatible bouncer.

```bash
sudo cscli decisions list
```
```bash
sudo cscli metrics show bouncers
```

<details>
   <summary>Run this command for Docker or Kubernetes</summary>

**Docker**
```bash
docker exec crowdsec cscli decisions list
```

```bash
docker exec crowdsec cscli metrics show bouncers
```

**Kubernetes**
```bash
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli decisions list
```

```bash
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli metrics show bouncers
```

</details>

High numbers of active decisions or bouncer blocks may indicate proactive defenses are already blocking malicious actors. Still verify that no other issue exists.

## Related Issues

- [Log Processor No Logs Read](/u/troubleshooting/issue_lp_no_logs_read) - If acquisition is not working
- [Log Processor No Logs Parsed](/u/troubleshooting/issue_lp_no_logs_parsed) - If parsing is failing
- [Security Engine Troubleshooting](/u/troubleshooting/security_engine) - General Security Engine issues

## Getting Help

If you've verified logs are being read and parsed correctly but still see no alerts:

- Check [Discourse](https://discourse.crowdsec.net/) for similar cases
- Ask on [Discord](https://discord.gg/crowdsec) with your `cscli metrics` output
