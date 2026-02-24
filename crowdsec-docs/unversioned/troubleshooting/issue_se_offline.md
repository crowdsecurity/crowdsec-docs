---
title: Security Engine Offline
id: issue_se_offline
---

The **Security Engine Offline** issue indicates that an enrolled Security Engine has not reported to **CrowdSec Central API** for more than **48 hours**.  
This usually means the core `crowdsec` service has stopped working or communicating with our infrastructure.

## What Triggers This Issue

- **Trigger condition**: No contact with Console for 48 hours
- **Criticality**: 🔥 Critical
- **Impact**: Complete loss of visibility and protection coordination

## Common Root Causes

- [**Host or service down**](#host-or-service-down): The CrowdSec service has stopped or the host itself is unreachable.
- [**Console connectivity issues**](#console-connectivity-issues): Network, firewall, or proxy blocking HTTPS calls to Console endpoints, or TLS validation failures.

## Diagnosis & Resolution

### Host or service down

#### 🔎 Check if CrowdSec service is running

Check that the `crowdsec` service is running:

```bash
sudo systemctl status crowdsec
```
```bash
sudo journalctl -u crowdsec -n 50
```

<details>
   <summary>Run this command for Docker or Kubernetes</summary>

```bash
docker ps --filter name=crowdsec
kubectl get pods -n crowdsec
```

</details>

If the host itself is unreachable (hypervisor, VM, or cloud instance down), the Console cannot receive a heartbeat and marks the engine offline.

#### 🛠️ Restart the Security Engine service

Restart the Security Engine service:

```bash
sudo systemctl restart crowdsec
```

<details>
   <summary>For Docker or Kubernetes</summary>

**Docker:**
```bash
docker restart crowdsec
```

**Kubernetes:**
```bash
kubectl rollout restart deployment/crowdsec -n crowdsec
```

</details>

After restarting, re-run `sudo cscli console status` to ensure the heartbeat is restored.

### Console connectivity issues

#### 🔎 Check console status and logs for connectivity errors

`sudo cscli console status` may show errors such as `permission denied`, `unable to reach console`, or TLS failures. Inspect `/var/log/crowdsec/crowdsec.log` (or container stdout) for details.

Confirm that your Security Engine can communicate with CrowdSec Central API (CAPI):
```bash
sudo cscli capi status
```

Also check that the Security Engine Local API is running and healthy:
```bash
sudo cscli machines list
```
In a standalone install, you should see one machine. Check the `Last Update` time.

Ensure outbound access to the CrowdSec Console endpoints listed in [Network management](/docs/configuration/network_management). Firewalls or proxy changes often block the HTTPS calls required for heartbeats.

Verify system time is synced (via NTP). Large clock drifts can invalidate console tokens.

#### 🛠️ Restore connectivity to the Console

Restore connectivity to the Console:

1. Check that you can access crowdsec services and APIs listed in [network management](https://doc.crowdsec.net/docs/next/configuration/network_management/)

2. If a proxy is required, configure it in `/etc/crowdsec/config.yaml` under `common.http_proxies` and reload the service.

3. Renew TLS trust stores if the host cannot validate the Console certificate chain.

Test connectivity:
```bash
curl -I https://api.crowdsec.net/
```

For CAPI connectivity issues you can follow the [posts-install health check step for connectivity](/u/getting_started/health_check#-crowdsec-connectivity-checks).

In the rare case you saw **zero machines** in your machines list, try:
```bash
sudo cscli machine add --auto --force
```

## Verify Resolution

After making changes:

Restart or reload CrowdSec: `sudo systemctl restart crowdsec`

1. Check engine status:
   ```bash
   sudo cscli console status
   ```

2. Verify in the Console the security engine "last activity" date

Once the engine resumes contact, the Console clears the **Security Engine Offline** alert during the next poll.

💡 Consider enabling the **Security Engine Offline** [notification](/u/console/notification_integrations/overview) in your preferred integration so future outages are caught quickly.

## Related Issues

- [Log Processor Offline](/u/troubleshooting/issue_lp_offline) - If specific agents are offline
- [Security Engine Troubleshooting](/u/troubleshooting/security_engine) - General Security Engine issues

## Getting Help

If you still cannot restore Security Engine heartbeat to CrowdSec Console:

- Check [Discourse](https://discourse.crowdsec.net/) for similar cases
- Ask on [Discord](https://discord.gg/crowdsec) with your `sudo cscli support dump` output
