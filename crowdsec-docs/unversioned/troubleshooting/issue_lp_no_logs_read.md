---
title: Log Processor No Logs Read
id: issue_lp_no_logs_read
---

The **Log Processor No Logs Read** means the LP is running but hasn't acquired any log lines in the last 24 hours.   
This is the first step in the detection pipeline and must work for CrowdSec to function.

## What Triggers This Issue

- **Trigger condition**: No logs acquired for 24 hours
- **Criticality**: 🔥 Critical
- **Impact**: Complete detection failure - no logs means no alerts

## Common Root Causes

- [**Missing or incorrect acquisition configuration**](#missing-acquisition-configuration): No acquisition files exist, not properly referencing the datasource for logs
- [**File permission issues**](#file-permission-issues): CrowdSec doesn't have read access to the log files.
- [**Log files are empty or not being written**](#log-files-empty-or-not-being-written): The services being monitored aren't generating logs.
- [**Incorrect Acquisition endpoint configuration**](#detailed-acquisition-documentation): Error in endpoint config, for acquisition types listening for incoming data (httpLogs, syslog,...)
- [**Acquisition type mismatch**](#detailed-acquisition-documentation): Wrong datasource type configured (e.g., using `file` instead of `journald`).
- **Container/Kubernetes volume issues**: In containerized deployments, logs aren't mounted or accessible to the CrowdSec container.

## Diagnosis & Resolution

### Missing Acquisition Configuration

#### 🔎 Check if acquisition configuration exists

```bash
# Default single file acquisition configuration
sudo cat /etc/crowdsec/acquis.yaml
# Recommended, per-datasource acquisitions configuration files
sudo ls -la /etc/crowdsec/acquis.d/
```

<details>
   <summary>Run this command for Docker or Kubernetes</summary>

```bash
docker exec crowdsec cat /etc/crowdsec/acquis.yaml
docker exec crowdsec ls -la /etc/crowdsec/acquis.d/
```

```bash
kubectl get configmap -n crowdsec -o yaml
```

</details>

If these files are empty or missing, you need to create acquisition configuration.

Also check acquisition metrics:

```bash
sudo cscli metrics show acquisition
```

<details>
   <summary>Run this command for Docker or Kubernetes</summary>

```bash
docker exec crowdsec cscli metrics show acquisition
```
```bash
kubectl exec -n crowdsec -it <agent-pod> -- cscli metrics show acquisition
```
</details>

**What to look for:**
- If the output is empty or shows 0 "Lines read", acquisition is not working
- If sources are listed but "Lines read" is 0, the source exists but isn't reading data

#### 🛠️ Create acquisition configuration for your deployment

The acquisition configuration tells CrowdSec which logs to read. Configuration varies by deployment:

- For [file based logs](/log_processor/data_sources/file)
- Or [any other type of *datasource*](/log_processor/data_sources/intro)

### File Permission Issues

#### 🔎 Test if CrowdSec can read log files

```bash
# Check logs permissions to see if they can be read by CrowdSec
ls -la /var/log/nginx/
```

#### 🛠️ Grant CrowdSec read access to log files

If CrowdSec can't read log files:

```bash
# Or adjust log file permissions or find files you have read access to
sudo chmod 644 /var/log/nginx/access.log

# Restart CrowdSec to pick up group membership
sudo systemctl restart crowdsec
```

### Log Files Empty or Not Being Written

#### 🔎🛠️ Verify log files exist and have recent content

```bash
# Verify log file exists
ls -la /var/log/nginx/access.log

# Check if it has recent content
tail -10 /var/log/nginx/access.log

# Check last modification time
stat /var/log/nginx/access.log
```

🛠️ If your files are empty fix your logging or change your acquisition configuration to point at the appropriate files

## Detailed Acquisition Documentation

For more information on acquisition configuration:
- [Datasources Documentation](/docs/log_processor/data_sources/intro)
- [File datasource](/docs/log_processor/data_sources/file)
- [Journald datasource](/docs/log_processor/data_sources/journald)
- [Hub collection pages](https://app.crowdsec.net/hub/collections) - each collection shows example acquisition config

## Related Issues

- [Log Processor No Logs Parsed](/u/troubleshooting/issue_lp_no_logs_parsed) - Next step if logs are read but not parsed
- [Log Processor No Alerts](/u/troubleshooting/issue_lp_no_alerts) - If logs are read and parsed but scenarios don't trigger
- [Engine No Alerts](/u/troubleshooting/issue_se_no_alerts) - Similar issue at the Security Engine level

## Getting Help

If acquisition still doesn't work:

- Share your acquisition config on [Discourse](https://discourse.crowdsec.net/)
- Ask on [Discord](https://discord.gg/crowdsec) with your `cscli metrics` output and acquisition files
- Check for similar issues in the [GitHub repository](https://github.com/crowdsecurity/crowdsec/issues)
