---
title: Security Engine Offline
id: security_engine_offline
---

The **Security Engine Offline** alert appears in the Console and notification integrations when an enrolled engine has not reported or logged in to CrowdSec for more than 48 hours. This usually means the core `crowdsec` service (Log Processor + Local API) has stopped working or communicating with our infrastructure.

## Common Root Causes & Diagnostics

### Host or service down

- Check that the `crowdsec` service is running:

```bash
sudo systemctl status crowdsec
sudo journalctl -u crowdsec -n 50
```

- For container or Kubernetes deployments, confirm the workload is still healthy:

```bash
docker ps --filter name=crowdsec
kubectl get pods -n crowdsec
```

- If the host itself is unreachable (hypervisor, VM, or cloud instance down), the Console cannot receive a heartbeat and marks the engine offline.

### Enrollment revoked or pending

- On the engine, run `sudo cscli console status` to verify it is still enrolled and accepted.
- In the Console, visit **Security Engines** and confirm the engine is not archived or removed. Follow [Pending Security Engines](/u/console/security_engines/pending_security_engines) if it shows as waiting for approval.
- Review `/etc/crowdsec/console.yaml` for disabled options (`console_management`, `custom`, `tainted`, `context`) that may prevent expected data from being sent.

### Console connectivity issues

- `sudo cscli console status` may show errors such as `permission denied`, `unable to reach console`, or TLS failures. Inspect `/var/log/crowdsec/crowdsec.log` (or container stdout) for more details.
- Ensure outbound access to the CrowdSec Console endpoints listed in [Network management](/docs/configuration/network_management). Firewalls or proxy changes often block the HTTPS calls required for heartbeats.
- Verify system time is synced (via NTP). Large clock drifts can invalidate console tokens.

### Local API unavailable

- If the Local API is stopped, the Security Engine cannot gather or forward alerts. Check its status on the same host:

  ```bash
  sudo cscli machines list
  sudo cscli metrics show engine
  ```

- Errors in `/var/log/crowdsec/local_api.log` regarding database connectivity or TLS indicate the Local API is not processing alerts, which will in turn stop console updates. Refer to [Security Engine troubleshooting](/u/troubleshooting/security_engine) and [Log Processor Offline](/u/troubleshooting/log_processor_offline) if needed.

## Recovery Actions

### Restart the Security Engine service

- Systemd:

  ```bash
  sudo systemctl restart crowdsec
  ```

- Docker:

  ```bash
  docker restart crowdsec
  ```

- Kubernetes:

  ```bash
  kubectl rollout restart deployment/crowdsec -n crowdsec
  ```

After restarting, re-run `sudo cscli console status` to ensure the heartbeat is restored.

### Re-enroll the engine in the Console

- If the engine was removed or enrollment expired, obtain a fresh key from **Settings > Enrollment** in the Console and run:

  ```bash
  sudo cscli console enroll <ENROLLMENT_KEY>
  sudo systemctl restart crowdsec
  ```

- When replacing an existing enrollment, append `--overwrite` so the Console updates the existing record.
- Confirm the engine appears as **Healthy** in the Console after the restart.

### Restore connectivity to the Console

- Check that you can access crowdsec services and APIs listed in [network management](https://doc.crowdsec.net/docs/next/configuration/network_management/)
- If a proxy is required, configure it in `/etc/crowdsec/config.yaml` under `common.http_proxies` and reload the service.
- Renew TLS trust stores if the host cannot validate the Console certificate chain.

### Stabilise the Local API

- Restart the Local API component (same `crowdsec` service or the dedicated LAPI pod) and confirm it responds to local commands:

- Investigate persistent database or authentication errors using `sudo cscli support dump`, then consult the [Security Engine troubleshooting guide](/u/troubleshooting/security_engine) if issues remain.

Once the engine resumes contact, the Console clears the **Security Engine Offline** alert during the next poll. Consider enabling the **Security Engine Offline** notification in your preferred integration so future outages are caught quickly.
