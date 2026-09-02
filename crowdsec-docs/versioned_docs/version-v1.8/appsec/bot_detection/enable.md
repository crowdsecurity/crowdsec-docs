---
id: enable
title: Enable bot detection
sidebar_position: 2
---

This page covers turning bot detection on: installing the collection, making sure your AppSec acquisition loads it, and verifying that the challenge is served. Check the [prerequisites](intro.md#prerequisites) first.

:::warning

Check that your bouncer supports bot detection before going further, see the [list of compatible bouncers](intro.md#prerequisites). Enabling it behind a bouncer that does not support it leads to unexpected behavior, most likely silently refusing every client.

:::

## Install the collection

Install the collection that bundles everything (appsec-configs + scenarios + parsers):

```bash
sudo cscli collections install crowdsecurity/appsec-bot-challenge
```

Then make sure the bundled appsec-configs are actually loaded by your AppSec acquisition. Open the AppSec datasource file (typically `/etc/crowdsec/acquis.d/appsec.yaml`):

```yaml
listen_addr: 127.0.0.1:7422
appsec_configs:
  - crowdsecurity/appsec-default
  - crowdsecurity/appsec-bot-*
labels:
  type: appsec
```

The wildcard matches **installed** appsec-configs only, so it picks up exactly what the collection gave you: the scoring engine, its threshold, and every exclusion config. A broader `crowdsecurity/*` works too.

:::warning

Install one bundle, not several. `appsec-bot-challenge`, `-strict` and `-permissive` each ship a different threshold config, and a wildcard loads every one you have installed. Their rejection rules then stack and the strictest threshold wins, silently overriding your choice. If you switch bundles, remove the old one rather than installing on top.

:::

The exclusion configs cover verified search-engine, AI, social and monitoring bots plus well-known paths. See [Known bots it lets through](whats_included.md#known-bots-it-lets-through) and [Path-exclusion configs](whats_included.md#path-exclusion-configs) for what each one covers. If some don't apply to your app, list the configs you want by name instead of using the wildcard.

Reload CrowdSec for the change to take effect:

```bash
sudo systemctl reload crowdsec
```

## Choosing a threshold

The collection installed above rejects a submission scoring 75 or more. To be stricter or more forgiving, install a different bundle and point the acquisition at its threshold config:

| Collection                                      | Threshold config to load                                | Rejects at |
| ----------------------------------------------- | ------------------------------------------------------- | ---------- |
| `crowdsecurity/appsec-bot-challenge`            | `crowdsecurity/appsec-bot-challenge-scoring-balanced`   | `>= 75`    |
| `crowdsecurity/appsec-bot-challenge-strict`     | `crowdsecurity/appsec-bot-challenge-scoring-strict`     | `>= 45`    |
| `crowdsecurity/appsec-bot-challenge-permissive` | `crowdsecurity/appsec-bot-challenge-scoring-permissive` | `>= 100`   |

Start with the default, then read `score_reasons` on real rejections before you move it. [How a request is scored](whats_included.md#how-a-request-is-scored) covers what each threshold buys you.

Once installed, see [default configuration](whats_included.md) for a tour of the behavior you just enabled — none of it requires an extra install step.

## Content-Security-Policy

Every challenge response carries its own `Content-Security-Policy` header. The challenge page runs an inline script and an inline style, and starts the proof-of-work worker from a `blob:` URL, so it needs a policy that allows all three. The AppSec component always sets the same permissive one:

```
default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; worker-src 'self' blob:;
```

:::note
This policy is fixed: there is currently no configuration option or hook helper to change the challenge's `Content-Security-Policy`, so a conflict with your own has to be solved on the web server side.
:::

If your web server also sets a `Content-Security-Policy`, that policy is _added_ next to the challenge's instead of replacing it. The browser then receives **two** policies and enforces both: something is only allowed if _every_ policy allows it. A site policy without `'unsafe-inline'` or without `blob:` therefore blocks the challenge page even though the challenge shipped a permissive policy of its own, and the visitor is stuck on a page that can never solve anything.

The symptom is a blank or frozen challenge page with `Refused to execute inline script …` or `Refused to create a worker …` in the browser console, while [the metrics](#metrics) show challenges being requested but never submitted.

The fix is to **set your own policy only when the response does not already carry one**, so that the challenge's header is the one the browser gets. In nginx, map the policy already set on the response to your own, and add the header from that map:

```nginx
http {
    # ... your policy when the response has no CSP yet, empty otherwise
    map $sent_http_content_security_policy $hdr_csp {
        ""  "default-src 'self'; script-src 'self'; object-src 'none'";
    }

    server {
        # ...
        add_header Content-Security-Policy $hdr_csp;
    }
}
```

The map has no `default`, so `$hdr_csp` is empty for any response that already carries a policy — the challenge page among them — and nginx does not add a header whose value is empty.

If you serve several sites with different policies, feed `$hdr_csp` from a second map keyed on `$host` instead of a literal:

```nginx
http {
    # the policy each site wants
    map $host $host_csp {
        "www.example.com"   "default-src 'self'; script-src 'self'; object-src 'none'";
        "shop.example.com"  "default-src 'self'; img-src 'self' data:";
        default             "default-src 'self'";
    }

    # ... but only on a response that has no CSP yet
    map $sent_http_content_security_policy $hdr_csp {
        ""  $host_csp;
    }

    server {
        # ...
        add_header Content-Security-Policy $hdr_csp;
    }
}
```

Since an empty value means no header at all, `default ""` in the first map is how you leave a host without any site policy.

:::note
Side effect: an application of yours that sets its own `Content-Security-Policy` also keeps it, since nginx no longer adds the site policy on top of it.
:::

## Verification

Hit a protected route from a clean client (no cookie): you should receive the challenge HTML:

```bash
curl -i https://your-protected-site.example/some/page
# expect a 200 with a small HTML body containing the challenge script,
# and a Set-Cookie for __crowdsec_challenge once the challenge is solved.
```

Tail the CrowdSec log and trigger a failed submission (e.g. with `curl` against `/crowdsec-internal/challenge/submit` with garbage payload) to see the `on_challenge_submit rejected` line. After enough failed submissions, the behavioral scenario should fire and appear in `cscli alerts list`.

### Get rejected as a bot (CDP)

To see the bad-bot rejection path end to end, visit a protected route with a browser driven over the **Chrome DevTools Protocol (CDP)**. The fingerprint library flags CDP as a high-severity automation signal, rejecting it. Any CDP-based automation triggers it: [Puppeteer](https://pptr.dev/), [Playwright](https://playwright.dev/) with Chromium, or plain Chrome launched with `--remote-debugging-port` (or open debug-tools).

<details>
<summary>Example Puppeteer script</summary>

```js
// node cdp-check.js — drives Chromium over CDP, so the challenge should reject it
const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://your-protected-site.example/some/page", {
    waitUntil: "networkidle0",
  });
  console.log("status:", (await page.content()).length, "bytes");
  await browser.close();
})();
```

</details>

The browser solves the proof-of-work and submits a valid challenge, but the fingerprint carries the `cdp` signal, worth 100 points on its own. Tail the log and you should see the rejection:

```
level=info msg="on_challenge_submit rejected" automation=true is_bot=true platform=Linux reason="request score 115" signals="[cdp utc_timezone]" source="::1" timezone=UTC ua="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36"
```

`reason` reports the score that crossed the threshold. Here the container also reported a UTC timezone, so `utc_timezone` added its 15 points on top of `cdp`.

A clean browser (no automation, no DevTools attached) visiting the same route gets the cookie and passes.

### What the alert looks like

A rejection is not just a log line. It becomes an alert with kind `bot-detection`:

```
$ sudo cscli alerts list --kind bot-detection --limit 1
+------+--------+-------------------------------------------+---------+----+-----------+----------------------+---------------+
|  ID  |  value |                   reason                  | country | as | decisions |      created_at      |      kind     |
+------+--------+-------------------------------------------+---------+----+-----------+----------------------+---------------+
| 2019 | Ip:::1 | crowdsecurity/rejected-browser-submission |         |    |           | 2026-08-18T11:41:11Z | bot-detection |
+------+--------+-------------------------------------------+---------+----+-----------+----------------------+---------------+
```

Inspect it to see why the client was refused:

```
$ sudo cscli alerts inspect 2019 -d

 - Context  :
+------------------+--------------------------------------------------------------+
|        Key       |                             Value                            |
+------------------+--------------------------------------------------------------+
| bot_detected     | true                                                         |
| challenge_event  | rejected                                                     |
| fail_reason      | request score 115                                            |
| fingerprint_id   | FS1_000010000000000100000_00010h02ba_1280x1024c02m08b00011h4 |
|                  | 0bcfb_f10001111000101111000111111111e00000000p1100h-2d436_0h |
|                  | 6526db_1h-53968_en2tUTC_h-48c_0100h6ae994                    |
| operating_system | Linux                                                        |
| request_score    | 115                                                          |
| score_reasons    | cdp=100,utc_timezone=15                                      |
| target_uri       | /                                                            |
| user_agent       | Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML,   |
|                  | like Gecko) Chrome/151.0.0.0 Safari/537.36                   |
+------------------+--------------------------------------------------------------+
```

`score_reasons` is the field that explains the decision. See [The alerts it produces](whats_included.md#the-alerts-it-produces) for the full field reference and how these look in the Console.

If you don't see any challenge activity after a reload, double-check that:

- The new appsec-config is listed in your AppSec datasource (`appsec_configs:`).
- The bouncer is forwarding `/crowdsec-internal/challenge/*` paths unchanged.
- Your web server is not adding a `Content-Security-Policy` of its own on top of the challenge's, see [Content-Security-Policy](#content-security-policy).

## Metrics

Bot detection exposes the challenge lifecycle as Prometheus counters and surfaces a summary in `cscli`. The funnel is `requested` → `submitted` → `accepted` (`solved` or `granted`) or `rejected` (`protocol`, `submission`, or `cookie`).

The dedicated `bot-detection` section shows the per-engine breakdown:

```
$ sudo cscli metrics show bot-detection
+----------------------------------------------------------------------------------------------------------------------------------+
| Bot Detection Metrics                                                                                                            |
+-----------------+-----------+-----------+--------+---------+--------+-------------------+----------------------+-----------------+
| Bot Detection   | Requested | Submitted | Solved | Granted | Exempt | Protocol Failures | Submissions Rejected | Cookies Invalid |
+-----------------+-----------+-----------+--------+---------+--------+-------------------+----------------------+-----------------+
| 127.0.0.1:7422/ | 3         | 2         | 1      | -       | 2      | -                 | 1                    | -               |
+-----------------+-----------+-----------+--------+---------+--------+-------------------+----------------------+-----------------+
+----------------------------------+
| Bot Detection — Exempted         |
+-----------------+--------+-------+
| Appsec Engine   | Reason | Count |
+-----------------+--------+-------+
| 127.0.0.1:7422/ | static | 2     |
+-----------------+--------+-------+
| Total           |        | 2     |
+-----------------+--------+-------+
+----------------------------------------------------------+
| Bot Detection — Rejected                                 |
+-----------------+------------+-------------------+-------+
| Appsec Engine   | Kind       | Reason            | Count |
+-----------------+------------+-------------------+-------+
| 127.0.0.1:7422/ | submission | request score 115 | 1     |
+-----------------+------------+-------------------+-------+
| Total           |            |                   | 1     |
+-----------------+------------+-------------------+-------+
+-----------------------------------------+
| Bot Detection Infrastructure Metrics    |
+---------------------------------+-------+
| Metric                          | Count |
+---------------------------------+-------+
| Signing key regenerated         | 1     |
| Signing key evicted             | 0     |
| Re-obfuscation (dynamic module) | 1     |
| Dynamic module evicted          | 0     |
+---------------------------------+-------+
```

Read the funnel across the first table: 3 challenges served, 2 submitted, 1 solved and 1 rejected. The `Exempt` column counts requests an exclusion config skipped, here 2 static assets. The `Rejected` table groups by the reason string, so with the shipped configs it doubles as a histogram of the scores you are turning away.

The top-level appsec table also gains a three-column challenge summary:

```
$ sudo cscli metrics show appsec-engine
+-------------------------------------------------------------------------------------+
| Appsec Metrics                                                                      |
+-----------------+-----------+---------+---------------+--------------+--------------+
| Appsec Engine   | Processed | Blocked | Ch. Requested | Ch. Accepted | Ch. Rejected |
+-----------------+-----------+---------+---------------+--------------+--------------+
| 127.0.0.1:7422/ | 12        | 1       | 3             | 1            | 1            |
+-----------------+-----------+---------+---------------+--------------+--------------+
```

The full list of Prometheus metric names and labels lives in the [Application Security Engine section of the Prometheus reference](../../observability/prometheus.md#application-security-engine).
