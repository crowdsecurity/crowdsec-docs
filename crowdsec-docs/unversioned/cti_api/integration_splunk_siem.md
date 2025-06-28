---
id: integration_splunk_siem
title: Splunk SIEM App
sidebar_position: 6
---

The **Splunk SIEM App** enables IP lookup from CrowdSec CTI API via custom command called `cssmoke`. It provides information about the IP, such as what kind of attacks it has been participant of as seen by CrowdSec's network. It also includes enrichment by CrowdSec like background noise score, aggressivity over time etc.


## Installation

The Splunk SIEM App is available in Splunkbase. You can download it from [here](https://splunkbase.splunk.com/app/6800/).

## Usage

- Get your API key for CrowdSec CTI API by following [this guide.](/cti_api/getting_started.mdx)

- Complete the App setup by providing your API Key 

**N.B**: If you wish to change your key at a later date, you can do so on this same page.

![Setup View](/img/splunk_siem/splunk_siem_api_key_setup.png)


- Test it by running the query `| makeresults | eval ip="8.8.8.8" | cssmoke ipfield="ip"`

![Example Output](/img/splunk_siem/splunk_siem_example.png)

![Example Output (2)](/img/splunk_siem/splunk_siem_example_2.png)

## Enriched Data

The following fields are automatically enriched using **CrowdSec** intelligence:

(Please refer to the [CrowdSec CTI API documentation](https://docs.crowdsec.net/u/cti_api/taxonomy/cti_object/) for more details on each field.)


### Reputation & Classification

* `crowdsec_reputation`: IP reputation
* `crowdsec_confidence`: Confidence level
* `crowdsec_ip_range_score`: The malevolence score of the IP range the IP belongs to
* `crowdsec_ip`: Original IP address
* `crowdsec_ip_range`: IP range
* `crowdsec_ip_range_24`: /24 range of the IP address
* `crowdsec_ip_range_24_reputation`: Reputation of the range
* `crowdsec_ip_range_24_score`: Score for the range
* `crowdsec_as_name`: Autonomous system (AS) name
* `crowdsec_as_num`: Autonomous system (AS) number
* `crowdsec_false_positives`: Historical false positives
* `crowdsec_classifications`: Classifications associated with the IP

### Geolocation

* `crowdsec_country`: Country
* `crowdsec_city`: City
* `crowdsec_latitude`: Latitude
* `crowdsec_longitude`: Longitude
* `crowdsec_reverse_dns`: Reverse DNS result

### Behavioral & Threat Intelligence

* `crowdsec_behaviors`: A list of the attack categories for which the IP was reported
* `crowdsec_mitre_techniques`: A list of Mitre techniques associated with the IP
* `crowdsec_cves`: A list of CVEs for which the IP has been reported for
* `crowdsec_attack_details`: A more exhaustive list of the scenarios for which a given IP was reported
* `crowdsec_target_countries`: The top 10 countries targeted by the IP
* `crowdsec_background_noise`: The level of background noise of an IP address is an indicator of its internet activity intensity
* `crowdsec_background_noise_score`: CrowdSec intelligence calculated score
* `crowdsec_references`: A list of the CrowdSec Blockists the IP belongs to

### Activity History

* `crowdsec_first_seen`: Date of the first time this IP was reported
* `crowdsec_last_seen`: Date of the last time this IP was reported
* `crowdsec_full_age`: Delta in days between first seen and today
* `crowdsec_days_age`: Delta in days between first and last seen timestamps

### Threat Scores Over Time

#### Overall

* `crowdsec_overall_aggressiveness`
* `crowdsec_overall_threat`
* `crowdsec_overall_trust`
* `crowdsec_overall_anomaly`
* `crowdsec_overall_total`

#### Last Day

* `crowdsec_last_day_aggressiveness`
* `crowdsec_last_day_threat`
* `crowdsec_last_day_trust`
* `crowdsec_last_day_anomaly`
* `crowdsec_last_day_total`

#### Last Week

* `crowdsec_last_week_aggressiveness`
* `crowdsec_last_week_threat`
* `crowdsec_last_week_trust`
* `crowdsec_last_week_anomaly`
* `crowdsec_last_week_total`

#### Last Month

* `crowdsec_last_month_aggressiveness`
* `crowdsec_last_month_threat`
* `crowdsec_last_month_trust`
* `crowdsec_last_month_anomaly`
* `crowdsec_last_month_total`

