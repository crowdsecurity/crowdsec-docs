---
title: Engine No Alerts
id: issue_engine_no_alerts
---

The **Engine No Alerts** issue appears when your Security Engine has been running but hasn't generated any alerts in the last **48 hours**.

## What Triggers This Issue

- **Trigger condition**: No alerts generated for 48 hours
- **Criticality**: ⚠️ High
- **Impact**: Your detection system may not be working as expected

## Common Root Causes

- **Scenarios in simulation mode**: Detection scenarios are installed but set to simulation mode, preventing actual alerts.
- **Are appropriate collections installed**: make sure you have the detection scenarios and/or appsec rules covering your services needs
- **Low/no-traffic environment**: If your service handles very few request or is not open to the internet it's usually to observe low/no malicious activity.
- **Legitimate low-activity environment**: Your defenses preceding your service might be good enough that you don't detect additional malicious behaviors (CrowdSec blocklists or other protections may already deflect most malicious activity)

<a name="otherIssues"></a>  

**Other Issues**
- 🔗 **[No logs being read](/u/troubleshooting/issue_lp_no_logs_read)**: The acquisition configuration may be missing, disabled, or pointing to empty log sources. 
- 🔗 **[No logs being parsed](/u/troubleshooting/issue_lp_no_logs_parsed)**: Logs are being read but parsers can't process them due to format mismatches or missing collections.

## How to Diagnose

If it's not due to [other issues](#otherIssues), here are the diagnosis and resolutions for other root causes.

### Check if scenarios are in simulation mode

Verify whether your scenarios are set to simulation mode, which prevents them from generating alerts:

```bash
# On host
sudo cscli simulation status

# Docker
docker exec crowdsec cscli simulation status

# Kubernetes
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli simulation status
```

If scenarios are listed, they're in simulation mode and won't be sent to CrowdSec console (they should however still appear in `cscli alerts list`).

### Check if appropriate collections are installed

Verify you have collections matching your protected services:

```bash
# On host
sudo cscli collections list

# Docker
docker exec crowdsec cscli collections list

# Kubernetes
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli collections list
```

Compare your installed collections against your actual services (nginx, apache, ssh, etc.). Missing collections means no detection rules for those services.

### Evaluate your service activity level

Check how much traffic your service is processing:

```bash
# On host
sudo cscli metrics show acquisition parsers

# Docker
docker exec crowdsec cscli metrics show acquisition parsers

# Kubernetes
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli metrics show acquisition parsers
```

Look at "Lines parsed" - if this number is very low (dozens or hundreds per day), you may simply have insufficient traffic volume for malicious activity to appear.

### Check if proactive defenses are blocking threats upstream

If you have CrowdSec blocklists or other protection layers active, they may be blocking malicious traffic before it reaches your scenarios:

```bash
# On host
sudo cscli decisions list
sudo cscli metrics show bouncers

# Docker
docker exec crowdsec cscli decisions list
docker exec crowdsec cscli metrics show bouncers

# Kubernetes
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli decisions list
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli metrics show bouncers
```

High numbers of active decisions or bouncer blocks indicate your proactive defenses are working - malicious actors never reach your log-based detection.

## How to Resolve

### If scenarios are in simulation mode

Disable simulation mode to allow alerts to be generated:

```bash
# On host
sudo cscli simulation disable --all
sudo systemctl reload crowdsec

# Docker
docker exec crowdsec cscli simulation disable --all
docker restart crowdsec

# Kubernetes
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli simulation disable --all
kubectl rollout restart deployment/crowdsec -n crowdsec
```

You can also disable simulation for specific scenarios only:

```bash
sudo cscli simulation disable crowdsecurity/ssh-bf
sudo systemctl reload crowdsec
```

### If appropriate collections are missing

Install collections matching your protected services. Visit the [CrowdSec Hub](https://hub.crowdsec.net/) to find collections for your stack:

- **Web servers**: `crowdsecurity/nginx`, `crowdsecurity/apache2`, `crowdsecurity/caddy`
- **SSH**: `crowdsecurity/sshd`
- **Linux base**: `crowdsecurity/linux`
- **AppSec/WAF**: `crowdsecurity/appsec-*` collections for application-level protection

Install collections using:

```bash
# On host
sudo cscli collections install crowdsecurity/nginx
sudo systemctl reload crowdsec

# Docker
docker exec crowdsec cscli collections install crowdsecurity/nginx
docker restart crowdsec

# Kubernetes
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli collections install crowdsecurity/nginx
kubectl rollout restart deployment/crowdsec -n crowdsec
```

### If this is a low-traffic environment

For services with minimal traffic or limited internet exposure:

1. **Verify detection is working** by triggering test scenarios as described in the [Health Check guide](/u/getting_started/health_check/#trigger-crowdsecs-test-scenarios)
2. **Consider this normal** - If your detection is properly working, low traffic may means fewer threats to detect and you can ignore the issue for now.

### If proactive defenses are already handling threats

This is actually a **positive outcome** - your blocklists and bouncers are preventing malicious traffic from reaching your services:

1. **Verify your setup is working** by running the [Health Check detection tests](/u/getting_started/health_check#-detection-checks) to confirm scenarios can still trigger when needed
2. **Monitor bouncer metrics** to see how many threats are being blocked: `sudo cscli metrics show bouncers`
3. **Review active decisions** to understand what threats are being prevented: `sudo cscli decisions list`
4. **Keep the Console enrolled** to maintain visibility into your protection posture even if local alerts are minimal

## Related Issues

- [LP No Logs Read](/u/troubleshooting/issue_lp_no_logs_read) - If acquisition is not working
- [LP No Logs Parsed](/u/troubleshooting/issue_lp_no_logs_parsed) - If parsing is failing
- [Security Engine Troubleshooting](/u/troubleshooting/security_engine) - General Security Engine issues

## Getting Help

If you've verified logs are being read and parsed correctly but still see no alerts:

- Check [Discourse](https://discourse.crowdsec.net/) for similar cases
- Ask on [Discord](https://discord.gg/crowdsec) with your `cscli metrics` output