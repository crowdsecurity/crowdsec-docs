---
id: acquisition
title: Acquisition
---

:::info
This acquisition guide will walk you through adding additional acquisition, to see all available options see the [Acquisition](/docs/next/acquisition/intro) documentation.
:::

# Acquisition

By default when CrowdSec is installed it will attempt to detect the running services and acquire the appropriate parsers and scenarios. However, you may want to manually acquire parsers and scenarios for services that are not detected.

## What services are already detected?

To find what services are already detected, you can use the `cscli` command line tool.

```bash
sudo cscli collections list
```

### How to interpret the output

The output will show a list of collections that are already acquired. For example `crowdsecurity/sshd` is the collection for the `sshd` service.

## What services are supported?

To find a list of supported services, you can [browse the hub online](https://hub.crowdsec.net/) or use the `cscli` command line tool.

```bash
sudo cscli collections list --all
```

:::tip
You can filter the output by piping the output to `grep` or `awk` to find the service you are interested in.
:::

