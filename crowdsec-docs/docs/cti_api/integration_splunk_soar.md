---
id: integration_splunk_soar
title: Splunk SOAR
sidebar_position: 4
---

Splunk SOAR App for CrowdSec. This App allows enrichment of IP addresses in an event investigation and playbooks with CrowdSec's CTI API.

This documentation will guide you through installing and configuring the app as well as showing an example of usage in which we'll show enrichement of IP addresses in an event investigation.

## Setup

1. Navigate to apps page from  your dashboard as shown in the image below.

![Splunk dashboard](/img/splunk_soar/app_dashboard.png)

2. Navigate to the new apps page by clicking on the `New Apps` button. Then search for "CrowdSec"

![New Apps](/img/splunk_soar/search_in_new_apps.png)

3. Click on the the Install Button to install the app.

## Configurating the App

1. Now the App should appear in the unconfigured apps.

![Unconfigured Apps](/img/splunk_soar/unconfigured.png)

2. Click on `CONFIGURE NEW ASSET` button.

3. Enter the required details like asset name etc in the Asset Info tab.

![Asset Configure Part 1](/img/splunk_soar/configure_asset.png)

4. Navigate to Asset Setting pane, and enter your CrowdSec CTI API key. If you don't have [one already see this guide to obtain one](/docs/next/cti_api/getting_started).

![Asset Configure Part 2](/img/splunk_soar/configure_asset_pt2.png)

5. Click on the Save button to save the asset.

6. You can test this asset by clicking on the Test Connectivity button. If everything is configured properly, you would get message like the one in the image. 

![Test Connectivity](/img/splunk_soar/test_connect.png)

Done, you've successfully configured the app. You can now use it in your playbooks and event investigations.

## Example Usage

Here's an example of it's usage in event investigation.

![Example](/img/splunk_soar/lookup_for_ip_in_event.png)

![Result](/img/splunk_soar/lookup_result.png)


