---
id: create_ip
title: IP / CIDR
---

:::info Recommended: Use Centralized AllowLists

For IP and CIDR-based allowlisting, we recommend using [Centralized AllowLists](/local_api/allowlists.md) instead. AllowLists are managed at the LAPI level, making them easier to maintain and they also affect blocklist pulls. The parser whitelists documented below are more suited for complex expressions based on log elements.

:::

IP whitelists are best suited for the `Parser whitelists` stage: once a log line is parsed, CrowdSec already knows the IP and can discard it early to save resources.

Create `mywhitelist.yaml` in your parser whitelist directory (see [introduction](/log_processor/whitelist/introduction.md) for OS-specific paths):

```yaml
name: "my/whitelist" ## Must be unique
description: "Whitelist events from my ip addresses"
whitelist:
  reason: "my ip ranges"
  ip:
    - "192.168.1.1" # Replace with your public IP
  cidr:
    - "192.168.1.0/24" # Replace with your public IP range
```

```bash title="Reload CrowdSec"
sudo systemctl reload crowdsec
```

### Test the whitelist

Use a security tool such as `nikto` to test the whitelist:

```bash
nikto -host myfqdn.com
```

```bash
sudo cscli decisions list --ip <your_whitelisted_ip>
```

The expected result is `No active decisions`.

### I still see an old decision?

Whitelisting only prevents new decisions. Remove old decisions with:

```bash
sudo cscli decisions delete --ip <your_whitelisted_ip>
```
