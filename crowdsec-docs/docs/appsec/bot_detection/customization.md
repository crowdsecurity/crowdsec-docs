---
id: customization
title: Customization & recipes
sidebar_position: 4
---

## Recipes

Every recipe on this page is a **complete overlay appsec-config** — a standalone file you drop next to the shipped configs, not an edit to them. Overlays merge field by field with the collection's config (hooks are appended, scalar options are overridden), so you keep the upstream files untouched and add a small file of your own that contributes only the hooks it needs. The merge mechanics are covered in [Where to set these values](configuration.md#where-to-set-these-values) and [AppSec configuration syntax](../configuration.md#configuration-file-format).

To deploy any recipe below:

1. **Save the file** to `/etc/crowdsec/appsec-configs/` — the filename is free, the `name:` inside is what identifies the config.
2. **Load it from your acquisition.** Add its `name:` to `appsec_configs:` in your AppSec datasource (typically `/etc/crowdsec/acquis.d/appsec.yaml`). A custom name in your own namespace is **not** matched by the `crowdsecurity/appsec-bot-*` wildcard from [Enable bot detection](enable.md#install-the-collection), so list it explicitly alongside the wildcard:

   ```yaml
   listen_addr: 127.0.0.1:7422
   appsec_configs:
     - crowdsecurity/appsec-bot-*
     - mycorp/appsec-bot-challenge-checkout-only # your overlay, by name
   labels:
     type: appsec
   ```

   Confirm the name CrowdSec sees with `cscli appsec-configs list`.
3. **Reload:** `sudo systemctl reload crowdsec`.

:::note Which block hooks go under
The challenge runs in the **in-band** phase, so bot-detection hooks live under an `inband:` block — `pre_eval`, `post_eval`, `on_challenge`, and `on_challenge_submit`. This matches the shipped `appsec-bot-challenge-simple` config. Each phase exposes a different set of helpers (for example `SendChallenge()` is available in `post_eval` but not `pre_eval`; `SetChallengeDifficulty()` is not available in `on_challenge_submit`); see the [Hooks reference](hooks.md) for the per-hook helper tables.
:::

### Restrict the challenge to a specific path

By default the appsec-config shipped by the collection challenges every request except [known bots](hooks.md#known-bots) and well-known paths. To narrow the challenge to one section of your application, don't edit the default config: add a `pre_eval` hook that exempts every request **outside** the path you care about.

```yaml
# /etc/crowdsec/appsec-configs/mycorp-challenge-checkout-only.yaml
name: mycorp/appsec-bot-challenge-checkout-only
inband:
  pre_eval:
    - filter: '!(req.URL.Path startsWith "/checkout/")'
      apply:
        - ExemptFromChallenge("outside-checkout")
```

`ExemptFromChallenge(reason)` flags the request as exempt, so `SendChallenge()` becomes a no-op for it and no challenge is served. Because the exemption is additive, the shipped config stays untouched — only `/checkout/` is left to be challenged.

:::note
`ExemptFromChallenge(reason)` mints no cookie, so the exemption is re-evaluated on every request. To let a trusted client through for a whole session instead, use `GrantChallengeCookie(...)` — see [ExemptFromChallenge vs GrantChallengeCookie](hooks.md#exemptfromchallenge-vs-grantchallengecookie).
:::

### Restrict the challenge to specific paths on a given host (FQDN)

If a single AppSec component fronts several virtual hosts, you usually want the challenge on only part of the surface — say, only `/checkout` and `/cart`, and only on `foobar.com`. The Host the client targeted is available in every hook as `req.Host`, so add a `pre_eval` that exempts everything **outside** the `(host, path)` set you want to protect:

```yaml
# /etc/crowdsec/appsec-configs/mycorp-challenge-foobar-surface.yaml
name: mycorp/appsec-bot-challenge-foobar-surface
inband:
  pre_eval:
    # Challenge only /checkout and /cart on foobar.com. Every other path, and
    # every other vhost behind this AppSec component, is exempted.
    - filter: '!(req.Host == "foobar.com" && (req.URL.Path startsWith "/checkout" || req.URL.Path startsWith "/cart"))'
      apply:
        - ExemptFromChallenge("outside-foobar-surface")
```

To protect different paths on different hosts, split the logic into one `pre_eval` block per host rather than a single large condition. Exemptions are additive and independent, so each block reads on its own and the order doesn't matter — whatever is left un-exempted is what gets challenged:

```yaml
# /etc/crowdsec/appsec-configs/mycorp-challenge-protected-surface.yaml
name: mycorp/appsec-bot-challenge-protected-surface
inband:
  pre_eval:
    # Any host we don't explicitly protect below: never challenge.
    - filter: req.Host != "foobar.com" && req.Host != "api.foobar.com"
      apply:
        - ExemptFromChallenge("unprotected-host")

    # On foobar.com, challenge only the checkout funnel.
    - filter: req.Host == "foobar.com" && !(req.URL.Path startsWith "/checkout" || req.URL.Path startsWith "/cart")
      apply:
        - ExemptFromChallenge("foobar-outside-funnel")

    # On api.foobar.com, challenge only the login endpoint.
    - filter: req.Host == "api.foobar.com" && !(req.URL.Path startsWith "/v1/login")
      apply:
        - ExemptFromChallenge("api-outside-login")
```

Adding another protected host is then just another block, and you can widen the "unprotected hosts" guard to match.

The inverse — challenge everything **except** one host, e.g. a status page or a webhook vhost that will never solve JavaScript — is a single positive match:

```yaml
# /etc/crowdsec/appsec-configs/mycorp-challenge-exempt-status-host.yaml
name: mycorp/appsec-bot-challenge-exempt-status-host
inband:
  pre_eval:
    - filter: req.Host == "status.foobar.com"
      apply:
        - ExemptFromChallenge("status-vhost")
```

:::note Matching hosts correctly
`req.Host` is the Host header as the client sent it. Two things to watch:

- **Ports.** Some proxies forward `foobar.com:443`. If yours does, either match with `req.Host startsWith "foobar.com"` or normalize the Host at the proxy.
- **Subdomains.** `==` matches one exact host. To cover a whole domain, combine an exact match with a suffix match: `req.Host == "foobar.com" || req.Host endsWith ".foobar.com"` — the leading dot stops it from also matching `notfoobar.com`.
:::

### Tune the challenge difficulty per route

The proof-of-work difficulty is `medium` by default. You can raise it for routes under active abuse, or lower it for latency-sensitive or mobile-heavy sections, by calling `SetChallengeDifficulty(level)` in `pre_eval` — the level you set is picked up when the shipped config issues the challenge later in the request. See [Challenge difficulty levels](hooks.md#challenge-difficulty-levels) for the available levels and their solve times.

```yaml
# /etc/crowdsec/appsec-configs/mycorp-challenge-difficulty.yaml
name: mycorp/appsec-bot-challenge-difficulty
inband:
  pre_eval:
    # Costly PoW on the login/auth surface, where credential-stuffing lives.
    - filter: req.URL.Path startsWith "/login" || req.URL.Path startsWith "/auth"
      apply:
        - SetChallengeDifficulty("high")
    # Cheap PoW on the mobile API, where clients are slower and latency hurts.
    - filter: req.URL.Path startsWith "/m/"
      apply:
        - SetChallengeDifficulty("low")
```

:::note
`SetChallengeDifficulty()` is available in `pre_eval`, `post_eval`, and `on_challenge`, but **not** in `on_challenge_submit` (by then the challenge has already been solved). To make an already-passed client redo a harder challenge, set the difficulty and call `SendChallenge()` from `on_challenge` — see [Re-challenge a returning client whose fingerprint looks off](#re-challenge-a-returning-client-whose-fingerprint-looks-off).
:::

### Allowlist an internal probe by header

Useful for synthetic monitoring or internal health checks that don't run JavaScript. Which helper to use depends on whether the probe can carry a cookie. See [ExemptFromChallenge vs GrantChallengeCookie](hooks.md#exemptfromchallenge-vs-grantchallengecookie) for the full distinction.

**Session allow (cookie).** If the probe is a cookie-capable client that stores and re-sends `__crowdsec_challenge`, mint a session cookie so it's waved through for the whole window without re-checking the header each time:

```yaml
# /etc/crowdsec/appsec-configs/mycorp-allow-probe-session.yaml
name: mycorp/appsec-bot-challenge-allow-probe-session
inband:
  pre_eval:
    - filter: req.Header.Get("X-Internal-Probe") == "my-shared-secret"
      apply:
        - GrantChallengeCookie("internal-probe", "24h")
```

**Per-request allow (no cookie).** If the probe can't hold a cookie — a plain `curl` health check, most uptime monitors — exempt the request itself instead. This mints no cookie, so the header is re-checked on every request:

```yaml
# /etc/crowdsec/appsec-configs/mycorp-allow-probe-request.yaml
name: mycorp/appsec-bot-challenge-allow-probe-request
inband:
  pre_eval:
    - filter: req.Header.Get("X-Internal-Probe") == "my-shared-secret"
      apply:
        - ExemptFromChallenge("internal-probe")
```

:::warning
Both variants are purely technical examples and shouldn't be used as-is. If `my-shared-secret` ever leaks, anyone who learns it can present that header and bypass bot detection entirely. Prefer pairing the header check with a source-IP filter, e.g. `req.Header.Get("X-Internal-Probe") == "my-shared-secret" && req.RemoteAddr startsWith "10."`.
:::

### Allowlist by IPs

If the trusted client has a stable source IP or range, a native [CrowdSec allowlist](/local_api/allowlists.md) is simpler and safer than a shared-secret header: an allowlisted IP bypasses AppSec entirely, so it is never challenged and never issued a cookie. Allowlists are keyed on source IP/range and managed centrally at the LAPI (`cscli allowlists`), so reach for the hook recipes on this page only when the client can't be pinned to an IP.

### Authoring your own known-bot files

`MatchKnownBot()` matches a request against the bot-description files you name, under `<datadir>/legit_bots/` (typically `/var/lib/crowdsec/data/legit_bots/`). The shipped exclude-configs (see [Known bots it lets through](whats_included.md#known-bots-it-lets-through)) keep the built-in definitions up to date; to recognise a bot of your own, ship a custom appsec-config that both calls `MatchKnownBot(..., "legit_bots/mybot.json")` and declares that file in its `data:` section:

```yaml
# /etc/crowdsec/appsec-configs/mycorp-known-bot.yaml
name: mycorp/appsec-bot-challenge-known-bot
inband:
  pre_eval:
    - filter: MatchKnownBot(req.RemoteAddr, req.UserAgent(), req.URL.Path, "legit_bots/mybot.json")
      apply:
        - ExemptFromChallenge("mybot")
data:
  - source_url: https://example.com/mybot.json
    dest_file: legit_bots/mybot.json
    type: bots
```

Each file is one or more newline-delimited JSON objects with these fields:

| Field        | Type        | Required | Meaning                                                                                                  |
| ------------ | ----------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `name`       | string      | yes      | Identifier for the bot, used in logs.                                                                    |
| `user_agent` | string      | no       | Case-insensitive regex the request User-Agent must match.                                                |
| `paths`      | `[]string`  | no       | Regexes; the request path must match at least one if present.                                            |
| `ips`        | `[]string`  | no\*     | Exact source IPs (IPv4 or IPv6).                                                                         |
| `ranges`     | `[]string`  | no\*     | Source CIDR ranges.                                                                                      |
| `rdns`       | `[]string`  | no\*     | Regexes matched against the **forward-confirmed** reverse-DNS name of the source IP. Anchor them (e.g. `\\.googlebot\\.com$`) to avoid false positives. |

\* At least one of `ips`, `ranges`, or `rdns` is required — a definition that only matches on `user_agent` is rejected at load time, since a User-Agent alone is trivial to spoof.

A request is recognised as a known bot when:

```
(user_agent matches  AND  at least one path matches)  AND  (exact IP  OR  CIDR range  OR  FCrDNS)
```

The helper is **fail-closed**: an unparseable address, a DNS failure, or an unknown file means "not a known bot", never an error, so the request falls through to the normal challenge.

Example file:

```json
{"name":"googlebot","user_agent":"googlebot","rdns":["(^|\\.)googlebot\\.com$","\\.google\\.com$"]}
{"name":"uptimerobot","user_agent":"uptimerobot","paths":["^/health(/|$)","^/status$"],"ranges":["69.162.124.224/28"],"ips":["216.144.250.150"]}
{"name":"internal-scanner","ips":["10.1.2.3","2001:db8::42"]}
```

The reverse-DNS confirmation used by `rdns` goes through the engine's DNS cache; see [`dns_cache`](/configuration/crowdsec_configuration.md#dns_cache) if you need to tune its TTL or size.

### Block on a weak signal the default ignores

The collection already rejects submissions where `fingerprint.IsBot()` is true — the high-confidence fast-bot-detection verdict. Weaker heuristic signals are collected too, but the default leaves them alone because they carry false positives. If your traffic profile makes one of them worth enforcing, you can opt in.

For example, the Accept-Language mismatch fires when the `Accept-Language` header disagrees with the browser's `navigator.language`. It's a medium-severity heuristic — legitimate for some multilingual or proxied setups, but unusual for a normal browser — so the default ignores it. To reject on it:

```yaml
# /etc/crowdsec/appsec-configs/mycorp-reject-accept-language.yaml
name: mycorp/appsec-bot-challenge-reject-accept-language
inband:
  on_challenge_submit:
    - filter: fingerprint.AcceptLanguageMismatch(req)
      apply:
        - RejectSubmission("accept-language mismatch")
```

:::warning
Weak signals are too specific to be part of default rules. Validate one against your real traffic — [dump the fingerprints](#dump-fingerprints-for-offline-analysis) it would have rejected, or start by alerting instead of rejecting — before you enforce it.
:::

### Reject only when several soft signals stack up

A single soft signal is noisy; several firing at once on the same client is a much stronger tell. [`EvaluateMismatches()`](hooks.md#the-mismatchreport-object) aggregates every library signal **and** the custom mismatch checks into one severity-scored report, so you can require a threshold instead of trusting any one check. This rejects submissions carrying two or more distinct mismatch signals while a lone flaky check goes through:

```yaml
# /etc/crowdsec/appsec-configs/mycorp-reject-stacked-mismatches.yaml
name: mycorp/appsec-bot-challenge-reject-stacked-mismatches
inband:
  on_challenge_submit:
    - filter: EvaluateMismatches().Count() >= 2
      apply:
        - RejectSubmission("multiple mismatch signals")
```

To weight by severity instead of raw count — e.g. reject on any single high-severity signal, but require the report to be non-trivial otherwise — branch on `.High()` / `.Medium()`:

```yaml
inband:
  on_challenge_submit:
    - filter: EvaluateMismatches().High() >= 1
      apply:
        - RejectSubmission("high-severity mismatch")
```

### Re-challenge a returning client whose fingerprint looks off

The two recipes above act at submission time. The `on_challenge` hook is the counterpart for clients that **already hold a valid cookie**: it runs on every subsequent request and still sees the decoded `fingerprint`, so it's where you re-verify a returning client. If the mismatch report now looks suspicious — a sign the cookie may have been lifted and replayed from a different client — force a fresh, harder challenge:

```yaml
# /etc/crowdsec/appsec-configs/mycorp-rechallenge-on-mismatch.yaml
name: mycorp/appsec-bot-challenge-rechallenge-on-mismatch
inband:
  on_challenge:
    - filter: EvaluateMismatches().High() >= 1
      apply:
        - SetChallengeDifficulty("high")
        - SendChallenge()
```

`SendChallenge()` here re-issues the challenge even though the client has a cookie; `SetChallengeDifficulty("high")` makes the re-issued proof-of-work costly. Both helpers are available in `on_challenge` (but not in `on_challenge_submit`).

### Block a returning client outright on a strong signal

When the signal is strong enough that you don't want to give the client another chance, block the request instead of re-challenging. `DropRequest(reason)` (available in `on_challenge`) blocks immediately using the config's default remediation:

```yaml
# /etc/crowdsec/appsec-configs/mycorp-drop-automation.yaml
name: mycorp/appsec-bot-challenge-drop-automation
inband:
  on_challenge:
    - filter: fingerprint.HasAutomationSignal()
      apply:
        - DropRequest("automation signal on cookie-bearing client")
```

`fingerprint.HasAutomationSignal()` is true when a webdriver / Selenium / CDP / Playwright / bot-UA indicator was seen — see [Verdict and signal helpers](hooks.md#verdict-and-signal-helpers) for the full set of roll-ups you can branch on.

### Dump fingerprints for offline analysis

When you're tuning your own rules and want to see exactly what the challenge measured about a client, `DumpFingerprint(label)` writes the decoded fingerprint (plus request context) as a JSONL line to `<datadir>/fingerprint_dumps/crowdsec_fp_dump_<label>.jsonl`. No extra configuration is needed. For example, to capture everything the fast-bot-detection library flagged while still rejecting it:

```yaml
# /etc/crowdsec/appsec-configs/mycorp-dump-suspected-automation.yaml
name: mycorp/appsec-bot-challenge-dump-suspected-automation
inband:
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

Inside `on_challenge` and `on_challenge_submit` hooks, the in-flight challenge exposes a `fingerprint` object. The object exposes both high-level helpers such as `fingerprint.IsBot()` or `BotSignals()`, and the individual weak signals. See [Hooks reference](hooks.md#the-fingerprint-object) for the full list of properties.

Example — reject only clients with multiple, independent library signals so you don't punish a flaky headless screenshot bot for tripping a single check:

```yaml
# /etc/crowdsec/appsec-configs/mycorp-reject-multi-signal.yaml
name: mycorp/appsec-bot-challenge-reject-multi-signal
inband:
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

This makes it straightforward to write your own scenarios on top of the built-in ones. Save the scenario to `/etc/crowdsec/scenarios/` and reload. For example, alerting on any client the challenge identified as automation:

```yaml
# /etc/crowdsec/scenarios/mycorp-appsec-bot-detected.yaml
type: leaky
name: mycorp/appsec-bot-detected
description: "Alert on a client the AppSec challenge identified as a bot"
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
# /etc/crowdsec/scenarios/mycorp-appsec-automation-repeat.yaml
type: leaky
name: mycorp/appsec-automation-repeat
description: "Repeated challenge rejections for the fast-bot-detection reason from one IP"
filter: |
  evt.Parsed.source == "crowdsec-appsec-challenge" &&
  evt.Parsed.challenge_event == "rejected" &&
  evt.Parsed.challenge_fail_reason == "known bot (fast bot detection)"
groupby: evt.Meta.source_ip
capacity: 5
leakspeed: 10m
labels:
  type: appsec
  service: bot-detection
```

For deeper queries that the flat fields don't cover, `evt.Unmarshaled.fingerprint` exposes the same helper methods as the in-hook `fingerprint` object:

```yaml
filter: |
  evt.Parsed.source == "crowdsec-appsec-challenge" &&
  evt.Unmarshaled.fingerprint.HasAutomationSignal()
```
