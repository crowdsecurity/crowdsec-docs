---
title: Firewall Integration Offline
id: issue_integration_fw_offline
---

The **Firewall Integration Offline** issue appears when a firewall configured to pull blocklists directly from CrowdSec Blocklist-as-a-Service (BLaaS) has not pulled in more than 24 hours.   
This means your firewall is no longer receiving the latest threat intelligence and blocked IPs.

## What Triggers This Issue

- **Trigger condition**: No pull from BLaaS endpoint for 24 hours
- **Criticality**: 🔥 Critical
- **Impact**: Firewall blocklist is not updated; new threats are not blocked; firewall may be malfunctioning.

## Common Root Causes

- [**Firewall rule disabled or removed**](#firewall-rule-disabled-or-removed): The firewall rule that pulls from external blocklists no longer exists or has been disabled.
- [**BLaaS credentials invalid**](#blaas-credentials-invalid): The Basic Auth credentials configured in the firewall for the BLaaS endpoint are incorrect, expired, or were regenerated.
- [**Network connectivity issues**](#network-connectivity-issues): The firewall cannot reach the BLaaS endpoint due to network problems, DNS issues, or routing failures.
- [**Firewall offline**](#firewall-offline): The firewall itself is powered off, unreachable, or not processing rules.

## Diagnosis & Resolution

### Firewall rule disabled or removed

#### 🔎 Verify the CrowdSec blocklist rule exists and is enabled

Access your firewall's management interface and check if the CrowdSec blocklist rule is present and enabled.

:::info
External blocklist configuration location varies by vendor. Check your firewall's documentation for "External Threat Feeds", "External Dynamic Lists", or "URL Aliases". See [Blocklist Integration Setup](/u/integrations/intro) for vendor-specific guidance.
:::

Verify:
- CrowdSec blocklist rule is present and enabled
- URL points to `https://admin.api.crowdsec.net/...`
- Use the firewall's "test" or "refresh" function if available

#### 🛠️ Re-enable or recreate the external blocklist rule

1. **If the rule is disabled** - Re-enable it in your firewall's configuration
2. **If the rule is missing** - Recreate it following your [firewall's integration documentation](/u/integrations/intro)
3. **Trigger manual update** - Use "Refresh Now" or "Update" button and check logs for errors

### BLaaS credentials invalid

:::info
Credentials are shown at creation. Store them in your password manager.  
You can regenerate them from the Console UI.
:::

#### 🛠️🔎 Verify credentials and test connectivity

🔎 Make sure your firewall configuration uses both the BLaaS endpoint URL and the Basic Auth credentials.  
🛠️ Use the *Configuration/Refresh Credentials* action on your integration if you lost them.

🔎 Some firewalls provide Basic Auth forms, but some versions have bugs.  
🛠️ Try embedding Basic Auth directly in the URL provided to your firewall:
- `https://<username>:<password>@admin.api.crowdsec.net/v1/integrations/<yourIntegId>/content`

### Network connectivity issues

#### 🔎 Test connectivity and review logs

Test network connectivity from a host on the same network or from the firewall's CLI:

```bash
# Test basic connectivity
curl -I https://admin.api.crowdsec.net/

# Test DNS resolution
nslookup admin.api.crowdsec.net
```

Review your firewall's logs for errors related to external blocklist updates. Look for:
- `failed to download` - connectivity issue
- `authentication failed` or `401` - API key invalid
- `SSL certificate verification failed` - certificate trust issue
- `timeout` - network connectivity or endpoint unreachable

:::info
Log locations vary by firewall vendor. Check your firewall's documentation for system event logs. See [Blocklist Integration Setup](/u/integrations/intro) for vendor-specific guidance.
:::

#### 🛠️ Fix network connectivity issues

1. **Check firewall outbound rules** - Ensure outbound HTTPS (443) is allowed to `admin.api.crowdsec.net`
2. **Verify DNS resolution** - Configure public DNS (8.8.8.8, 1.1.1.1) if needed
3. **Check proxy settings** - Verify proxy configuration if using one
4. **Update SSL/TLS certificates** - Ensure firewall trusts public CA certificates

See [Network Management documentation](/docs/configuration/network_management) for required endpoints.

### Firewall offline

#### 🔎 Check if firewall is accessible and running

Verify basic firewall accessibility:
- Can you access the firewall's management interface?
- Is the firewall responding to ping requests?
- Are firewall services running normally?

#### 🛠️ Restore firewall connectivity

1. **Physical/Virtual access** - Check hardware is powered on or VM is running
2. **Management access** - Connect via console/KVM if needed and verify network configuration
3. **After restoring connectivity** - Trigger manual blocklist update and verify in Console

## Verify Resolution

After making changes:

1. **Trigger manual update** - Use the firewall's "Refresh" or "Update Now" function and wait 30-60 seconds

2. **Check in CrowdSec Console** - Navigate to **Integrations** → **Blocklists** and verify the "Last Pull" timestamp has updated. The offline alert should clear automatically.

3. **Verify blocklist is populated** - Check your firewall shows IP addresses in the blocklist (number should match your subscription tier)

## Firewall Integration Documentation

For detailed setup and configuration specific to your firewall vendor:

- [Blocklist Integration Setup Guide](/u/integrations/blocklists/intro)
- Vendor-specific integration pages (FortiGate, Palo Alto, pfSense, OPNsense, etc.)

## Related Issues

- [Remediation Component Integration Offline](/u/troubleshooting/issue_integration_rc_offline) - Similar issue for remediation components (bouncers)
- [Security Engine Offline](/u/troubleshooting/issue_se_offline) - If using agent-based deployment

## Getting Help

If your firewall integration still shows as offline after following these steps:

- Consult your [firewall's integration documentation](/u/integrations/blocklists/intro)
- Share firewall logs on [Discourse](https://discourse.crowdsec.net/)
- Ask on [Discord](https://discord.gg/crowdsec) with firewall model and error messages
- Contact CrowdSec support via Console if BLaaS endpoint issues persist
