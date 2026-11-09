---
id: create_capi
title: CAPI
---

:::warning

This option is deprecated.
You should use [centralized allowlists](/local_api/allowlists.md) instead.

:::

## Whitelists from CAPI (Central API) community blocklist or third party blocklist

From version 1.5.0, you can define IPs or IP ranges to whitelist from the community blocklist or third-party blocklists. Set the whitelist file path in `config.yaml` (no default path is set).

```yaml
api:
  server:
    capi_whitelists_path: <path_to_capi_whitelists_file>
```

Recommended file paths:

- Linux `/etc/crowdsec/capi-whitelists.yaml` 
- Freebsd `/usr/local/etc/crowdsec/capi-whitelists.yaml` 
- Windows `c:/programdata/crowdsec/config/capi-whitelists.yaml`

*These files **DO NOT** exist by default. You **MUST** create them manually and set the path above.*

Example file content:

```yaml
ips:
 - 1.2.3.4
 - 2.3.4.5
cidrs:
 - 1.2.3.0/24
```

```bash title="Reload CrowdSec"
sudo systemctl reload crowdsec
```

:::warning

The whitelist applies only when CrowdSec pulls blocklists from CAPI. IPs already in your local database are not retroactively whitelisted.

You can either delete decisions for specific IPs with `cscli decisions delete`, or delete all alerts and active decisions with `cscli alerts delete --all` and then restart CrowdSec.

:::
