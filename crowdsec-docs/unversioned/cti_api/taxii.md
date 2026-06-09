---
id: taxii
title: TAXII
sidebar_position: 3
---

[TAXII](https://oasis-open.github.io/cti-documentation/taxii/intro) (Trusted Automated eXchange of Indicator Information) is the OASIS standard protocol for sharing cyber threat intelligence over HTTPS. The CrowdSec TAXII server implements **TAXII 2.1** and serves indicators as **STIX 2.1** objects, so any TAXII-compatible client (OpenCTI, MISP, Anomali, your TIP, etc.) can subscribe to the CrowdSec feed natively.

Where the [offline replica](/u/cti_api/offline_replicas) is a bulk snapshot, the TAXII feed is designed for **continuous synchronization**: poll periodically and pull only what changed since your last poll.

:::info Premium feature
The TAXII feed requires a **dedicated API key**. [Contact our sales team](https://www.crowdsec.net/contact-crowdsec) to get access.
:::

## Endpoints

The server exposes the standard TAXII 2.1 resources:

| Endpoint                                              | Purpose                                |
| ----------------------------------------------------- | -------------------------------------- |
| `/v1/taxii2/`                                         | Discovery, lists available API roots   |
| `/v1/cti/`                                            | API root information                   |
| `/v1/cti/collections/`                                | List collections                       |
| `/v1/cti/collections/{id}/objects/`                   | Get STIX indicators (paginated)        |
| `/v1/cti/collections/{id}/manifest/`                  | Object metadata only                   |

The CTI is published in the **`real-time-feeds`** collection, updated hourly. Each indicator maps an IP to a STIX `indicator` object with a pattern (e.g. `[ipv4-addr:value = '1.2.3.4']`), confidence score, labels, and validity window.

## Authentication

Authenticate with your API key in one of two ways:

- **`x-api-key` header**: pass the key directly.
- **HTTP Basic auth** (the TAXII convention, and what most TAXII clients expect): the key goes in the **password** field. The username is ignored, but many tools won't let you leave it blank, so just put any non-empty value (e.g. `crowdsec`).

```shell
# Using the x-api-key header

# Discovery
curl -H "x-api-key: $API_KEY" \
  https://taxii.cti.api.crowdsec.net/v1/taxii2/

# List collections
curl -H "x-api-key: $API_KEY" \
  https://taxii.cti.api.crowdsec.net/v1/cti/collections/

# Pull indicators (first page)
curl -H "x-api-key: $API_KEY" \
  "https://taxii.cti.api.crowdsec.net/v1/cti/collections/real-time-feeds/objects/?limit=100"
```

```shell
# Using HTTP Basic auth (username can be anything, password is your API key)
curl -u "crowdsec:$API_KEY" \
  https://taxii.cti.api.crowdsec.net/v1/cti/collections/
```

## Pulling only what changed

Use `added_after` to fetch indicators added since your last sync, and follow the opaque `next` cursor to page through results:

```shell
curl -H "x-api-key: $API_KEY" \
  "https://taxii.cti.api.crowdsec.net/v1/cti/collections/real-time-feeds/objects/?added_after=2026-06-01T00:00:00Z&limit=100"
```

## Getting access

The TAXII feed is available with a dedicated CTI API key.

<a href="https://www.crowdsec.net/contact-crowdsec" target="_blank" rel="noopener" className="button button--primary button--lg">Contact sales to get your API key →</a>
