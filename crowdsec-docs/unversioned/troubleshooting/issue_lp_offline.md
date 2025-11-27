---
title: Log Processor Offline
id: issue_lp_offline
---

When a Log Processor (Security Engine used to read log in a distributed setup) has not checked in with the Local API (LAPI) of the central Security Engine for more than 24 hours.

## What Triggers This Issue

- **Trigger condition**: Log Processor has not checked in with Local API for more than 24 hours
- **Criticality**: 🔥 Critical
- **Impact**: Services supposed to be watched by this LP are not anymore - potential threats undetected

## Common Root Causes

- **Service stopped or stuck**: The crowdsec service of this LP has crashed, hung, or was manually stopped on the agent host.
- **Machine not validated or credentials revoked**: The agent's credentials are pending validation, were removed from the central LAPI, or the credentials file is missing/corrupt.
- **Local API unreachable from agent**: Network issues, firewall rules, or configuration errors prevent the agent from connecting to the LAPI endpoint.
- **Local API service unavailable**: The central LAPI service itself is down or not responding, affecting all agents trying to connect *(would have triggered an other issue)*.

## Diagnosis & Resolution

### Service Stopped or Stuck

#### Check Log Processor service status

Confirm the service state on the host:

```bash
sudo systemctl status crowdsec
sudo journalctl -u crowdsec -n 50
```

For containerised deployments, verify the workload is still running:

```bash
docker ps --filter name=crowdsec
kubectl get pods -n crowdsec
```

On the LAPI node, run `sudo cscli machines list` and check whether the `Last Update` column is older than 24 hours for the affected machine.

#### Restart Log Processor service and verify check-in

Restart the Log Processor service:

```bash
# On host (systemd)
sudo systemctl restart crowdsec

# Docker
docker restart crowdsec

# Kubernetes
kubectl rollout restart deployment/crowdsec -n crowdsec
```

After the restart, verify the agent is checking in:

```bash
# On LAPI host
sudo cscli machines list
```

Check that the `Last Update` timestamp is recent (within last few minutes).

### Machine Credentials Need Validation

#### Check machine status on LAPI

From the LAPI host:

```bash
# On host
sudo cscli machines list

# Docker
docker exec crowdsec cscli machines list

# Kubernetes
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli machines list
```

- If the machine shows in `PENDING` state or is missing entirely, credentials need validation
- On the agent host, ensure `/etc/crowdsec/local_api_credentials.yaml` exists and contains valid login and password
- If you recently reinstalled or renamed the machine, it must be re-validated

#### Regenerate credentials for single machine setups

:::info
More suitable for single machine setups.
:::

To regenerate credentials directly on the LAPI host when the agent runs locally:

```bash
sudo cscli machines add -a
```

#### Validate or re-register machines in distributed setups

:::info
Registration system is more suitable for distributed setups.
:::

Approve pending machines on the LAPI:

```bash
sudo cscli machines list
sudo cscli machines validate <machine_name>
```

If credentials were removed or the agent was rebuilt, re-register it against the LAPI:

```bash
sudo cscli lapi register --url http://<lapi_host>:8080 --machine <machine_name>
sudo systemctl restart crowdsec
```

