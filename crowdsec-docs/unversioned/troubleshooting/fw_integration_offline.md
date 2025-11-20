---
title: Firewall Integration Offline
id: fw_integration_offline
---

The **Firewall Integration Offline** issue appears when a firewall-based remediation component (bouncer) has not pulled decisions from the Local API for more than 24 hours. This means blocked IPs are not being enforced at the firewall level.

## What Triggers This Issue

- **Trigger condition**: No decision pulls for 24 hours
- **Criticality**: Critical
- **Impact**: Firewall-based blocking is not working - detected threats are not being blocked

## Common Root Causes

### Bouncer service stopped
The firewall bouncer systemd service or process is not running.

### Authentication failure
API key is invalid, expired, or the bouncer was removed from the Security Engine.

### Network connectivity issues
The bouncer cannot reach the Local API endpoint (different host, port closed, etc.).

### Configuration errors
Incorrect API URL, missing configuration file, or malformed settings.

### Bouncer installation issue
The bouncer may not be properly installed or registered.

## How to Diagnose

### Check bouncer status in Security Engine

From the Security Engine (or LAPI host):

```bash
# On host
sudo cscli bouncers list

# Docker
docker exec crowdsec cscli bouncers list

# Kubernetes
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli bouncers list
```

**What to look for:**
- Is your firewall bouncer listed?
- Check the "Last API Pull" timestamp - is it older than 24 hours?
- Is the bouncer marked as "✓" (valid)?

### Check bouncer service status

On the host where the firewall bouncer is installed:

```bash
# For systemd-based bouncers
sudo systemctl status crowdsec-firewall-bouncer

# Or for other firewall bouncers
sudo systemctl status cs-firewall-bouncer
```

**Common firewall bouncers:**
- `crowdsec-firewall-bouncer` - iptables/nftables bouncer
- `cs-firewall-bouncer` - (legacy name)
- Platform-specific: check your installation method

### Check bouncer logs

```bash
# Linux
sudo tail -50 /var/log/crowdsec-firewall-bouncer.log

# Or check journald
sudo journalctl -u crowdsec-firewall-bouncer -n 50

# FreeBSD (OPNsense/pfSense)
sudo tail -50 /var/log/crowdsec/crowdsec-firewall-bouncer.log
```

**Look for errors like:**
- `connection refused` - API is unreachable
- `401 Unauthorized` or `403 Forbidden` - Authentication failed
- `invalid configuration` - Config file issues
- `cannot bind` or `permission denied` - Firewall permission issues

### Test connectivity to Local API

From the bouncer host:

```bash
# Test network connectivity
curl -I http://<lapi-host>:8080/

# Test with API key
curl -H "X-Api-Key: <your-api-key>" http://<lapi-host>:8080/v1/decisions
```

## How to Resolve

### Restart the bouncer service

```bash
# Restart the service
sudo systemctl restart crowdsec-firewall-bouncer

# Enable it to start on boot
sudo systemctl enable crowdsec-firewall-bouncer

# Check status
sudo systemctl status crowdsec-firewall-bouncer
```

### Re-register the bouncer

If the API key is invalid or missing:

#### Generate a new API key on the Security Engine

```bash
# On Security Engine / LAPI host
sudo cscli bouncers add firewall-bouncer-01

# Copy the generated API key
```

#### Update bouncer configuration

Edit the bouncer configuration file (usually `/etc/crowdsec/bouncers/crowdsec-firewall-bouncer.yaml`):

```yaml
api_url: http://<lapi-host>:8080/
api_key: <paste-new-api-key-here>
```

#### Restart the bouncer

```bash
sudo systemctl restart crowdsec-firewall-bouncer
```

### Fix connectivity issues

If the bouncer is on a different host than the Security Engine:

#### Check firewall rules allow access

```bash
# Test from bouncer host
nc -zv <lapi-host> 8080
```

If connection fails:
- Open port 8080 on the Security Engine host firewall
- Check network security groups / iptables rules
- Verify no proxy is blocking the connection

#### Verify API URL in bouncer config

Edit `/etc/crowdsec/bouncers/crowdsec-firewall-bouncer.yaml`:

