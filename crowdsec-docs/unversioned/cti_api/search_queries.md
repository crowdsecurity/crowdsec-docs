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

For example, if you want [to search for malicious IPs](https://app.crowdsec.net/cti?q=reputation%3A%22malicious%22&page=1):

```bash
reputation:"malicious"
```

You can also [query IPs reported for a specific CVE](https://app.crowdsec.net/cti?q=cves%3A%22CVE-2021-26086%22&page=1):

```bash
cves:"CVE-2021-26086"
```

It is also possible [to combine multiple expressions](https://app.crowdsec.net/cti?q=reputation%3A%22malicious%22+AND+cves%3A%22CVE-2021-26086%22&page=1):

```bash
reputation:"malicious" AND cves:"CVE-2021-26086"
```

You can access [a nested field by joining each part of its path](https://app.crowdsec.net/cti?q=classifications.classifications.label%3A%22TOR%22+AND+behaviors.label%3A%22http+exploit%22&page=1) by a `.`:

```bash
classifications.classifications.label:"TOR" AND behaviors.label:"http exploit"
```

## Operators

:::warning

Always use `AND`, `OR`, `NOT` in uppercase to ensure correct results.

:::

### `AND`

The `AND` operator requires expression from each side to be `true`.

For example, if you want [to search for malicious IPs located in France](https://app.crowdsec.net/cti?q=reputation%3A%22malicious%22+AND+location.country%3A%22FR%22&page=1):

```bash
reputation:"malicious" AND location.country:"FR"
```

### `OR`

The `OR` operator requires at least one of the expressions from each side to be `true`.

For example, you can [query malicious or suspicious IPs](https://app.crowdsec.net/cti?q=reputation%3A%22malicious%22+OR+reputation%3A%22suspicious%22&page=1):

```bash
reputation:"malicious" OR reputation:"suspicious"
```

### `NOT`

The `NOT` operator excludes documents containing the specified term from search results.

For example, you can [query malicious IPs except IPs located in France](https://app.crowdsec.net/cti?q=reputation%3A%22malicious%22+AND+NOT+location.country%3A%22FR%22&page=1):

```bash
reputation:"malicious" AND NOT location.country:"FR"
```

### Nested Operators

It is possible to combine many operators in a single query.

For example, you can [look for malicious IPs reported for HTTP exploitation or HTTP Scan](https://app.crowdsec.net/cti?q=reputation%3A%22malicious%22+AND+%28behaviors.label%3A%22http+exploit%22+OR+behaviors.label%3A%22http+scan%22%29&page=1):

```bash
reputation:"malicious" AND (behaviors.label:"http exploit" OR behaviors.label:"http scan")
```

You can also [search for malicious IPs reported with high or medium confidence for HTTP exploitation and not located in France](https://app.crowdsec.net/cti?q=reputation%3A%22malicious%22+AND+%28confidence%3A%22high%22+OR+confidence%3A%22medium%22%29+AND+behaviors.label%3A%22http+exploit%22+AND+location.country%3A%22fr%22&page=1):

```bash
reputation:"malicious" AND (confidence:"high" OR confidence:"medium") AND behaviors.label:"http exploit" AND location.country:"fr"
```

It is possible [to search for malicious IPs reported for HTTP exploitation or HTTP scan but not SSH bruteforce](https://app.crowdsec.net/cti?q=reputation%3Amalicious+AND+%28%28behaviors.label%3A%22http+exploit%22+OR+behaviors.label%3A%22http+scan%22%29+AND+NOT+behaviors.label%3A%22ssh+bruteforce%22%29&page=1):

```bash
reputation:malicious AND ((behaviors.label:"http exploit" OR behaviors.label:"http scan") AND NOT behaviors.label:"ssh bruteforce")
```

## Wildcard

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

It is possible [to search for IP addresses reported for at least one CVE and not classified as a public scanner](https://app.crowdsec.net/cti?q=cves%3ACVE-*+AND+NOT+classifications.classifications.name%3Ascanner*&page=1):

```bash
cves:CVE-* AND NOT classifications.classifications.name:scanner*
```

## Regular Expression

:::warning

Do not enclose regular expression queries between double quotes.

:::

Regular expression must be enclosed between `/`.

For example, you can [query any IPs reported for a CVE published in 2024](https://app.crowdsec.net/cti?q=cves%3A%2FCVE-2024-%5B0-9%5D%2B%2F&page=1):

```bash
cves:/CVE-2024-[0-9]+/
```

Or you can [search for any IPs belonging to Amazon or Google](https://app.crowdsec.net/cti?q=as_name%3A%2F%28amazon-02%7Cgoogle%29%2F&page=1):

```bash
as_name:/(amazon-02|google)/
```
