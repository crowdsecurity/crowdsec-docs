---
id: create_capi
title: CAPI
---

## Whitelists from CAPI (Central API) community blocklist or third party blocklist

From version 1.5.0 a user can specify a list of IP's or IP ranges to be whitelisted from a community blocklist or third party blocklist. You will have to specify a path to the file within `config.yaml` as by default there is no file specified.

```yaml
api:
  server:
    capi_whitelists_path: <path_to_capi_whitelists_file>
```

We recommend to use the following files for each OS:

- Linux `/etc/crowdsec/capi-whitelists.yaml` 
- Freebsd `/usr/local/etc/crowdsec/capi-whitelists.yaml` 
- Windows `c:/programdata/crowdsec/config/capi-whitelists.yaml`

*These files **DO NOT** exist and you **MUST** create them manually and configure the above settings*

The following snippet should be used as a guide

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

The whitelist only applies when crowdsec pulls the blocklist from CAPI. This means that any IPs already in your local database will not get whitelisted.

You can either manually delete the decisions for the IPs you want to whitelist with `cscli decisions delete`, or delete all alerts and active decisions from the database with `cscli alerts delete --all` and restart crowdsec.

:::
