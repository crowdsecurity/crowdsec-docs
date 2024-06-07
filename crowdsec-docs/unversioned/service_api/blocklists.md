---
id: blocklists
title: Blocklists
---

## Introduction

the `blocklists` feature of the service API allows you to create, populate, subscribe to and share blocklists.

## Populating blocklists

When populating blocklists, two strategies are currently available:
 - [`/upload`](https://admin.api.crowdsec.net/v1/docs#/Blocklists/uploadBlocklistContent) allows you to replace the existing content of the blocklist.
 - [`/ips`](https://admin.api.crowdsec.net/v1/docs#/Blocklists/addIpsToBlocklist) and [`/ips/delete`](https://admin.api.crowdsec.net/v1/docs#/Blocklists/deleteIpsFromBlocklist) allow you to perform incremental changes on the blocklist by adding or removing IPs by batches.

## Blocklist subscription mechanism

When [subscribing to blocklists](https://admin.api.crowdsec.net/v1/docs#/Blocklists/subscribeBlocklist), you can use various `entity_type` :

 - A [Security Engine](https://doc.crowdsec.net/docs/next/intro) (entity_type `engine`). [Remediation Components (Bouncers)](https://doc.crowdsec.net/u/bouncers/intro) connected to it will benefit of the blocklist
 - A [Firewall Integration](https://doc.crowdsec.net/u/console/blocklists/integrations/firewall) (entity_type `firewall_integration`). This allows to use blocklists directly on your existing Firewall Appliances (CISCO, F5, Palo Alto etc.) without having to install a Security Engine or Bouncer.
 - A [Remediation Component](https://doc.crowdsec.net/u/bouncers/intro) (entity_type `remediation_component_integration`). This allows to use a Bouncer directly without having to deploy a Security Engine.
 - You can as well subscribe via a `tag` (entity_type `tag`). This means that future Security Engines <!-- or Integrations  @hes --> associated to this tag will **automatically** be subscribed to the blocklist.
 - You can also subscribe via an `org` directly. This means that future Security Engines <!-- and Integrations @hes --> enrolled in this org will **automatically** be subscribed to the blocklist.

## Sharing private blocklists with other organizations

The `/blocklists/{blocklist_id}/shares` endpoint allows you to share a private blocklist with other organizations.

When sharing your blocklist with another organization, decide the `permission` you give them on your blocklist:
 - `read` : they can subscribe to the blocklist, download its content and view the blocklist(s) statistics.
 - `write` : they can add and remove IPs

## Statistics Explained

The statistics provided when you query the [`GET /blocklists/{blocklist_id}`](https://admin.api.crowdsec.net/v1/docs#/Blocklists/getBlocklist) endpoint are divided into two sections. The `stats` section contains basic information about the blocklists itself, like how many IPs it contains and how this count changes over time. The `content_stats` section contains detailed stats about the IPs currently in the blocklist, such as the top AS represented and so on.
 - `stats.content_stats.total_seen`: Number of IPs that were seen by the Crowdsec network 
 - `stats.content_stats.total_fire`: Number of IPs that are currently in the Crowdsec Community Blocklist
 - `stats.content_stats.total_seen_1m`: Number of IPs that were seen by the Crowdsec network in the past 30 days
 - `stats.content_stats.total_in_other_lists`: Number of IPs that are also present in other public blocklists
 - `stats.content_stats.total_false_positive`: Number of false positives (cdns, scanners etc.) identified by Crowdsec in the blocklist. Note that we automatically remove false positives in blocklists provided by Crowdsec, so this field will only be non-zero for custom blocklists.
 - `stats.content_stats.false_positive_removed_by_crowdsec`: Number of false positives our system removed from the blocklist
 - `stats.content_stats.most_present_behaviors`: Array containing the top 10 most seen behaviors (`http:exploit`, `ssh:bruteforce` etc.) for IPs in the blocklist
 - `stats.content_stats.most_present_categories`: Array containing the top 10 most seen categories (insecure_services etc.) for IPs in the blocklist
 - `stats.content_stats.most_present_scenarios`: Array containing the top 10 scenarios which IPs in the blocklist were reported for. This only displays scenarios that are publicly available in our hub.
 - `stats.content_stats.top_as`: Array containing the top 10 autonomous systems (AS) for IPs in the blocklist
 - `stats.content_stats.top_attacking_countries`: Array containing the top 10 countries of origin for IPs in the blocklist
 - `stats.content_stats.top_ips`: Array containing the top 10 most reported IPs in the blocklist
 - `stats.addition_2days`: Number of IPs added to the blocklist over the last 2 days
 - `stats.addition_month`: Number of IPs added to the blocklist over the last 30 days
 - `stats.suppression_2days`: Number of IPs removed (by expiration) over the last 2 days
 - `stats.suppression_month`: Number of IPs removed (by expiration) over the last 30 days
 - `stats.change_2days_percentage`: Percentage of IPs in blocklist that were changed (added or deleted) in the last 2 days
 - `stats.change_month_percentage`: Percentage of IPs in blocklist that were changed (added or deleted) in the past month
 - `stats.count`: Number of IPs in the blocklist
 - `stats.updated_at`: When these stats were last computed
