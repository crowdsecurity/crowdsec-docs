---
title: Firewall Integration Pulling Zero IPs
id: issue_integration_fw_zero_ips
---

The **Firewall Integration Pulling Zero IPs** issue means that none of its subscribed blocklists have IPs in them.

## What Triggers This Issue

- **Trigger condition**: On your last Pull your integration content was empty.
- **Criticality**: ⚠️ High
- **Impact**: Firewall pulling empty content — not contributing to protection.

## Common Root Causes

- [**No blocklist subscriptions**](#diagnosis--resolution): The integration has no blocklists subscribed to it, so the endpoint has nothing to return.
- [**All subscribed blocklists are empty**](#diagnosis--resolution): The subscribed blocklists currently contain no entries (rare, but possible for user created or dynamic lists).

## Diagnosis & Resolution

This is the most common cause. When a Firewall integration is created in the Console, it must have at least one blocklist subscribed to it before the endpoint will return any IPs.

#### 🔎 See blocklists subscriptions for your integration

1. Navigate to **Blocklists > Integrations**
2. Look if the mentioned integration's tile to see if it has Blocklists

- If **no blocklists** are listed, the BLaaS endpoint will return an empty list on every pull.
- **User made blocklists** you have created might be empty
- Note that the premium-tier blocklist [**Threat Forecast Blocklist**](/u/console/threat_forecast), generated specially for your organization, might be empty if you share no or too few signals

#### 🛠️ Solution: subscribe to one or more blocklists

1. Browse the [blocklists catalogue ↗️](https://app.crowdsec.net/blocklists/search) via the left side menu or by clicking **Add Blocklist** on your integration tile.
2. Follow the [blocklists subscription documentation](/u/console/blocklists/subscription)

## Related Issues

- [Firewall Integration Offline](/u/troubleshooting/issue_integration_fw_offline) — If the firewall has stopped pulling entirely
- [Remediation Component Integration Offline](/u/troubleshooting/issue_integration_rc_offline) — Similar issue for RC-based integrations

## Getting Help

If your firewall integration still shows zero IPs after subscribing to blocklists:

- Check [Discourse](https://discourse.crowdsec.net/) for similar cases
- Ask on [Discord](https://discord.gg/crowdsec) with your integration configuration
- Contact CrowdSec support via the Console
