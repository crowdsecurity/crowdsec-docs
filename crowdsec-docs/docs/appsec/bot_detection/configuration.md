---
id: configuration
title: Bot detection configuration
sidebar_position: 2
---

<!--
  Hub item names below ending in `_XX_..._XX_` are placeholders pending
  publication. See the bot detection intro for the canonical placeholder list.
-->

This page covers the configuration of the bot detection feature: the signing keys and their rotation, cookie lifetime, and JavaScript bundle obfuscation.

## Where to set these values

Bot-detection settings live under a top-level `challenge:` block inside an appsec-config YAML file — the same kind of file documented in [AppSec configuration syntax](../configuration.md). Multiple appsec-configs loaded by your AppSec acquisition combine field by field, so you can keep the upstream collection's appsec-config unchanged and ship a small overlay of your own that only sets what you care about. The mechanics of loading and merging appsec-configs are covered in [AppSec configuration syntax](../configuration.md#configuration-file-format).

A minimal overlay looks like this — every field below is optional, see the rest of this page for what each one does:

```yaml
# /etc/crowdsec/appsec-configs/mycorp-overlay.yaml
name: _XX_APPSEC_CONFIG_OVERLAY_XX_

challenge:
  master_secret: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
  crypto_obfuscation_pool_size: 3
```

Reload CrowdSec for changes to take effect:

```bash
sudo systemctl reload crowdsec
```

## Key management

The challenge mechanism is built on a long-lived **master secret**, from which the AppSec component derives two independent key families: one rotated on a schedule that signs challenge tickets and validates proof-of-work, and one (static for the lifetime of the master secret) that seals the success cookie.

| Key | Default | Operational meaning |
|---|---|---|
| `master_secret` | random, ephemeral (single-instance only) | Long-lived secret used to derive every other key. Hex (≥64 chars, preferred) or passphrase (≥32 bytes of UTF-8). **Required** when running more than one AppSec instance — all instances must share the same value or cookies issued by one are rejected by another. |
| `key_rotation_interval` | `5m` | How often the per-epoch signing key advances. All instances in a distributed setup must agree on this value to derive identical per-epoch keys. Minimum 30s. |
| `max_live_epochs` | `3` | How many past epochs (in addition to the current one) the AppSec component still accepts. Bump this if a meaningful share of your clients need more than `(max_live_epochs + 1) × key_rotation_interval` to solve and submit the challenge (slow mobile networks, long round-trips). |
| `cookie_ttl` | `12h` | How long a successful-challenge cookie stays valid. Decoupled from key rotation — the cookie carries its own `not_after` timestamp sealed under the master cookie key, so rotating the per-epoch sign key does **not** invalidate already-issued cookies. |

### Single-instance deployments

Leaving `master_secret` unset is fine: the AppSec component generates a 32-byte random secret at startup and logs a warning. Every restart invalidates all outstanding challenge cookies, which is acceptable for a single host.

### Multi-instance / HA deployments

Set `master_secret` and `key_rotation_interval` to the **same value** on every AppSec instance. If the values differ, a cookie issued by instance A will be rejected by instance B and clients will be re-challenged on every request that lands on a different node — a noticeable user-experience regression and a load amplifier.

To rotate the master secret safely:

1. Generate a new secret.
2. Roll it out to **every** AppSec instance within one `cookie_ttl` window.
3. Restart each instance after it has the new value.

During the rollout, clients holding cookies sealed under the old secret will be re-challenged once on instances that already have the new secret — there is no way to keep both valid simultaneously.

### Generating a secret

The recommended form is a 32-byte hex string:

