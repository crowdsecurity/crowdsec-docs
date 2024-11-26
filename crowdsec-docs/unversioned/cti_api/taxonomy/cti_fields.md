---
id: cti_object
title: CTI Format
sidebar_position: 2
---

<details>
  <summary>Object example</summary>

```json
{
    "ip_range_score": 5,
    "ip": "[CENSORED]",
    "ip_range": "[CENSORED]",
    "as_name": "[CENSORED]",
    "reputation": "malicious",
    "ip_range_24": "[CENSORED]",
    "ip_range_24_reputation": "suspicious",
    "ip_range_24_score": 3,
    "background_noise_score": 10,
    "background_noise": "high",
    "as_num": 0,
    "location": {
        "country": "FR",
        "city": "",
        "latitude": 0.0,
        "longitude": 0.0
    },
    "reverse_dns": "[CENSORED]",
    "behaviors": [
        {
            "name": "http:scan",
            "label": "HTTP Scan",
            "description": "IP has been reported for performing actions related to HTTP vulnerability scanning and discovery."
        },
        {
            "name": "ssh:bruteforce",
            "label": "SSH Bruteforce",
            "description": "IP has been reported for performing brute force on ssh services."
        },
        {
            "name": "http:exploit",
            "label": "HTTP Exploit",
            "description": "IP has been reported for attempting to exploit a vulnerability in a web application."
        },
        {
            "name": "generic:exploit",
            "label": "Exploitation attempt",
            "description": "IP has been reported trying to exploit known vulnerability/CVE on unspecified protocols."
        }
    ],
    "history": {
        "first_seen": "2022-05-28T16:00:00+00:00",
        "last_seen": "2023-10-15T05:45:00+00:00",
        "full_age": 507,
        "days_age": 505
    },
    "classifications": {
        "false_positives": [],
        "classifications": []
    },
    "attack_details": [
        {
            "name": "crowdsecurity/http-probing",
            "label": "HTTP Probing",
            "description": "Detect site scanning/probing from a single ip",
            "references": []
        },
        {
            "name": "crowdsecurity/ssh-bf",
            "label": "SSH Bruteforce",
            "description": "Detect ssh bruteforce",
            "references": []
        },
        {
            "name": "crowdsecurity/ssh-slow-bf",
            "label": "SSH Bruteforce",
            "description": "Detect slow ssh bruteforce",
            "references": []
        },
        {
            "name": "crowdsecurity/http-bad-user-agent",
            "label": "detection of bad user-agents",
            "description": "Detect bad user-agents",
            "references": []
        },
        {
            "name": "crowdsecurity/suricata-major-severity",
            "label": "Suricata Severity 1 Event",
            "description": "Detect exploit attempts via emerging threat rules",
            "references": []
        },
        {
            "name": "crowdsecurity/modsecurity",
            "label": "Modsecurity Alert",
            "description": "Web exploitation via modsecurity",
            "references": []
        }
    ],
    "target_countries": {
        "AT": 0,
        "AU": 2,
        "BR": 0,
        "CA": 4,
        "CH": 0,
        "CN": 0,
        "DE": 79,
        "DK": 0,
        "ES": 0,
        "FI": 12
    },
    "mitre_techniques": [
        {
            "name": "T1595",
            "label": "Active Scanning",
            "description": "Adversaries may execute active reconnaissance scans to gather information that can be used during targeting. Active scans are those where the adversary probes victim infrastructure via network traffic, as opposed to other forms of reconnaissance that do not involve direct interaction.\n\nAdversaries may perform different forms of active scanning depending on what information they seek to gather. These scans can also be performed in various ways, including using native features of network protocols such as ICMP.(Citation: Botnet Scan)(Citation: OWASP Fingerprinting) Information from these scans may reveal opportunities for other forms of reconnaissance (ex: [Search Open Websites/Domains](https://attack.mitre.org/techniques/T1593) or [Search Open Technical Databases](https://attack.mitre.org/techniques/T1596)), establishing operational resources (ex: [Develop Capabilities](https://attack.mitre.org/techniques/T1587) or [Obtain Capabilities](https://attack.mitre.org/techniques/T1588)), and/or initial access (ex: [External Remote Services](https://attack.mitre.org/techniques/T1133) or [Exploit Public-Facing Application](https://attack.mitre.org/techniques/T1190))."
        },
        {
            "name": "T1110",
            "label": "Brute Force",
            "description": "Adversaries may use brute force techniques to gain access to accounts when passwords are unknown or when password hashes are obtained. Without knowledge of the password for an account or set of accounts, an adversary may systematically guess the password using a repetitive or iterative mechanism. Brute forcing passwords can take place via interaction with a service that will check the validity of those credentials or offline against previously acquired credential data, such as password hashes.\n\nBrute forcing credentials may take place at various points during a breach. For example, adversaries may attempt to brute force access to [Valid Accounts](https://attack.mitre.org/techniques/T1078) within a victim environment leveraging knowledge gathered from other post-compromise behaviors such as [OS Credential Dumping](https://attack.mitre.org/techniques/T1003), [Account Discovery](https://attack.mitre.org/techniques/T1087), or [Password Policy Discovery](https://attack.mitre.org/techniques/T1201). Adversaries may also combine brute forcing activity with behaviors such as [External Remote Services](https://attack.mitre.org/techniques/T1133) as part of Initial Access."
        },
        {
            "name": "T1190",
            "label": "Exploit Public-Facing Application",
            "description": "Adversaries may attempt to exploit a weakness in an Internet-facing host or system to initially access a network. The weakness in the system can be a software bug, a temporary glitch, or a misconfiguration.\n\nExploited applications are often websites/web servers, but can also include databases (like SQL), standard services (like SMB or SSH), network device administration and management protocols (like SNMP and Smart Install), and any other system with Internet accessible open sockets.(Citation: NVD CVE-2016-6662)(Citation: CIS Multiple SMB Vulnerabilities)(Citation: US-CERT TA18-106A Network Infrastructure Devices 2018)(Citation: Cisco Blog Legacy Device Attacks)(Citation: NVD CVE-2014-7169) Depending on the flaw being exploited this may also involve [Exploitation for Defense Evasion](https://attack.mitre.org/techniques/T1211). \n\nIf an application is hosted on cloud-based infrastructure and/or is containerized, then exploiting it may lead to compromise of the underlying instance or container. This can allow an adversary a path to access the cloud or container APIs, exploit container host access via [Escape to Host](https://attack.mitre.org/techniques/T1611), or take advantage of weak identity and access management policies.\n\nAdversaries may also exploit edge network infrastructure and related appliances, specifically targeting devices that do not support robust host-based defenses.(Citation: Mandiant Fortinet Zero Day)(Citation: Wired Russia Cyberwar)\n\nFor websites and databases, the OWASP top 10 and CWE top 25 highlight the most common web-based vulnerabilities.(Citation: OWASP Top 10)(Citation: CWE top 25)"
        }
    ],
    "cves": [],
    "scores": {
        "overall": {
            "aggressiveness": 5,
            "threat": 2,
            "trust": 4,
            "anomaly": 0,
            "total": 4
        },
        "last_day": {
            "aggressiveness": 0,
            "threat": 0,
            "trust": 0,
            "anomaly": 0,
            "total": 0
        },
        "last_week": {
            "aggressiveness": 5,
            "threat": 2,
            "trust": 4,
            "anomaly": 0,
            "total": 4
        },
        "last_month": {
            "aggressiveness": 5,
            "threat": 2,
            "trust": 4,
            "anomaly": 0,
            "total": 4
        }
    },
    "references": []
}
```

