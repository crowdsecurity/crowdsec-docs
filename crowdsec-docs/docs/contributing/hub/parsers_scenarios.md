---
id: parsers_scenarios
title: "Contributing Parsers and Scenarios"
sidebar_label: "Parsers & Scenarios"
description: "How to contribute a parser or scenario to the CrowdSec hub: what each one is responsible for, the required labels, hubtest coverage, and the per-item documentation a reviewer expects."
---

Supporting a new service usually means contributing a parser, a scenario, and a collection that bundles them.

The full walkthroughs are [parsers creation](/log_processor/parsers/create.md) and [scenarios creation](/log_processor/scenarios/create.md). The shared PR workflow is on [Contributing to the Hub](intro.md).

## Parsers

A parser extracts fields. Keep detection logic in the scenario, so others can reuse your parser with their own scenarios. Before you submit a parser:

- Reuse existing grok patterns and [expr helpers](/expr/intro.md) before writing new ones.
- Set the fields scenarios rely on, in particular the source IP that scenarios use to decide whom to ban.
- Cover the parser with [`cscli hubtest`](/cscli/cscli_hubtest.md), using sample logs that include success, failure and edge cases.

## Scenarios

Before you submit a scenario:

- Fill the required `labels` so they match what the scenario detects, since classification and remediation depend on them.
- Test against legitimate traffic too, since a false positive bans real users.
- Explain in the pull request why you chose the `capacity` and `leakspeed`, since they set the scenario's sensitivity.

## Collections

Bundle tested parsers and scenarios into a collection, following [collections format](/log_processor/collections/format.md). Its `.md` should state the goal and include an acquisition example showing how to ingest the relevant logs.

## Test your parsers and scenarios

See [parser tests](/log_processor/parsers/create.md#create-our-test) and [scenario tests](/log_processor/scenarios/create.md#create-our-test). Also check that your items work with the existing ones they depend on. To run tests locally, see [Creating a test environment](../engine/test_env.md).

## Documentation

Add a `.md` file with the same name as each parser, scenario and collection. The [hub](https://hub.crowdsec.net) renders it: state the item's purpose and anything needed to set it up.
