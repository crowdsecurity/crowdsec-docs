---
id: create_ip
title: IP / CIDR
---

IP whitelists are best suited at `Parser whitelists` level because once the log line has been parsed we already know the IP address and can save resources by discarding it earlier in the pipeline.

We will create the file `mywhitelist.yaml` please see [introduction](/log_processor/whitelist/introduction.md) for your OS specific paths.

```yaml
name: "my/whitelist" ## Must be unique
description: "Whitelist events from my ip addresses"
whitelist:
  reason: "my ip ranges"
  ip:
    - "192.168.1.1" # Replace with your WAN IP
  cidr:
    - "192.168.1.0/24" # Replace with your WAN IP range
```

```bash title="Reload CrowdSec"
sudo systemctl reload crowdsec
```

### Test the whitelist

You can run a security tool such as `nikto` to test your whitelist

```bash
nikto -host myfqdn.com
```

```bash
sudo cscli decisions list --ip {your_whitelisted_ip}
```

Should show the result `No active decisions`

### I still see an old decision?

The whitelist will only prevent new decisions so you must remove any old decisions with

```bash
sudo decisions delete --ip {your_whitelist_ip}
```