```yaml
# For local LAPI
api_url: http://127.0.0.1:8080/

# For remote LAPI
api_url: http://<lapi-server-ip>:8080/

# For HTTPS
api_url: https://<lapi-server>:8080/
```

**Important:** Don't forget the trailing `/`

### Fix configuration errors

If bouncer logs show configuration errors:

```bash
# Validate YAML syntax
sudo cat /etc/crowdsec/bouncers/crowdsec-firewall-bouncer.yaml

# Check for common issues:
# - Incorrect indentation (YAML is whitespace-sensitive)
# - Missing api_key or api_url
# - Incorrect mode (iptables vs nftables)
```

**Example minimal configuration:**
```yaml
mode: iptables  # or nftables
pid_dir: /var/run/
update_frequency: 10s
daemonize: true
log_mode: file
log_dir: /var/log/
log_level: info
api_url: http://127.0.0.1:8080/
api_key: <your-api-key>
deny_action: DROP
deny_log: false
```

### Fix firewall permission issues

Some firewall bouncers need specific permissions:

```bash
# For iptables
sudo setcap cap_net_admin+ep /usr/bin/crowdsec-firewall-bouncer

# Verify iptables rules are being applied
sudo iptables -L crowdsec-chain -n -v

# For nftables
sudo nft list ruleset | grep crowdsec
```

### Reinstall the bouncer (if needed)

If the bouncer is corrupted or not properly installed:

```bash
# Remove old installation
sudo apt remove crowdsec-firewall-bouncer  # Debian/Ubuntu
sudo yum remove crowdsec-firewall-bouncer  # RHEL/CentOS

# Reinstall
sudo apt install crowdsec-firewall-bouncer
# Or follow installation instructions for your platform

# Re-register with new API key
sudo cscli bouncers add firewall-bouncer-new
# Update config with the new key
# Restart service
```

## Verify Resolution

After making changes:

1. **Check bouncer status:**
   ```bash
   sudo systemctl status crowdsec-firewall-bouncer
   ```
   Should show "active (running)"

2. **Verify API pulls on Security Engine:**
   ```bash
   sudo cscli bouncers list
   ```
   "Last API Pull" should update to a recent timestamp (within seconds)

3. **Check firewall rules are applied:**
   ```bash
   # iptables
   sudo iptables -L crowdsec-chain -n -v

   # nftables
   sudo nft list table inet crowdsec
   ```

4. **Test blocking:**
   Add a test decision and verify it appears in firewall rules:
   ```bash
   sudo cscli decisions add --ip 192.0.2.1 --duration 5m --reason "test"

   # Wait 10-15 seconds for bouncer to pull
   sudo iptables -L crowdsec-chain -n -v | grep 192.0.2.1
   ```

## Platform-Specific Notes

### OPNsense / pfSense
- Bouncer name: `crowdsec-firewall-bouncer` or `os-crowdsec`
- Config: `/usr/local/etc/crowdsec/bouncers/`
- Logs: `/var/log/crowdsec/`
- Service: Check via OPNsense/pfSense GUI or `service crowdsec-firewall-bouncer status`

### Docker
If running the bouncer in Docker, ensure:
- Container is running: `docker ps | grep bouncer`
- Network connectivity to LAPI container/host
- Proper capabilities: `--cap-add=NET_ADMIN --cap-add=NET_RAW`

### Kubernetes
For Kubernetes network policies or firewall controllers:
- Check pod status: `kubectl get pods -n <bouncer-namespace>`
- Check logs: `kubectl logs -n <bouncer-namespace> <bouncer-pod>`
- Verify service connectivity to LAPI

## Related Issues

- [RC Integration Offline](/u/troubleshooting/rc_integration_offline) - Similar issue for non-firewall bouncers
- [Remediation Components Troubleshooting](/u/troubleshooting/remediation_components) - General bouncer issues

## Getting Help

If your firewall bouncer still doesn't work:

- Share bouncer logs on [Discourse](https://discourse.crowdsec.net/)
- Ask on [Discord](https://discord.gg/crowdsec) with `cscli bouncers list` output
- Check firewall bouncer documentation: [Firewall Bouncer Docs](/u/bouncers/firewall)
- Report bugs: [GitHub Issues](https://github.com/crowdsecurity/cs-firewall-bouncer/issues)
