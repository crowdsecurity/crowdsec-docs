---
id: other_helpers
title: Other helpers
sidebar_position: 2
---

## Time Helpers

### `TimeNow() string`

Return RFC3339 formatted time 

> `TimeNow()`

### `ParseUnix(unix string) string`
```
ParseUnix("1672239773.3590894") -> "2022-12-28T15:02:53Z"
ParseUnix("1672239773") -> "2022-12-28T15:02:53Z"
ParseUnix("notatimestamp") -> ""
```
Parses unix timestamp string and returns RFC3339 formatted time

## Stash Helpers

### `GetFromStash(cache string, key string)`

`GetFromStash` retrieves the value for `key` in the named `cache`.
The cache are usually populated by [parser's stash section](/parsers/format.md#stash).
An empty string if the key doesn't exist (or has been evicted), and error is raised if the `cache` doesn't exist.

## Others

### `IsIPV4(ip string) bool`

Returns true if it's a valid IPv4.

> `IsIPV4("1.2.3.4")`

> `IsIPV4(Alert.GetValue())`

### `IsIP(ip string) bool`

Returns true if it's a valid IP (v4 or v6).

> `IsIP("2001:0db8:85a3:0000:0000:8a2e:0370:7334")`

> `IsIP("1.2.3.4")`

> `IsIP(Alert.GetValue())`

### `GetDecisionsCount(value string) int`

Returns the number of existing decisions in the database with the same value.
This can return expired decisions if they have not been flushed yet.

> `GetDecisionsCount("192.168.1.1")`

> `GetDecisionsCount(Alert.GetValue())`

### `GetDecisionsSinceCount(value string, since string) int`

Returns the number of existing decisions in the database with the same value since duration string (valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h".).
This can return expired decisions if they have not been flushed yet.

> `GetDecisionsSinceCount("192.168.1.1", "7h")`

> `GetDecisionsSinceCount(Alert.GetValue(), "30min")`

### `GetActiveDecisionsCount(value string) int`

Returns the number of active decisions in the database with the same value.

> `GetActiveDecisionsCount(Alert.GetValue())`


### `GetActiveDecisionsTimeLeft(value string) time.Duration`

Returns the time left for the longest decision associated with the value.

The returned value type is `time.Duration`, so you can use all the [time.Duration methods](https://pkg.go.dev/time#Duration).

> `GetActiveDecisionsTimeLeft(Alert.GetValue())`

> `GetActiveDecisionsTimeLeft(Alert.GetValue()).Hours() > 1"

### `KeyExists(key string, map map[string]interface{}) bool`

Return true if the `key` exists in the map.

### `Get(arr []string, index int) string`

Returns the index'th entry of arr, or `""`.


### `Distance(lat1 string, long1 string, lat2 string, long2 string) float64`

Computes the distance in kilometers between the set of coordinates represented by lat1/long1 and lat2/long2.
Designed to implement impossible travel and similar scenarios:

```yaml
type: conditional
name: demo/impossible-travel
description: "test"
filter: "evt.Meta.log_type == 'fake_ok'"
groupby: evt.Meta.user
capacity: -1
condition: |
  len(queue.Queue) >= 2 
  and Distance(queue.Queue[-1].Enriched.Latitude, queue.Queue[-1].Enriched.Longitude,
  queue.Queue[-2].Enriched.Latitude, queue.Queue[-2].Enriched.Longitude) > 100
leakspeed: 3h
labels:
  type: fraud
```
Notes:
 - Will return `0` if either set of coordinates is nil (ie. IP couldn't be geoloc)
 - Assumes that the earth is spherical and uses the haversine formula.

### `Hostname() string`

Returns the hostname of the machine.

## Alert specific helpers

### `Alert.Remediation bool`

Is `true` if the alert asks for a remediation. Will be true for alerts from scenarios with `remediation: true` flag. Will be false for alerts from manual `cscli decisions add` commands (as they come with their own decision).

### `Alert.GetScenario() string`

Returns the name of the scenario that triggered the alert.

### `Alert.GetScope() string`

Returns the scope of an alert. Most common value is `Ip`. `Country` and `As` are generally used for more distributed attacks detection/remediation.

### `Alert.GetValue() string`

Returns the value of an alert. field value of a `Source`, most common value can be a IPv4, IPv6 or other if the Scope is different than `Ip`.

### `Alert.GetSources() []string`

Return the list of IP addresses in the alert sources.

### `Alert.GetEventsCount() int32`

Return the number of events in the bucket.
