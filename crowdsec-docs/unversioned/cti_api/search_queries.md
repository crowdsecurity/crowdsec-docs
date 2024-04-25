---
id: search_queries
title: Search Queries
sidebar_position: 6
---

## Lucene queries

The CrowdSec CTI search engine is based on Lucene query syntax. This syntax allows users to make queries based on the CTI information we provide about IP addresses.

## Fields

It is possible to search any field available in the JSON document below:

<details>
  <summary>Available fields to query</summary>

```json
{
    "ip": "[CENSORED]",
    "ip_range": "[CENSORED]",
    "as_name": "[CENSORED]",
    "reputation": "malicious",
    "ip_range_24": "[CENSORED]",
    "ip_range_24_reputation": "suspicious",
    "background_noise": "high",
    "confidence": "high",
    "as_num": 8798,
    "location": {
        "country": "FR",
        "city": "Paris"
    },
    "reverse_dns": "[CENSORED]",
    "behaviors": [
        {
            "name": "http:exploit",
            "label": "HTTP Exploit",
            "description": "IP has been reported for attempting to exploit a vulnerability in a web application."
        }
    ],
    "classifications": {
        "false_positives": [],
        "classifications": []
    },
    "attack_details": [],
    "mitre_techniques": [
        {
            "name": "T1190",
            "label": "Exploit Public-Facing Application",
            "description": "Adversaries may attempt to exploit a weakness in an Internet-facing host or system to initially access a network."
        }
    ],
    "cves": ["CVE-2021-26086"]
}
```

</details>

We provide all the possible values for each of the following fields:

-   [`behaviors`](taxonomy/behaviors)
-   [`classifications.classifications`](taxonomy/classifications)
-   [`classifications.false_positives`](taxonomy/false_positives)
-   [`attack_details`](taxonomy/scenarios)

To perform a search query, specify the field from the JSON document you wish to search followed by a colon `:` and the value you are looking for between double quotes.

:::info

Search is case insensitive.

:::

For example, if you want to search for malicious IPs:

```bash
reputation:"malicious"
```

You can also query IPs reported for a specific CVE:

```bash
cves:"CVE-2021-26086"
```

It is also possible to combine multiple expressions:

```bash
reputation:"malicious" AND cves:"CVE-2021-26086"
```

You can access a nested field by joining each part of its path by a `.`:

```bash
classifications.classifications.label:"TOR" AND behaviors.label:"http exploit"
```

## Operators

:::warning

Always use `AND`, `OR`, `NOT` in uppercase to ensure correct results.

:::

### `AND`

The `AND` operator requires expression from each side to be `true`.

For example, if you want to search for malicious IPs located in France:

```bash
reputation:"malicious" AND location.country:"FR"
```

### `OR`

The `OR` operator requires at least one of the expressions from each side to be `true`.

For example, you can query malicious or suspicious IPs:

```bash
reputation:"malicious" OR reputation:"suspicious"
```

### `NOT`

The `NOT` operator excludes documents containing the specified term from search results.

For example, you can query all malicious IPs except IPs located in France:

```bash
reputation:"malicious" AND NOT location.country:"FR"
```

### Nested Operators

It is possible to combine many operators in a single query.

For example, you can look for malicious IPs reported for HTTP exploitation or HTTP Scan:

```bash
reputation:"malicious" AND (behaviors.label:"http exploit" OR behaviors.label:"http scan")
```

You can also search for malicious IPs reported with high or medium confidence for HTTP exploitation and not located in France:

```bash
reputation:"malicious" AND (confidence:"high" OR confidence:"medium") AND behaviors.label:"http exploit" AND location.country:"fr"
```

It is possible to search for malicious IPs reported for HTTP exploitation or HTTP scan but not SSH bruteforce:

```bash
reputation:malicious AND ((behaviors.label:"http exploit" OR behaviors.label:"http scan") AND NOT behaviors.label:"ssh bruteforce")
```

## Wildcard Queries

:::warning

Wildcard values cannot start with `*` or `?`, for example `reverse_dns:*.crowdsec.net` is invalid.

:::

:::warning

Do not enclose wildcard queries between double quotes.

:::

It is possible to make wildcard queries where `*` indicates any additional number of characters and `?` indicates any single character.

You can query any IPs targeting HTTP protocol:

```bash
behaviors.label:HTTP\*
```

It is possible to search for IP addresses reported for at least one CVE and not classified as a public scanner:

```bash
cves:CVE-* AND NOT classifications.classifications.name:scanner*
```
