---
id: next_steps
title: Next Steps
---

# Next Steps

Now that you have installed CrowdSec, we have a post installation checklist to help continue your journey.

## Post Installation Steps

### 1. Acquisitions

:::info
Acquisitions are sources of logs that CrowdSec can analyze.
:::

By default when CrowdSec is installed it will attempt to detect the running services and acquire the appropriate parsers and scenarios. However, not all services are detected, and you may want to manually acquire parsers and scenarios for services that are not detected.

See the dedicated [Acquisition](/getting_started/post_installation/acquisition.md) guide for more information.

### 2. Profiles

:::info
Profiles are a set of rules that drives what decisions will be taken by CrowdSec.
:::

CrowdSec comes with a default profile that is suitable for most use cases. However, you may want to create a custom profile to suit your specific needs.

See the dedicated [Profiles](/getting_started/post_installation/profiles.md) guide for more information.

### 3. Metrics

:::info
Metrics are a way to monitor the behavior of CrowdSec.
:::

CrowdSec comes with a prometheus endpoint that can be used to get insights into the behavior of CrowdSec.

See the dedicated [Metrics](/getting_started/post_installation/metrics.md) guide for more information.