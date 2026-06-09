---
id: api_introduction
title: APIs Overview
---

CrowdSec exposes three ways to programmatically access its threat intelligence. They serve different use cases and scale requirements — pick the one that fits your workflow, or combine them.

## REST CTI API

The standard HTTP/JSON API. Send a request, get a response — ideal for on-demand lookups, scripts, and real-time enrichment inside a SIEM, SOAR, or TIP.

- **Best for**: per-IP lookups, real-time enrichment pipelines, integrations with security platforms
- **Rate limits**: apply per API key (see your plan quota)
- **Auth**: API key via `x-api-key` header
- **Formats**: JSON

[REST CTI API →](/u/cti_api/enrichment_api)

## Offline Replicas

A full, periodically refreshed snapshot of the CrowdSec CTI database delivered as a downloadable file. No per-request latency, no rate limits — you run the data locally.

- **Best for**: high-volume enrichment, air-gapped environments, bulk ingestion into a data lake or TIP
- **Rate limits**: none (bulk download)
- **Auth**: dedicated API key (premium)
- **Formats**: `mmdb`, `parquet`, `json`

[Offline Replicas →](/u/cti_api/offline_replicas)

## TAXII

A TAXII 2.1 / STIX 2.1 feed for continuous, incremental synchronization. Poll the feed periodically and pull only what changed since your last poll — native integration with any TAXII-compatible platform.

- **Best for**: TIPs and platforms that speak TAXII natively (OpenCTI, MISP, Anomali, …), continuous feed synchronization
- **Rate limits**: none beyond polling cadence
- **Auth**: dedicated API key (premium)
- **Protocol**: TAXII 2.1 over HTTPS, indicators as STIX 2.1 objects

[TAXII →](/u/cti_api/taxii)

## Which one to choose?

| | REST CTI API | Offline Replica | TAXII |
|---|---|---|---|
| On-demand IP lookup | ✅ | ❌ | ❌ |
| High-volume / bulk enrichment | ⚠️ (per IP requests) | ✅ | ✅ |
| Air-gapped / no outbound calls | ❌ | ✅ | ❌ |
| Native TAXII/STIX integration | ❌ | ❌ | ✅ |
| Incremental updates | ❌ | ❌ | ✅ |
| Available on free plan | ✅ | ❌ | ❌ |
