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


## Statistics Explained

<!-- @ese detailed stats -->

The statistics provided when you query the [`GET /blocklists/{blocklist_id}`](https://admin.api.crowdsec.net/v1/docs#/Blocklists/getBlocklist) endpoint are the following:
 - `id`: 
 - `created_at`: 
 - ...



<!--

 - sharing lists
 - explain the subscriptions (ie. sub to org, you cannot unsub engine)


-->



## Blocklist subscription mechanism

When [subscribing to blocklists](https://admin.api.crowdsec.net/v1/docs#/Blocklists/subscribeBlocklist), you can use various `entity_type` :

 - A [Security Engine](https://doc.crowdsec.net/docs/next/intro) (entity_type `engine`). [Remediation Components (Bouncers)](https://doc.crowdsec.net/u/bouncers/intro) connected to it will benefit of the blocklist
 - A [Firewall Integration](https://doc.crowdsec.net/u/console/blocklists/integrations/firewall) (entity_type `firewall_integration`). This allows to use blocklists directly on your existing Firewall Appliances (CISCO, F5, Palo Alto etc.) without having to install a Security Engine or Bouncer.
 - A [Remediation Component](https://doc.crowdsec.net/u/bouncers/intro) (entity_type `remediation_component_integration`). This allows to use a Bouncer directly without having to deploy a Security Engine.
 - You can as well subscribe via a `tag` (entity_type `tag`). This means that future Security Engines <!-- or Integrations  @hes --> associated to this tag will **automatically** be subscribed to the blocklist.
 - You can also subscribe via an `org` directly. This means that future Security Engines <!-- and Integrations @hes --> enrolled in this org will **automatically** be subscribed to the blocklist.