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

## Logs & Alerts Helpers

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

### `GetMeta(Key) Value`

Returns the first value for the `Key` Meta if it exists in the event.

> `evt.GetMeta("foobar")`

### `SetMeta(key, value) bool`

Sets the value of `key` to `value` in the Meta map.

> `evt.SetMeta('foobar', 'toto)`


### `GetType() String`

Returns the type of event, `overflow`, `appsec` or `log`.

> `evt.GetType() in ["log", "appsec"]`

### `ParseIPSources() []net.IP`

Returns the list of IPs attached to the event, for both `overflow` and `log` type.


### `SetParsed(key, value) bool`

Sets the value of `key` to `value` in the Parsed map.

## Appsec Helpers

If the `Event` is the result of a rule being, matched, `Event.Appsec` is present.

### `Appsec.GetVar(name) value`

Returns the `value` of the Appsec var `name`. 

> `evt.Appsec.GetVar("foobar")`

### `Appsec.MatchedRules`

`MatchedRules` is the list of rules that matched in the HTTP Request. It is an array of `map`, and each entry contains the following keys:

 - `id`, `name`, `msg`, `rule_type`, `tags`, `file`, `confidence`, `revision`, `secmark`, `accuracy`, `severity`, `kind`

> `evt.Appsec.MatchedRules` and use below functions

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

## Source specific helpers

### `Source.GetValue() string`

Return the `Source.Value` field value of a `Source`.

### `Source.GetScope() string`

Return the `Source.Scope` field value of `Source` (`ip`, `range` ...)


