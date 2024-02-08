---
id: acquisition
title: Acquisition
---

:::info
This acquisition guide will walk you through adding additional acquisition, to see all available options see the [Acquisition](/docs/next/acquisition/intro) documentation.
:::

# Acquisition

By default when CrowdSec is installed it will attempt to detect the running services and acquire the appropriate parsers and scenarios. However, you may want to manually acquire parsers and scenarios for services that are not detected.

## What services are supported?

To find a list of supported services, you can browser the [hub](https://hub.crowdsec.net/) or use the `cscli` command line tool.

```bash
sudo cscli collections list --all
```

