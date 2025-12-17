---
title: Mismatching Collection(s)
id: issue_mismatch_collections
---

The **Mismatching Collection(s)** issue appears when a specific collection is installed, but the associated log files aren't read. For example having the [crowdsecurity/nginx](https://app.crowdsec.net/hub/author/crowdsecurity/collections/nginx) collection installed, while not reading any nginx logs.

## What Triggers This Issue

- **Trigger condition**: Collection is installed, but no associated logs are read.
- **Criticality**: ⚠️ High
- **Impact**: Service related to the installed collection isn't protected.

## Common Root Causes

- **Missing acquisition**: Collection has been installed, but related acquisition hasn't been configured.
- **Uncommon log files**: The acquisition was configured as per the documentation, but the service logs somewhere else.

## Diagnosis & Resolution

- Refer to the official [hub page of the collection](https://app.crowdsec.net/hub/collections) and see if you added the needed acquisition configuration.

For example, if you installed [crowdsecurity/nginx](https://app.crowdsec.net/hub/author/crowdsecurity/collections/nginx), ensure that you added the recommended acquisition configuration. Look for existing acquisition in `/etc/crowdsec/acquis.yaml` or add the needed one(s):

```bash
cat > /etc/crowdsec/acquis.d/nginx.yaml << EOF
filenames:
  - /var/log/nginx/*.log
labels:
  type: nginx
EOF
```

- Check your service(s) configuration and adapt the acquisition configuration to be able to capture logs.

## Getting Help

If you've verified logs are being read and parsed but still see no alerts:

- Share your setup details on [Discourse](https://discourse.crowdsec.net/)
- Ask on [Discord](https://discord.gg/crowdsec) with `cscli metrics` output
