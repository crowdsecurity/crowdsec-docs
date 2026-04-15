---
id: intro
title: CrowdSec CTI - Cyber Threat Intelligence
sidebar_position: 1
---

CrowdSec's **Cyber Threat Intelligence (CTI)** exposes the threat data collected by the global CrowdSec network — millions of IPs enriched with behaviors, classifications, scores, MITRE techniques, and CVE associations — through a REST API designed for programmatic integration.

This section covers the **API** side of CTI: authentication, datasets, data format, taxonomy, and integrations with third-party security platforms.

:::tip Prefer a visual interface?
The [IP Reputation section of the Console](/u/console/ip_reputation/intro) presents exploration via the Console UI to: get details about a specific IP, run advanced queries, and manage your CTI API Key(s)
:::

---

## What the API Gives You

For any queried IP, the CTI API returns:

| Field | Description |
| --- | --- |
| **Reputation** | Malicious, Suspicious, Known, Benign, Safe, or Unknown |
| **Behaviors** | Attack types observed (SSH Bruteforce, HTTP Scan, CVE exploitation, etc.) |
| **Classifications** | TOR exit node, VPN/Proxy, CDN, scanner, false positive, and more |
| **Scores** | Aggressiveness, threat, trust, and anomaly — computed over 1d / 7d / 30d windows |
| **MITRE ATT&CK** | Techniques mapped to the IP's observed behaviors |
| **CVEs** | Vulnerabilities the IP has been actively exploiting |
| **History** | First seen / last seen, activity age |
| **Target countries** | Geographic distribution of attacks from this IP |

Full field-level documentation: [CTI Object format](/u/cti_api/taxonomy/cti_object).

---

## Taxonomy

Understanding the CTI data model is key to making good use of the API. The [Taxonomy section](/u/cti_api/taxonomy/intro) documents:

- [**CTI Format**](/u/cti_api/taxonomy/cti_object) — complete response structure and field reference
- [**Scores**](/u/cti_api/taxonomy/scores) — how aggressiveness, threat, trust, and anomaly are computed
- [**Behaviors**](/u/cti_api/taxonomy/behaviors) — defined attack behaviors and their labels
- [**Classifications**](/u/cti_api/taxonomy/classifications) — IP category tags (VPN, TOR, CDN, scanner, etc.)
- [**False Positives**](/u/cti_api/taxonomy/false_positives) — categories excluded from malicious verdicts
- [**Scenarios**](/u/cti_api/taxonomy/scenarios) — the detection scenarios that triggered reports for an IP

---

## Getting Started

1. **Get an API key** — create one in the [Console](https://app.crowdsec.net/settings/cti-api-keys). A free key is available to all registered users. See [API Keys](/u/console/ip_reputation/api_keys).
2. **Make your first request** — see [API Introduction](/u/cti_api/api_introduction) for the base URL, authentication header, and an example response.
3. **Integrate** — connect CrowdSec CTI to your SIEM, SOAR, or TIP using one of the [supported integrations](/u/cti_api/api_integration/integration_intro).

---

## Integrations

CrowdSec CTI has native integrations with major security platforms:

| Category | Platforms |
| --- | --- |
| **SIEM** | Splunk Enterprise Security, QRadar, Microsoft Sentinel |
| **SOAR** | Splunk SOAR, Palo Alto XSOAR, TheHive |
| **TIP** | MISP, OpenCTI, Sekoia XDR |
| **Investigation** | Maltego, MSTICpy, IntelOwl |
| **Other** | Chrome extension, Gigasheet |

[See all integrations →](/u/cti_api/api_integration/integration_intro)
