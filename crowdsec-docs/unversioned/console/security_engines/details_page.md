---
title: Details page
description: Learn how to view the details of a Security Engine in the CrowdSec Console its purpose and how to use it
---

## Introduction

This page will reference information about a specific Security Engine. This page is your one-stop resource for understanding everything related to the Security Engine you're interested in.

![Security Engine details page](/img/console/security_engines/details-page.jpeg)

## Usage

### Summary

At the top of the page, the essential information regarding the Security Engine is referenced. This includes the IP address, ID, last activity, tags, and the current version. This page will notify if the Security Engine is not running the latest CrowdSec version. To identify outdated Security Engines, you can also utilize the [**Troubleshooting**](/console/security_engines/troubleshooting) feature.

![Security Engine details page](/img/console/security_engines/details-page-summary.png)

Quick actions are available from the summary to apply changes to your Security Engine.

-   [Update name or tags](/console/security_engines/name_and_tags.md)
-   [Transfer an Engine](/console/security_engines/transfer_engine.md)
-   [Remove an Engine](/console/security_engines/remove_engine.md)

![Security Engine details page](/img/console/security_engines/details-page-actions.png)

### Remediation components

The [remediation component](/bouncers/intro.md) in CrowdSec will apply either the decisions made by CrowdSec, the blocklists or the custom decisions.

![Security Engine details page](/img/console/security_engines/details-page-remediation.png)

#### Metrics

Starting from version 1.6.3, CrowdSec’s remediation components now display detailed metrics. These metrics provide valuable insights into the number of traffic drops and the volume of traffic processed by each remediation component.

To access a detailed view of these metrics, simply click the **Get More Info** button on any active remediation component card. This will show you the effectiveness of each decision made by the Security Engine, based on the installed blocklists.

![Security Engine details page](/img/console/security_engines/details-page-remediation-metrics.png)

In the same modal, you can view the active decisions. This section provides information about the number of decisions made by each source of decisions.

![Security Engine details page](/img/console/security_engines/details-page-remediation-decisions.png)

#### Inactive remediation components

Remediation components are meant to block attackers. Having inactive remediation component can compromise the security of your Security Engine, as they cannot apply decisions.

![Security Engine details page](/img/console/security_engines/details-page-inactive-bouncer.png)

### Blocklists

The Blocklists section will display all blocklists associated with the Security Engine. This section will provide information about the blocklist, including the number of IPs, the last update, and the number of false positives.

See the [blocklist documentation](/console/blocklists/overview.md) to install your first one.

![Security Engine details page](/img/console/security_engines/details-page-blocklists.png)

### Scenarios

To view all installed scenarios on the Security Engine, navigate to the **Scenarios** section. Here, each scenario will display the triggered alerts, easily accessible on the [HUB](https://hub.crowdsec.net) with just one click.

![Security Engine details page](/img/console/security_engines/details-page-scenarios.png)

For additional scenarios, visit the [CrowdSec HUB](https://hub.crowdsec.net).

:::info
By clicking on a scenario, you can access essential information about the scenario and be redirected to the corresponding page in the CrowdSec HUB. This provides direct access to the necessary details.
:::

![Security Engine details page](/img/console/security_engines/details-page-scenarios-hub.png)

### Log Processors

The Log Processors section will only be displayed if the Security Engines have multiple log processors, indicating a Distributed Setup. Here, you can access all essential information regarding the log processors and their current version.

:::info
A warning will be displayed if any Security Engine has an outdated version.
:::

![Security Engine details page](/img/console/security_engines/details-page-log-processors.png)
