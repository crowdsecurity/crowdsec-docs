---
title: Central API 403 / CAPI rate limiting
id: capi_403
---

Getting a **403 (Forbidden)** from **CrowdSec Central API (CAPI)** means your Security Engine requests are blocked or your IP is rate limited.  
This is commonly caused by misconfiguration and triggers a 1-hour ban from CrowdSec API.

:::info
CAPI restrictions apply only to free users. Enterprise users are not impacted.
:::

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

- **Non Sharing, not enrolled**: more than 20 logins in 50 minutes
- **Sharing, not enrolled**: more than 20 logins in 50 minutes
- **Enrolled, non sharing**: more than 20 requests in 50 minutes
- **Enrolled, sharing**: more than 20 requests in 50 minutes
- **Non-free users**: this restriction does not apply

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

#### 🛠️ Fix the root cause, then stop the service for 1 hour

:::warning
**Stopping the service is required.** If CrowdSec keeps running while blocked, every retry resets the cooldown timer and prolongs the ban. You must stop it completely for at least 1 hour after fixing the root cause.
:::

```bash
sudo systemctl stop crowdsec
# fix the underlying issue, then wait 1 hour before starting again
sudo systemctl start crowdsec
```

For Docker: `docker compose down`, fix, wait 1 hour, then `docker compose up -d`.

If you run multiple instances behind the same NAT, consider consolidating under [one LAPI instance](/u/user_guides/multiserver_setup).

### Health check calling `cscli capi status` too frequently

Some third-party stacks configure a Docker health check that runs `cscli capi status` on a short interval. This authenticates against CAPI on every check and quickly exhausts the login threshold.

See [Docker installation — Health checks](/u/getting_started/installation/docker#health-checks) for the recommended `cscli lapi status` health check configuration.

### Misconfiguration or multiple instances

Running multiple instances from the same public IP can trigger rate limiting.

## Verify Resolution

After fixing the root cause and waiting 1 hour:

1. Start the service and check CAPI connectivity:

```bash
sudo systemctl start crowdsec
sudo cscli capi status
```

If it returns `You can successfully interact with Central API (CAPI)`, the ban is lifted.

If still blocked, contact [security@crowdsec.net](mailto:security@crowdsec.net) with your source IP and relevant logs.

## Known Issues

3rd party software or related issues:
 - [Pangolin](https://github.com/orgs/fosrl/discussions/2119)
 - [CrowdSec Issue](https://github.com/crowdsecurity/crowdsec/issues/4165)

## Related Issues

- [Security Engine Troubleshooting](/u/troubleshooting/security_engine) - General Security Engine issues
- [Network Management](/docs/configuration/network_management) - Console and CAPI endpoints

## Getting Help

If you still get 403 responses from CAPI:

- Check [Discourse](https://discourse.crowdsec.net/) for similar cases
- Ask on [Discord](https://discord.gg/crowdsec) with your `sudo cscli support dump` output
