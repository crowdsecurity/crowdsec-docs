---
slug: cscli_dashboard_deprecation
title: Cscli dashboard deprecation
authors: crowdsec
tags: [dashboard, Metabase]
---

This blog article will outline the steps being taken to deprecate the `cscli dashboard` command out of the `cscli` binary. The `cscli dashboard` command was used to setup a containerized Metabase dashboard.

<!--truncate-->

## Why deprecate `cscli dashboard` ?

There were multiple factors which led to the decision to deprecate the `cscli dashboard` command:

The `cscli dashboard` command was initially offered a way to visualize the data collected by your local CrowdSec instance. However, we found the tools to be too limited and not user-friendly enough. So we started working on the [CrowdSec Console](https://app.crowdsec.net/) which is a more powerful and user-friendly tool to visualize your data.

Some users using `cscli dashboard` command did not understand what was happening "under the hood" and were not proactively maintaining or securing their dashboards. This led to recent [CVE's](https://www.cvedetails.com/vulnerability-list/vendor_id-19475/product_id-51231/Metabase-Metabase.html?page=1&order=1&trc=16&sha=d16c0f1d7c9eb6761cdc711c7e1caee1e2a2c079) not being patched in a timely manner since the version was tied to the `cscli` binary and users were publicly exposing their dashboards.

## What will happen to the `cscli dashboard` command ?

The `cscli dashboard` command will be deprecated starting from version `1.7.0` of the CrowdSec package. Moving forward, users will have the following alternatives for viewing metrics and insights:

* CrowdSec Console (officially supported)
* Prometheus with Grafana
* VictoriaMetrics with Grafana

Please note that **only the CrowdSec Console is officially supported by the CrowdSec team**. The other options are provided for flexibility but are community-driven and require self-management.

## What should I do now?

Currently we recommend that you firstly check which version of Metabase that is currently deployed on your system to ensure that you are not vulnerable to any CVE's. You can do this by running the following command:

```bash
docker ps -a
```

This will show you the running containers on your system. Look for the Metabase container and check the version of the container. If you are running a version of Metabase that is vulnerable to a CVE, we recommend that you update to latest version of CrowdSec then re run the `cscli dashboard` command to update the Metabase dashboard.
