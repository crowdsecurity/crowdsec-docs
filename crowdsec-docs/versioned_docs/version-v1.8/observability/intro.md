---
id: intro
title: Introduction
sidebar_position: 1
---

Observability in security software is crucial, especially when this software might take important decision such as blocking IP addresses.

We attempt to provide good observability of CrowdSec's behavior :

 - CrowdSec itself exposes a [prometheus instrumentation](/observability/prometheus.md)
 - `cscli` allows you to view part of prometheus metrics in [cli (`cscli metrics`)](/cscli/cscli_metrics.md)
 - CrowdSec logging is contextualized for easy processing
 - for **humans**, `cscli` provides command-line tools to inspect and manage CrowdSec's behavior

Furthermore, most of CrowdSec configuration should allow you to enable partial debug (ie. per-scenario, per-parser etc.)

