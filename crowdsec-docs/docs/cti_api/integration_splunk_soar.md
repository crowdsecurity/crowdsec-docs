---
id: integration_splunk_soar
title: Splunk SOAR
sidebar_position: 4
---

Splunk SOAR App for CrowdSec. This App allows enrichment of IP addresses with CrowdSec's CTI API.

## Quickstart

1. Navigate to apps page from  your dashboard as shown in the image below.

![splunk dashboard](/img/splunk_soar/app_dashboard.png)

2. Navigate to the new apps page by clicking on the `New Apps` button. Then search for "CrowdSec"

![New Apps](/img/splunk_soar/search_in_new_apps.png)

3. Click on the the Install Button to install the app.

4. Now the App should appear in the unconfigured apps.

![Unconfigured Apps](/img/splunk_soar/unconfigured.png)

5. Click on `CONFIGURE NEW ASSET` button.

6. Enter the required details like asset name etc in the Asset Info tab.

![Asset Configure Part 1](/img/splunk_soar/configure_asset.png)

7. Navigate to Asset Setting pane, and enter your CrowdSec CTI API key. If you don't have [one already see this guide to obtain one](/docs/next/cti_api/getting_started).

![Asset Configure Part 2](/img/splunk_soar/configure_asset_pt2.png)

8. Click on the Save button to save the asset.

9. You can test this asset by clicking on the Test Connectivity button. If everything is configured properly, you would get message like the one in the image. 

![Test Connectivity](/img/splunk_soar/test_connect.png)

10. Now you can use this asset in your playbooks, event investigations etc.

11. Here's an example of it's usage in  event investigation.

![Example](/img/splunk_soar/lookup_for_ip_in_event.png)

![Result](/img/splunk_soar/lookup_result.png)


