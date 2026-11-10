---
id: appsec_rules
title: "Contributing AppSec Rules"
sidebar_label: "AppSec Rules"
description: "How to contribute an AppSec (WAF) rule to the CrowdSec hub: rule syntax and metadata, hubtest with nuclei templates, and the CI gates a pull request has to pass."
---

An AppSec rule lives under `appsec-rules/AUTHOR/`, where `AUTHOR` is your hub author name, and needs a test that proves it fires.

[AppSec rule creation](/appsec/create_rules.md) is the full walkthrough, and [rules syntax](/appsec/rules_syntax.md) is the reference. The shared PR workflow is on [Contributing to the Hub](intro.md). For bot detection, see [Contributing bot detections](bot_detections.md).

## Filename prefixes

Pick the filename prefix that matches what you're adding:

| Prefix | For |
|---|---|
| `vpatch-` | a rule targeting a specific vulnerability, usually a CVE |
| `crs-` | rules bridging the OWASP Core Rule Set |
| `generic-` | broad behavioral rules not tied to one vulnerability |
| `experimental-` | rules not yet trusted to block |

:::note
`appsec-default.yaml` loads `experimental-*` rules out of band, so they detect but never block. Experimental bot-detection signals are a different mechanism.
:::

## Rule metadata

Fill the required labels and classification fields, and make sure they describe what the rule does: downstream consumers rely on them.

## Test your rule

Every rule needs an AppSec test: a nuclei template that sends the payload, and the expected outcome. See [create our test](/appsec/create_rules.md#create-our-test). To run it, use the following command:

```bash
cscli hubtest run TEST_NAME --appsec
```

Replace `TEST_NAME` with the name of your test.

See [`cscli hubtest`](/cscli/cscli_hubtest.md) for the options, and [Creating a test environment](../engine/test_env.md) if you don't have a local setup yet.

## CI checks

Three CI jobs run on an AppSec rule pull request:

- **`test_appsec_rules`** runs `cscli hubtest run --all --appsec` against a nuclei and OpenResty stack, and fails if any test fails.
- **`waf-check`** replays legitimate traffic against the rules and fails on false positives, even when the rule's own test passes.
- **`appsec_vpatch_lint`** checks that every new `vpatch-` rule is listed in `collections/crowdsecurity/appsec-virtual-patching.yaml`, and comments on the PR if it isn't.

## Documentation

Add a `.md` file with the same name next to the rule. The [hub](https://hub.crowdsec.net) renders it: say what the rule catches and, if relevant, what it might false-positive on.
