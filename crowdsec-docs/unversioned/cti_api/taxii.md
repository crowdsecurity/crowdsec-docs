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

## Response format

The objects endpoint returns a standard TAXII **envelope**: an `objects` array plus a `more` flag. When `more` is `true`, a `next` cursor is included; pass it back to fetch the following page.

The **first page** is prefixed with a CrowdSec [Identity](https://docs.oasis-open.org/cti/stix/v2.1/os/stix-v2.1-os.html#_wh296fiwpklp) object. Every indicator points to it through `created_by_ref`, so you can attribute the feed to CrowdSec.

Each IP is a STIX **Indicator** object:

```json
{
  "objects": [
    {
      "type": "identity",
      "spec_version": "2.1",
      "id": "identity--fa61fc5e-dd3f-5a17-8260-f1819eec7ad9",
      "created": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "name": "CrowdSec",
      "identity_class": "organization",
      "sectors": ["technology"]
    },
    {
      "type": "indicator",
      "spec_version": "2.1",
      "id": "indicator--c000020a-0000-5000-8000-000000000000",
      "created": "2026-02-27T17:45:00.000Z",
      "modified": "2026-05-09T10:15:00.000Z",
      "name": "Suspicious IP 192.0.2.10",
      "pattern": "[ipv4-addr:value = '192.0.2.10']",
      "pattern_type": "stix",
      "valid_from": "2026-05-09T10:15:00.000Z",
      "valid_until": "2026-06-09T13:40:15.245Z",
      "indicator_types": ["anomalous-activity"],
      "confidence": 40,
      "labels": ["suspicious", "pop3/imap:bruteforce"],
      "created_by_ref": "identity--fa61fc5e-dd3f-5a17-8260-f1819eec7ad9"
    },
    {
      "type": "indicator",
      "spec_version": "2.1",
      "id": "indicator--c6336417-0000-5000-8000-000000000000",
      "created": "2025-01-23T05:15:00.000Z",
      "modified": "2026-05-09T10:15:00.000Z",
      "name": "Malicious IP 198.51.100.23",
      "pattern": "[ipv4-addr:value = '198.51.100.23']",
      "pattern_type": "stix",
      "valid_from": "2026-05-09T10:15:00.000Z",
      "valid_until": "2026-06-09T13:40:15.245Z",
      "indicator_types": ["malicious-activity"],
      "confidence": 60,
      "labels": [
        "malicious",
        "http:scan",
        "generic:exploit",
        "http:exploit",
        "connection-type:residential"
      ],
      "created_by_ref": "identity--fa61fc5e-dd3f-5a17-8260-f1819eec7ad9",
      "description": "Malicious IP | Residential IP"
    }
  ],
  "more": false
}
```

### Indicator fields

| Field             | Meaning                                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------------------- |
| `id`              | Deterministic STIX ID derived from the IP, so the same IP always maps to the same indicator.         |
| `pattern`         | STIX pattern matching the IP, e.g. `[ipv4-addr:value = '1.2.3.4']` (IPv4 and IPv6 supported).         |
| `name`            | Human-readable summary including the IP and its reputation (`Malicious IP …`, `Suspicious IP …`).     |
| `indicator_types` | STIX type derived from reputation: `malicious-activity`, `anomalous-activity`, or `unknown`.          |
| `confidence`      | CrowdSec confidence on a 0–100 scale.                                                                 |
| `labels`          | Reputation plus CrowdSec context: behaviors (`http:bruteforce`), classifications, and list memberships (`list:crowdsec_ai_vpn_proxy`). |
| `created`         | When the IP was first seen by CrowdSec.                                                               |
| `modified`        | When the IP was last seen by CrowdSec.                                                                |
| `valid_from` / `valid_until` | Validity window of the indicator. Refresh before `valid_until` to keep your feed current.  |
| `created_by_ref`  | Reference to the CrowdSec Identity object on page 1.                                                  |

See the [Taxonomy](/u/cti_api/taxonomy/intro) for the full meaning of reputations, behaviors, and classifications surfaced in `labels`.

## Pulling only what changed

Use `added_after` to fetch indicators added since your last sync, and follow the opaque `next` cursor to page through results:

```shell
curl -H "x-api-key: $API_KEY" \
  "https://taxii.cti.api.crowdsec.net/v1/cti/collections/real-time-feeds/objects/?added_after=2026-06-01T00:00:00Z&limit=100"
```

## Getting access

The TAXII feed is available with a dedicated CTI API key.

<a href="https://www.crowdsec.net/contact-crowdsec" target="_blank" rel="noopener" className="button button--primary button--lg">Contact sales to get your API key →</a>
