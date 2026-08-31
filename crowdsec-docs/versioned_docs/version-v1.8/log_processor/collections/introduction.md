---
id: intro
title: Introduction
sidebar_position: 1
---

Collections are bundles of detection content that you install together to support a given service or use case (for example: NGINX, SSH, WordPress, or generic HTTP attacks).

In practice, a collection is a YAML file that references other Hub items such as:

- **Parsers**: extract structured fields from raw log lines. See [Parsers](/log_processor/parsers/introduction.mdx).
- **Scenarios**: detect behaviors by correlating events over time. See [Scenarios](/log_processor/scenarios/introduction.mdx).
- **Postoverflows**: additional processing after a scenario triggers (often used for last-chance whitelisting). See [Postoverflows](/log_processor/parsers/introduction.mdx#postoverflows) and [Whitelists](/log_processor/whitelist/introduction.md).
- **Contexts**: enrich alerts with additional key/value fields. See [Alert Context](/log_processor/alert_context/intro.md).
- **AppSec rules / configurations**: WAF rules and their configuration. See [AppSec](/appsec/intro.md) and [AppSec configuration](/appsec/configuration.md).

## Why collections exist

Collections are the recommended way to install detection content because they:

- Keep configurations consistent (the right parsers + scenarios shipped together).
- Make installation and updates easier (one package per service).
- Reduce missed detections caused by incomplete installs.

## Installing and updating collections

Collections are distributed via the CrowdSec Hub and managed with `cscli`:

- Update the Hub index: see [`cscli hub update`](/cscli/cscli_hub_update.md)
- Install or upgrade items: see [`cscli hub upgrade`](/cscli/cscli_hub_upgrade.md) and [Hub management](/cscli/cscli_hub.md)

## Collection file format

To understand what a collection can contain (and how it is defined), see [Collection format](/log_processor/collections/format.md).
