---
title: Log Processor Offline
id: issue_log_processor_offline
---

When the Console or a notification rule reports **Log Processor Offline**, the local agent has not checked in with the Local API (LAPI) for more than 24 hours. The alert is different from **Log Processor No Alert**, which only means logs were parsed but no scenarios fired. Use the sections below to identify why the heartbeat stopped and how to bring the agent back online.

## Common Root Causes & Diagnostics

### Service stopped or stuck

- Confirm the service state on the host:

```bash
sudo systemctl status crowdsec
sudo journalctl -u crowdsec -n 50
```

- For containerised deployments, verify the workload is still running:

```bash
docker ps --filter name=crowdsec
kubectl get pods -n crowdsec
```

- On the LAPI node, run `sudo cscli machines list` and check whether the `Last Update` column is older than 24 hours for the affected machine.

### Machine not validated or credentials revoked

- `sudo cscli machines list` on the LAPI shows the machine in `PENDING` state or missing entirely.
- On the agent host, ensure `/etc/crowdsec/local_api_credentials.yaml` exists and contains the expected login and password.
- If you recently reinstalled or renamed the machine, it must be re-validated. See [Machines management](/u/user_guides/machines_mgmt) for details.

### Local API unreachable

- From the agent, run:

```bash
sudo cscli lapi status
```

  Errors such as `401 Unauthorized`, TLS failures, or connection timeouts indicate an authentication or network issue.

- Verify the API endpoint declared in `/etc/crowdsec/config.yaml` (`api.client.credentials_path`, `url`, `ca_cert`, `insecure_skip_verify`) matches your LAPI setup. Refer to [Local API configuration](/docs/local_api/configuration) and [TLS authentication](/docs/local_api/tls_auth) if certificates changed.
- Confirm the network path between the agent and the LAPI host is open (default port `8080/TCP`). Firewalls or reverse proxies introduced after installation commonly block the heartbeat.

### Local API unavailable

- If several agents show as offline simultaneously, the LAPI service might be down. Check its status on the LAPI machine:

```bash
sudo systemctl status crowdsec
sudo journalctl -u crowdsec -n 50
```

- Inspect `/var/log/crowdsec/` (or container logs) for database or authentication errors that prevent the LAPI from responding.
- Use `sudo cscli metrics show engine` on the LAPI to confirm it is still ingesting events from other agents. See the [Health Check guide](/u/getting_started/health_check) for additional diagnostics.

## Recovery Actions

### Restart the Log Processor service

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

After the restart, re-run `sudo cscli machines list` on the LAPI to confirm the `Last Update` timestamp is refreshed.

### Validate or re-register the machine

#### Using credentials

:::info
More suitable for single machine setups.
:::

- To regenerate credentials directly on the LAPI host when the agent runs locally, run:

```bash
sudo cscli machines add -a
```

#### Using registration system

:::info
Registration system is more suitable for distributed setups.
:::



- Approve pending machines on the LAPI:

```bash
sudo cscli machines validate <machine_name>
```

- If credentials were removed or the agent was rebuilt, re-register it against the LAPI:

```bash
sudo cscli lapi register --url http://<lapi_host>:8080 --machine <machine_name>
sudo systemctl restart crowdsec
```

Update the `--url` to match your deployment. Auto-registration tokens are covered in [Machines management](/u/user_guides/machines_mgmt#machine-auto-validation).

### Restore connectivity to the Local API

- Open the required port on firewalls or security groups and verify with:

```bash
nc -zv <lapi_host> 8080
```

- If TLS certificates were renewed, update the agent trust store (`ca_cert`) or temporarily enable `insecure_skip_verify: true` for testing. Follow the hardening recommendations in [TLS authentication](/docs/local_api/tls_auth).
- When using proxies or load balancers, ensure they forward HTTP headers and TLS material expected by the LAPI.

### Stabilise the Local API

- Restart the LAPI service or pod if it was unresponsive:

```bash
sudo systemctl restart crowdsec
kubectl rollout restart deployment/crowdsec-lapi -n crowdsec
```

- Run `sudo cscli support dump` to collect diagnostics if the LAPI repeatedly crashes or loses database access. Review the resulting archive for database connectivity errors and consult the [Security Engine troubleshooting guide](/u/troubleshooting/security_engine) when escalation is required.

Once the heartbeat is restored, the Console alert clears automatically during the next polling cycle. Consider adding a [notification rule](/u/console/notification_integrations/rule) for **Log Processor Offline** so you are alerted promptly when it happens again.
