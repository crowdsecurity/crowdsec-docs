---
id: create_fqdn
title: FQDN
---

:::info
FQDN lookups can be potentially cause latency issues, we only recommend to use this within the `Postoverflow whitelist` stage see [introduction](/whitelist/introduction.md) for your OS specific path
:::

### Create the whitelist with fully qualified domaine name

You might want to whitelist a fully qualified domain name (FQDN eg foo.com), in that case you need to follow this below

Let's create the following file `FQDN-whitelists.yaml` (See [introduction](/whitelist/introduction.md) for your OS specific path) :

```yaml
name: me/FQDN-whitlists
description: "Whitelist postoverflows from FQDN"
whitelist:
  reason: "do whitelistings by FQDN"
  expression:
    - evt.Overflow.Alert.Source.IP in LookupHost("foo.com")
    - evt.Overflow.Alert.Source.IP in LookupHost("foo.foo.org")
    - evt.Overflow.Alert.Source.IP in LookupHost("12123564.org")
```
Save and reload CrowdSec before to test

```bash title="Reload CrowdSec"
sudo systemctl reload crowdsec
```

