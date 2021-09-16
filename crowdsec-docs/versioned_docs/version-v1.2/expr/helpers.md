---
id: helpers
title: Helpers
sidebar_position: 3
---

> [antonmedv/expr](https://github.com/antonmedv/expr) - Expression evaluation engine for Go: fast, non-Turing complete, dynamic typing, static typing

Several components of CrowdSec's configuration use [Expr](https://github.com/antonmedv/expr), primarily:

 - [Filters](/parsers/format.md#filter) that are used to determine event eligibility in parsers, scenarios and profiles
 - [Statics](/parsers/format.md#statics) use Expr in the `expression` directive, to compute complex values
 - [Whitelists](/whitelist/introduction.md) rely on `expression` directive to allow more complex whitelists filters

To learn more about [Expr](https://github.com/antonmedv/expr), [check the GitHub page of the project](https://github.com/antonmedv/expr/blob/master/docs/Language-Definition.md).


When CrowdSec relies on `expr`, a context is provided to let the expression access relevant objects:

 - `evt.` is the representation of the current event and is the most relevant object
 - in [profiles](/profiles/intro.md), alerts are accessible via the `Alert` object

If the `debug` is enabled (in the scenario or parser where Expr is used), additional debug will be displayed regarding evaluated expressions.


# Helpers

In order to makes its use in CrowdSec more efficient, we added a few helpers that are documented below.

### `Atof(string) float64`

Parses a string representation of a float number to an actual float number (binding on `strconv.ParseFloat`)

> `Atof(evt.Parsed.tcp_port)`


### `JsonExtract(JsonBlob, FieldName) string`

Extract the `FieldName` from the `JsonBlob` and returns it as a string. (binding on [jsonparser](https://github.com/buger/jsonparser/))

> `JsonExtract(evt.Parsed.some_json_blob, "foo.bar[0].one_item")`

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

### `IpInRange(IPStr, RangeStr) bool`

Returns true if the IP `IPStr` is contained in the IP range `RangeStr` (uses `net.ParseCIDR`)

> `IpInRange("1.2.3.4", "1.2.3.0/24")`

### `TimeNow() string`

Return RFC3339 formatted time 

> `TimeNow()`