```bash
openssl rand -hex 32
# e.g. 0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

Passphrases are accepted too, but must be at least 32 bytes of UTF-8. An invalid value (too short, non-hex characters in a hex-looking string) causes CrowdSec to fail loading the config.

## JS obfuscation

The AppSec component serves two JavaScript artefacts to the client during a challenge: a **static library bundle** (the fingerprinting + proof-of-work runner) and a **dynamic per-epoch key module** (which embeds the current signing key). Both are obfuscated, and you can tune how many distinct obfuscated variants are kept in memory and how often new ones are produced.

**Why this matters.** Code running inside an attacker-controlled browser can always be reverse-engineered eventually; obfuscation buys time and cost, not invisibility.

| Key | Default | Recommended | What it controls |
|---|---|---|---|
| `crypto_obfuscation_pool_size` | `1` | `3` | Number of distinct obfuscations of the per-epoch sign-key module kept per live epoch. Each variant costs ~5 s of CPU per rotation. A pool size of 3 is recommended in production: different clients see different obfuscations of the same key, which materially raises the cost of an attacker reverse-engineering the module. The default of `1` exists to keep tests cheap. |
| `library_runtime_obfuscation_enabled` | `false` | `false` | When `false`, the AppSec component serves only the library bundle baked at build time (no runtime cost). When `true`, a background goroutine produces additional obfuscations of the static library bundle on a cadence. Enable only on hosts with CPU budget to spare — the build-time bundle is already obfuscated and is sufficient for most deployments. |
| `library_obfuscation_pool_size` | `1` | `1` | Maximum number of obfuscated library-bundle variants kept. Has no effect unless `library_runtime_obfuscation_enabled` is `true` — values >1 are clamped to 1 with a startup warning otherwise. |
| `library_obfuscation_refresh_interval` | `1h` | `1h` | How often the background obfuscator produces one new library-bundle variant. Each pass costs roughly one minute of CPU. Ignored when runtime obfuscation is disabled. |

:::tip
Don't enable `library_runtime_obfuscation_enabled` on a small or shared host — the obfuscator is CPU-heavy and runs every `library_obfuscation_refresh_interval`. The build-time obfuscation is enough for most deployments; only turn this on if you specifically need rotating byte-level library variants in addition to the build-time bundle.
:::

## DNS cache

Identity-verified bots (see [Legitimate bots it lets through](intro.md#legitimate-bots-it-lets-through)) are confirmed with a forward-confirmed reverse-DNS lookup. To keep that off the request hot path, the engine caches DNS results. Unlike the fields above, this is **not** part of the `challenge:` block — it is global engine configuration, set under `crowdsec_service` in the main `config.yaml`:

```yaml
crowdsec_service:
  dns_cache:
    ttl: 1h            # how long positive lookups are cached
    negative_ttl: 5m   # how long failures are cached
    size: 16384        # max number of cached entries (LRU)
```

The defaults shown above are fine for most deployments. Raise `size` if you verify a large, diverse set of bot IPs; lower `ttl` if a vendor rotates its DNS aggressively and you want exemptions to follow more quickly.

## Applying changes

Most fields take effect on the next CrowdSec reload:

```bash
sudo systemctl reload crowdsec
```

Specifically:

- Changing `master_secret` **invalidates all in-flight challenges** (clients mid-challenge will be re-challenged) and **invalidates every already-issued cookie**. Plan a rotation as described in [Multi-instance / HA deployments](#multi-instance--ha-deployments).
- Changing `key_rotation_interval` or `max_live_epochs` invalidates in-flight challenges but does **not** invalidate already-issued cookies — they remain valid until their own `not_after` timestamp.
- Changing `cookie_ttl` affects only cookies issued **after** the reload; cookies already in the wild keep their original lifetime.
- Changing the JS obfuscation fields takes effect on the next rotation tick / refresh tick.

## Verification

Check that the AppSec component picked up the config:

```bash
sudo cscli metrics show appsec
```

Hit a protected endpoint with a clean client and confirm the challenge HTML is served. Tail the CrowdSec log:

```bash
sudo tail -F /var/log/crowdsec.log | grep -E "challenge submission|on_challenge_submit"
```

You should see lines like:

```
level=info msg="challenge submission accepted" source=198.51.100.42 fsid=FS1_xyz is_bot=false allowlisted=false
level=info msg="on_challenge_submit rejected" source=203.0.113.7 reason=fast-bot-detection signals="[cdp]"
```

If you don't see any `challenge submission` lines at all after a reload, double-check that:

- The new appsec-config is listed in your AppSec datasource (`appsec_configs:`) — see [Where to set these values](#where-to-set-these-values).
- The bouncer is forwarding `/crowdsec-internal/challenge/*` paths unchanged — see [Prerequisites](intro.md#prerequisites) on the intro page.
