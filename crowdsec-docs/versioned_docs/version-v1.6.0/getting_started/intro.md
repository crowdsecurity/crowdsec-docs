---
id: security_engine_intro
title: Introduction
sidebar_position: 1
---

# Security Engine

:::info
You may see Security Engine referred to as "agent" in the documentation/videos and "machines" within cscli commands.
:::

The Security Engine is a core component of CrowdSec. It is the component that will analyze logs and will expose an API endpoint for the remediation components to get the decisions made by the engine.

## Supported Platforms

See [Version Matrix](/getting_started/versions_matrix.md) for a list of supported platforms.

## Why is my Security Engine classed as a "log processor" within the console?

The `Security Engine` comes compiled with a number of optional features that can be enabled or disabled at runtime. One of these features is called the "LAPI" (Local API). If this feature is disabled at runtime, the Security Engine will be classed as a "log processor" within the console as it will only be able to process logs and forward the alerts to the local API you define in the configuration.

Most commonly this is the case when you are running in a distributed setup, where you have a central server that is running the LAPI and a number of remote servers that are running the "Log processors".
