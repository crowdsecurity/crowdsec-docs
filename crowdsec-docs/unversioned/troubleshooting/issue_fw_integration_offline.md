---
title: Firewall Integration Offline
id: issue_fw_integration_offline
---

The **Firewall Integration Offline** issue appears when a firewall that is configured to pull blocklists directly from CrowdSec's Blocklist-as-a-Service (BLaaS) endpoint has not pulled the list for more than 24 hours. This means your firewall is no longer receiving the latest threat intelligence and blocked IPs.

## What Triggers This Issue

- **Trigger condition**: No pull from BLaaS endpoint for 24 hours
- **Criticality**: 🔥 Critical
- **Impact**: Firewall blocklist is not being updated - new threats are not being blocked - Firewall potentially malfunctioning.

## Common Root Causes

- **Firewall rule disabled or removed**: The firewall rule that pulls from external blocklists no longer exists or has been disabled.
- **BLaaS credentials invalid**: The basic auth credentials configured in the firewall for accessing the BLaaS endpoint is incorrect, expired, or has been regenerated.
- **Network connectivity issues**: The firewall cannot reach the BLaaS endpoint due to network problems, DNS issues, or routing failures.
- **Firewall offline**: The firewall itself is powered off, unreachable, or not processing rules.

## How to Diagnose

### Check if the firewall is running and has access to BLaaS endpoint

// a few lines describe generic ways for them to check their firewall is workin and can ping https://admin.api.crowdsec.net

### Check if the firewall rule for external blocklist still exists

Access your firewall's management interface and verify:

1. **Navigate to the external blocklist configuration section** (varies by vendor):
   - FortiGate: Security Fabric → External Connectors → Threat Feeds
   - Palo Alto: Objects → External Dynamic Lists
   - ...

2. **Verify the rule exists and is valid:**
   - Is the CrowdSec blocklist rule present?
   - Is it enabled/active?
   - Check the URL configured - should point to `https://admin.api.crowdsec.net/...`
   - Some firewalls have a "test" function for external feeds access

### Check BLaaS endpoint credentials

Verify the basic auth credentials configured in your firewall matches the one from the Console:

**Get the correct basic auth credentials from CrowdSec Console:**
If you lost the credentials you can regenerate them:
   - Navigate to **Blocklists** → **Integrations**: select your firewall integration
   - Click **Configuration** → **Refresh Credentials** if you suspect the key is wrong (this will generate a new one)
   - Copy the displayed API key or authentication header
**Check authentication method:**
   - Some firewalls use HTTP headers (`X-Api-Key: <key>`)
   - Others may use URL parameters (`?api_key=<key>`)
   - Some may offer basic auth forms that are not functional *(Checkpoint among other)*, you can put the credentials directly into the URL: `https://<username>:<password>@https://admin.api.crowdsec.net/...`

### Test connectivity to BLaaS endpoint

