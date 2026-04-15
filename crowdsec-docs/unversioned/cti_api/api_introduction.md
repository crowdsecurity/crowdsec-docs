---
id: api_introduction
title: API Introduction
sidebar_position: 1
---

The CrowdSec CTI API gives you programmatic access to IP reputation data collected from CrowdSec deployments worldwide. Use it to enrich your own security workflows — whether that's a quick manual lookup, a script that checks IPs at ingestion, or a fully automated enrichment pipeline inside a SIEM, SOAR, or TIP.

## Authentication

All requests require a CTI API key passed in the `x-api-key` header.

Keys are created and managed in the Console under **Settings → CTI API Keys**.
[Create your API key →](/u/console/ip_reputation/api_keys)

## Ways to Use the API

### Integrations

CrowdSec maintains ready-made integrations for common security platforms — Splunk, QRadar, Microsoft Sentinel, MISP, OpenCTI, Palo Alto XSOAR, TheHive, and more. If you use one of these, it's the fastest path to enrichment.

[Browse all integrations →](/u/cti_api/api_integration/integration_intro)

### cURL

For quick lookups or scripting, query the API directly:

```shell
curl -H "x-api-key: $API_KEY" https://cti.api.crowdsec.net/v2/smoke/1.2.3.4 | jq .
```

### IPDEX

Available in [Web UI](https://ipdex.crowdsec.net/) or [CLI](https://github.com/crowdsecurity/ipdex), this tool provides a detailed IP reputation report from a list of IPs or logs you provide.   
This is a useful Proof of Value tool to see the coverage of CrowdSec Threat Intel for both Blocklists and Threat Intel.

[IPDEX →](/u/cti_api/api_integration/integration_ipdex)

## API Reference

Full endpoint documentation is available via [Swagger](https://crowdsecurity.github.io/cti-api/).
