---
title: Central API 403 (Forbidden)
id: capi_403
---

Getting a **403 (Forbidden)** from **CrowdSec Central API (CAPI)** means your Security Engine request is blocked or your IP is being rate limited.  
This is commonly tied to misconfigured setups, and triggers a 1 hour ban from CrowdSec's API.

## What Triggers This Issue

- **Trigger condition**: Amount of logins exceeds thresholds.
- **Criticality**: ⚠️ High
- **Impact**: No enrollment, no metrics, no decisions, and no reputation sharing updates

## Common Root Causes

- **CrowdSec containers restart loop**: CrowdSec containers stuck in a restart loop.
- **`cscli capi status` spam**: Integrations or 3rd party software using `cscli capi status` too often.
- **Misconfiguration or multiple instances**: Duplicate engines or invalid tokens trigger repeated logins.

## Diagnosis & Resolution

### Temporary ban due to login bursts

In **CAPI login**, every IP using a **free account** can be blocked for 1 hour when thresholds are exceeded:

- **Non Sharing, not enrolled**: more than 5 logins in 50 minutes
- **Sharing, not enrolled**: more than 10 logins in 50 minutes
- **Enrolled, non sharing**: more than 10 requests in 50 minutes
- **Enrolled, sharing**: more than 20 requests in 50 minutes

#### 🔎 Check for repeated login attempts

Look for repeated CAPI login failures or bursts:

```bash
sudo journalctl -u crowdsec -n 100
```

If you see many login attempts in a short period, you likely hit the temporary ban.

#### 🔎 Inspect engine activity

Check that the engine is stable and not in a crash loop:

```bash
sudo systemctl status crowdsec
```
```bash
sudo journalctl -u crowdsec -n 50
```

<details>
   <summary>Check logs for Docker</summary>

```bash
docker compose up
```

</details>

Crash loops can trigger repeated logins, resulting in 403s.

#### 🛠️ Wait for ban expiry and reduce login frequency

Wait **1 hour** for the ban to expire, then ensure the engine is not repeatedly re-authenticating.

If you run multiple instances behind the same NAT, consider using **one LAPI instance** or lowering reconnection frequency to avoid bursts.

#### 🛠️ Stabilize the engine

Resolve the underlying crash or restart loop before retrying CAPI:

```bash
sudo systemctl restart crowdsec
```

### Misconfiguration or multiple instances

Running multiple instances from the same public IP can lead to trigering the rate limit.

## Verify Resolution

After making changes:

Restart or reload CrowdSec: `sudo systemctl restart crowdsec`

1. Check engine status:
   ```bash
   sudo cscli console status
   ```

2. Check CAPI connectivity:
   ```bash
   sudo cscli capi status
   ```

If CAPI returns 200/204 and your console status is OK, the 403 is resolved.

## Related Issues

- [Security Engine Troubleshooting](/u/troubleshooting/security_engine) - General Security Engine issues
- [Network Management](/docs/configuration/network_management) - Console and CAPI endpoints

## Getting Help

If you still get 403 responses from CAPI:

- Check [Discourse](https://discourse.crowdsec.net/) for similar cases
- Ask on [Discord](https://discord.gg/crowdsec) with your `sudo cscli support dump` output
