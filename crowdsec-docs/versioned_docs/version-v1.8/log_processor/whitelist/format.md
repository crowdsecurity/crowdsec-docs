---
id: format
title: Format
sidebar_position: 2
---

## Whitelist configuration example

```yaml
name: "my/whitelist" ## Must be unique
description: "Whitelist events from my ipv4 addresses"
# This is a normal parser, so you can restrict its scope with a filter
filter: "1 == 1"
whitelist:
  reason: "my ipv4 ranges"
  ip: 
    - "127.0.0.1"
  cidr:
    - "192.168.0.0/16"
    - "10.0.0.0/8"
    - "172.16.0.0/12"
  expression:
  # Works only if reverse DNS enrichment (crowdsecurity/rdns) is enabled
    - evt.Enriched.reverse_dns endsWith ".mycoolorg.com."
  # Works only if geoip enrichment (crowdsecurity/geoip-enrich) is enabled
    - evt.Enriched.IsoCode == 'FR'
```

## Whitelist directives


### `name`

```yaml
name: my_author_name/my_whitelist_name
```

The `name` is mandatory.

It must be unique (it also defines the scenario name in the hub).


### `description`

```yaml
description: whitelist office
```

The `description` is mandatory.

It is a short sentence describing what it detects.


### `filter`

```yaml
filter: expression
```

`filter` must be a valid [expr](https://github.com/antonmedv/expr) expression that will be evaluated against the [event](/expr/event.md).

If `filter` evaluates to `true`, or is absent, the node is processed.

If `filter` evaluates to `false` or a non-boolean value, the node is not processed.

Here is the [expr documentation](https://github.com/antonmedv/expr/tree/master/docs).

Examples:

 - `filter: "evt.Enriched.foo == 'test'"`
 - `filter: "evt.Enriched.bar == 'test' && evt.Enriched.foo == 'test2'`


### `whitelist`

```yaml
whitelist:
  reason: "my ipv4 ranges"
  ip: 
    - "127.0.0.1"
  cidr:
    - "192.168.0.0/16"
    - "10.0.0.0/8"
    - "172.16.0.0/12"
  expression:
  # Works only if reverse DNS enrichment (crowdsecurity/rdns) is enabled
    - evt.Enriched.reverse_dns endsWith ".mycoolorg.com."
  # Works only if geoip enrichment (crowdsecurity/geoip-enrich) is enabled
    - evt.Enriched.IsoCode == 'FR'
```

#### `reason`

```yaml
reason: whitelist for test
```

The `reason` is mandatory.

It is a short sentence describing the reason for the whitelist.

#### `ip`

```yaml
whitelist:
  ip: 
    - "127.0.0.1"
```

List of IP addresses to whitelist.


#### `cidr`

```yaml
whitelist:
  cidr:
    - "192.168.0.0/16"
    - "10.0.0.0/8"
    - "172.16.0.0/12"
```

List of CIDR ranges to whitelist.


#### `expression`

```yaml
whitelist:
  expression:
  # Works only if reverse DNS enrichment (crowdsecurity/rdns) is enabled
    - evt.Enriched.reverse_dns endsWith ".mycoolorg.com."
  # Works only if geoip enrichment (crowdsecurity/geoip-enrich) is enabled
    - evt.Enriched.IsoCode == 'FR'
```

List of [expr](/expr/intro.md) expressions. If any expression evaluates to `true`, the event is whitelisted.


### `data`

```yaml
data:
  - source_url: https://URL/TO/FILE
    dest_file: LOCAL_FILENAME
    type: (regexp|string)
```

`data` lets you specify an external data source.
This section is only relevant when `cscli` is used to install parser from hub, as it will download the `source_url` and store it to `dest_file`. When the parser is not installed from the hub, CrowdSec won't download the URL, but the file must exist for the parser to be loaded correctly.

The `type` is mandatory if you want to evaluate the data in the file, and should be `regex` for valid (re2) regular expression per line or `string` for string per line.
The regexps will be compiled, the strings will be loaded into a list and both will be kept in memory.
Without specifying a `type`, the file will be downloaded and stored as a file and not in memory.


```yaml
name: crowdsecurity/cdn-whitelist
...
data:
  - source_url: https://www.cloudflare.com/ips-v4
    dest_file: cloudflare_ips.txt
    type: string
```
