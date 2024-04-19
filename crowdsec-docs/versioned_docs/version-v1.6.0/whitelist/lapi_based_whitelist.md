---
id: create_lapi
title: LAPI
---

LAPI based whitelist are not your traditional whitelists, as in they wont prevent an overflow from happening, but they will prevent a decision being made by the LAPI this means log processors that forward alerts to the LAPI will not need to be configured individually to ignore certain conditions.

You can create a LAPI based whitelist by prepending a profile to the `profiles.yaml` file:

```yaml
name: whitelist
debug: true
filters:
 - Alert.GetValue() in ["2.2.2.2", "3.3.3.3"]
on_success: break
---   
```

In this example, the LAPI will not make a decision if the source IP is `2.2.2.2` or `3.3.3.3`.

The `profiles.yaml` file location differs based on the OS type here are the default locations:

- Linux: `/etc/crowdsec/profiles.yaml`
- FreeBSD: `/usr/local/etc/crowdsec/profiles.yaml`
- Windows: `C:\ProgramData\CrowdSec\config\profiles.yaml`

You can use our extensive [EXPR helpers](/expr/intro.md) to create more complex whitelists, for example, you can whitelist a range of IPs by using the following syntax:

```yaml
name: whitelist
debug: true
filters:
 - IpInRange(Alert.GetValue(), "192.168.1.0/24")
on_success: break
---
```

If you have implemented a LAPI based whitelist then you must reload the CrowdSec service for the changes to take effect.

```bash title="Reload CrowdSec"
sudo systemctl reload crowdsec
```