</details>

## `ip`

> type: **string**

```json
"ip": "1.2.3.4"
```

The requested IP.

## `ip_range`

> type: **string**

```json
"ip_range": "1.2.3.0/18"
```

The range to which the IP belongs.

## `reputation`

> type: **string**

```json
"reputation" : "malicious"
```

The reputation of the IP address.

The possible values are:

-   `malicious` : The IP address is malicious
-   `suspicious` : Many CrowdSec users have reported the IP, but it is not aggressive enough to be considered malicious
-   `known` : At this time, the CrowdSec network has identified the IP, but we still require additional information to make a decision
-   `safe` : The IP address is safe and can be trusted (ex: Google DNS, Cloudflare DNS ...)
-   `benign` : The IP address belong to a known entity and is not dangerous (eg. Public Internet Scanners)
-   `unknown`: The IP address is either unknown or its last report is from more than three months ago

## `ip_range_24`

> type: **string**

```json
"ip_range_24" : "1.2.3.0/24"
```

The /24 range of the IP address.

## `ip_range_24_reputation`

> type: **string**

```json
"ip_range_24_reputation" : "malicious"
```

For range reputation, only the IPs in the immediate proximity of the requested IP address are considered. For convenience, the range (network prefix) size is always fixed to /24, or 256 IPv4 addresses.

The possible values for the /24 network prefix are:

