---
id: next_steps
title: Post Installation Steps
---

Now that your CrowdSec installation is up and running, here are some post-installation steps to help you continue your journey.  
Some steps are **recommended** ⭐ for most users, while others are **optional** 🛠️ and offer additional customization or advanced capabilities.  

To make sure your installation is properly setup run a [🩺 Health Check](/getting_started/health_check) if you haven't already done so.  
For general errors whilst installing you can follow our [🚨 troubleshooting guide](/getting_started/post_installation/troubleshoot.mdx).

### 1. CrowdSec Console ⭐

The CrowdSec Console is a web-based interface provided by CrowdSec, offering a wide range of features and capabilities to enhance your experience with CrowdSec.

See the dedicated [CrowdSec Console](/getting_started/post_installation/console.mdx) guide for more information.


### 2. Whitelists ⭐

:::info
Whitelists are a way to tell CrowdSec to ignore certain events or IP addresses.
:::

By default CrowdSec will whitelist private LAN IP addresses, however you may want to whitelist additional IP addresses or events.

See the dedicated [Whitelists](/getting_started/post_installation/whitelists.mdx) guide for more information.

### 3. Acquisitions 🛠️

:::info
Acquisitions are sources of logs that CrowdSec can analyze.
:::

By default when CrowdSec is installed it will attempt to detect the running services and acquire the appropriate parsers and scenarios. However, not all services are detected, and you may want to manually acquire parsers and scenarios for services that are not detected.

See the dedicated [Acquisition](/getting_started/post_installation/acquisition.mdx) guide for more information.

### 4. Profiles 🛠️

:::info
Profiles are a set of rules that drives what decisions will be taken by CrowdSec.
:::

CrowdSec comes with a default profile that is suitable for most use cases. However, you may want to create a custom profile to suit your specific needs.

See the dedicated [Profiles](/getting_started/post_installation/profiles.mdx) guide for more information.

### 5. Metrics 🛠️

:::info
Metrics are a way to monitor the behavior of CrowdSec.
:::

CrowdSec comes with a prometheus endpoint that can be used to get insights into the behavior of CrowdSec.

See the dedicated [Metrics](/getting_started/post_installation/metrics.mdx) guide for more information.
