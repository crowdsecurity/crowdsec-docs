---
id: enable
title: Enable bot detection
sidebar_position: 2
---

This page covers turning bot detection on: installing the collection, making sure your AppSec acquisition loads it, and verifying that the challenge is served. Make sure you meet the [prerequisites](intro.md#prerequisites) first — in particular, a bot-detection-compatible bouncer.

## Install the collection

Install the collection that bundles everything (appsec-configs + scenarios + parsers):

```bash
sudo cscli collections install crowdsecurity/appsec-bot-challenge
```

Then make sure the bundled appsec-configs are actually loaded by your AppSec acquisition. Open the AppSec datasource file (typically `/etc/crowdsec/acquis.d/appsec.yaml`) to add the challenge config **and** the exclude-configs together with an `appsec-bot-*` wildcard:

```yaml
listen_addr: 127.0.0.1:7422
appsec_configs:
 ...
 ...
 - crowdsecurity/appsec-bot-*
labels:
  type: appsec
```

The `crowdsecurity/appsec-bot-*` wildcard picks up `appsec-bot-challenge-simple` (the config that serves the challenge) plus every `appsec-bot-challenge-exclude-*` config. Exclusion config covers bots (verified search-engine, AI, social and monitoring bots) and path exclusions. See [Known bots it lets through](whats_included.md#known-bots-it-lets-through) and [Path-exclusion configs](whats_included.md#path-exclusion-configs) for exactly what each one covers.


If some of those exclusions don't apply to your app, list the configs you want explicitly instead of using the wildcard:

```yaml
listen_addr: 127.0.0.1:7422
appsec_configs:
  - crowdsecurity/appsec-default
  - crowdsecurity/appsec-bot-challenge-simple
  - crowdsecurity/appsec-bot-challenge-exclude-crawler-files
  - crowdsecurity/appsec-bot-challenge-exclude-static
  # add or drop the other appsec-bot-challenge-exclude-* configs as needed
labels:
  type: appsec
```

A broader `crowdsecurity/*` wildcard also works and picks up every installed `crowdsecurity/*` appsec-config.

Reload CrowdSec for the change to take effect:

```bash
sudo systemctl reload crowdsec
```

:::info
If your acquisition already loads appsec-configs via a `crowdsecurity/*` wildcard, no acquisition change is needed, installing the collection is enough.
:::

Once installed, see [default configuration](whats_included.md) for a tour of the behavior you just enabled — none of it requires an extra install step.

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
  await page.goto("https://your-protected-site.example/some/page", { waitUntil: "networkidle0" });
  console.log("status:", (await page.content()).length, "bytes");
  await browser.close();
})();
```

</details>

The browser solves the proof-of-work and submits a valid challenge, but because the fingerprint carries the `cdp` signal it is **not** granted a cookie. Tail the log and you should see the rejection with the `cdp` signal:

```
level=info msg="on_challenge_submit rejected" source=X.X.X.X is_bot=true reason="known bot (fast bot detection)" signals="[cdp]"
```

A clean browser (no automation, no DevTools attached) visiting the same route gets the cookie and passes.

If you don't see any challenge activity after a reload, double-check that:

- The new appsec-config is listed in your AppSec datasource (`appsec_configs:`).
- The bouncer is forwarding `/crowdsec-internal/challenge/*` paths unchanged.

## Metrics

Bot detection exposes the challenge lifecycle as Prometheus counters and surfaces a summary in `cscli`. The funnel is `requested` → `submitted` → `accepted` (`solved` or `granted`) or `rejected` (`protocol`, `submission`, or `cookie`).

The dedicated `bot-detection` section shows the per-engine breakdown:

```
$ sudo cscli metrics show bot-detection
```

<!-- TODO: paste real `cscli metrics show bot-detection` output once captured against a running stack -->

The top-level appsec table also gains a three-column challenge summary:

```
$ sudo cscli metrics show appsec-engine
```

<!-- TODO: paste real `cscli metrics show appsec-engine` output showing the new Ch. Requested / Ch. Accepted / Ch. Rejected columns -->

The full list of Prometheus metric names and labels lives in the [Application Security Engine section of the Prometheus reference](../../observability/prometheus.md#application-security-engine).
