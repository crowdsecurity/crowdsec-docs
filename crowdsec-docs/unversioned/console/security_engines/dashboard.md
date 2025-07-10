---
title: Dashboard
description: Security Engines Dashboard page
---

This section displays all the CrowdSec Security Engines available in an Organization. This feature provides a quick overview of the organization's security status and allows the management of all the Security Engines remotely.

If you haven't signed up for Security Engines, check out the ["Getting Started"](/getting_started/post_installation/console.mdx) guide.

![Security_engines_page](/img/console/security_engines/page.png)

## Table view

Different views are available based on the number of engines in an organization. If an organization have more than four engines, table views work best. (See below)

![Table_view](/img/console/security_engines/table-view.png)

## Security Engine Card

Each Security Engine has a card that displays essential details to facilitate monitoring issues in a stack.

- **Name**: Clicking on the name will redirect to the detailed page of the Security Engine.
- **IP**: Clicking on the IP will copy it to the clipboard.
- **Enroll Date**
- **Tags**: Add custom tags to the engines by using the ["doc"](/u/console/security_engines/name_and_tags) tag format.
- **Alerts / Scenarios / Remediation Components / Blocklists / Log Processors (Distributed Setup only)**: Clicking any items will redirect to a dedicated section with relevant information.
- **Activity**: This feature helps focus on Security Engines that require your attention. The ["Troubleshoot"](/u/console/security_engines/troubleshooting) feature can identify problems in your stack by analyzing past engine activity.
- **Distributed Setup**: These are considered Distributed Setup Engines when multiple log processors are attached. [(Get more info here)](/docs/next/getting_started/security_engine_intro/#why-is-my-security-engine-classed-as-a-log-processor-within-the-console)

### Basic Card

![Basic_card](/img/console/security_engines/basic-card.png)

### Distributed Setup Card

![Distributed_setup_card](/img/console/security_engines/distributed-setup-card.png)

## Security Engines Inactivity

In our system, Security Engines are only displayed if there have been activity references within the last 30 days. If no recent activity is associated with a Security Engine, it will not be shown in the interface. This helps ensure well-presented data with relevant and up-to-date information regarding security activities.
