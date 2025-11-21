---
title: RC Integration Offline
id: issue_rc_integration_offline
---

The **RC Integration Offline** (Remediation Component Integration Offline) issue appears when a non-firewall remediation component (bouncer) has not pulled decisions from the Local API for more than 24 hours. This means your web server, reverse proxy, CDN, or other integration is not receiving block/captcha decisions.

## What Triggers This Issue

- **Trigger condition**: No decision pulls for 24 hours
- **Criticality**: Critical
- **Impact**: Application-level remediation is not working - threats are not being blocked or challenged

## Common Remediation Components

This issue applies to bouncers such as:
- **Web servers**: NGINX, Apache, IIS
- **Reverse proxies**: Traefik, HAProxy, Caddy
- **Application frameworks**: PHP, Wordpress plugins
- **Cloud services**: Cloudflare, Akamai connectors
- **Custom integrations**: Using CrowdSec API

## Common Root Causes

- **Bouncer service or process stopped**: The bouncer daemon, module, or plugin is not running.
- **Authentication failure**: API key is invalid, expired, or the bouncer was removed from the Security Engine.
- **Network connectivity issues**: The bouncer cannot reach the Local API endpoint.
- **Configuration errors**: Incorrect API URL, missing configuration file, or malformed settings.
- **Integration not loaded**: Module/plugin is installed but not enabled in the web server or application.
- **Log rotation or restart issues**: Bouncer lost connection after service restart and didn't reconnect.

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
- Is your bouncer listed?
- Check "Last API Pull" timestamp - is it older than 24 hours?
- Is the bouncer marked as "✓" (valid)?

### Check bouncer service status

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

Log locations vary by bouncer type:

```bash
# Web server logs
sudo tail -50 /var/log/nginx/error.log
sudo tail -50 /var/log/apache2/error.log

# Standalone bouncer logs
sudo tail -50 /var/log/crowdsec-<bouncer-name>.log
sudo journalctl -u crowdsec-<bouncer-name> -n 50

# Docker/Kubernetes
docker logs <bouncer-container>
kubectl logs <bouncer-pod> -n <namespace>
```

**Look for errors like:**
- `connection refused` - API unreachable
- `401 Unauthorized` or `403 Forbidden` - Authentication failed
- `module not loaded` - Integration not enabled
- `invalid configuration` - Config file issues

### Test connectivity to Local API

From the bouncer host:

```bash
# Test network connectivity
curl -I http://<lapi-host>:8080/

# Test with API key
curl -H "X-Api-Key: <your-api-key>" http://<lapi-host>:8080/v1/decisions
```

## How to Resolve

### Restart the bouncer

#### For web server modules

```bash
# NGINX
sudo systemctl restart nginx

# Apache
sudo systemctl restart apache2

# IIS (Windows)
iisreset
```

#### For standalone daemons

```bash
sudo systemctl restart crowdsec-<bouncer-name>
sudo systemctl enable crowdsec-<bouncer-name>
```

### Re-register the bouncer

If the API key is invalid:

#### Generate new API key on Security Engine

```bash
# On LAPI host
sudo cscli bouncers add my-nginx-bouncer

# Copy the generated API key
```

#### Update bouncer configuration

Configuration file locations vary:

**NGINX bouncer:**
```bash
# Edit config
sudo nano /etc/crowdsec/bouncers/crowdsec-nginx-bouncer.conf

# Update api_key line
API_KEY=<paste-new-key>
```

**Traefik bouncer:**
```bash
# Edit config
sudo nano /etc/crowdsec/bouncers/crowdsec-traefik-bouncer.yaml

# Update api_key field
crowdsec_lapi_key: <paste-new-key>
```

**Cloudflare bouncer:**
```bash
# Edit config
sudo nano /etc/crowdsec/bouncers/crowdsec-cloudflare-bouncer.yaml

# Update api_key
crowdsec_lapi_key: <paste-new-key>
```

#### Restart after updating config

```bash
sudo systemctl restart <bouncer-service>
```

### Fix connectivity issues

