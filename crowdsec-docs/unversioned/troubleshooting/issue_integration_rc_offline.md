---
title: Remediation Component Integration Offline
id: issue_integration_rc_offline
---

The **Remediation Component Integration Offline** refers to a Blocklist-Integration of type Remediation Component has not pulled from its endpoint for more than 24 hours.

This issue applies to Remediation Component (aka bouncers) directly connected to a Blocklist integration endpoint (aka Blocklist as a Service / BLaaS).

## What Triggers This Issue

- **Trigger condition**: No pull for 24 hours
- **Criticality**: Critical
- **Impact**: Latest blocklist updates not retrieved and potential malfunction of the remediation component.

## Common Root Causes

- **Bouncer service or process stopped**: The bouncer daemon, module, or plugin is not running.
- **Configuration errors**: Incorrect or missing API URL or API Key in bouncer's configuration file, or malformed settings.
- **Network connectivity issues**: The bouncer cannot reach the endpoint.
- **Bouncer not loaded**: Bouncer Module/plugin is installed but not enabled or started.

## How to Diagnose

Depending on the type of bouncer, you'll need to check its installation status, configuration, and running status.

**Types of remediation components:**
- **Web server modules**: NGINX, Apache plugins
- **Reverse proxy integrations**: Traefik, HAProxy, Caddy middlewares
- **Application frameworks**: PHP libraries, WordPress plugins
- **Cloud service workers**: Cloudflare Workers, Fastly Compute, autonomous update daemons
- **Custom integrations**: Using the Bouncer SDK

### Check bouncer configuration has proper parameters

