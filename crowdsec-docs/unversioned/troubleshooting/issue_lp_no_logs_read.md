---
title: LP No Logs Read
id: issue_lp_no_logs_read
---

The **LP No Logs Read** issue appears when a Log Processor is running but hasn't acquired any log lines in the last 24 hours. This is the first step in the detection pipeline and must work for CrowdSec to function.

## What Triggers This Issue

- **Trigger condition**: No logs acquired for 24 hours
- **Criticality**: Critical
- **Impact**: Complete detection failure - no logs means no alerts

## Common Root Causes

- **Missing acquisition configuration**: No acquisition files exist, or they're empty.
- **Incorrect log file paths**: Acquisition configuration points to paths that don't exist or have moved.
- **File permission issues**: CrowdSec doesn't have read access to the log files.
- **Log files are empty or not being written**: The services being monitored aren't generating logs.
- **Acquisition type mismatch**: Wrong datasource type configured (e.g., using `file` instead of `journald`).
- **Container/Kubernetes volume issues**: In containerized deployments, logs aren't mounted or accessible to the CrowdSec container.

## How to Diagnose

### Check acquisition metrics

```bash
# On host
sudo cscli metrics show acquisition

# Docker
docker exec crowdsec cscli metrics show acquisition

# Kubernetes
kubectl exec -n crowdsec -it <agent-pod> -- cscli metrics show acquisition
```

**What to look for:**
- If the output is empty or shows 0 "Lines read", acquisition is not working
- If sources are listed but "Lines read" is 0, the source exists but isn't reading data

### Verify acquisition configuration exists

```bash
# On host
sudo cat /etc/crowdsec/acquis.yaml
sudo ls -la /etc/crowdsec/acquis.d/

# Docker
docker exec crowdsec cat /etc/crowdsec/acquis.yaml
docker exec crowdsec ls -la /etc/crowdsec/acquis.d/

# Kubernetes - check ConfigMap
kubectl get configmap -n crowdsec -o yaml
```

If these files are empty or missing, you need to create acquisition configuration.

### Check log files exist and have content

```bash
# Verify log file exists
ls -la /var/log/nginx/access.log

# Check if it has recent content
tail -10 /var/log/nginx/access.log

# Check last modification time
stat /var/log/nginx/access.log
```

### Check file permissions

```bash
# Check if CrowdSec user can read the log file
sudo -u crowdsec cat /var/log/nginx/access.log | head -5

# Check directory permissions
ls -la /var/log/nginx/
```

## How to Resolve

### Create or fix acquisition configuration

The acquisition configuration tells CrowdSec which logs to read. Configuration varies by deployment:

#### On Host

Create or edit `/etc/crowdsec/acquis.yaml` or add files to `/etc/crowdsec/acquis.d/`:

**Example for NGINX:**
```yaml
filenames:
  - /var/log/nginx/access.log
  - /var/log/nginx/error.log
labels:
  type: nginx
---
```

**Example for SSH (via syslog):**
```yaml
filenames:
  - /var/log/auth.log
labels:
  type: syslog
---
```

**Example for journald:**
```yaml
source: journalctl
journalctl_filter:
  - "_SYSTEMD_UNIT=ssh.service"
labels:
  type: syslog
---
```

After creating the configuration:
```bash
sudo systemctl restart crowdsec
```

#### Docker

Ensure log volumes are mounted and acquisition is configured:

**docker-compose.yml example:**
```yaml
services:
  crowdsec:
    image: crowdsecurity/crowdsec:latest
    volumes:
      - /var/log:/var/log:ro  # Mount host logs as read-only
      - ./acquis.yaml:/etc/crowdsec/acquis.yaml:ro
      - crowdsec-config:/etc/crowdsec
      - crowdsec-data:/var/lib/crowdsec/data
```

**acquis.yaml for Docker:**
```yaml
filenames:
  - /var/log/nginx/access.log
labels:
  type: nginx
```

