---
id: signals
title: "Bot detection signals"
sidebar_label: "Signals"
description: "How CrowdSec bot detection scores a client: built-in fingerprint signals, signals shipped by the hub as appsec-configs, and the experimental state a new signal passes through before it is given a weight."
sidebar_position: 4
---

A **signal** is a named observation about a client that adds points to its [request score](whats_included.md#how-a-request-is-scored), like `cdp` or `os_font_missing_windows`. Alerts list the signals that fired in `score_reasons`.

## Where signals come from

1. **Built-in signals.** The engine computes these from the fingerprint, and `crowdsecurity/appsec-bot-challenge-scoring` assigns their weights. They are listed with their severities in [Reasons and severities](hooks.md#reasons-and-severities), and with their weights in [How a request is scored](whats_included.md#how-a-request-is-scored).
2. **Signals shipped by the hub.** Added by `crowdsecurity/appsec-bot-challenge-detect-*` appsec-configs. Some of these configs also ship a [detection script](custom_js.md) that collects extra data in the browser.
3. **Signals you write yourself.** See [Custom detection scripts](custom_js.md).

## Experimental and scoring signals

Every signal is in one of two states:

- **Experimental** signals have a weight of `0`. They never block, but `appsec-bot-challenge-warn-experimental` raises an alert when one fires.
- **Scoring** signals have a real weight and count toward the request score, so they can get a client blocked.

New signals are often shipped as experimental first.

### Telling which state a signal is in

The category prefix in `score_reasons` shows it:

```
score_reasons    detect-experimental-fonts:os_font_missing_windows=0,cdp=100
```

`detect-experimental-*` marks an experimental signal. A scoring signal from a detection config uses the `detect` category instead.

## What's installed, and what's opt-in

Detection configs are grouped into two collections:

- **[`crowdsecurity/appsec-bot-challenge-detections`](https://app.crowdsec.net/hub/author/crowdsecurity/collections/appsec-bot-challenge-detections)** is installed by `appsec-bot-challenge`, `-strict` and `-permissive`.
- **[`crowdsecurity/appsec-bot-challenge-detections-extra`](https://app.crowdsec.net/hub/author/crowdsecurity/collections/appsec-bot-challenge-detections-extra)** is opt-in. It holds configs that cost too much to impose on everyone, such as a CSP requirement or a larger share of the client-side time budget, or that we aren't confident enough in yet.

Each collection's hub page lists the configs it currently contains.

## Requirements

Detection configs need CrowdSec 1.8.2 or later. Any other requirement is listed on the config's hub page.

## Seeing what fires on your traffic

Experimental signals arrive as alerts:

```bash
sudo cscli alerts list --kind bot-detection
```

```bash
sudo cscli alerts inspect <id> -d
```

`crowdsecurity/suspicious-browser-submission` alerts are detect-only. `crowdsecurity/rejected-browser-submission` means the client was rejected.

## Acting on a signal before it is promoted

You don't have to wait for a signal to be promoted upstream:

- [Give an experimental signal a weight](customization.md#give-an-experimental-signal-a-weight)
- [Cap or cancel a signal family](customization.md#cap-or-cancel-a-signal-family)

## Contributing a signal

`cscli hubtest` cannot test challenge hooks, so new detections are validated by shipping them as experimental and watching what fires. See [Contributing bot detections](/contributing/hub/bot_detections.md).
