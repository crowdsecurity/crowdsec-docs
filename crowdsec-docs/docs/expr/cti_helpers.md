---
id: cti_helpers
title: CTI helpers
sidebar_position: 4
---

## CTI Helpers

CTI Helper allows to query Crowdsec's CTI API to enhance the engine capabilities.
It requires [creating a CTI API Key in the console, as described here](/docs/next/cti_api/getting_started).


### `CrowdsecCTI(string) SmokeItem`

Returns the CTI information associated with the provided IP address.
The returned object is of type [`SmokeItem`](https://pkg.go.dev/github.com/crowdsecurity/crowdsec/pkg/cticlient#SmokeItem), and exposes a few convenience helpers:

#### `SmokeItem.GetAttackDetails() []string`

Returns the list of the scenarios most triggered by the given IP.

```yaml
"crowdsecurity/ssh-bf" in CrowdsecCTI("X.X.X.X").GetAttackDetails()
```

#### `SmokeItem.GetBackgroundNoiseScore() int`

Returns the background noise score associated to the given IP, from a scale of 0 (not noisy) to 10 (extremely noisy).

#### `SmokeItem.GetBehaviors() []string`

Returns the list of [behaviors](/docs/next/cti_api/taxonomy#behaviors) associated to the IP. The list of behaviors is derived from the scenarios the IP triggered.

#### `SmokeItem.GetFalsePositives() []string`

Returns the list of eventual [false positive categories](/docs/next/cti_api/taxonomy#false-positives) associatted to the IP.

#### `SmokeItem.GetMaliciousnessScore() float32`

Returns the maliciousness score of the IP, from a scale of 1 (very malicious) to 0 (unknown). If the IP is part of the fire blocklist, the score is "1", otherwise it is computed based on the activity score of the IP over the previous day.

#### `SmokeItem.IsFalsePositive() bool`

Returns true if the IP is flagged as being a false positive.

#### `SmokeItem.IsPartOfCommunityBlocklist() bool`

Returns true if the IP is currently in the community blocklist.
