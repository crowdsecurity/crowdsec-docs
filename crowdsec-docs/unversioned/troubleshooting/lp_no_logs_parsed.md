---
title: LP No Logs Parsed
id: lp_no_logs_parsed
---

The **LP No Logs Parsed** issue appears when logs are being successfully read by the Log Processor but none are being parsed correctly in the last 48 hours. This means the acquisition is working, but parsers can't interpret the log format.

## What Triggers This Issue

- **Trigger condition**: Logs read but no successful parsing for 48 hours
- **Criticality**: Critical
- **Impact**: No events generated means no detection or alerts possible

## Common Root Causes

### Missing collection or parsers
The required parser collection for your log format isn't installed.

### Acquisition type mismatch
The `type:` or `program:` label in acquisition doesn't match any installed parser's FILTER.

### Custom or unexpected log format
Logs don't match the format expected by the parser (custom format, version mismatch, etc.).

### Parser FILTER not matching
Parser exists but its FILTER clause doesn't match the acquisition label.

### Grok pattern mismatch
Log structure has changed and the parser's grok patterns no longer match.

## How to Diagnose

### Check parsing metrics

```bash
# On host
sudo cscli metrics show acquisition parsers

# Docker
docker exec crowdsec cscli metrics show acquisition parsers

# Kubernetes
kubectl exec -n crowdsec -it <agent-pod> -- cscli metrics show acquisition parsers
```

**What to look for:**
- **Acquisition**: "Lines read" should be > 0 (confirms logs are being read)
- **Parsers**: "Lines parsed" should be > 0 (currently 0 means parsing is failing)
- **Unparsed lines**: Check if there's a high "unparsed" count

### Use cscli explain to test parsing

Take a sample log line and test it:

```bash
# Test with your actual log line
sudo cscli explain --log "192.168.1.1 - - [01/Jan/2024:12:00:00 +0000] \"GET / HTTP/1.1\" 200 1234" --type nginx

# Or test from a file
sudo cscli explain --file /var/log/nginx/access.log --type nginx
```

**What to look for:**
- 🔴 (red) next to parser names means the parser didn't match
- 🟢 (green) means the parser succeeded
- If all parsers show 🔴, the log format isn't being recognized

### Check installed collections and parsers

```bash
# List installed collections
sudo cscli collections list

# List installed parsers
sudo cscli parsers list

# Check specific parser details
sudo cscli parsers inspect crowdsecurity/nginx-logs
```

### Verify acquisition type/program label

```bash
# Check your acquisition configuration
sudo cat /etc/crowdsec/acquis.yaml
sudo cat /etc/crowdsec/acquis.d/*.yaml
```

Compare the `type:` (or `program:` in Kubernetes) with installed parser names.

## How to Resolve

### Install missing collection

Most services have a collection that includes parsers and scenarios:

```bash
# Search for collections
sudo cscli collections search nginx

# Install the collection
sudo cscli collections install crowdsecurity/nginx

# Restart CrowdSec
sudo systemctl restart crowdsec
```

**Docker:**
```yaml
environment:
  COLLECTIONS: "crowdsecurity/nginx crowdsecurity/linux"
```
Then restart the container.

**Kubernetes:**
```yaml
agent:
  env:
    - name: COLLECTIONS
      value: "crowdsecurity/nginx crowdsecurity/traefik"
```
Then: `helm upgrade crowdsec crowdsec/crowdsec -n crowdsec -f values.yaml`

### Fix acquisition type/program mismatch

The acquisition label must match a parser's FILTER:

#### On Host or Docker

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

#### Kubernetes

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

### Handle custom log formats

If you use a custom log format that doesn't match standard parsers:

#### Option 1: Adjust log format to match parser
**NGINX example:**
```nginx
# In nginx.conf, use the combined format
log_format combined '$remote_addr - $remote_user [$time_local] '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent"';
access_log /var/log/nginx/access.log combined;
```

#### Option 2: Create a custom parser
1. Use the [CrowdSec Playground](https://playground.crowdsec.net/) to develop and test your parser
2. Create a custom parser in `/etc/crowdsec/parsers/s01-parse/custom-parser.yaml`
3. Use grok patterns to match your format
4. See [Parser Documentation](/docs/log_processor/parsers/format) for details

**Simple custom parser example:**
```yaml
onsuccess: next_stage
debug: false
filter: "evt.Parsed.program == 'my-custom-app'"
name: my-org/my-custom-app-logs
description: "Custom parser for my application"
grok:
  pattern: '%{IPORHOST:source_ip} - %{DATA:message}'
  apply_on: message
statics:
  - meta: log_type
    value: my_custom_app
  - meta: service
    value: http
```

#### Option 3: Use a different parser
Some services have multiple parser options. Check the [Hub](https://app.crowdsec.net/hub/parsers) for alternatives.

### Debug parser FILTER issues

If a parser is installed but not matching, check its FILTER:

```bash
# View parser details
sudo cscli parsers inspect crowdsecurity/nginx-logs

# Look for the "filter" field
# Example: filter: "evt.Parsed.program == 'nginx'"
```

The FILTER must match your acquisition label. If your label is `type: nginx`, the parser FILTER should check `evt.Line.Labels.type == "nginx"` or `evt.Parsed.program == "nginx"`.

## Verify Resolution

After making changes:

1. **Restart CrowdSec:**
   ```bash
   sudo systemctl restart crowdsec
   ```

2. **Wait 1-2 minutes for log processing**

3. **Check metrics again:**
   ```bash
   sudo cscli metrics show parsers
   ```

   **"Lines parsed" should now be > 0**

4. **Test with cscli explain:**
   ```bash
   sudo cscli explain --log "<your sample log>" --type <your-type>
   ```

   **Parsers should show 🟢 (green) indicators**

5. **Verify events are reaching scenarios:**
   ```bash
   sudo cscli metrics show scenarios
   ```

## Common Parser FILTER Values

| Service | Acquisition Label | Parser FILTER |
|---------|------------------|---------------|
| NGINX | `type: nginx` | `evt.Line.Labels.type == "nginx"` |
| Apache | `type: apache2` | `evt.Line.Labels.type == "apache2"` |
| SSH (syslog) | `type: syslog` | `evt.Line.Labels.type == "syslog"` |
| Traefik | `program: traefik` | `evt.Parsed.program == "traefik"` |
| MySQL | `type: mysql` | `evt.Line.Labels.type == "mysql"` |

## Related Issues

- [LP No Logs Read](/u/troubleshooting/lp_no_logs_read) - If logs aren't being read at all
- [LP No Alerts](/u/troubleshooting/lp_no_alerts) - If logs are parsed but scenarios don't trigger
- [Engine No Alerts](/u/troubleshooting/engine_no_alerts) - Similar issue at the Security Engine level

## Getting Help

If parsing still fails:

- Test your logs in [CrowdSec Playground](https://playground.crowdsec.net/)
- Share your log samples and acquisition config on [Discourse](https://discourse.crowdsec.net/)
- Ask on [Discord](https://discord.gg/crowdsec) with `cscli explain` output
- Check parser documentation on the [Hub](https://app.crowdsec.net/hub/parsers)