Restart the container:
```bash
docker-compose restart crowdsec
```

#### Kubernetes

Configure acquisition in your Helm values:

**values.yaml:**
```yaml
agent:
  acquisition:
    - namespace: production
      podName: nginx-*
      program: nginx
    - namespace: production
      podName: webapp-*
      program: nginx
```

**Note:** In Kubernetes, use `program:` (not `type:`). The `program` field must match the FILTER in your parsers.

Apply changes:
```bash
helm upgrade crowdsec crowdsec/crowdsec -n crowdsec -f values.yaml
```

### Fix file permissions

If CrowdSec can't read log files:

```bash
# Add CrowdSec user to the log group (e.g., adm)
sudo usermod -aG adm crowdsec

# Or adjust log file permissions (less secure)
sudo chmod 644 /var/log/nginx/access.log

# Restart CrowdSec to pick up group membership
sudo systemctl restart crowdsec
```

### Verify log files are being written

If log files are empty:

1. **Check the monitored service is running:**
   ```bash
   sudo systemctl status nginx
   ```

2. **Generate some log activity:**
   ```bash
   curl http://localhost/
   tail /var/log/nginx/access.log
   ```

3. **Check service logging configuration:**
   - For NGINX: verify `access_log` directives in nginx.conf
   - For Apache: verify `CustomLog` directives
   - For systemd services: verify they're logging to journald or files

### Fix container/Kubernetes volume issues

#### Docker
Ensure volumes are correctly mounted:
```bash
# Check mounts inside container
docker exec crowdsec ls -la /var/log/nginx/

# If empty, verify docker-compose.yml volumes section
```

#### Kubernetes
Kubernetes agents read from `/var/log/containers` by default (mounted by helm chart). If logs aren't there:

```bash
# Verify pods are writing to expected locations
kubectl logs -n production nginx-pod-name

# Check if logs are in /var/log/containers on the node
kubectl debug node/your-node -it --image=busybox -- ls -la /var/log/containers/
```

## Verify Resolution

After making changes:

1. **Restart CrowdSec:**
   ```bash
   sudo systemctl restart crowdsec
   # or docker restart crowdsec
   # or kubectl rollout restart deployment/crowdsec-agent -n crowdsec
   ```

2. **Wait 1-2 minutes for acquisition to start**

3. **Check metrics again:**
   ```bash
   sudo cscli metrics show acquisition
   ```

4. **Verify "Lines read" is increasing:**
   - Run metrics command twice with a delay
   - Numbers should increase if logs are being actively generated

5. **Check CrowdSec logs for errors:**
   ```bash
   sudo tail -50 /var/log/crowdsec.log
   # or docker logs crowdsec
   # or kubectl logs -n crowdsec <pod-name>
   ```

## Detailed Acquisition Documentation

For more information on acquisition configuration:
- [Datasources Documentation](/docs/log_processor/data_sources/intro)
- [File datasource](/docs/log_processor/data_sources/file)
- [Journald datasource](/docs/log_processor/data_sources/journald)
- [Hub collection pages](https://app.crowdsec.net/hub/collections) - each collection shows example acquisition config

## Related Issues

- [LP No Logs Parsed](/u/troubleshooting/lp_no_logs_parsed) - Next step if logs are read but not parsed
- [LP No Alerts](/u/troubleshooting/lp_no_alerts) - If logs are read and parsed but scenarios don't trigger
- [Engine No Alerts](/u/troubleshooting/engine_no_alerts) - Similar issue at the Security Engine level

## Getting Help

If acquisition still doesn't work:

- Share your acquisition config on [Discourse](https://discourse.crowdsec.net/)
- Ask on [Discord](https://discord.gg/crowdsec) with your `cscli metrics` output and acquisition files
- Check for similar issues in the [GitHub repository](https://github.com/crowdsecurity/crowdsec/issues)
