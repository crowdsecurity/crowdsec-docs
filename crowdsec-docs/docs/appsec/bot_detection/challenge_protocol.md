---
id: challenge_protocol
title: Challenge protocol
sidebar_position: 3
---

This page describes how a compatible remediation component serves the bot-detection challenge.

The challenge HTML and JavaScript can be much larger than a normal remediation decision. For this reason, the remediation component must not try to pass the challenge body through a small control channel such as SPOE. It should use the control channel only to decide that a request needs a challenge, then serve the challenge body through a regular HTTP path.

## Components

- **Browser**: the client making the protected request.
- **Remediation component**: the HTTP integration in front of the application. For example, the HAProxy SPOA bouncer.
- **CrowdSec AppSec component**: validates the HTTP request and returns `allow`, `ban`, or challenge data.
- **Challenge HTTP path**: the route used by the remediation component to fetch and return the challenge page, JavaScript worker, or submit response.

## High-level flow

```text
Browser        Remediation component        AppSec component
   |                    |                         |
   | HTTP request       |                         |
   |------------------->|                         |
   |                    | validate request        |
   |                    |------------------------>|
   |                    | 403 action=challenge    |
   |                    |<------------------------|
   |                    |                         |
   | challenge response |                         |
   |<-------------------|                         |
```

For HAProxy SPOA specifically, there are two internal steps:

1. HAProxy sends the request metadata to the bouncer through SPOE. The bouncer calls AppSec and returns only `txn.crowdsec.remediation = "challenge"`.
2. HAProxy routes the same browser request to the bouncer's challenge HTTP server. That server calls AppSec again and writes the returned body, headers, and cookies directly to the browser.

This avoids sending large challenge bodies through SPOE frames.

## AppSec challenge response

When AppSec decides to challenge a request, it returns HTTP `403` to the remediation component with a JSON envelope:

```json
{
  "action": "challenge",
  "http_status": 200,
  "user_body_content": "<!DOCTYPE html>...",
  "user_headers": {
    "Content-Type": ["text/html"],
    "Content-Security-Policy": ["default-src 'self'"],
    "Cache-Control": ["no-cache, no-store"]
  },
  "user_cookies": [
    "__crowdsec_challenge=...; HttpOnly; Path=/; SameSite=Lax"
  ]
}
```

The remediation component interprets the fields as follows:

| Field | Meaning |
|---|---|
| `action` | Must be `challenge`. A `403` response with another action is treated as a block. |
| `http_status` | Status code to return to the browser. If missing, `200` is a safe default for challenge pages. |
| `user_body_content` | HTML, JavaScript, or JSON body to write to the browser. |
| `user_headers` | Response headers to forward to the browser. |
| `user_cookies` | Values to forward as separate `Set-Cookie` headers. |

If AppSec returns an empty `403` body or invalid JSON, the remediation component should fail closed and block the request.

## Challenge endpoints

The browser may request several challenge-related URLs:

```text
/crowdsec-internal/challenge/pow-worker.js
/crowdsec-internal/challenge/submit
```

These requests use the same protocol as the initial challenge page:

1. The browser requests a challenge asset or submits proof data.
2. The remediation component forwards the request to AppSec.
3. AppSec returns a challenge envelope.
4. The remediation component writes the response body, headers, and cookies to the browser.

The submit endpoint is usually a `POST`, so compatible remediation components must forward the request body to AppSec.

## Cookies

AppSec owns the challenge cookie values. The remediation component does not parse or validate them directly. It forwards the values from `user_cookies` as `Set-Cookie` headers.

Solved challenge state is then visible to AppSec on later requests through the browser's normal `Cookie` header. When AppSec recognizes a valid challenge cookie, it returns `allow`.

Do not combine multiple cookie values into one comma-separated header. Preserve each cookie as a separate `Set-Cookie` header.

## HAProxy SPOA example

The HAProxy SPOA bouncer uses a dedicated challenge listener. The bouncer configuration needs AppSec enabled and a challenge listener configured:

```yaml
appsec_url: http://127.0.0.1:7422/
challenge_listen: 127.0.0.1:9001
```

HAProxy must then route challenge remediations to that listener:

```haproxy
frontend protected
    mode http
    filter spoe engine crowdsec config /etc/haproxy/crowdsec.cfg

    acl body_within_limit req.body_size -m int le 51200
    http-request send-spoe-group crowdsec crowdsec-http-body if body_within_limit || !{ req.body_size -m found }
    http-request send-spoe-group crowdsec crowdsec-http-no-body if !body_within_limit { req.body_size -m found }

    http-request set-header X-Crowdsec-Real-Ip %[src] if { var(txn.crowdsec.remediation) -m str "challenge" }

    http-request lua.crowdsec_handle if { var(txn.crowdsec.remediation) -m str "captcha" }
    http-request lua.crowdsec_handle if { var(txn.crowdsec.remediation) -m str "ban" }

    use_backend crowdsec_challenge if { var(txn.crowdsec.remediation) -m str "challenge" }
    use_backend app

backend crowdsec_challenge
    mode http
    server challenge 127.0.0.1:9001
```

The important points are:

- `challenge` is not rendered by the Lua ban/captcha handler.
- HAProxy adds `X-Crowdsec-Real-Ip` before routing to the challenge server.
- The challenge backend points to the bouncer's `challenge_listen` address.
- Large challenge bodies are served through HTTP, not through SPOE.

## Solved challenge redirects

Some deployments use a synthetic URL such as `/challenge` to test the feature. Once the browser solves the challenge, AppSec returns `allow` for that URL. If the URL does not exist in the protected application, HAProxy should redirect it to a known-safe page instead of forwarding it to the application and returning a `404`.

Example:

```haproxy
http-request redirect code 302 location / if { path -m str /challenge } { var(txn.crowdsec.remediation) -m str "allow" }
```

For normal protected application URLs, no synthetic redirect is required: the original request can continue to the application after AppSec returns `allow`.

## Security notes

- Bind internal listeners to loopback unless remote access is explicitly needed. For example, use `127.0.0.1:9001` for the HAProxy SPOA challenge listener.
- Do not expose the challenge listener directly to the internet. It expects the front proxy to provide trusted request context such as the real client IP.
- Keep challenge response bodies out of control protocols with small frame limits.
- Preserve `Set-Cookie` as repeated headers.
- Forward challenge asset and submit paths unchanged.
- Forward request bodies for challenge submit requests.

## Failure behavior

A conservative remediation component should handle AppSec responses like this:

| AppSec response | Remediation behavior |
|---|---|
| `200` | Allow the request. |
| `403` with `action=challenge` | Serve the challenge response. |
| `403` with another action | Block the request. |
| `403` with an empty body | Block the request. |
| `403` with invalid JSON | Block the request. |
| `401`, `500`, or an unexpected status | Use the remediation component's configured AppSec failure behavior. |

For troubleshooting the AppSec side of the exchange, see the [AppSec protocol reference](../protocol.md) and the [bot detection configuration page](configuration.md).