-   `malicious` : The range is considered malicious
-   `suspicious` : The IP range contains several IPs that have been reported by the CrowdSec network
-   `known` : The IP range is recognized in the CrowdSec network, but we lack sufficient sightings of its IP addresses
-   `unknown`: The last report for IP range is either unknown or over 3 months old

## `ip_range_24_score`

> type: **string**

```json
"ip_range_24_score" : 4
```

For range scoring, only the IPs in the immediate proximity of the requested IP address are considered. For convenience, the range (network prefix) size is always fixed to /24, or 256 IPv4 addresses.

0 represents unknown, 1 represents a few reported IPs, and 5 represents the highest level for the most aggressive range

Here is the mapping with the reputation:

| Score | Reputation   |
| ----- | ------------ |
| 0     | `unknown`    |
| 1     | `known`      |
| 2-3   | `suspicious` |
| 4-5   | `malicious`  |

## `background_noise`

> type: **string**

```json
"background_noise" : "high"
```

The level of background noise of an IP address is an indicator of its internet activity intensity.

The possible values are:

-   `high` : IP is very noisy, validated as an untargeted mild-threat mass-attacks
-   `medium` : IP has been reported by many members of the CrowdSec network, but not enough to be considered as background noise
-   `low` : IP has been reported by a few members of the CrowdSec network
-   `none` : IP has never been reported or only by a very few members of the CrowdSec network

## `background_noise_score`

> type: **int**

```json
"background_noise_score" : 10
```

CrowdSec intelligence calculated score: a high background noise scores highlights untargeted mild-threat mass-attacks.

## `confidence`

> type: **string**

```json
confidence: "high"
```

The confidence level about the reports used to compute the reputation and scores.

The possible values are:

-   `high`
-   `medium`
-   `low`
-   `none`

## `ip_range_score`

> type: **int**

```json
"ip_range_score" : 5
```

The malevolence score of the IP range the IP belongs to. 0 is unknown, 1 is a couple of IP reported, 5 is the highest level for the most aggressive range. See "scoring" above.

## `as_name`

> type: **string**

```json
"as_name": "AS-NAME"
```

The autonomous system name to which the IP belongs.

## `as_num`

> type: **int**

```json
"as_num": 123
```

The autonomous system to which the IP belongs.

## `reverse_dns`

> type: **string**

```json
"reverse_dns": "test.com"
```

Reverse DNS lookup of the IP, when available.

## `location`

> type: **object**

```json
"location" : {
  "country" : "FR",
  "city" : "Paris",
  "latitude" : 0.0,
  "longitude" : 0.0,
}
```

The geo location information about the IP address.

### `country`

> type: **string**

```json
"country" : "FR"
```

The two letters country code of the IP following ISO 3166 format, when available.

### `city`

> type: **string**

```json
"city" : "Paris"
```

The associated city name of the IP, when available.

### `latitude`

> type: **float**

```json
"latitude" : 0.0
```

Latitude of the IP, when available.

### `longitude`

> type: **float**

```json
"longitude" : 0.0
```

Longitude of the IP, when available.

## `history`

> type: **object**

```json
"history" : {
  "first_seen" : "2022-01-01T00:00:00+00:00",
  "last_seen" : "2022-01-01T00:00:00+00:00",
  "full_age" : 42,
  "days_age" : 40,
}
```

Historical information we have collected about the IP.

### `first_seen`

> type: **string**

```json
"first_seen" : "2022-01-01T00:00:00+00:00"
```

Date of the first time this IP was reported. Please note that due to our progressive data degradation mechanism this date might be later than the first time the IP was actually seen.

### `last_seen`

> type: **string**

```json
"last_seen" : "2022-01-01T00:00:00+00:00"
```

Date of the last time this IP was reported.

### `full_age`

> type: **int**

```json
"full_age" : 42
```

Delta in days between first seen and today.

### `days_age`

> type: **int**

```json
"days_age" : 40
```

Delta in days between first and last seen timestamps.

## `behaviors`

> type: **list(object)**

```json
"behaviors" : [
  {
    "name" : "protocol:behavior",
    "label" : "Protocol Behavior",
    "description" : "Protocol Behavior description"
  }
]
```

A list of the attack categories for which the IP was reported.
The possibles values of this field are listed [here](cti_api/taxonomy/behaviors.mdx).

### `name`

> type: **string**

```json
"name" : "protocol:behavior"
```

Category name of the attack, often in the form `protocol-or-scope:attack_type`.

### `label`

> type: **string**

```json
"label" : "Protocol Behavior"
```

Human-friendly name of the behavior.

### `description`

> type: **string**

