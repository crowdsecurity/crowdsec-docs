---
id: create_lapi
title: LAPI
---

:::warning Deprecated

This approach is deprecated. Please use [Centralized AllowLists](/local_api/allowlists.md) instead.

:::

LAPI-based whitelists differ from parser whitelists: they do not prevent overflows, but they do prevent the LAPI from creating decisions. This means log processors forwarding alerts to the LAPI do not need per-agent ignore rules for those conditions.

Create a LAPI-based whitelist by prepending a profile in `profiles.yaml`:

```yaml
name: whitelist
debug: true
filters:
 - Alert.GetValue() in ["2.2.2.2", "3.3.3.3"]
on_success: break
---   
```

In this example, the LAPI will not make a decision if the source IP is `2.2.2.2` or `3.3.3.3`.

`profiles.yaml` location depends on the OS:

- Linux: `/etc/crowdsec/profiles.yaml`
- FreeBSD: `/usr/local/etc/crowdsec/profiles.yaml`
- Windows: `C:\ProgramData\CrowdSec\config\profiles.yaml`

You can use [EXPR helpers](/expr/intro.md) for more complex whitelists. For example, to whitelist an IP range:

```yaml
name: whitelist
debug: true
filters:
 - IpInRange(Alert.GetValue(), "192.168.1.0/24")
on_success: break
---
```

After adding a LAPI-based whitelist, reload CrowdSec for changes to take effect:

```bash title="Reload CrowdSec"
sudo systemctl reload crowdsec
```
