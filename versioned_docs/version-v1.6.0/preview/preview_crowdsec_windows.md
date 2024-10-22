---
id: crowdsec_windows
title: Windows
---

## CrowdSec Installation

You can download the MSI file from the [latest github pre-release](https://github.com/crowdsecurity/crowdsec/releases).

:::warning
Before upgrading an installation, ensure you make a backup of your configuration files you can follow our guide [here](backup_guide)
:::

The MSI file will perform some basic setup:
 - Installation of CrowdSec
 - Download of the [windows collection](https://hub.crowdsec.net/author/crowdsecurity/collections/windows). This includes the basic parser for the windows event log, a scenario to detect login brute force and the MMDB files to perform geo-ip enrichment.
 - Registering your CrowdSec installation with our Central API.
 - Installation of the Windows Service for CrowdSec. The service will start at boot time.

Contrary to Linux, CrowdSec does not yet support the automatic configuration at installation time. If you want to be able to detect something other than RDP or SMB bruteforce, then you will need to customize your acquisition configuration.

Please head over to the stable documentation to learn how to do so [here](../getting_started/install_windows#acquisition-configuration).

Once you've installed crowdsec, follow the [setup instruction for the preview](/preview/1-5/setup.mdx).