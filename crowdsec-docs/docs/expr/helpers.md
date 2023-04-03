---
id: helpers
title: Helpers
sidebar_position: 3
---

> [antonmedv/expr](https://github.com/antonmedv/expr) - Expression evaluation engine for Go: fast, non-Turing complete, dynamic typing, static typing

Several places of CrowdSec's configuration use [expr](https://github.com/antonmedv/expr), notably :

 - [Filters](/parsers/format.md#filter) that are used to determine events eligibility in parsers, scenarios and profiles
 - [Statics](/parsers/format.md#statics) use expr in the `expression` directive, to compute complex values
 - [Whitelists](/whitelist/introduction.md) rely on `expression` directive to allow more complex whitelists filters

To learn more about [expr](https://github.com/antonmedv/expr), [check the github page of the project](https://github.com/antonmedv/expr/blob/master/docs/Language-Definition.md).


When CrowdSec relies on `expr`, a context is provided to let the expression access relevant objects :

 - `evt.` is the representation of the current event and is the most relevant object
 - in [profiles](/profiles/intro.md), alert is accessible via the `Alert` object

If the `debug` is enabled (in the scenario or parser where expr is used), additional debug will be displayed regarding evaluated expressions.

## IP Helpers

### `IpInRange(IPStr, RangeStr) bool`

Returns true if the IP `IPStr` is contained in the IP range `RangeStr` (uses `net.ParseCIDR`)

> `IpInRange("1.2.3.4", "1.2.3.0/24")`

### `IpToRange(IPStr, MaskStr) IpStr`

Returns the subnet of the IP with the request cidr size.
It is intended for scenarios taking actions against the range of an IP, not the IP itself :

```yaml
type: leaky
...
scope:
 type: Range
 expression: IpToRange(evt.Meta.source_ip, "/16")
```

> `IpToRange("192.168.0.1", "24")` returns `192.168.0.0/24`

> `IpToRange("192.168.42.1", "16")` returns `192.168.0.0/16`


### `IsIPV6(ip string) bool`

Returns true if it's a valid IPv6.

> `IsIPV6("2001:0db8:85a3:0000:0000:8a2e:0370:7334")`

> `IsIPV6(Alert.GetValue())`

### `LookupHost(host string) []string`
:::warning
* Only use this function within postoverflows as it is can be very slow
* Note if you whitelist a domain behind a CDN provider, all domains using the same CDN provider will also be whitelisted
* Do not use variables within the function as this can be untrusted user input
:::
Returns []string ip addresses that resolvable to the hostname EG: `LookupHost('mydomain.tld') => ['1.2.3.4', '5.6.7.8']`
```yaml
name: me/my_cool_whitelist
description: lets whitelist our own IP
whitelist:
  reason: dont ban my IP
  expression:
    - evt.Overflow.Alert.Source.IP in LookupHost('mydomain.tld')
# This can be useful when you have a dynamic ip and use dynamic DNS providers
```


## Strings

### `Atof(string) float64`

Parses a string representation of a float number to an actual float number (binding on `strconv.ParseFloat`)

> `Atof(evt.Parsed.tcp_port)`

### `File(FileName) []string`

Returns the content of `FileName` as an array of string, while providing cache mechanism.

> `evt.Parsed.some_field in File('some_patterns.txt')`

> `any(File('rdns_seo_bots.txt'), { evt.Enriched.reverse_dns endsWith #})`

### `RegexpInFile(StringToMatch, FileName) bool`

Returns `true` if the `StringToMatch` is matched by one of the expressions contained in `FileName` (uses RE2 regexp engine).

> `RegexpInFile( evt.Enriched.reverse_dns, 'my_legit_seo_whitelists.txt')`

### `Upper(string) string`

Returns the uppercase version of the string

> `Upper("yop")`

### `Lower(string) string`

Returns the lowercase version of the string

> `Lower("YOP")`


### `ParseUri(string) map[string][]string`

Parses an URI into a map of string list.

`ParseURI("/foo?a=1&b=2")` would return :

```
{
  "a": []string{"1"}, 
  "b": []string{"2"}
}
```

### `PathUnescape(string) string`

`PathUnescape` does the inverse transformation of PathEscape, converting each 3-byte encoded substring of the form "%AB" into the hex-decoded byte 0xAB. It returns an error if any % is not followed by two hexadecimal digits.

### `PathEscape(string) string`

`PathEscape` escapes the string so it can be safely placed inside a URL path segment, replacing special characters (including /) with %XX sequences as needed.

### `QueryUnescape(string) string`

`QueryUnescape` does the inverse transformation of QueryEscape, converting each 3-byte encoded substring of the form "%AB" into the hex-decoded byte 0xAB. It returns an error if any % is not followed by two hexadecimal digits.

### `QueryEscape(string) string`

`QueryEscape` escapes the string so it can be safely placed inside a URL query.

### `Sprintf(format string, a ...interface{}) string`

[Official doc](https://pkg.go.dev/fmt#Sprintf) : Sprintf formats according to a format specifier and returns the resulting string.

> `Sprintf('%dh', 1)` returns `1h`

### `Match(pattern string, object string) bool`

`Match` returns true if the object string matches the pattern. Pattern only supports wildcard :
 - `*` multi-character wildcard (including zero-length)
 - `?` single character wildcard

> `Match('to?o*', 'totoooooo')` returns `true`

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

## JSON Helpers

### `UnmarshalJSON`

`UnmarshalJSON` allows to unmarshal a full json object and store the results in the `evt.Unmarshaled` field.
The method is not meant to be used directly as it doesn't return data :

```yaml
statics:
  - method: UnmarshalJSON
    expression: evt.Line.Raw
  - meta: user
    #this has been just populated by the UnmarshalJSON call above
    expression: evt.Unmarshaled.something.something
```


### `JsonExtract(JsonBlob, FieldName) string`

Extract the `FieldName` from the `JsonBlob` and returns it as a string. (binding on [jsonparser](https://github.com/buger/jsonparser/))

> `JsonExtract(evt.Parsed.some_json_blob, "foo.bar[0].one_item")`

### `JsonExtractSlice(JsonBlob, FieldName) []interface{}`

Extract the JSON array in `FieldName` from `JsonBlob` and returns it as a go slice.

Returns nil if the field does not exist or is not an array.

> `JsonExtractSlice(evt.Parsed.message, "params")[0]['value']['login']`

> `any(JsonExtractSlice(evt.Parsed.message, "params"), {.key == 'user' && .value.login != ''})`

### `JsonExtractObject(JsonBlob, FieldName) map[string]interface{}`

Extract the JSON object in `FieldName` from `JsonBlob` and returns it as a go map.

Returns `nil` if the field does not exist or does is not an object.

> `JsonExtractObject(evt.Parsed.message, "params.user")["login"]`

### `ToJsonString(Obj) string`

Returns the JSON representation of `obj`

Returns an empty string if `obj` cannot be serialized to JSON.

> `ToJsonString(JsonExtractSlice(evt.Parsed.message, "params"))`


## XML Helpers


### `XMLGetAttributeValue(xmlString string, path string, attributeName string) string`

Returns the value of `attribute` in the XML node identified by the XPath query `path`.

> `XMLGetAttributeValue(evt.Line.Raw, "/Event/System[1]/Provider", "Name")`

### `XMLGetNodeValue(xmlString string, path string) string`

Returns the content of the XML node identified by the XPath query `path`.

> `XMLGetNodeValue(evt.Line.Raw, "/Event/System[1]/EventID")`


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

Returns the number of existing decisions in database with the same value.

> `GetDecisionsCount("192.168.1.1")`

> `GetDecisionsCount(Alert.GetValue())`

### `GetDecisionsSinceCount(value string, since string) int`

Returns the number of existing decisions in database with the same value since duration string (valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h".).

> `GetDecisionsCount("192.168.1.1", "7h")`

> `GetDecisionsCount(Alert.GetValue(), "30min")`

### `KeyExists(key string, map map[string]interface{}) bool`

Return true if the `key` exist in the map.


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

 
## Event specific helpers


### `Event.GetType() string`

Returns the type of an Event : `overflow` or `log`.

### `Event.GetMeta(key string) string`

Return the `value` of the `Meta[key]` in the Event object (`Meta` are filled only for events of type `overflow`).

### `Event.Time`

The `event` object holds a `Time` field that is set to the date of the event (in time-machine mode) or the time of event acquisition (in live mode). As it is a golang's `time.Time` object, [all the time helpers are available](https://pkg.go.dev/time#Time), but only a few are showcased here.

#### `Event.Time.Hour() int`

Returns the hour of the day of the event.

> `filter: "evt.Meta.log_type == '...' && (evt.Time.Hour() >= 20 || evt.Time.Hour() < 6)`

Will detect if the event happened between 8pm and 6am (NWO).

#### `Event.Time.Weekday().String() string`

Returns the day of the week as a string (`Monday`, `Tuesday` etc.).

> `filter: "evt.Meta.log_type == '...' && evt.Time.Weekday().String() in ['Saturday', 'Sunday']`

Will detect if the event happend over the weekend (NWD).

## Source specific helpers

### `Source.GetValue() string`

Return the `Source.Value` field value of a `Source`.

### `Source.GetScope() string`

Return the `Source.Scope` field value of `Source` (`ip`, `range` ...)

