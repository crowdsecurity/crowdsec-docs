---
id: integration_splunk_siem
title: Splunk SIEM App
sidebar_position: 6
---

The **Splunk SIEM App** enables IP lookup from CrowdSec CTI API via custom command called `cssmoke`. It provides information about the IP, such as what kind of attacks it has been participant of as seen by CrowdSec's network. It also includes enrichment by CrowdSec like background noise score, aggressivity over time etc.


## Installation

The Splunk SIEM App is available in Splunkbase. You can download it from [here](https://splunkbase.splunk.com/app/6800/).

## Usage

- Get your API key for CrowdSec CTI API by following [this guide.](/cti_api/api_getting_started.mdx)

- Complete the App setup by providing your API Key 

:::info
The batching option cannot be used with free CTI API keys. Batching allows to query up to 100 IPs at a time and is needed for any larger scale enrichments.
:::


![Setup View](/img/splunk_siem/splunk_siem_api_key_setup.png)


- Test it by running the query `| makeresults | eval ip="8.8.8.8" | cssmoke ipfield="ip"`

![Example Output](/img/splunk_siem/splunk_siem_example.png)


## Fields filtering

`cssmoke` supports a `fields` argument to restrict outputed fields, separated by commas.

```
cssmoke ipfield="ip" fields="confidence,reputation,cves"
```

![Example Output (2)](/img/splunk_siem/splunk_siem_example_2.png)

## Multiple IP fields

All output fields have the prefix `crowdsec_{field}_`. For event with multiple IPs (ie. `ipsrc`, `ipdst`), the outputs will be in `crowdsec_ipsrc_reputation`, `crowdsec_ipdst_reputation` etc.

![Example Output (3)](/img/splunk_siem/splunk_siem_multiple_ips.png)


:::info
Fields containing multiple IP values aren't supported.
:::

## Enriched Data

The following fields are automatically enriched using **CrowdSec** intelligence:

(Please refer to the [CrowdSec CTI API documentation](https://docs.crowdsec.net/u/cti_api/taxonomy/cti_object/) for more details on each field.)

:::info

All output fields are prefixed with `crowdsec_{field}_`.
:::

### Reputation & Classification

* `reputation`: IP reputation
* `confidence`: Confidence level
* `ip_range_score`: The malevolence score of the IP range the IP belongs to
* `ip`: Original IP address
* `ip_range`: IP range
* `ip_range_24`: /24 range of the IP address
* `ip_range_24_reputation`: Reputation of the range
* `ip_range_24_score`: Score for the range
* `as_name`: Autonomous system (AS) name
* `as_num`: Autonomous system (AS) number
* `false_positives`: Historical false positives
* `classifications`: Classifications associated with the IP

### Geolocation

* `country`: Country
* `city`: City
* `latitude`: Latitude
* `longitude`: Longitude
* `reverse_dns`: Reverse DNS result

### Behavioral & Threat Intelligence

* `behaviors`: A list of the attack categories for which the IP was reported
* `mitre_techniques`: A list of Mitre techniques associated with the IP
* `cves`: A list of CVEs for which the IP has been reported for
* `attack_details`: A more exhaustive list of the scenarios for which a given IP was reported
* `target_countries`: The top 10 countries targeted by the IP
* `background_noise`: The level of background noise of an IP address is an indicator of its internet activity intensity
* `background_noise_score`: CrowdSec intelligence calculated score
* `references`: A list of the CrowdSec Blockists the IP belongs to

### Activity History

* `first_seen`: Date of the first time this IP was reported
* `last_seen`: Date of the last time this IP was reported
* `full_age`: Delta in days between first seen and today
* `days_age`: Delta in days between first and last seen timestamps

### Threat Scores Over Time

#### Overall

* `overall_aggressiveness`
* `overall_threat`
* `overall_trust`
* `overall_anomaly`
* `overall_total`

#### Last Day

* `last_day_aggressiveness`
* `last_day_threat`
* `last_day_trust`
* `last_day_anomaly`
* `last_day_total`

#### Last Week

* `last_week_aggressiveness`
* `last_week_threat`
* `last_week_trust`
* `last_week_anomaly`
* `last_week_total`

#### Last Month

* `last_month_aggressiveness`
* `last_month_threat`
* `last_month_trust`
* `last_month_anomaly`
* `last_month_total`

