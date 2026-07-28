---
id: customization
title: Customization & recipes
sidebar_position: 4
---

## Recipes

### Restrict the challenge to a specific path

By default the appsec-config shipped by the collection challenges every request except [known bots](hooks.md#known-bots) and well-known paths. To narrow the challenge to one section of your application, do not edit default config: Add a `pre_eval` hook that exempts every request **outside** the path you care about:

```yaml
pre_eval:
  - filter: '!(req.URL.Path startsWith "/checkout/")'
    apply:
      - ExemptFromChallenge("outside-checkout")
```

`ExemptFromChallenge(reason)` flags the request as exempt, so `SendChallenge()` becomes a no-op for it and no challenge is served. Because the exemption is additive, the shipped config stays untouched — only `/checkout/` is left to be challenged.

:::note
`ExemptFromChallenge(reason)` mints no cookie, so the exemption is re-evaluated on every request. To let a trusted client through for a whole session instead, use `GrantChallengeCookie(...)` — see [ExemptFromChallenge vs GrantChallengeCookie](hooks.md#exemptfromchallenge-vs-grantchallengecookie).
:::

### Allowlist an internal probe by header

Useful for synthetic monitoring or internal health checks that don't run JavaScript. Which helper to use depends on whether the probe can carry a cookie. See [ExemptFromChallenge vs GrantChallengeCookie](hooks.md#exemptfromchallenge-vs-grantchallengecookie) for the full distinction.

**Session allow (cookie).** If the probe is a cookie-capable client that stores and re-sends `__crowdsec_challenge`, mint a session cookie so it's waved through for the whole window without re-checking the header each time:

```yaml
inband:
  pre_eval:
    - filter: req.Header.Get("X-Internal-Probe") == "my-shared-secret"
      apply:
        - GrantChallengeCookie("internal-probe", "24h")
```

**Per-request allow (no cookie).** If the probe can't hold a cookie — a plain `curl` health check, most uptime monitors — exempt the request itself instead. This mints no cookie, so the header is re-checked on every request:

```yaml
inband:
  pre_eval:
    - filter: req.Header.Get("X-Internal-Probe") == "my-shared-secret"
      apply:
        - ExemptFromChallenge("internal-probe")
```

:::warning
Both variants are purely technical examples and shouldn't be used as-is. If `my-shared-secret` ever leaks anyone who learns it can present that header and bypass bot detection entirely. Prefer pairing the header check with a source-IP filter (`req.RemoteAddr`).
:::

### Allowlist by IPs

If the trusted client has a stable source IP or range, a native [CrowdSec allowlist](/local_api/allowlists.md) is simpler and safer than a shared-secret header: an allowlisted IP bypasses AppSec entirely, so it is never challenged and never issued a cookie. Allowlists are keyed on source IP/range and managed centrally at the LAPI (`cscli allowlists`), so reach for the hook recipes on this page only when the client can't be pinned to an IP.

### Block on a weak signal the default ignores

The collection already rejects submissions where `fingerprint.IsBot()` is true — the high-confidence fast-bot-detection verdict. Weaker heuristic signals are collected too, but the default leaves them alone because they carry false positives. If your traffic profile makes one of them worth enforcing, you can opt in.

For example, the Accept-Language mismatch fires when the `Accept-Language` header disagrees with the browser's `navigator.language`. It's a medium-severity heuristic — legitimate for some multilingual or proxied setups, but unusual for a normal browser — so the default ignores it. To reject on it:

```yaml
on_challenge_submit:
  - filter: fingerprint.AcceptLanguageMismatch(req)
    apply:
      - RejectSubmission("accept-language mismatch")
```

:::warning
Weak signals are too specific to be part of default rules. Validate one against your real traffic — [dump the fingerprints](#dump-fingerprints-for-offline-analysis) it would have rejected, or start by alerting instead of rejecting — before you enforce it.
:::

### Dump fingerprints for offline analysis

When you're tuning your own rules and want to see exactly what the challenge measured about a client, `DumpFingerprint(label)` writes the decoded fingerprint (plus request context) as a JSONL line to `<datadir>/fingerprint_dumps/crowdsec_fp_dump_<label>.jsonl`. No configuration is needed. For example, to capture everything the fast-bot-detection library flagged:

```yaml
on_challenge_submit:
  - filter: "fingerprint.IsBot()"
    apply:
      - DumpFingerprint("suspected-automation")
      - RejectSubmission("known bot (fast bot detection)")
```

See [DumpFingerprint](hooks.md#dumpfingerprint) in the Hooks reference for the file format and behavior.

## Using the bot signal in appsec-configs and scenarios

The information the challenge collects about a client is not locked inside the bot-detection collection — it's surfaced as a regular CrowdSec event and made available to both appsec-config hooks and scenario expressions. That means you can react to a "this client is automation" verdict anywhere in your CrowdSec stack, not just inside the dedicated `on_challenge_submit` hook.

### From an appsec-config

Inside `on_challenge` and `on_challenge_submit` hooks, the in-flight challenge exposes a `fingerprint` object. The object exposes both high-level helpers such as `fingerprint.IsBot()` or `BotSignals()`, but also weak signals. See [Hooks reference](hooks.md#the-fingerprint-object) for detailed properties.

Example — reject only clients with multiple, independent signals so you don't punish a flaky headless screenshot bot for tripping a single check:

```yaml
on_challenge_submit:
  - filter: fingerprint.IsBot() && fingerprint.BotSignalCount() >= 2
    apply:
      - RejectSubmission("multiple bot signals")
```

### From a scenario

Every step of the challenge lifecycle (requested / submitted / failed / rejected / solved) emits a CrowdSec event with `source: crowdsec-appsec-challenge`, distinct from `crowdsec-appsec` events emitted by WAF rule matches. The most important fingerprint signals are also flattened into `evt.Parsed` so scenario `filter` expressions can match on them cheaply, and the full fingerprint object is available under `evt.Unmarshaled.fingerprint` for richer queries.

Flat fields exposed in `evt.Parsed`:

| Field                                  | Values                              | Meaning                                                                                                   |
| -------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `source`                               | `crowdsec-appsec-challenge`         | Distinguishes challenge events from WAF rule events.                                                      |
| `challenge_event`                      | `requested` / `submitted` / `failed` / `rejected` / `solved` | Which step of the lifecycle produced the event. `failed` is a crypto/PoW failure; `rejected` is an `on_challenge_submit` hook calling `RejectSubmission(reason)`. |
| `challenge_difficulty`                 | integer string                      | The PoW difficulty applied to this moment.                                                                |
| `challenge_fail_reason`                | string (on `failed` or `rejected`)  | On `failed`, the raw protocol error (`invalid HMAC`, `invalid proof-of-work`, …). On `rejected`, the operator-supplied reason from `RejectSubmission()`. |
| `fsid`                                 | string                              | Per-fingerprint identifier. Stable across the cookie's lifetime — useful for `groupby`.                   |
| `fingerprint_bot`                      | `"true"` / `"false"`                | Set when a fingerprint was attached to the event.                                                         |
| `fingerprint_allowlisted`              | `"true"` / `"false"`                | Whether this cookie was issued via `GrantChallengeCookie(...)` rather than a real submission.             |
| `fingerprint_allowlist_reason`         | string                              | The reason argument passed to `GrantChallengeCookie(...)` (only set when allowlisted).                    |
| `platform`                             | string                              | The platform the fingerprint reported (e.g. `Linux`, `Windows`), when a fingerprint was attached.         |
| `user_agent`                           | string                              | The client's User-Agent at the time of the event.                                                         |

This makes it straightforward to write your own scenarios on top of the built-in ones. For example, alerting on any client the challenge identified as automation:

```yaml
type: leaky
name: mycorp/appsec-bot-detected
filter: |
  evt.Parsed.source == "crowdsec-appsec-challenge" &&
  evt.Parsed.fingerprint_bot == "true"
groupby: evt.Meta.source_ip
capacity: 1
leakspeed: 1m
labels:
  type: appsec
  service: bot-detection
```

Or, more targeted, alerting on repeat offenders that fail submission for the same automation reason:

```yaml
type: leaky
name: mycorp/appsec-automation-repeat
filter: |
  evt.Parsed.source == "crowdsec-appsec-challenge" &&
  evt.Parsed.challenge_event == "rejected" &&
  evt.Parsed.challenge_fail_reason == "known bot (fast bot detection)"
groupby: evt.Meta.source_ip
capacity: 5
leakspeed: 10m
```

For deeper queries that the flat fields don't cover, `evt.Unmarshaled.fingerprint` exposes the same helper methods as the in-hook `fingerprint` object:

```yaml
filter: |
  evt.Parsed.source == "crowdsec-appsec-challenge" &&
  evt.Unmarshaled.fingerprint.HasAutomationSignal()
```
