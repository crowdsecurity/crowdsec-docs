---
title: Security Engine No Active Remediation Component
id: issue_se_no_active_rc
---

The **Security Engine No Active Remediation Component** issue appears when a Security Engine has Remediation Components *(bouncers)* registered, but **none of them have sent a heartbeat in the past 24 hours**.

Registered but inactive Remediation Components mean your Security Engine's decisions are not being enforced — attackers are detected but **never blocked**.

## What Triggers This Issue

- **Trigger condition**: All registered Remediation Components have been inactive for 24+ hours
- **Criticality**: 🔥 Critical
- **Impact**: Security Engine decisions are not being enforced — no active blocking is taking place.

## Common Root Causes

- [**Configuration file errors**](#configuration-file-errors): The RC's configuration file has incorrect settings, preventing it from starting or connecting.
- [**Invalid credentials**](#invalid-credentials): The API key in the RC configuration is wrong, expired, or was regenerated.
- [**Security Engine not accessible**](#security-engine-not-accessible): The RC cannot reach the Security Engine's Local API (LAPI).
- [**RC service not running**](#rc-service-not-running): The bouncer process or module is stopped or crashed.
- [**Other RC-specific issues**](#other-rc-specific-issues): Dependency, permission, or integration-specific problems.

## Diagnosis & Resolution

### Configuration file errors

#### 🔎 Locate and inspect the RC configuration file

Configuration files are typically found at:

```
/etc/crowdsec/bouncers/crowdsec-<bouncer-name>-bouncer.yaml
```

or `.conf` for older bouncers. Check your [specific RC documentation](/u/bouncers/intro) for the exact path.

Open the file and verify the following fields are present and correctly set:

- `api_url`: the address of your Security Engine's LAPI (e.g. `http://127.0.0.1:8080`)
- `api_key`: a valid API key generated with `cscli bouncers add`

#### 🛠️ Fix the configuration and restart the RC

After editing the configuration file, restart the RC service to apply changes:

```bash
sudo systemctl restart crowdsec-<bouncer-name>-bouncer
```

Check the RC logs for startup errors:

```bash
sudo journalctl -u crowdsec-<bouncer-name>-bouncer --since "10 minutes ago"
```

### Invalid credentials

#### 🔎 Verify the API key is valid

The API key in the RC's configuration must match a key registered on the Security Engine. Check currently registered bouncers and their keys:

```bash
sudo cscli bouncers list
```

If the key was regenerated or the bouncer was re-added, the old key is no longer valid.

#### 🛠️ Generate a new API key and update the RC

1. Remove the stale bouncer registration (if needed):
```bash
sudo cscli bouncers delete <bouncer-name>
```
2. Generate a new key:
```bash
sudo cscli bouncers add <bouncer-name>
```
3. Copy the generated API key into the RC's configuration file (`api_key` field)
4. Restart the RC service

### Security Engine not accessible

The RC must be able to reach the Security Engine's LAPI. This can fail due to network changes, firewall rules, or a LAPI bind address that only listens on localhost.

#### 🔎 Test connectivity from the RC host

```bash
# Replace with your actual LAPI address and port
curl -s http://127.0.0.1:8080/health
```

A healthy LAPI returns `{"status":"ok"}`. Anything else indicates a connectivity or LAPI issue.

#### 🔎 Check the LAPI listen address

```bash
sudo grep -i "listen_uri" /etc/crowdsec/config.yaml
```

If `listen_uri` is set to `127.0.0.1:8080` and the RC runs on a different host, it won't be reachable.

#### 🛠️ Fix LAPI accessibility

- If the RC is on the **same host**: verify `api_url` in the RC config uses `http://127.0.0.1:8080`
- If the RC is on a **different host**: update `listen_uri` in `/etc/crowdsec/config.yaml` to bind to the correct interface, ensure firewall rules allow the connection, and update `api_url` in the RC config accordingly

See [Network Management documentation](/docs/configuration/network_management) for required endpoints.

### RC service not running

#### 🔎 Check the RC service status

```bash
sudo systemctl status crowdsec-<bouncer-name>-bouncer
```

Look for error messages in the output. If the service is `failed` or `inactive`, check the logs:

```bash
sudo journalctl -u crowdsec-<bouncer-name>-bouncer -n 50
```

#### 🛠️ Start the RC service and address errors

```bash
sudo systemctl start crowdsec-<bouncer-name>-bouncer
sudo systemctl enable crowdsec-<bouncer-name>-bouncer
```

If the service fails to start, the logs will typically indicate the root cause (missing config, invalid key, unreachable LAPI, etc.).

### Other RC-specific issues

Beyond the common causes above, each RC type has its own specific failure modes. Refer to the relevant documentation for deeper troubleshooting:

- **Missing system dependencies** (e.g. Lua packages for the Nginx bouncer): see [Nginx Bouncer](/u/bouncers/nginx)
- **Web server module not loaded** (Nginx, Apache, HAProxy): see the respective RC documentation pages
- **Elevated privilege requirements** (Firewall bouncer needing root to manage nftables/iptables): see [Firewall Bouncer](/u/bouncers/firewall)
- **External service credentials** (Cloudflare API tokens, AWS IAM permissions): see [Cloudflare Workers Bouncer](/u/bouncers/cloudflare-workers) or [AWS WAF Bouncer](/u/bouncers/aws-waf)
- **PHP cache backend unavailable** (Redis or Memcached not running): see [PHP Bouncer](/u/bouncers/php)
- **TLS/mTLS certificate issues** (invalid or expired client certificates): see your RC's documentation for TLS configuration
- **General RC troubleshooting**: see [Remediation Components Troubleshooting](/u/troubleshooting/remediation_components)

## Verify Resolution

After fixing the issue:

1. **Check the RC is running and connected**:
```bash
sudo cscli bouncers list
```
The bouncer's **Last Pull** timestamp should update within a few minutes.

2. **Check in the Console** — Navigate to your Security Engine. The active RC alert should clear automatically once a heartbeat is received.

3. **Verify enforcement is working**:
```bash
# Add a short test ban
sudo cscli decisions add --ip 1.2.3.4 --duration 1m
# Confirm the bouncer picked it up
sudo cscli metrics show bouncers
# Clean up
sudo cscli decisions delete --ip 1.2.3.4
```

## Related Issues

- [Security Engine No Remediation Component](/u/troubleshooting/issue_se_no_rc) — If no RC is registered at all
- [Security Engine Offline](/u/troubleshooting/issue_se_offline) — If the Security Engine itself is not reporting
- [Remediation Component Integration Offline](/u/troubleshooting/issue_integration_rc_offline) — For BLaaS-connected RC integrations

## Getting Help

If your Remediation Component is still inactive after following these steps:

- Check [Discourse](https://discourse.crowdsec.net/) for your specific RC type
- Ask on [Discord](https://discord.gg/crowdsec) with your RC logs and `cscli bouncers list` output
- Consult your [RC's documentation page](/u/bouncers/intro)
