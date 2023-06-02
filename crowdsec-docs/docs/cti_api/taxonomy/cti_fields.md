---
id: cti_object
title: CTI Object Taxonomy
sidebar_position: 2
---


## `ip`
> type: **string**

```json
"ip": "1.2.3.4"
```

The requested IP.

## `ip_range`
> type: **string**

```json
"ip_range": "1.2.3.0/24"
```

The range to which the IP belongs.

## `background_noise_score`
> type: **int**

```json
"background_noise_score" : 10
```

Evaluate the noisiness of an IP address, from a scale of 0 (not noisy) to 10 (extremely noisy)


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
>type: **object**

```json
"history" : {
  "first_seen" : "2022-01-01T00:00:00+00:00",
  "last_seen" : "2022-01-01T00:00:00+00:00",
  "full_age" : 42,
  "days_age" : 40,
}
```

The geo location information about the IP address.


### `first_seen`
> type: **string**

```json
"first_seen" : "2022-01-01T00:00:00+00:00"
```

Date of the first time this IP was reported. Please note that due to "progressive data degradation" this date might be later than the first time the IP was actually seen.

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
    "name" : "protocol:protocol:behavior",
    "label" : "Protocol Behavior",
    "description" : "Protocol Behavior description"
  }
]
```

A list of the attack categories for which the IP was reported.
The possibles values of this field are listed [here](cti_api/taxonomy/behaviors.md).


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

A list of false positives tags associated with the IP. Any IP with `false_positives` tags shouldn't be considered as malicious.

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
    "name" : "classifications",
    "label" : "Classification",
    "description" : "Classification description"
  }
]
```

A list of false positives tags associated with the IP. Any IP with `classifications` tags shouldn't be considered as malicious.

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
    "label" : "Scenario Labelr",
    "description" : "Scenario description"
  }
]
```

A more exhaustive list of the scenarios for which a given IP was reported.
The possibles values of this field are listed [here](cti_api/taxonomy/scenarios.md).


### `name`
> type: **string**

```json
"name" : "protocol:behavior"
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

The top 10 reports repartition by country about the IP, as a percentage


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

Indicators of Malevolence computed on different time periods.

:warning: All scores are from a scall of 0 to 5.

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

The score of the *aggressiveness* component (see [more here](cti_api/taxonomy/scores.md)).

#### `threat`
> type: **int**

```json
"threat" : 5
```

The score of the *threat* component (see [more here](cti_api/taxonomy/scores.md)).


#### `trust`
> type: **int**

```json
"trust" : 5
```

The score of the *trust* component (see [more here](cti_api/taxonomy/scores.md)).

#### `anomaly`
> type: **int**

```json
"anomaly" : 5
```

The score of the *anomaly* component (see [more here](cti_api/taxonomy/scores.md)).



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

The score of the *aggressiveness* component (see [more here](cti_api/taxonomy/scores.md)).

#### `threat`
> type: **int**

```json
"threat" : 5
```

The score of the *threat* component (see [more here](cti_api/taxonomy/scores.md)).


#### `trust`
> type: **int**

```json
"trust" : 5
```

The score of the *trust* component (see [more here](cti_api/taxonomy/scores.md)).

#### `anomaly`
> type: **int**

```json
"anomaly" : 5
```

The score of the *anomaly* component (see [more here](cti_api/taxonomy/scores.md)).


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

The score of the *aggressiveness* component (see [more here](cti_api/taxonomy/scores.md)).

#### `threat`
> type: **int**

```json
"threat" : 5
```

The score of the *threat* component (see [more here](cti_api/taxonomy/scores.md)).


#### `trust`
> type: **int**

```json
"trust" : 5
```

The score of the *trust* component (see [more here](cti_api/taxonomy/scores.md)).

#### `anomaly`
> type: **int**

```json
"anomaly" : 5
```

The score of the *anomaly* component (see [more here](cti_api/taxonomy/scores.md)).


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

The score of the *aggressiveness* component (see [more here](cti_api/taxonomy/scores.md)).

#### `threat`
> type: **int**

```json
"threat" : 5
```

The score of the *threat* component (see [more here](cti_api/taxonomy/scores.md)).


#### `trust`
> type: **int**

```json
"trust" : 5
```

The score of the *trust* component (see [more here](cti_api/taxonomy/scores.md)).

#### `anomaly`
> type: **int**

```json
"anomaly" : 5
```

The score of the *anomaly* component (see [more here](cti_api/taxonomy/scores.md)).

## `state`
> type: **string**

```json
"state": "validated|refused"
```

Only present for the `fire` route.

- `validated` means IP is currently part of community blocklist
- `refused` means it was part of the community blocklist, but was manually purged (ie. false positive)

## `expiration`
> type: **string**

```json
"expiration": "2023-01-01T01:01:01.000000"
```

Only present for the `fire` route.

Date at which the IP address expire from the community blocklist.

