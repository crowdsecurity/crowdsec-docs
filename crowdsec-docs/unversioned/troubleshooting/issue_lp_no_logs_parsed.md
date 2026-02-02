---
title: Log Processor No Logs Parsed
id: issue_lp_no_logs_parsed
---

The **Log Processor No Logs Parsed** indicates that logs are being successfully **read** by the Log Processor but none are being **parsed** correctly in the last 48 hours.   
This means the acquisition is working, but parsers can't interpret the log format.

## What Triggers This Issue

- **Trigger condition**: Logs read but no successful parsing for 48 hours
- **Criticality**: 🔥 Critical
- **Impact**: No events generated means no detection or alerts possible

## Common Root Causes

- [**Missing collection or parsers**](#missing-collection-or-parsers): The required parser collection for your log format isn't installed.
- [**Custom or unexpected log format**](#acquisition-typeprogram-mismatch): Logs don't match the format expected by the parser (custom format, version mismatch, etc.).

## Diagnosis & Resolution

### Missing Collection or Parsers

#### 🔎 Check parsing metrics and installed collections

```bash
sudo cscli metrics show acquisition parsers
```

<details>
   <summary>Run this command for Docker or Kubernetes</summary>

```bash
docker exec crowdsec cscli metrics show acquisition parsers
```

```bash
kubectl exec -n crowdsec -it <agent-pod> -- cscli metrics show acquisition parsers
```

</details>

**What to look for:**
- **Acquisition**: "Lines read" should be > 0 (confirms logs are being read)
- **Parsers**: "Lines parsed" should be > 0 (currently 0 means parsing is failing)
- **Unparsed lines**: Check if there's a high "unparsed" count

Check installed collections and parsers:

```bash
sudo cscli collections list
```
```bash
sudo cscli parsers list
```

#### 🛠️ Install required collections for your log formats

Most services have a collection that includes parsers and scenarios.   

- Search the [CrowdSec Hub ↗️](https://app.crowdsec.net/hub) for a collection with the name of the service you want to protect.
- Or a [specific log parser ↗️](https://app.crowdsec.net/hub/log-parsers) if you did not find the collection
- [Get help from the community](#getting-help) to understand what collections you need.

### Acquisition Type/Program Mismatch

The log type defined in the acquisition is linked to the parsing process, having a mismatch can result in the proper parser not being chosen for the log you're reading.   

💡 if you're directly reading a program's log file the type usually matches the name of the program.   
If you're reading logs from a stream (ie syslog) there might be a first step in parsing that is identifying syslog logs format hence the acquisition type will be "syslog"

:::info
💡 If you're using default log systems it will usually not be the root cause for your usecase.
:::

#### 🔎 Check acquisition labels match parser filters

```bash
# Check your acquisition configuration
sudo cat /etc/crowdsec/acquis.yaml
sudo cat /etc/crowdsec/acquis.d/*.yaml
```

Compare the `type:` (or `program:` in Kubernetes) with installed parser names.

#### 🛠️ Fix acquisition labels to match parser FILTER

The acquisition label must match a parser's FILTER:

**On Host or Docker:**

Check your `acquis.yaml`:

```yaml
filenames:
  - /var/log/nginx/access.log
labels:
  type: nginx  # This must match a parser FILTER
```

Common types:
- `nginx` - for NGINX logs
- `apache2` - for Apache logs
- `syslog` - for syslog-formatted logs (SSH, etc.)
- `mysql` - for MySQL logs
- `postgres` - for PostgreSQL logs
- 💡 for the exact type you can look at the [filter](#parser-filter-not-matching) in the parser yaml files

**Kubernetes:**

In Kubernetes, use `program:` instead of `type:`:

```yaml
agent:
  acquisition:
    - namespace: production
      podName: nginx-*
      program: nginx  # This must match parser FILTER
```

**After changing configuration:**

```bash
sudo systemctl restart crowdsec
# or docker restart crowdsec
# or helm upgrade (for Kubernetes)
```

### Parser FILTER Not Matching

#### 🔎 Inspect parser FILTER requirements

If a parser is installed but not matching, check its FILTER:

```bash
# View parser details
sudo cscli parsers inspect crowdsecurity/nginx-logs

# Look for the "filter" field
# Example: filter: "evt.Parsed.program == 'nginx'"
```

The FILTER must match your acquisition label. If your label is `type: nginx`, the parser FILTER should check `evt.Line.Labels.type == "nginx"` or `evt.Parsed.program == "nginx"`.

#### 🛠️ Update acquisition configuration to match FILTER

Ensure your acquisition configuration uses labels that match the parser's FILTER. Refer to the "Acquisition Type/Program Mismatch" section above for examples.

## Common Parser FILTER Values

| Service | Acquisition Label | Parser FILTER |
|---------|------------------|---------------|
| NGINX | `type: nginx` | `evt.Line.Labels.type == "nginx"` |
| Apache | `type: apache2` | `evt.Line.Labels.type == "apache2"` |
| SSH (syslog) | `type: syslog` | `evt.Line.Labels.type == "syslog"` |
| Traefik | `program: traefik` | `evt.Parsed.program == "traefik"` |
| MySQL | `type: mysql` | `evt.Line.Labels.type == "mysql"` |

## Related Issues

- [Log Processor No Logs Read](/u/troubleshooting/issue_lp_no_logs_read) - If logs aren't being read at all
- [Log Processor No Alerts](/u/troubleshooting/issue_lp_no_alerts) - If logs are parsed but scenarios don't trigger
- [Engine No Alerts](/u/troubleshooting/issue_se_no_alerts) - Similar issue at the Security Engine level

## Getting Help

If parsing still fails:

- Test your logs in [CrowdSec Playground](https://playground.crowdsec.net/)
- Share your log samples and acquisition config on [Discourse](https://discourse.crowdsec.net/)
- Ask on [Discord](https://discord.gg/crowdsec) with `cscli collections list` and `cscli parsers list` output
- Check parser documentation on the [Hub](https://app.crowdsec.net/hub/parsers)