```json
"description" : "Protocol Behavior description"
```

Human-friendly description of the behavior.

## `classifications`

> type: **object**

```json
"classifications" : {
  "false_positives" : [
    {
      "name" : "false_positive",
      "label" : "False Positive",
      "description" : "False Positive description"
    }
  ],
  "classifications" : {
    "name" : "classification",
    "label" : "Classification",
    "description" : "Classification description"
  }
}
```

The possible false positives and classifications attributed to this IP address.

### `false_positives`

> type: **list(object)**

```json
"false_positives" : [
  {
    "name" : "false_positive",
    "label" : "False Positive",
    "description" : "False Positive description"
  }
]
```

A list of false positive tags associated with the IP. Any IP with `false_positives` tags shouldn't be considered as malicious.

#### `name`

> type: **string**

```json
"name" : "false_positive"
```

False positive name.

#### `label`

> type: **string**

```json
"label" : "False Positive"
```

Human-friendly name of the false positive.

#### `description`

> type: **string**

```json
"description" : "False Positive description"
```

Human-friendly description of the false positive.

### `classifications`

> type: **list(object)**

```json
"classifications" : [
  {
    "name" : "classification",
    "label" : "Classification",
    "description" : "Classification description"
  }
]
```

A list of `classification` tags associated with the IP.

#### `name`

> type: **string**

```json
"name" : "classification"
```

Classification name.

#### `label`

> type: **string**

```json
"label" : "Classification"
```

Human-friendly name of the classification.

#### `description`

> type: **string**

```json
"description" : "Classification description"
```

Human-friendly description of the classification.

## `attack_details`

> type: **list(object)**

```json
"attack_details" : [
  {
    "name" : "crowdsecurity/scenario",
    "label" : "Scenario Label",
    "description" : "Scenario description"
  }
]
```

A more exhaustive list of the scenarios for which a given IP was reported.
The possibles values of this field are listed [here](cti_api/taxonomy/scenarios.mdx).

### `name`

> type: **string**

```json
"name" : "author/scenario_name"
```

Name of the scenario, often in the form `author/scenario_name`.

### `label`

> type: **string**

```json
"label" : "Scenario"
```

Human-friendly name of the scenario.

### `description`

> type: **string**

```json
"description" : "Scenario description"
```

Human-friendly description of the scenario.

## `mitre_techniques`

> type: **list(object)**

```json
"mitre_techniques" : [
  {
    "name" : "technique_id",
    "label" : "technique name",
    "description" : "Technique description"
  }
]
```

