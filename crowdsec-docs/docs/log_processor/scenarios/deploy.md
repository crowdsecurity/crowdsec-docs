---
id: deploy
title: Deploy
sidebar_position: 4
---

:::warning

This documentation mostly focus on installation of custom scenarios. Scenarios from the hub should be installed as a part of the collection, by using `cscli collections install <collection-name>`. Installing scenarios directly with `cscli scenario install <scenario-name>` might lead to unexpected results because of missing dependencies (ie. parsers, enrichers, post-overflows etc.)

:::


## Deployment

### Installation

To deploy a scenario, simply copy it to `/etc/crowdsec/scenarios/`.

### Verification

Use `cscli scenarios list` to view all your installed scenarios:

- `Name` presents the `name` field of the yaml file.
- `Version` represents the version of the scenario according to the hub. Versions increment on upstream changes.
- `Local path` represents the local path to the scenario file.
- `📦 Status` indicates the state:

| Status | Description |
|--------|-------------|
| `✔️  enabled` | Scenario is from the hub and up-to-date |
| `🏠  enabled,local` | This is a custom scenario |
| `⚠️  enabled,tainted` | This is an upstream scenario that has been modified |

