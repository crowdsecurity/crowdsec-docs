---
id: intro
title: Introduction
sidebar_position: 1
---

To be able to detect things, crowdsec needs to access logs.
DataSources are configured via the [acquisition]({{TBD}}) configuration, or specified via the command-line when performing cold logs analysis.


Name | Type | Stream | One-shot
-----|------|--------|----------
file | single files, glob expressions and .gz files | yes | yes
journald | journald via filter | yes | yes
aws cloudwatch | single stream or log group | yes | yes
syslog service | read logs received via syslog protocol | yes | no
