---
id: acquisition
title: Acquisition
---

# Acquisition

By default when CrowdSec is installed it will attempt to detect the running services and acquire the appropriate parsers and scenarios. However, you may want to manually acquire parsers and scenarios for services that are not detected.

## What services are already detected?

To find what services are already detected, you can use the `cscli` command line tool.

```bash
cscli collections list
```

:::info
Collections are packages of parsers and scenarios that are used to detect security threats.
:::

### How to interpret the output

The output will show a list of collections that are already installed. For example `crowdsecurity/sshd` is the collection for the `sshd` service.

:::info
If you already see all services you want covered by the output, you do not need to do any additional configuration for acquisition.

[Head back to the post installation guide](/getting_started/next_steps.md)
:::

## Are the detected services working correctly?

To check if the detected services are working correctly, you can use the `cscli` command line tool.

```bash
cscli collections inspect <collection_name>
```

### How to interpret the output

Within the output, you will see a list of parsers and scenarios that are installed for the collection. If you see the correct files for your platform and version, then the service is working correctly.

<details>

<summary>Example output</summary>

```bash
type: collections
name: crowdsecurity/iptables
file_name: iptables.yaml
description: 'iptables support : logs and port-scans detection scenarios'
author: crowdsecurity
path: collections/crowdsecurity/iptables.yaml
version: "0.2"
parsers:
- crowdsecurity/iptables-logs
scenarios:
- crowdsecurity/iptables-scan-multi_ports
contexts:
- crowdsecurity/firewall_base
local_path: /etc/crowdsec/collections/iptables.yaml
local_version: "0.2"
local_hash: d59e4198c2b88cccb6f9da9f9375348a1835d7f5a933d7452693ad0321ef1282
installed: true
downloaded: true
uptodate: true
tainted: false
belongs_to_collections:
- crowdsecurity/unifi
local: false

Current metrics:

- (Parser) crowdsecurity/iptables-logs:
╭────────────────────────┬──────┬────────┬──────────╮
│        Parsers         │ Hits │ Parsed │ Unparsed │
├────────────────────────┼──────┼────────┼──────────┤
│ file:/var/log/kern.log │ 45   │ 45     │ 0        │
├────────────────────────┼──────┼────────┼──────────┤
│ file:/var/log/syslog   │ 45   │ 45     │ 0        │
╰────────────────────────┴──────┴────────┴──────────╯

- (Scenario) crowdsecurity/iptables-scan-multi_ports:
╭───────────────┬───────────┬──────────────┬────────┬─────────╮
│ Current Count │ Overflows │ Instantiated │ Poured │ Expired │
├───────────────┼───────────┼──────────────┼────────┼─────────┤
│ 0             │ 0         │ 38           │ 38     │ 38      │
╰───────────────┴───────────┴──────────────┴────────┴─────────╯
```

</details>

## What services are supported?

To find a list of supported services, you can [browse the hub online](https://hub.crowdsec.net/) or use the `cscli` command line tool.

```bash
cscli collections list --all
```

:::tip
You can filter the output by piping the output using command line tools such as `grep` or `awk`.
:::

## How to setup a new acquisition

Once you have found an acquisition you want to add, you can use the `cscli` command line tool to add the collection.

```bash
cscli collections add <collection_name>
```