From a host on the same network as your firewall (or from the firewall's CLI if available):

```bash
# Test network connectivity
curl -I https://admin.api.crowdsec.net/

# Test with Credentials
curl -I https://<username>:<password>admin.api.crowdsec.net/v1/integrations/<yourIntegId>/content

# Expected response: JSON with decisions or empty list
# Should NOT return 401 Unauthorized or 403 Forbidden
```

If you get connection errors:
- DNS resolution failures - check DNS configuration
- Connection timeouts - firewall outbound rules may be blocking
- SSL/TLS errors - firewall may need updated root certificates

### Check firewall logs

Review your firewall's logs for errors related to external blocklist updates:

**Common log locations by vendor:**
*Path to logs may vary depending on your firewall version, check your documentation.*
- **FortiGate**: Log & Report → System Events → filter for "Threat Feed"
- **Palo Alto**: Monitor → System Logs → filter for "External Dynamic List"
- **pfSense**: Status → System Logs → Firewall
- **OPNsense**: System → Log Files → Firewall

**Look for error messages like:**
- `failed to download` - connectivity issue
- `authentication failed` or `401` - API key invalid
- `SSL certificate verification failed` - certificate trust issue
- `timeout` - network connectivity or endpoint unreachable
- `invalid format` - blocklist format mismatch

## How to Resolve

### If the firewall rule is disabled or missing

Re-enable or recreate the external blocklist rule:

### If BLaaS credentials are invalid

Update the API key in your firewall configuration:

1. **Regenerate API key in Console** (if needed):
   - Navigate to **Integrations** → **Blocklists** → select firewall integration
   - Click **Refresh Credentials**
   - Copy the new API key

2. **Update firewall configuration** with the new API key:
   - Edit the external blocklist rule
   - Update the authentication header or API key field
   - Save and apply changes

3. **Trigger manual update** to test:
   - Most firewalls have a "Refresh Now" or "Update" button
   - Click it to force an immediate pull from BLaaS
   - Check logs for success or errors

### If network connectivity is failing

Fix network issues preventing firewall from reaching BLaaS:

1. **Check firewall outbound rules:**
   - Ensure firewall allows outbound HTTPS (port 443) to `admin.api.crowdsec.net`
   - Verify no egress filtering is blocking the connection
   - Check if firewall's management interface has internet access

2. **Verify DNS resolution:**
   ```bash
   # From firewall CLI or nearby host
   nslookup admin.api.crowdsec.net
   dig admin.api.crowdsec.net
   ```

   If DNS fails, configure firewall to use public DNS (8.8.8.8, 1.1.1.1) temporarily

3. **Check proxy settings:**
   - If firewall uses a proxy for outbound connections, verify proxy configuration
   - Ensure proxy allows HTTPS connections to CrowdSec endpoints
   - Test proxy with: `curl -x <proxy-host>:<port> https://admin.api.crowdsec.net/`

4. **Test from firewall CLI:**
   - If firewall has CLI access, test connectivity directly:
     ```bash
     # Example for pfSense/OPNsense
     curl -I https://admin.api.crowdsec.net/

     # Example for FortiGate
     execute ping admin.api.crowdsec.net
     execute telnet admin.api.crowdsec.net 443
     ```

5. **Check SSL/TLS certificate trust:**
   - Ensure firewall trusts public CA certificates
   - Update firewall's certificate store if needed
   - Temporarily disable certificate verification for testing (then fix properly)

### If the firewall is offline

Restore firewall connectivity:

1. **Physical/Virtual access:**
   - Check if firewall hardware is powered on
   - For virtual firewalls, verify VM is running
   - Check network cables and interfaces

2. **Management access:**
   - Connect via console/KVM if network management is down
   - Verify management interface IP configuration
   - Check firewall's default gateway

3. **After restoring connectivity:**
   - Trigger manual blocklist update
   - Verify last pull timestamp updates in Console
   - Monitor firewall logs for successful updates

## Verify Resolution

After making changes:

1. **Trigger manual update on firewall:**
   - Use the firewall's "Refresh" or "Update Now" function
   - Wait 30-60 seconds for the pull to complete

2. **Check in CrowdSec Console:**
   - Navigate to **Integrations** → **Blocklists**
   - Verify the "Last Pull" timestamp has updated to a recent time (within last few minutes)
   - The offline alert should clear automatically during next polling cycle

3. **Verify blocklist is populated:**
   - Check your firewall shows IP addresses in the blocklist
   - Number of entries should match your subscription tier and decisions
   - Example: FortiGate → System → External Resources → view entries

## Related Issues

- [RC Integration Offline](/u/troubleshooting/issue_rc_integration_offline) - Similar issue for remediation components (bouncers)
- [Security Engine Offline](/u/troubleshooting/issue_security_engine_offline) - If using agent-based deployment
- [Blocklist Integration Setup](/u/integrations/blocklists/intro) - Initial setup guide

## Getting Help

If your firewall integration still shows as offline:

- Check firewall vendor's documentation for external blocklist configuration
- Share firewall logs on [Discourse](https://discourse.crowdsec.net/)
- Ask on [Discord](https://discord.gg/crowdsec) with firewall model and error messages
- Contact CrowdSec support via Console if BLaaS endpoint issues persist
