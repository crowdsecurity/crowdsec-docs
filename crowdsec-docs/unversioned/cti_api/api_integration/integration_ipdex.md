---
id: integration_ipdex
title: IPDEX
sidebar_position: 1
---

`ipdex` is a tool developed by CrowdSec to investigate IP reputation using the CrowdSec CTI API. It is available as a **web application** and a **CLI**, and is particularly useful as a Proof of Value tool to assess CrowdSec's threat intelligence coverage across both blocklists and threat intel data.

## Web UI

The [ipdex web app](https://ipdex.crowdsec.net/) lets you upload a list of IPs or a log file and instantly get a reputation report — no installation required.

![ipdex web UI](/img/ipdex_demo.png)

For full usage documentation, see [ipdex.crowdsec.net/docs](https://ipdex.crowdsec.net/docs).

## CLI

The CLI version is available for local use and automation. It connects to the CTI API using your API key.

[Official ipdex repository](https://github.com/crowdsecurity/ipdex)

### Installation

See the [install guide](https://github.com/crowdsecurity/ipdex?tab=readme-ov-file#1-install) on the ipdex repository.

### Usage

See the [user guide](https://github.com/crowdsecurity/ipdex?tab=readme-ov-file#user-guide) on the ipdex repository.

#### Analyzing an IP address

![IP Analysis](/img/ipdex/ipdex_ip.png)

#### Analyzing a log file

![Log File Analysis](/img/ipdex/ipdex_log_file.png)