Update the `--url` to match your deployment. Auto-registration tokens are covered in [Machines management](/u/user_guides/machines_mgmt#machine-auto-validation).

#### Clean up stale Kubernetes pod machines

In Kubernetes environments, pod restarts and scaling events create new pod identities. Old Log Processor entries may remain in the LAPI's machine list even after pods are deleted, causing the Console to show offline agents that no longer exist.

To identify and clean up stale machines:

1. List all registered machines and note their last update times:

```bash
# On LAPI host
sudo cscli machines list

# In Kubernetes
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli machines list
```

2. Identify machines that haven't checked in for 24+ hours and verify they correspond to deleted pods:

```bash
# Check current running pods
kubectl get pods -n crowdsec -l app=crowdsec-agent -o wide
```

3. Prune stale machines:

```bash
# Delete specific stale machine
sudo cscli machines delete <stale_machine_name>

# Or prune all machines not seen in 24+ hours (use with caution)
sudo cscli machines prune
```

4. After pruning, you may need to restart the agent deployment to regenerate credentials for current pods:

```bash
kubectl rollout restart deployment/crowdsec-agent -n crowdsec
```

5. Verify new pods register successfully:

```bash
# Wait 1-2 minutes then check
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli machines list
```

:::tip
To prevent accumulation of stale machines in Kubernetes, consider using [auto-registration tokens](/u/user_guides/machines_mgmt#machine-auto-validation) which handle pod lifecycle automatically.
:::

Once pruned, the issues concerning those pruned LPs will disappear on next SE info update *(within 30minutes)*.

### Central LAPI Unreachable from Agent

#### Test LAPI connectivity from agent

From the agent host, test connectivity to the LAPI:

```bash
# On host
sudo cscli lapi status

# Docker
docker exec crowdsec-agent cscli lapi status

# Kubernetes
kubectl exec -n crowdsec -it <agent-pod-name> -- cscli lapi status
```

Look for errors:
- `401 Unauthorized` - credentials issue
- TLS failures - certificate problems
- Connection timeouts - network/firewall blocking

Also verify the API endpoint in `/etc/crowdsec/config.yaml`:
- Check `api.client.credentials_path` points to correct credentials file
- Verify `url` matches your LAPI endpoint (default: `http://localhost:8080`)
- Review `ca_cert` and `insecure_skip_verify` if using TLS

Test network connectivity:

```bash
nc -zv <lapi_host> 8080
```

#### Fix network connectivity and firewall rules

Open the required port on firewalls or security groups:

```bash
# Test connectivity
nc -zv <lapi_host> 8080

# If using firewall, ensure port is open
sudo ufw allow 8080/tcp
# or
sudo firewall-cmd --add-port=8080/tcp --permanent
sudo firewall-cmd --reload
```

If using TLS:
- Update the agent trust store (`ca_cert` in `/etc/crowdsec/config.yaml`) if certificates were renewed
- Temporarily enable `insecure_skip_verify: true` for testing (then fix certificates properly)
- Follow [TLS authentication](/docs/local_api/tls_auth) for proper setup

If using proxies or load balancers:
- Ensure they forward HTTP headers correctly
- Verify TLS passthrough or termination is configured properly
- Check that the LAPI endpoint is accessible through the proxy

### Local API Service Unavailable

#### Check if Local API service is down

If several agents show as offline simultaneously, the LAPI service itself might be down.

On the LAPI machine:

```bash
# On host
sudo systemctl status crowdsec
sudo journalctl -u crowdsec -n 50

# Docker
docker ps --filter name=crowdsec-lapi
docker logs crowdsec-lapi --tail 50

# Kubernetes
kubectl get pods -n crowdsec -l type=lapi
kubectl logs -n crowdsec -l type=lapi --tail 50
```

Check `sudo cscli metrics show engine` on the LAPI to confirm it is processing events from other agents.

#### Restart Local API service and investigate issues

Restart the LAPI service:

```bash
# On host (systemd)
sudo systemctl restart crowdsec

# Kubernetes
kubectl rollout restart deployment/crowdsec-lapi -n crowdsec
```

If the LAPI repeatedly crashes or loses database access:

1. Collect diagnostics:

```bash
sudo cscli support dump
```

2. Review `/var/log/crowdsec/` (or container logs) for errors
3. Check database connectivity and credentials
4. Consult the [Security Engine troubleshooting guide](/u/troubleshooting/security_engine) if issues persist

## Verify Resolution

After making changes:

1. Wait 1-2 minutes for the agent to check in
2. Verify on the LAPI host:

```bash
sudo cscli machines list
```

3. Check that `Last Update` timestamp is recent (within last few minutes)
4. The Console alert will clear automatically during the next polling cycle

## Related Issues

- [Engine No Alerts](/u/troubleshooting/issue_se_no_alerts) - If the agent is online but not generating alerts
- [Log Processor No Logs Read](/u/troubleshooting/issue_lp_no_logs_read) - If acquisition is not working
- [Security Engine Troubleshooting](/u/troubleshooting/security_engine) - General Security Engine issues

## Getting Help

If the agent still shows as offline after following these steps:

- Check [Discourse](https://discourse.crowdsec.net/) for similar issues
- Ask on [Discord](https://discord.gg/crowdsec) with your `cscli machines list` and `cscli lapi status` output
- Share the output of `sudo cscli support dump` if the issue persists

Consider adding a [notification rule](/u/console/notification_integrations/rule) for **Log Processor Offline** to be alerted promptly when this happens again.
