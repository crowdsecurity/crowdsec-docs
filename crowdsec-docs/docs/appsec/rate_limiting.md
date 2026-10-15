---
id: rate_limiting
title: Rate Limiting
description: "Rate limit requests with the CrowdSec WAF: use the RateLimit() helper in pre_eval hooks to cap how often a client can hit an endpoint and answer with a 429."
sidebar_position: 6
---

The Application Security Component can rate limit requests directly in the WAF, before any rule is evaluated. A typical use is to protect sensitive endpoints such as login forms, password reset pages or expensive API calls against brute force and abuse.

Rate limiting is exposed through the `RateLimit()` helper, available in [`pre_eval` hooks](hooks.md#pre_eval).

## Quick example

Limit `POST /login` to 5 requests per minute per client IP:

```yaml
name: custom/my-appsec-config
inband:
  pre_eval:
    - filter: req.URL.Path == "/login" && req.Method == "POST"
      apply:
        - RateLimit("login", "5/m")
```

The first 5 requests from a client are let through (and then evaluated by the WAF rules as usual). Any additional request within the minute is blocked and the user receives an HTTP `429 Too Many Requests`.

## The `RateLimit` helper

| Helper      | Type                                        | Description                                                                                                                         |
| ----------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `RateLimit` | `func(key str, limit str, source str?) bool` | Spend one request of the `key` budget for the current client. Blocks the request and returns `true` if the client is over the limit, `false` otherwise. |

### `key`

A name identifying the limiter, for example `"login"` or `"api"`. Each key has its own, independent budget per client: a client that exhausted its `login` budget can still use its `api` budget.

The key appears in logs, metrics, events and alerts, so pick something meaningful.

- It **must be a string literal**: `RateLimit(req.URL.Path, "5/m")` is rejected.
- It **must be unique**: a given key can only be used by a single `RateLimit()` call in the whole AppSec configuration (including across the top-level, `inband` and `outofband` sections). To apply the same budget to several endpoints, use a single call with a broader `filter`:

```yaml
inband:
  pre_eval:
    - filter: req.Method == "POST" && req.URL.Path in ["/login", "/password-reset", "/register"]
      apply:
        - RateLimit("auth", "10/m")
```

### `limit`

The allowed rate, written as `<count>/<unit>`:

| Unit | Period     | Example  |
| ---- | ---------- | -------- |
| `s`  | one second | `"10/s"` |
| `m`  | one minute | `"5/m"`  |
| `h`  | one hour   | `"100/h"` |

`<count>` must be a positive integer, and only a single unit is accepted (`"1/5m"` or `"10/d"` are invalid). Like the key, the limit **must be a string literal**.

The limit is checked when the configuration is loaded: an invalid limit, a non-literal argument or a duplicate key prevents the AppSec datasource from starting, with an explicit error.

### `source` (optional)

By default, requests are counted per client IP:

- IPv4 clients are tracked per address.
- IPv6 clients are tracked per `/64` prefix, as a single end site usually owns a whole `/64`. Tracking each IPv6 address separately would let a client rotate addresses to get a fresh budget.

The optional third argument lets you count requests on another value instead, such as a session cookie or an API key:

```yaml
inband:
  pre_eval:
    - filter: req.URL.Path startsWith "/api/"
      apply:
        - RateLimit("api", "100/m", req.Header.Get("X-Api-Key"))
```

Here, every API key has its own budget of 100 requests per minute, regardless of the IP it is used from.

If the value is empty (the header is missing, for example), the client IP is used instead, so that requests without the value do not end up sharing a single budget. A value can never consume the budget of an IP: a client sending `X-Api-Key: 1.2.3.4` does not affect the budget of the client `1.2.3.4`.

:::warning
Each distinct value gets its own budget, held in memory until it expires (see [Memory usage](#memory-usage)). Only use a value the client cannot freely change, or one that is validated before reaching the WAF. Keying on an arbitrary header means a client can bypass the limit by sending a different value with each request, and make the WAF track an unbounded number of values.
:::

### Return value

`RateLimit()` returns `true` when the request was over the limit (and has been blocked), `false` otherwise. The return value is mostly useful to make further decisions in the same hook, but you do not need to act on it: the request is blocked by the helper itself.

## How limits are enforced

`RateLimit()` uses a token bucket: each client starts with `<count>` tokens, and each request spends one. Tokens refill continuously at a rate of `<count>` per period, i.e. one token every `period / count`.

With `"3/m"`:

- A client can send 3 requests at once.
- The 4th request is blocked.
- One token is given back every 20 seconds, so after 20 seconds the client can send one more request, and after a full minute without requests it has its 3 tokens back.

A client that keeps sending requests over the limit is thus still allowed one request per `period / count`, and blocked otherwise.

When a request is over the limit:

- Request processing stops: the WAF rules are not evaluated for this request.
- The remediation component is instructed to apply a `ban` remediation.
- The HTTP code returned to the user is always `429 Too Many Requests` (it does not follow [`user_blocked_http_code`](configuration.md#user_blocked_http_code)). The HTTP code returned to the remediation component follows [`blocked_http_code`](configuration.md#blocked_http_code) as for any other blocked request.

Limiters are shared by all the routines of a given AppSec datasource, so the budget of a client does not depend on which routine processes its request. They are kept in memory only: they are reset when CrowdSec restarts or reloads.

## In-band only

Rate limiting only applies to the in-band phase, where the request can actually be blocked. Declare your `RateLimit()` calls in `inband.pre_eval`, as in the examples on this page.

`RateLimit()` calls made during the out-of-band phase do nothing: they do not consume the budget and never block. If a `RateLimit()` call is reached out-of-band (for example from a [legacy flat `pre_eval` hook](hooks.md#legacy-flat-hooks), which runs in both phases), CrowdSec logs a warning once per key.

`RateLimit()` is only available in `pre_eval` hooks: using it in `on_load`, `post_eval`, `on_match` or the challenge hooks fails at configuration load.

## Events and alerts

Every request blocked by `RateLimit()` generates an event, with `evt.Parsed.source` set to `crowdsec-appsec-rate-limit`.

These events are parsed by the [`crowdsecurity/appsec-rate-limit-logs`](https://app.crowdsec.net/hub/author/crowdsecurity/configurations/appsec-rate-limit-logs) parser, which you need to install before writing scenarios on top of them:

```bash
sudo cscli parsers install crowdsecurity/appsec-rate-limit-logs
```

The parser sets the following fields:

| Field                          | Description                                                                         |
| ------------------------------ | ----------------------------------------------------------------------------------- |
| `evt.Meta.service`             | Always `appsec`.                                                                    |
| `evt.Meta.log_type`            | Always `appsec-rate-limit`.                                                         |
| `evt.Meta.source_ip`           | The IP of the rate limited client.                                                  |
| `evt.Meta.target_host`         | The FQDN of the request, if present (`Host` header).                                |
| `evt.Meta.target_uri`          | The complete URI of the request.                                                    |
| `evt.Meta.http_verb`           | The HTTP method of the request.                                                     |
| `evt.Meta.http_user_agent`     | The `User-Agent` of the request.                                                    |
| `evt.Meta.rate_limit_key`      | The key of the limiter, for example `login`.                                        |
| `evt.Meta.rate_limit`          | The limit that was exceeded, for example `5/m`.                                     |
| `evt.Meta.request_uuid`        | The unique ID of the request.                                                       |
| `evt.Meta.remediation_cmpt_ip` | The IP of the remediation component that forwarded the request.                     |

The value passed as `source` is deliberately left out of the event, as it can be sensitive (a session cookie, an API key, …).

In addition, the first time a client goes over the limit of a key, CrowdSec sends an alert with the `rate limit exceeded` scenario. The alert context always includes `rate_limit_key` and `rate_limit`, so you can tell which limit was exceeded from the alert, including in the [CrowdSec Console](https://app.crowdsec.net). A client that keeps going over the limit does not generate any other alert until it has been idle for at least a full period of the limit.

While we do not provide scenarios for this out of the box, you can use these events to write your own scenarios, for example to ban clients that keep going over a limit:

```yaml
# /etc/crowdsec/scenarios/mycorp-appsec-login-rate-limit.yaml
type: leaky
name: mycorp/appsec-login-rate-limit
description: "Ban clients repeatedly exceeding the login rate limit"
filter: |
  evt.Meta.log_type == "appsec-rate-limit" &&
  evt.Meta.rate_limit_key == "login"
groupby: evt.Meta.source_ip
capacity: 20
leakspeed: 1m
blackhole: 5m
labels:
  type: appsec
  service: http
  remediation: true
```

## Memory usage

Each limiter keeps one entry per client (IP, IPv6 `/64` or `source` value) it has seen. Entries idle for at least a full period are periodically dropped, as their budget is full again at this point, so memory usage is roughly proportional to the number of distinct clients seen during one to two periods of each limit.

Keep this in mind when using long periods (`/h`) together with a custom `source`: the number of tracked clients is exposed by the `cs_appsec_rate_limiters` metric (see below).

## Metrics

| Metric                         | Type    | Labels                           | Description                                                     |
| ------------------------------ | ------- | -------------------------------- | --------------------------------------------------------------- |
| `cs_appsec_rate_limited_total` | counter | `source`, `appsec_engine`, `key` | Number of requests blocked by `RateLimit()`.                    |
| `cs_appsec_rate_limiters`      | gauge   | `appsec_engine`, `key`           | Number of clients currently tracked by the limiter of each key. |

The `source` label of `cs_appsec_rate_limited_total` is the remediation component that forwarded the request, not the rate limited client.

## Full example

The following configuration:

- limits login attempts to 5 per minute per IP,
- limits the API to 100 requests per minute per API key (or per IP for requests without a key),
- never rate limits a trusted internal network.

```yaml
name: custom/my-appsec-config
default_remediation: ban
inband:
  rules:
    - crowdsecurity/base-config
    - crowdsecurity/vpatch-*
  pre_eval:
    - filter: |
        req.Method == "POST" && req.URL.Path == "/login" &&
        !IpInRange(req.RemoteAddr, "10.0.0.0/8")
      apply:
        - RateLimit("login", "5/m")
    - filter: req.URL.Path startsWith "/api/"
      apply:
        - RateLimit("api", "100/m", req.Header.Get("X-Api-Key"))
```
