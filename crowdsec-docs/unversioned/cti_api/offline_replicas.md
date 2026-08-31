---
id: offline_replicas
title: Offline Replicas
sidebar_position: 2
---

The CTI REST API is ideal for looking up individual IPs on demand. But some use cases need the data *locally*: high-volume enrichment with no per-request latency, air-gapped environments, or feeding a SIEM/TIP in bulk.

The **offline replica** (Full Dump) is a complete, periodically refreshed snapshot of the CrowdSec CTI database. Instead of querying IP by IP, you download the whole dataset and run it where you need it, with no rate limits and no network round-trips per lookup.

:::info Premium feature
The offline replica requires a **dedicated API key**. [Contact our sales team](https://www.crowdsec.net/contact-crowdsec) to get access.
:::

Two datasets are available:

- **Smoke**: the full CrowdSec threat intelligence dataset.
- **Fire**: the full CrowdSec intelligence blocklist.

## Formats

You choose the format that fits your tooling:

| Format    | Best for                                                    |
| --------- | ----------------------------------------------------------- |
| `mmdb`    | Fast IP lookups embedded in your apps (MaxMind-style DB)    |
| `parquet` | Analytics, data lakes, columnar processing                  |
| `json`    | NDJSON, line-delimited JSON for streaming / simple parsing  |

## How it works

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

## Getting access

The offline replica is available with a dedicated CTI API key.

<a href="https://www.crowdsec.net/contact-crowdsec" target="_blank" rel="noopener" className="button button--primary button--lg">Contact sales to get your API key →</a>