For Blocklist-as-a-Service (BLaaS) connectivity, verify the bouncer configuration has proper api url and key 
:::info
Properties name may vary: *api_url, api_key or lapi_url_lapi_key* ... Check your [bouncer's doc](/u/bouncers/intro)
:::


1. **api_url**: Must point to your BLaaS endpoint (e.g., `https://admin.api.crowdsec.net/v1/decisions/stream`)
2. **api_key**: Your BLaaS API key *(Found in the Console in your Blocklist integration section, on creation or on "Refresh Credentials")*

**Common configuration file locations:**
- **On host**: `/etc/crowdsec/bouncers/crowdsec-<name>-bouncer.conf`
- ie: **NGINX**: `/etc/crowdsec/bouncers/crowdsec-nginx-bouncer.conf`
- **WordPress**: Admin panel → CrowdSec → **Connection details** Section

Check the configuration file:
```bash
# Example for NGINX bouncer
sudo cat /etc/crowdsec/bouncers/crowdsec-nginx-bouncer.conf

# Look for:
# API_URL=https://admin.api.crowdsec.net/v1/decisions/stream
# API_KEY=<your-blaas-api-key>
```

### Check bouncer service status

Verify the bouncer is running and hasn't encountered errors.

#### For host-based processes

Check if the bouncer process or service is running:

Depending on your bouncer type:

#### Web server module bouncers

```bash
# NGINX
sudo systemctl status nginx
sudo nginx -t  # Test configuration

# Apache
sudo systemctl status apache2
sudo apache2ctl -t  # Test configuration

# Check if module is loaded
# NGINX: check nginx.conf for crowdsec module
# Apache: check mods-enabled/crowdsec.conf
```

#### Standalone bouncer daemons

```bash
# Traefik bouncer
sudo systemctl status crowdsec-traefik-bouncer

# HAProxy bouncer
sudo systemctl status crowdsec-haproxy-bouncer

# Cloudflare bouncer
sudo systemctl status crowdsec-cloudflare-bouncer
```

### Check bouncer logs

Bouncer logs locations vary by type:

**Standalone daemon bouncers:**
- **Systemd services**: `sudo journalctl -u crowdsec-<bouncer-name> -n 50`
- **Traefik/HAProxy/Cloudflare**: `/var/log/crowdsec-<bouncer-name>.log`

**Web server module bouncers:**
- **NGINX**: Check main NGINX error log (`/var/log/nginx/error.log`)
- **Apache**: Check Apache error log (`/var/log/apache2/error.log`)

**Application framework bouncers:**
- **WordPress**: WordPress debug log or plugin settings page
- **PHP**: Application logs or web server error logs

**Cloud service workers:**
- **Cloudflare Workers**: Cloudflare dashboard → Workers → Logs
- **Fastly Compute**: Fastly dashboard → Real-time logs

**Look for errors like:**
- `connection refused` or `timeout` - API endpoint unreachable
- `401 Unauthorized` or `403 Forbidden` - API key invalid or missing
- `module not loaded` - Integration not enabled in web server
- `invalid configuration` - Config file syntax or parameter errors
- `rate limit exceeded` - Cloud service plan limits reached

### Test connectivity to the endpoint

From the bouncer host:

```bash
# Test network connectivity
curl -I https://<endpoint_url>/

# Test with API key
curl -H "X-Api-Key: <endpoint_url>" https://<endpoint_url> 
```

## How to Resolve

### Restart the bouncer

#### For web server modules

```bash
# NGINX
sudo systemctl restart nginx

# Apache
sudo systemctl restart apache2
```

#### For standalone daemons

```bash
sudo systemctl restart crowdsec-<bouncer-name>
sudo systemctl enable crowdsec-<bouncer-name>
```

### Update bouncer configuration

If the API URL or API key is incorrect, update the bouncer's configuration file:

**NGINX bouncer** (`/etc/crowdsec/bouncers/crowdsec-nginx-bouncer.conf`):
```bash
API_URL=https://admin.api.crowdsec.net/v1/decisions/stream
API_KEY=<your-blaas-api-key>
UPDATE_FREQUENCY=10s
```

**Traefik bouncer** (`/etc/crowdsec/bouncers/crowdsec-traefik-bouncer.yaml`):
```yaml
crowdsec_url: https://admin.api.crowdsec.net/v1/decisions/stream
crowdsec_api_key: <your-blaas-api-key>
update_frequency: 10s
```

**HAProxy bouncer** (`/etc/crowdsec/bouncers/crowdsec-haproxy-bouncer.conf`):
```bash
CROWDSEC_URL=https://admin.api.crowdsec.net/v1/decisions/stream
CROWDSEC_API_KEY=<your-blaas-api-key>
```

After updating, restart the bouncer service.

### Fix connectivity issues

If the bouncer cannot reach the BLaaS endpoint:

1. **Test network connectivity:**
   ```bash
   curl -I https://admin.api.crowdsec.net/
   ```

2. **Check firewall rules:**
   ```bash
   # Ensure outbound HTTPS (443) is allowed
   sudo ufw status
   # or
   sudo firewall-cmd --list-all
   ```

3. **Test with API key:**
   ```bash
   curl -H "X-Api-Key: <your-api-key>" \
     https://admin.api.crowdsec.net/v1/decisions/stream
   ```

   Should return `{"new":null,"deleted":null}` or similar if authenticated.

4. **Check proxy settings** if using a corporate proxy - configure in bouncer's environment or config file.

5. **For cloud workers (Cloudflare/Fastly):**
   - Verify the worker is deployed and running
   - Check if you've hit rate limits on your plan
   - Review worker logs for errors

### Enable the module/plugin

Some bouncers require explicit enabling:

#### NGINX

Check `/etc/nginx/nginx.conf` includes the CrowdSec module:

```nginx
load_module modules/ngx_http_crowdsec_module.so;

http {
    # CrowdSec configuration
    crowdsec_enabled on;
    crowdsec_api_url https://<endpoint_url>;
    # ...
}
```

Test and reload:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

#### Apache

Enable the module:
```bash
sudo a2enmod crowdsec
sudo systemctl restart apache2
```

## Verify Resolution

After making changes:

1. **Wait 1-2 minutes** for the bouncer to attempt its next pull from the endpoint

2. **Check in the Console:**
   - Navigate to your Blocklist integration
   - Look at the integration tile
   - Verify the "Last Pull" timestamp has updated to a recent time (within last few minutes)
   - The offline alert should clear automatically

3. **Verify bouncer is pulling decisions:**
   ```bash
   # For standalone daemons, check logs
   sudo journalctl -u crowdsec-<bouncer-name> -n 20

   # Look for successful pull messages like:
   # "Successfully pulled X decisions"
   # "Decisions updated"
   ```

4. **Test that blocking is working** (optional but recommended):
   - Check bouncer-specific documentation for test procedures
   - For web servers, you can test by temporarily adding a test decision

Once fixed, the issues concerning those RC will disappear on next SE info update *(within 30minutes)*.

## Bouncer-Specific Documentation

- [NGINX Bouncer](/u/bouncers/nginx)
- [Traefik Bouncer](/u/bouncers/traefik)
- [HAProxy Bouncer](/u/bouncers/haproxy)
- [Cloudflare Bouncer](/u/bouncers/cloudflare)
- [WordPress Plugin](/u/bouncers/wordpress)
- [All Bouncers](/u/bouncers/intro)

## Related Issues

- [Firewall Integration Offline](/u/troubleshooting/issue_integration_fw_offline) - Similar issue for firewall bouncers
- [Remediation Components Troubleshooting](/u/troubleshooting/remediation_components) - General bouncer issues

## Getting Help

If your bouncer still doesn't work:

- Check bouncer-specific documentation (links above)
- Share config and logs on [Discourse](https://discourse.crowdsec.net/)
- Ask on [Discord](https://discord.gg/crowdsec) with `cscli bouncers list` output
- Report bouncer bugs on GitHub (check bouncer's repository)