If bouncer is on a different host:

```bash
# Test connectivity
nc -zv <lapi-host> 8080

# Check API URL in bouncer config
# Should be: http://<lapi-ip>:8080/

# Update bouncer config with correct URL
```

### Enable the module/plugin

Some bouncers require explicit enabling:

#### NGINX

Check `/etc/nginx/nginx.conf` includes the CrowdSec module:

```nginx
load_module modules/ngx_http_crowdsec_module.so;

http {
    # CrowdSec configuration
    crowdsec_enabled on;
    crowdsec_api_url http://127.0.0.1:8080;
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

#### WordPress

Activate the plugin via WordPress admin panel or:
```bash
wp plugin activate crowdsec  # if using WP-CLI
```

### Fix configuration errors

Validate configuration syntax:

```bash
# Web servers
sudo nginx -t
sudo apache2ctl -t

# YAML-based bouncers
sudo cat /etc/crowdsec/bouncers/<bouncer-config>.yaml
# Check for YAML syntax errors
```

**Common config issues:**
- Missing or incorrect `api_url` / `api_key`
- Wrong file permissions (must be readable by web server user)
- Incorrect YAML indentation
- Missing trailing `/` in API URL

### Check file permissions

Bouncer config files must be readable:

```bash
# Check permissions
ls -la /etc/crowdsec/bouncers/

# Fix if needed
sudo chmod 640 /etc/crowdsec/bouncers/crowdsec-nginx-bouncer.conf
sudo chown root:www-data /etc/crowdsec/bouncers/crowdsec-nginx-bouncer.conf
```

## Verify Resolution

After making changes:

1. **Check bouncer service:**
   ```bash
   sudo systemctl status <bouncer-service>
   # or for web servers
   sudo systemctl status nginx
   ```

2. **Verify API pulls are resuming:**
   ```bash
   sudo cscli bouncers list
   ```
   "Last API Pull" should update within seconds/minutes

3. **Check bouncer logs for success:**
   ```bash
   sudo tail -20 /var/log/<bouncer>.log
   ```
   Should see successful API connection messages

4. **Test remediation:**
   Add a test decision:
   ```bash
   sudo cscli decisions add --ip 192.0.2.1 --duration 5m --reason "test"
   ```

   Try accessing your service from that IP (or simulate):
   ```bash
   curl -H "X-Forwarded-For: 192.0.2.1" http://your-service/
   ```
   Should receive 403 Forbidden or a captcha challenge

## Bouncer-Specific Documentation

- [NGINX Bouncer](/u/bouncers/nginx)
- [Traefik Bouncer](/u/bouncers/traefik)
- [HAProxy Bouncer](/u/bouncers/haproxy)
- [Cloudflare Bouncer](/u/bouncers/cloudflare)
- [WordPress Plugin](/u/bouncers/wordpress)
- [All Bouncers](/u/bouncers/intro)

## Kubernetes-Specific Notes

For Kubernetes ingress controllers:

```bash
# Check ingress controller is running
kubectl get pods -n ingress-nginx

# Check CrowdSec integration in ingress
kubectl describe ingress <your-ingress> -n <namespace>

# Check controller logs
kubectl logs -n ingress-nginx <controller-pod> --tail=50
```

Ensure the bouncer is registered and pulling decisions:
```bash
kubectl exec -n crowdsec -it $(kubectl get pods -n crowdsec -l type=lapi -o name) -- cscli bouncers list
```

## Related Issues

- [Firewall Integration Offline](/u/troubleshooting/fw_integration_offline) - Similar issue for firewall bouncers
- [Remediation Components Troubleshooting](/u/troubleshooting/remediation_components) - General bouncer issues

## Getting Help

If your bouncer still doesn't work:

- Check bouncer-specific documentation (links above)
- Share config and logs on [Discourse](https://discourse.crowdsec.net/)
- Ask on [Discord](https://discord.gg/crowdsec) with `cscli bouncers list` output
- Report bouncer bugs on GitHub (check bouncer's repository)
