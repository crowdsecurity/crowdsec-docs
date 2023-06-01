---
id: cti_object
title: CTI Object Taxonomy
sidebar_position: 2
---


### `ip`

```
ip: 1.2.3.4
```

The requested IP

### `ip_range`
```
ip_range: 1.2.3.0/24
```

The range to which the IP belongs

### `ip_range_score`
```
ip_range_score: 
```

The malevolence score of the IP range the IP belongs to. 0 is unknown, 1 is a couple of IP reported, 5 is the highest level for the most aggressive range. See "scoring" above


### `as_name`
```
as_name: AS-NAME
```

The autonomous system name to which the IP belongs

### `as_num`
```
as_num: 123
```

The autonomous system to which the IP belongs







### `state`

```
state: validated|refused
```

Only present for the `fire` route.

- `validated` means IP is currently part of community blocklist
- `refused` means it was part of the community blocklist, but was manually purged (ie. false positive)

### `expiration`
```
expiration: 2023-01-01T01:01:01.000000
```

Only present for the `fire` route.

Date at which the IP address expire from the community blocklist.


 - `state` : Only present for the "fire" route: `validated` means IP is currently part of community blocklist. `refused` means it was part of the community blocklist, but was manually purged (ie. false positive)
 - `expiration`: Only present for the "fire" route: Date at which the IP address expire from the community blocklist.
 - `ip_range_score`: the malevolence score of the IP range the IP belongs to. 0 is unknown, 1 is a couple of IP reported, 5 is the highest level for the most aggressive range. See "scoring" above
 - `ip_range`: the range to which the IP belongs
 - `ip`: the IP requested
 - `as_name`, `as_num`: The autonomous system name and number to which the IP belongs
 - `location` dictionary with the genreric localisation information:
   - `country`: the two letters country code of the IP following  ISO 3166 format, when available
   - `city`: the associated city name of the IP, when available
   - `latitude`, `longitude`: floating points coordinates of the IP, when available
 - `reverse_dns`: reverse DNS lookup of the IP, when available
 - `behaviors`: A list of the attack categories for which the IP was reported. Each list item contains :
   - `name`: category of the attack, often in the form "protocol-or-scope:attack_type". See "categories" for a non-exhaustive listing
   - `label`, `description`: Human-friendly description of the category
 - `history` :
    - `first_seen`: date of the first time this IP was reported. Please note that due to "progressive data degradation" this date might be later than the first time the IP was actually seen.
    - `last_seen`: date of the last time this IP was reported.
    - `full_age`: delta in days between first seen and today.
    - `days_age`: delta in days between first and last seen timestamps.
 - `classifications`:
   - `false_positive`: A list of false positives tags associated with the IP. Any IP with `known_false_positive` tags shouldn't be considered as malicious
   - `classifications`: A list of categories associated with the IP. Those data can be sourced from 3rd parties (i.e. tor exit nodes list). [An exhaustive list](#list-of-common-classifications) is available bellow,
 - `attack details`: A more exhaustive list of the scenarios for which a given IP was reported. Each entry contains the following information :
   - `name`: name of the scenario (see [hub.crowdsec.net](hub.crowdsec.net))
   - `label`, `description`: Human-friendly descriptions of said scenarios
 - `target_countries`: The top 10 reports repartition by country about the IP, as a percentage
 - `background_noise_score`: Evaluate the noisiness of an IP address, from a scale of 0 (not noisy) to 10 (extremely noisy)
 - `scores`: Indicators of Malevolence computed on different time periods
    - `overall`: Malevolence score over the total period (3 months)
      - `total`: The aggregated malevolence score
      - `aggressiveness`: The score of the *aggressiveness* component (see above)
      - `threat`: The score of the *threat* component (see above)
      - `trust`: The score of the *trust* component (see above)
      - `anomaly`: The score of the *anomaly* component (see above)
    - `last_month`: Malevolence score over the last month
      - `total`: The aggregated malevolence score
      - `aggressiveness`: The score of the *aggressiveness* component (see above)
      - `threat`: The score of the *threat* component (see above)
      - `trust`: The score of the *trust* component (see above)
      - `anomaly`: The score of the *anomaly* component (see above)
    - `last_week`: Malevolence score over the last week
      - `total`: The aggregated malevolence score
      - `aggressiveness`: The score of the *aggressiveness* component (see above)
      - `threat`: The score of the *threat* component (see above)
      - `trust`: The score of the *trust* component (see above)
      - `anomaly`: The score of the *anomaly* component (see above)
    - `last_day`:  Malevolence score over the last day
      - `total`: The aggregated malevolence score
      - `aggressiveness`: The score of the *aggressiveness* component (see above)
      - `threat`: The score of the *threat* component (see above)
      - `trust`: The score of the *trust* component (see above)
      - `anomaly`: The score of the *anomaly* component (see above)
  - `references` : A more open data field used to track 3rd parties referencing this IP as well. A common usage would be public / external lists in which this IP is present.
