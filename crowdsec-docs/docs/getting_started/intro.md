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

The `Security Engine` comes compiled with a number of core components that can be enabled or disabled at runtime.
One of these features is called the **"LAPI"** (Local API) and other one is the **"log processor"**.  

A single `Security Engine` can run in autonomous mode where it handles reading logs (or requests) and processing them as well as handling alerts and other task on its own **"LAPI"**.   
For **scaling** or **perimeter segmentation** reasons you might want to have a distributed setup. In that case multiple `Security Engines` process logs and send alerts to a central one's **"LAPI"**. In that distributed case you'll see **"log processors"** attached to the central `Security Engines` in the console UI.   

Read more about the [Log Processor](log_processor/intro.mdx) and the [Local API](local_api/intro.md).
