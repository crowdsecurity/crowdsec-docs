---
id: offline_replicas
title: Offline Replicas
sidebar_position: 2
---

The CTI REST API is ideal for looking up individual IPs on demand. But some use cases need the data *locally*: high-volume enrichment with no per-request latency, air-gapped environments, or feeding a SIEM/TIP in bulk. For those, CrowdSec offers two ways to replicate the CTI dataset on your side:

- **Full Dump (offline replica)**: periodic snapshots of the CTI you download and query locally.
- **TAXII Server**: a streaming feed of threat indicators over the standard TAXII 2.1 protocol.

:::info Premium features
Offline replicas and the TAXII feed require a **dedicated API key** that is not enabled by default. [Contact our sales team](https://www.crowdsec.net/contact-crowdsec) to get access.
:::

---

## Full Dump (Offline Replica)

The Full Dump is a complete, periodically refreshed snapshot of the CrowdSec CTI database. Instead of querying IP by IP, you download the whole dataset and run it where you need it, with no rate limits and no network round-trips per lookup.

Two datasets are available:

- **Smoke**: the broader threat intelligence database (the top *N* malicious/suspicious IPs, or the full dataset, depending on your plan).
- **Fire**: the CrowdSec community blocklist.

### Formats

You choose the format that fits your tooling:

| Format    | Best for                                                    |
| --------- | ----------------------------------------------------------- |
| `mmdb`    | Fast IP lookups embedded in your apps (MaxMind-style DB)    |
| `parquet` | Analytics, data lakes, columnar processing                  |
| `json`    | NDJSON, line-delimited JSON for streaming / simple parsing  |

### How it works

A single request returns short-lived (1 hour) download links for each dataset, along with a SHA-256 checksum so you can verify the file:

```shell
# Default format is NDJSON (json). Use ?format=parquet or ?format=mmdb otherwise.
curl -H "x-api-key: $API_KEY" "https://cti.api.crowdsec.net/v2/dump?format=mmdb"
```

```json
{
  "fire": {
    "url": "https://.../fire_mmdb_latest.tar.gz?...",
    "checksum": "bdda22833ce3dc8e...",
    "checksum_type": "sha256",
    "expire_at": "2026-06-09T12:06:21",
    "description": "Dump of the CrowdSec community-blocklist.",
    "format": "mmdb"
  },
  "smoke": {
    "url": "https://.../smoke_full_mmdb_latest.tar.gz?...",
    "checksum": "afce37deec359814...",
    "checksum_type": "sha256",
    "expire_at": "2026-06-09T12:06:21",
    "description": "Dump of the smoke database.",
    "format": "mmdb"
  }
}
```

Download the file from each `url`, verify it against the `checksum`, and you have a local replica of the CTI to query however you like. Each record carries the full CTI taxonomy: reputation, scores, behaviors, classifications, AS/geo info, MITRE techniques, CVEs, and more (see the [Taxonomy](/u/cti_api/taxonomy/intro)).

---

## TAXII Server

[TAXII](https://oasis-open.github.io/cti-documentation/taxii/intro) (Trusted Automated eXchange of Indicator Information) is the OASIS standard protocol for sharing cyber threat intelligence over HTTPS. The CrowdSec TAXII server implements **TAXII 2.1** and serves indicators as **STIX 2.1** objects, so any TAXII-compatible client (OpenCTI, MISP, Anomali, your TIP, etc.) can subscribe to the CrowdSec feed natively.

Where the Full Dump is a bulk snapshot, the TAXII feed is designed for **continuous synchronization**: poll periodically and pull only what changed since your last poll.

### Endpoints

The server exposes the standard TAXII 2.1 resources:

| Endpoint                                              | Purpose                                |
| ----------------------------------------------------- | -------------------------------------- |
| `/v1/taxii2/`                                         | Discovery, lists available API roots   |
| `/v1/cti/`                                            | API root information                   |
| `/v1/cti/collections/`                                | List collections                       |
| `/v1/cti/collections/{id}/objects/`                   | Get STIX indicators (paginated)        |
| `/v1/cti/collections/{id}/manifest/`                  | Object metadata only                   |

The CTI is published in the **`real-time-feeds`** collection, updated hourly. Each indicator maps an IP to a STIX `indicator` object with a pattern (e.g. `[ipv4-addr:value = '1.2.3.4']`), confidence score, labels, and validity window.

### Authentication

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

### Pulling only what changed

Use `added_after` to fetch indicators added since your last sync, and follow the opaque `next` cursor to page through results:

```shell
curl -H "x-api-key: $API_KEY" \
  "https://taxii.cti.api.crowdsec.net/v1/cti/collections/real-time-feeds/objects/?added_after=2026-06-01T00:00:00Z&limit=100"
```

---

## Getting access

Both the Full Dump and the TAXII feed are available with a dedicated CTI API key.

<a href="https://www.crowdsec.net/contact-crowdsec" target="_blank" rel="noopener" className="button button--primary button--lg">Contact sales to get your API key →</a>
