---
title: Remediation Component Integration Offline
id: issue_integration_rc_offline
---

The **Remediation Component Integration Offline** refers to a [Blocklist-Integration of type Remediation Component](/u/integrations/remediationcomponent) has not pulled from its endpoint for more than 24 hours.

This issue applies to Remediation Components *(aka bouncers)* directly connected to a **Blocklist integration endpoint** *(aka Blocklist as a Service / BLaaS)*.

## What Triggers This Issue

- **Trigger condition**: No pull for 24 hours
- **Criticality**: 🔥 Critical
- **Impact**: Latest blocklist updates not retrieved and potential malfunction of the remediation component.

## Common Root Causes

- [**Configuration errors**](#configuration-errors): Incorrect or missing API URL or API Key in bouncer's configuration file, or malformed settings.
- [**Bouncer service stopped or not loaded**](#bouncer-service-stopped-or-not-loaded): The bouncer daemon, module, or plugin is not running or not enabled.
- [**Network connectivity issues**](#network-connectivity-issues): The bouncer cannot reach the endpoint.

## Diagnosis & Resolution

Depending on the type of bouncer, you'll need to check its installation status, configuration, and running status. Refer to your specific [remediation component documentation](/u/bouncers/intro) for detailed setup and troubleshooting steps.

### Configuration errors

#### 🔎 Verify bouncer configuration has correct API URL and key

For Blocklist-as-a-Service (BLaaS) connectivity, verify the bouncer configuration has proper API URL and key:

1. **api_url**: Must point to your BLaaS endpoint (e.g., `https://admin.api.crowdsec.net/v1/decisions/stream`)
2. **api_key**: Your BLaaS API key *(Found in the Console in your Blocklist integration section, on creation or on "Refresh Credentials")*

:::info
Property names and configuration file locations vary by bouncer type. Check your [remediation component documentation](/u/bouncers/intro) for specifics.
:::

Common configuration file location: `/etc/crowdsec/bouncers/crowdsec-<name>-bouncer.conf`

```bash
# Example: Check configuration file
sudo cat /etc/crowdsec/bouncers/crowdsec-nginx-bouncer.conf
```

#### 🛠️ Update bouncer configuration and restart service

Update the bouncer configuration file with the correct API URL and API key. Example:

```bash
# [...]
API_URL=https://admin.api.crowdsec.net/v1/decisions/stream
API_KEY=<your-blaas-api-key>
UPDATE_FREQUENCY=10s
# [...]
```

After updating, restart the bouncer service or reload your web server.  
See your [remediation component documentation](/u/bouncers/intro) for specific configuration parameters and restart procedures.

### Bouncer service stopped or not loaded

#### 🔎 Check bouncer service status and logs

Verify the bouncer is running and check for errors. 
The method depends on your bouncer type:
- Some Bouncers are modules/plugins (NGINX, Apache...)
- Some are independent processes interacting with a service, via provided config or API (NFtables, Cloudflare,...)

**For modules/plugins** Check the logs of the service to identify any issues with the loading or running of the module.

**For standalone processes:** Make sure the process is running and their logs don't contain launch errors

### Network connectivity issues

#### 🔎 Test connectivity to BLaaS endpoint

From the bouncer host, test network connectivity:

```bash
# Test basic connectivity
curl -I https://admin.api.crowdsec.net/

# Test with API key (should return JSON response)
curl -H "X-Api-Key: <your-api-key>" \
  https://admin.api.crowdsec.net/v1/decisions/stream
```

#### 🛠️ Fix network connectivity issues

If the bouncer cannot reach the BLaaS endpoint:

1. **Check firewall rules** - Ensure outbound HTTPS (443) is allowed
2. **Configure proxy settings** if behind a corporate proxy - see your bouncer's documentation

See [Network Management documentation](/docs/configuration/network_management) for required endpoints.

## Verify Resolution

After making changes:

1. **Wait 1-2 minutes** for the bouncer to attempt its next pull from the endpoint

2. **Check in the Console** - Navigate to your Blocklist integration and verify the "Last Pull" timestamp has updated. The offline alert should clear automatically.

## Remediation Component Documentation

For detailed setup, configuration, and troubleshooting specific to your bouncer type, see:

- [All Remediation Components](/u/bouncers/intro)
- Individual bouncer pages (NGINX, Traefik, HAProxy, Cloudflare, WordPress, etc.)

## Related Issues

- [Firewall Integration Offline](/u/troubleshooting/issue_integration_fw_offline) - Similar issue for firewall bouncers
- [Remediation Components Troubleshooting](/u/troubleshooting/remediation_components) - General bouncer issues

## Getting Help

If your bouncer still doesn't work after following these steps:

- Consult your [remediation component documentation](/u/bouncers/intro)
- Share config and logs on [Discourse](https://discourse.crowdsec.net/)
- Ask on [Discord](https://discord.gg/crowdsec) with bouncer logs and configuration
- Report bugs on the bouncer's GitHub repository
