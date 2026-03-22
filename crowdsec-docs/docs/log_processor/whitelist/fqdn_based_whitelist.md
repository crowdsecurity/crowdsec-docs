---
id: create_fqdn
title: FQDN
---

:::info
FQDN lookups can cause latency. We recommend using them only in the `Postoverflow whitelist` stage. See [introduction](/log_processor/whitelist/introduction.md) for your OS-specific path.
:::

### Create a whitelist by fully qualified domain name

If you need to whitelist a fully qualified domain name (FQDN), for example `foo.com`, create a whitelist file like this:

Create `FQDN-whitelists.yaml` in your whitelist directory (see [introduction](/log_processor/whitelist/introduction.md) for your OS-specific path):

```yaml
name: "my/fqdn-whitelists" ## Must be unique
description: "Whitelist postoverflows by FQDN"
whitelist:
  reason: "whitelist by FQDN"
  expression:
    - evt.Overflow.Alert.Source.IP in LookupHost("foo.com")
    - evt.Overflow.Alert.Source.IP in LookupHost("foo.foo.org")
    - evt.Overflow.Alert.Source.IP in LookupHost("12123564.org")
```
Then reload CrowdSec:

```bash title="Reload CrowdSec"
sudo systemctl reload crowdsec
```