A list of Mitre techniques associated with the IP. More detail on the Mitre Att&ck can be found [here](https://attack.mitre.org/techniques/enterprise/).

### `name`

> type: **string**

```json
"name" : "technique ID"
```

Mitre Technique ID.

### `label`

> type: **string**

```json
"label" : "technique name"
```

Mitre Technique name.

### `description`

> type: **string**

```json
"description" : "technique description"
```

Mitre Technique description.

## `cves`

> type: **list(string)**

```json
"cves" : [
  "CVE-2023-1234",
  "CVE-2023-1245"
]
```

A list of CVEs for which the IP has been reported for.

## `target_countries`

> type: **object**

```json
"target_countries": {
  "US": 80,
  "GB": 5,
  "FR": 4,
  "DE": 4,
  "CA": 2,
},
```

The top 10 countries targeted by the IP. The numbers represent the percentage of the total number of attacks.

## `scores`

> type: **object**

```json
"scores": {
  "overall": {
    "aggressiveness": 5,
    "threat": 1,
    "trust": 4,
    "anomaly": 3,
    "total": 4
  },
  "last_day": {
    "aggressiveness": 1,
    "threat": 1,
    "trust": 0,
    "anomaly": 3,
    "total": 1
  },
  "last_week": {
    "aggressiveness": 3,
    "threat": 1,
    "trust": 2,
    "anomaly": 3,
    "total": 3
  },
  "last_month": {
    "aggressiveness": 4,
    "threat": 1,
    "trust": 5,
    "anomaly": 3,
    "total": 3
  }
}
```

Indicators of Malevolence computed over different time periods.

:warning: All scores are on a scale from 0 to 5.

### `overall`

> type: **object**

```json
"overall": {
  "aggressiveness": 5,
  "threat": 1,
  "trust": 4,
  "anomaly": 3,
  "total": 4
}
```

Malevolence score over the total period (3 months).

#### `total`

> type: **int**

```json
"total" : 5
```

The aggregated malevolence score.

#### `aggressiveness`

> type: **int**

```json
"aggressiveness" : 5
```

The score of the _aggressiveness_ component (see [more here](cti_api/taxonomy/scores.md)).

#### `threat`

> type: **int**

```json
"threat" : 5
```

The score of the _threat_ component (see [more here](cti_api/taxonomy/scores.md)).

#### `trust`

> type: **int**

```json
"trust" : 5
```

The score of the _trust_ component (see [more here](cti_api/taxonomy/scores.md)).

#### `anomaly`

> type: **int**

```json
"anomaly" : 5
```

The score of the _anomaly_ component (see [more here](cti_api/taxonomy/scores.md)).

### `last_month`

> type: **object**

```json
"last_month": {
  "aggressiveness": 5,
  "threat": 1,
  "trust": 4,
  "anomaly": 3,
  "total": 4
}
```

Malevolence score over the last month.

#### `total`

> type: **int**

```json
"total" : 5
```

The aggregated malevolence score.

#### `aggressiveness`

> type: **int**

```json
"aggressiveness" : 5
```

The score of the _aggressiveness_ component (see [more here](cti_api/taxonomy/scores.md)).

#### `threat`

> type: **int**

```json
"threat" : 5
```

The score of the _threat_ component (see [more here](cti_api/taxonomy/scores.md)).

#### `trust`

> type: **int**

```json
"trust" : 5
```

The score of the _trust_ component (see [more here](cti_api/taxonomy/scores.md)).

#### `anomaly`

> type: **int**

```json
"anomaly" : 5
```

The score of the _anomaly_ component (see [more here](cti_api/taxonomy/scores.md)).

### `last_week`

> type: **object**

```json
"last_week": {
  "aggressiveness": 5,
  "threat": 1,
  "trust": 4,
  "anomaly": 3,
  "total": 4
}
```

Malevolence score over the last week.

#### `total`

> type: **int**

```json
"total" : 5
```

The aggregated malevolence score.

#### `aggressiveness`

> type: **int**

```json
"aggressiveness" : 5
```

The score of the _aggressiveness_ component (see [more here](cti_api/taxonomy/scores.md)).

#### `threat`

> type: **int**

```json
"threat" : 5
```

The score of the _threat_ component (see [more here](cti_api/taxonomy/scores.md)).

#### `trust`

> type: **int**

```json
"trust" : 5
```

The score of the _trust_ component (see [more here](cti_api/taxonomy/scores.md)).

#### `anomaly`

> type: **int**

```json
"anomaly" : 5
```

The score of the _anomaly_ component (see [more here](cti_api/taxonomy/scores.md)).

### `last_day`

> type: **object**

```json
"last_day": {
  "aggressiveness": 5,
  "threat": 1,
  "trust": 4,
  "anomaly": 3,
  "total": 4
}
```

Malevolence score over the last day.

#### `total`

> type: **int**

```json
"total" : 5
```

The aggregated malevolence score.

#### `aggressiveness`

> type: **int**

```json
"aggressiveness" : 5
```

The score of the _aggressiveness_ component (see [more here](cti_api/taxonomy/scores.md)).

#### `threat`

> type: **int**

```json
"threat" : 5
```

The score of the _threat_ component (see [more here](cti_api/taxonomy/scores.md)).

#### `trust`

> type: **int**

```json
"trust" : 5
```

The score of the _trust_ component (see [more here](cti_api/taxonomy/scores.md)).

#### `anomaly`

> type: **int**

```json
"anomaly" : 5
```

The score of the _anomaly_ component (see [more here](cti_api/taxonomy/scores.md)).

## `references`

> type: **list(object)**

```json
"references" : [
  {
    "name" : "list_name",
    "label" : "List Label",
    "description" : "List descrption"
  }
]
```

A list of the [CrowdSec Blockists](https://app.crowdsec.net/blocklists) the IP belongs to.

### `name`

> type: **string**

```json
"name" : "list:list_name"
```

Name of the list, often in the form `list:<list_name>`.

### `label`

> type: **string**

```json
"label" : "List label"
```

Human-friendly name of the list.

### `description`

> type: **string**

```json
"description" : "List description"
```

Human-friendly description of the list.

## `state`

> type: **string**

```json
"state": "validated|refused"
```

Only present for the `fire` route.

-   `validated` means IP is currently part of community blocklist
-   `refused` means it was part of the community blocklist, but was manually purged (ie. false positive)

## `expiration`

> type: **string**

```json
"expiration": "2023-01-01T01:01:01.000000"
```

Only present for the `fire` route.

Date at which the IP address expires from the community blocklist.
