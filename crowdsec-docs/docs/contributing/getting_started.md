---
id: getting_started
title: "Contributing: getting started"
sidebar_label: "Getting Started"
description: "Start contributing to CrowdSec: where to talk to the project, how to find a first issue, and the four contribution tracks: the Security Engine, the hub, remediation components and the documentation."
---

You want to contribute to CrowdSec? Fantastic!

In order to achieve this, this guide will provide you with all the needed information and guidance :+1:

### Communication

The main communication channels of the project are:

- [discord](https://discord.gg/crowdsec): [Discord](https://discord.com/) is the most common communication medium of the project, and is especially suitable for live interactions (chatting).
- [github](https://github.com/crowdsecurity/): Issues and Pull Requests are used to expose bugs and suggestions in a more formal way.

Do not hesitate to join & ask your questions!

## Making your first contribution

### Find something to work on

The first step to getting started is to find something to work on. Help is always welcome, and no contribution is too small!

Here are some things you can do today to start contributing:

- Help improve the documentation
- Write test coverage
- Help triage issues

### Find a good first topic

There are multiple repositories within the Crowdsecurity organization. [Each repository](https://github.com/crowdsecurity/) has beginner-friendly issues that are a great place to get started on your contributor journey. For example, [crowdsecurity/crowdsec](https://github.com/crowdsecurity/crowdsec/issues) and [crowdsecurity/hub](https://github.com/crowdsecurity/hub/issues) have `help wanted` and `good first issue` labels for issues that don’t need high-level Crowdsec knowledge to contribute to. The `good first issue` label also indicates that Crowdsecurity Members are committed to providing extra assistance for new contributors. Another way to get started is to find a documentation improvement, such as a missing/broken link, which will give you exposure to the code submission/review process without the added complication of technical depth.

## The four contribution tracks

Each part of the project has its own contribution guide:

- [Security Engine](engine.md): the Go source, its tests and the branch workflow.
- [Hub](hub/intro.md): [parsers and scenarios](hub/parsers_scenarios.md), [AppSec rules](hub/appsec_rules.md) and [bot detections](hub/bot_detections.md).
- [Remediation components](components.md): bouncers and the specifications they implement.
- [Documentation](docs.md): these pages.

To run anything locally, first [create a test environment](engine/test_env.md).

## Using AI tools

AI tools are welcome, but people review every PR, and generated content nobody checked wastes their time. Before you open a PR:

- Read the whole diff yourself, and run the change or check the tests your agent ran.
- Cut what you wouldn't have written by hand: comments that restate the code, tests that can't fail, unrelated reformatting.
- Write the PR description yourself, in a few lines: what changed, why, and how you tested it. Answer review comments in your own words too.
- Read the repository's `AGENTS.md` when it has one, such as the [Security Engine's](https://github.com/crowdsecurity/crowdsec/blob/master/AGENTS.md), and point your agent at it.
- Declare your AI use in the PR.

PRs that skip these are unlikely to be reviewed.
