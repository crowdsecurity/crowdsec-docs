---
title: Overview
description: What the Alert Explorer is for, and what you will be able to do with it in five minutes
---

Every Security Engine you enroll reports the attacks it blocks to the Console. The Alert Explorer turns that stream into something you can actually investigate: it groups alerts by attacking IP and lets you pivot across the key dimensions of an attack - the source, the attacker's behavior, or the reputation of the IPs involved.

By the end of this page you will know how the Explorer is organised, and which page answers which question.

## What kind of question brings you here?

**"Is something new attacking my stack?"** The breakdown charts at the top of the page show your alert activity over time, by behavior, source IP or any other dimension. A wave that was not there last week stands out immediately, and one click on the chart isolates it. Walk through a full example in [Investigate an attack wave](/u/console/alerts/visualizer).

**"This IP showed up in a report. Did it hit me?"** Paste an IP, a CIDR range or a CVE identifier straight into the filter search: the Explorer recognises it and offers to show every matching alert. See [Search and filter](/u/console/alerts/search).

**"I only care about one part of my infrastructure."** Filter down to the engines, targets or behaviors you monitor, then save that perspective as a view pinned to your menu. See [Custom views](/u/console/alerts/views).

**"What does my WAF actually block?"** The dedicated WAF view breaks down inbound exploitation attempts caught at the application layer. See [The WAF view](/u/console/alerts/waf).

## The pivot points

Every investigation in the Explorer pivots around the same three families of dimensions, and you will meet them everywhere - as sections of the filter drawer, and as breakdown charts:

- **Where it comes from** - source IP or range, country, autonomous system, and the reputation the CrowdSec network assigns to each attacker.
- **What it does** - the behavior, the attack scenario, the CVE being exploited, the MITRE technique.
- **What it targets** - your Security Engines, by name or tag, and the targeted IPs.

Learn the three families once, and both [filtering](/u/console/alerts/search) and [building breakdowns](/u/console/alerts/visualizer) become the same gesture: pick a family, pick a dimension, pivot.

## The anatomy of the page

[capture: /alerts full page, All view, breakdowns + grouped table visible]

Three layers, top to bottom:

- **Breakdown charts** — your activity over the selected period, split by the dimensions you choose (behaviors, source IPs, countries, scenarios, target engines...). Add, remove or zoom into any of them.
- **Filters and views** — the period selector, the filter drawer, and your saved views. Every chart and the table below react to them instantly.
- **The alerts table** — grouped by attacking IP by default, so a noisy repeat offender takes one row instead of drowning the page. Expand a row to see the individual attack sessions, or switch grouping off to list raw alerts.

From any row you can open the alert detail, pivot to the IP's CTI profile, or ban the attacker across your engines from the context menu.

## Where the data comes from

The Explorer shows the alerts your Security Engines pushed to the Console, within your organization's alert quota and retention. Periods where your organization exceeded its quota appear as greyed "Out of quota" bands in the charts - see [Alert quotas](/u/console/alerts/quotas).
