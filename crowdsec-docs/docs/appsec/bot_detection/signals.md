---
id: signals
title: "Bot detection signals"
sidebar_label: "Signals"
description: "How CrowdSec bot detection scores a client: built-in fingerprint signals, signals shipped by the hub as appsec-configs, and the experimental state a new signal passes through before it is given a weight."
sidebar_position: 4
---

A **signal** is a named observation about a client that adds points to its [request score](whats_included.md#how-a-request-is-scored), like `cdp` or `os_font_missing_windows`. Signals are what `score_reasons` lists on an alert, and what a threshold acts on.

Signals reach that score from three places, and a new one passes through an experimental state before it can affect anyone's traffic.

## Where signals come from

1. **Built-in signals.** The engine computes these from the fingerprint itself, and `crowdsecurity/appsec-bot-challenge-scoring` assigns their weights. They are listed with their severities in [Reasons and severities](hooks.md#reasons-and-severities), and with their weights in [How a request is scored](whats_included.md#how-a-request-is-scored).
2. **Signals shipped by the hub.** Added by `crowdsecurity/appsec-bot-challenge-detect-*` appsec-configs, which contribute `on_challenge_submit` rules of their own.
3. **Signals you write yourself.** The same mechanism, authored locally. See [Custom detection scripts](custom_js.md).

Some of those hub configs ship a [detection script](custom_js.md) to collect something new from the browser, declared as a `data:` entry of `type: challenge-js`. Others only score data the challenge already collected, and ship no code.

## Experimental and scoring signals

Every signal is in one of two states:

- **Experimental.** Weight `0`. It raises an alert naming what fired, and nothing else. It cannot block, and cannot push a submission over a threshold.
- **Scoring.** A real weight. It counts toward the request score like any built-in signal, so it can take a client over the threshold and get it blocked.

New signals are often shipped as experimental first.

### Telling which state a signal is in

The score category carries the state, and `score_reasons` on an alert shows it:

```
score_reasons    detect-experimental-fonts:os_font_missing_windows=0,cdp=100
```

A `detect-experimental-*` category means experimental and contributed nothing. A promoted signal reads `detect:os_font_missing_windows` with a weight behind it.

`appsec-bot-challenge-warn-experimental` is the config that raises those alerts.

## What's installed, and what's opt-in

Detection configs are grouped into two collections:

- **[`crowdsecurity/appsec-bot-challenge-detections`](https://app.crowdsec.net/hub/author/crowdsecurity/collections/appsec-bot-challenge-detections)** is pulled in by `appsec-bot-challenge`, `-strict` and `-permissive`, so if you installed any of those you already have it. Its hub page lists what it currently contains.
- **[`crowdsecurity/appsec-bot-challenge-detections-extra`](https://app.crowdsec.net/hub/author/crowdsecurity/collections/appsec-bot-challenge-detections-extra)** is opt-in. A config lands here when it carries a cost the default bundle shouldn't impose on everyone, such as a CSP requirement or a larger share of the client-side time budget, or when we aren't confident enough in it yet. Both reasons can apply at once.

The hub changes without needing a CrowdSec release, so those two hub pages are the only current list of what ships.

## Requirements

Detection configs need CrowdSec 1.8.2 or later. A config's own hub page states anything else it needs.

## Seeing what fires on your traffic

Experimental signals arrive as alerts:

```bash
sudo cscli alerts list --kind bot-detection
```

```bash
sudo cscli alerts inspect <id> -d
```

Read `score_reasons` in the context. The scenario name tells you the outcome: `crowdsecurity/suspicious-browser-submission` is detect-only, `crowdsecurity/rejected-browser-submission` means the client was rejected.

## Acting on a signal before it is promoted

You don't have to wait for a signal to be promoted upstream:

- [Give an experimental signal a weight](customization.md#give-an-experimental-signal-a-weight)
- [Cap or cancel a signal family](customization.md#cap-or-cancel-a-signal-family)

## Contributing a signal

New detections are welcome. `cscli hubtest` cannot test challenge hooks, so a detection is validated by shipping it experimental and watching what fires.

See [Contributing bot detections](/contributing/hub/bot_detections.md) for the conventions and the submission path.
