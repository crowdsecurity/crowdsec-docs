---
title: Log Processor Offline
id: issue_lp_offline
---
:::info
LogProcessors are Security Engine used to read log in a distributed setup.  
In a standalone install your unique Security Engine registers itself as a LogProcessing machine.
:::

When a Log Processor has not checked in with the Local API (LAPI) of the central Security Engine for more than 24 hours.

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

#### 🔎 Check Log Processor service status

Confirm the service state on the host:

```bash
sudo systemctl status crowdsec
```
Or [check the logs](/u/troubleshooting/security_engine#where-are-the-logs-stored) of your Security Engine.

<details>
   <summary>For containerised deployments, verify the workload is still running</summary>

```bash
docker ps --filter name=crowdsec
```
```bash
kubectl get pods -n crowdsec
```
</details>

On the LAPI node, run `sudo cscli machines list` and check whether the `Last Update` column is older than 24 hours for the affected machine.

#### 🛠️ Restart Log Processor service and verify check-in

Restart the Log Processor service:

```bash
sudo systemctl restart crowdsec
```

<details>
   <summary>Run this command for Docker or Kubernetes</summary>

```bash
docker restart crowdsec
```
```bash
kubectl rollout restart deployment/crowdsec -n crowdsec
```
</details>

After the restart, verify the agent is checking in:

```bash
sudo cscli machines list
```

Check that the `Last Update` timestamp is recent (within last few minutes).

#### 🛠️ Prune dead/out of date Log processors

💡 In cases your log processors are clones, as it's the case in orchestrated environments (like Kubernetes), it can happen that some LP stay registered even after their instance was killed. *It's a know issue that will be addressed in future versions of CrowdSec.*

If you're facing such an issue, consider running the [cscli machines prune](/cscli/cscli_machines_prune/) command and even cron this pruning every so often if the issue re-appears often.

```bash
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli machines prune --duration 1h
```

### Machine Credentials Need Validation

#### 🔎 Check machine status on LAPI

From the LAPI host:

```bash
sudo cscli machines list
```

<details>
   <summary>Run this command for Docker or Kubernetes</summary>

```bash
docker exec crowdsec cscli machines list
```
```bash
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli machines list
```
</details>

- If the machine shows in `PENDING` state or is missing entirely, credentials need validation
- On the agent host, ensure `/etc/crowdsec/local_api_credentials.yaml` exists and contains valid login and password
- If you recently reinstalled or renamed the machine, it must be re-validated

#### 🛠️ Regenerate credentials for single machine setups

:::info
More suitable for single machine setups.
:::

To regenerate credentials directly on the LAPI host when the agent runs locally:

```bash
sudo cscli machines add --auto
```

#### 🛠️ Validate or re-register machines in distributed setups

:::info
Registration system is more suitable for distributed setups.
:::

Approve pending machines on the LAPI:

```bash
sudo cscli machines list
```
```bash
sudo cscli machines validate <machine_name>
```

If credentials were removed or the agent was rebuilt, re-register it against the LAPI:

```bash
sudo cscli lapi register --url http://<lapi_host>:8080 --machine <machine_name>
sudo systemctl restart crowdsec
```

Update the `--url` to match your deployment. Auto-registration tokens are covered in [Machines management](/u/user_guides/machines_mgmt#machine-auto-validation).

### Central LAPI Unreachable from Agent

#### 🔎 Test LAPI connectivity from agent

From the agent host, test connectivity to the LAPI:

```bash
# On host
sudo cscli lapi status

# Docker
docker exec crowdsec-agent cscli lapi status

# Kubernetes
kubectl exec -n crowdsec -it <agent-pod-name> -- cscli lapi status
```

Look at your logs and test network connectivity:

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
