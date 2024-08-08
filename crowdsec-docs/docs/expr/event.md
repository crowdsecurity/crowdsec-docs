---
id: event
title: Event
sidebar_position: 2
---

# Introduction

An `Event` is the runtime representation of an item being processed by crowdsec. It can represent:

 - a Log line being parsed: `Type` is set to `log`, and `Line`, `Parsed` and `Meta` are populated
 - an appsec rule match (`Appsec` holds the WAF rule match info)
 - an overflow being reprocessed (`Overflow` is used)


The `Event` object is modified by parsers, scenarios, and passed along. [The representation of the object can be found here : Event object documentation](https://pkg.go.dev/github.com/crowdsecurity/crowdsec/pkg/types#Event).



## Event Object : Log Line

When `Event` is a log line, `evt.GetType()` returns `log`, and the following fields are used:
 - `Meta` and `Parsed` maps are holding parsing results.
 - `Line` holds the representation of the original Log line.

## Event Object : Overflow

When `Event` is an overflow being reprocessed (`reprocess: true` in the originating scenario), `evt.GetType()` returns `appsec`, and [the `Overflow` object is used.](https://pkg.go.dev/github.com/crowdsecurity/crowdsec/pkg/types#RuntimeAlert)


## Event Object : Appsec

When `Event` is an event from the WAF/Appsec engine, `evt.GetType()` returns `appsec`, and [the `Appsec` field](https://pkg.go.dev/github.com/crowdsecurity/crowdsec/pkg/types#AppsecEvent) is used, [more specifically `Appsec.MatchedRules`.](https://pkg.go.dev/github.com/crowdsecurity/crowdsec/pkg/types#MatchedRules)


## Event Methods

### `GetMeta(Key) Value`

Returns the first value for the `Key` Meta if it exists in the event.

> `evt.GetMeta("foobar")`

### `SetMeta(key, value) bool`

Sets the value of `key` to `value` in the Meta map.


### `GetType() String`

Returns the type of event, `overflow` or `log`.

### `ParseIPSources() []net.IP`

Returns the list of IPs attached to the event, for both `overflow` and `log` type.


### `SetParsed(key, value) bool`

Sets the value of `key` to `value` in the Parsed map.

## Appsec Helpers

If the `Event` is the result of a rule being, matched, `Event.Appsec` is present.

### `Appsec.GetVar(name) value`

Returns the `value` of the Appsec var `name`. 

### `Appsec.MatchedRules`

`MatchedRules` is the list of rules that matched in the HTTP Request. It is an array of `map`, and each entry contains the following keys:

 - `id`, `name`, `msg`, `rule_type`, `tags`, `file`, `confidence`, `revision`, `secmark`, `accuracy`, `severity`, `kind`

Various filtering methods are available:
 - `MatchedRules.ByAccuracy(accuracy string) MatchedRules`
 - `MatchedRules.ByDisruptiveness(is bool) MatchedRules`
 - `MatchedRules.ByID(id int) MatchedRules`
 - `MatchedRules.ByKind(kind string) MatchedRules`
 - `MatchedRules.BySeverity(severity string) MatchedRules`
 - `MatchedRules.ByTag(match string) MatchedRules`
 - `MatchedRules.ByTagRx(rx string) MatchedRules`
 - `MatchedRules.ByTags(match []string) MatchedRules`
 - `MatchedRules.GetField(field Field) []interface{}`
 - `MatchedRules.GetHash() string`
 - `MatchedRules.GetMatchedZones() []string`
 - `MatchedRules.GetMethod() string`
 - `MatchedRules.GetName() string`
 - `MatchedRules.GetRuleIDs() []int`
 - `MatchedRules.GetURI() string`
 - `MatchedRules.GetVersion() string`
 - `MatchedRules.Kinds() []string`

Example usage would be to have `on_match` rules to alter the WAF remediation:

```yaml
on_match:
 - filter: |
    any( evt.Appsec.MatchedRules, #.name == "crowdsecurity/vpatch-env-access") and
    ...
   apply:
    - SetRemediation("allow")
```

You can view detailed [`MatchedRules` doc here](https://pkg.go.dev/github.com/crowdsecurity/crowdsec/pkg/types#MatchedRules).



<!-- ## LOG relevant fields

 - `Type` is `types.LOG`
 - `Whitelisted` : if `true` the LOG or OVFLW will be dropped
 - `Line` : representation of the raw line
    - `Raw` : the raw line representation
    - `Src` : a label for the source
    - `Time` : acquisition timestamp
    - `Labels` : the static labels (from acquis.yaml) associated to the source
    - `Process`: if set to false, processing of line will stop
 - `Parsed` : a `map[string]string` that can be used during parsing and enrichment. This is where GROK patterns will output their captures by default
 - `Enriched` : a `map[string]string` that can be used during parsing and enrichment. This is where enrichment functions will output their captures by default
 - `Meta` : a `map[string]string` that can be used to store *important* information about a log. This map is serialized into DB when storing event.
 - `Overflow` : representation of an Overflow if `Type` is set to `OVFLW`
 - `Time` : processing timestamp
 - `StrTime` : string representation of log timestamp. Can be set by parsers that capture timestamp in logs. Will be automatically processed by `crowdsecurity/dateparse-enrich` when processing logs in forensic mode to set `MarshaledTime`
 - `MarshaledTime` : if non-empty, the event's timestamp that will be used when processing buckets (for forensic mode)
 - `Appsec` : Appsec related fields
 
## OVERFLOW relevant fields

 - `Type` is `types.OVFLW`
 - `Whitelisted` : if `true` the LOG or OVFLW will be dropped
 - `Overflow` : representation of an Overflow if `Type` is set to `OVFLW`
 - `Time` : processing timestamp
 - `StrTime` : string representation of log timestamp. Can be set by parsers that capture timestamp in logs. Will be automatically processed by `crowdsecurity/dateparse-enrich` when processing logs in forensic mode to set `MarshaledTime`
 - `MarshaledTime` : if non-empty, the event's timestamp that will be used when processing buckets (for forensic mode)
 - `Overflow` : 
    - `Whitelisted` : if true the OVFLW will be dropped
    - `Reprocess` : if true, the OVFLOW will be reprocessed (inference)
    - `Sources` : a `map[string]models.Source` representing the distinct sources that triggered the overflow, with their types and values. The key of the map is the IP address.
    - `Alert` and `APIAlerts` : representation of the signals that will be sent to LAPI.

[Here](https://pkg.go.dev/github.com/crowdsecurity/crowdsec/pkg/types#RuntimeAlert) is full `evt.Overflow` object representation.

## Methods

 - `GetMeta(key string) string`  


## Source

[Here](https://pkg.go.dev/github.com/crowdsecurity/crowdsec/pkg/models#Source) is the representation of a `models.Source` object. -->