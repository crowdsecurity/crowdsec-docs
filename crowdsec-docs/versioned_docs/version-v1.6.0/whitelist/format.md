---
id: format
title: Format
sidebar_position: 2
---

## Whitelist configuration example

```yaml
name: crowdsecurity/my-whitelists
description: "Whitelist events from my ipv4 addresses"
#it's a normal parser, so we can restrict its scope with filter
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
  #beware, this one will work *only* if you enabled the reverse dns (crowdsecurity/rdns) enrichment postoverflow parser
    - evt.Enriched.reverse_dns endsWith ".mycoolorg.com."
  #this one will work *only* if you enabled the geoip (crowdsecurity/geoip-enrich) enrichment parser
    - evt.Enriched.IsoCode == 'FR'
```

## Whitelist directives


### `name`

```yaml
name: my_author_name/my_whitelist_name
```

The `name` is mandatory. 

It must be unique (and will define the scenario's name in the hub). 


### `description`

```yaml
description: whitelist office
```

The `description` is mandatory.

It is a quick sentence describing what it detects.


### `filter`

```yaml
filter: expression
```

`filter` must be a valid [expr](https://github.com/antonmedv/expr) expression that will be evaluated against the [event](/expr/event.md).

If `filter` evaluation returns true or is absent, node will be processed.

If `filter` returns `false` or a non-boolean, node won't be processed.

Here is the [expr documentation](https://github.com/antonmedv/expr/tree/master/docs).

Examples :

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
  #beware, this one will work *only* if you enabled the reverse dns (crowdsecurity/rdns) enrichment postoverflow parser
    - evt.Enriched.reverse_dns endsWith ".mycoolorg.com."
  #this one will work *only* if you enabled the geoip (crowdsecurity/geoip-enrich) enrichment parser
    - evt.Enriched.IsoCode == 'FR'
```

#### `reason`

```yaml
reason: whitelist for test
```

The `reason` is mandatory.

It is a quick sentence describing the reason of the whitelist.

#### `ip`

```yaml
whitelist:
  ip: 
    - "127.0.0.1"
```

A valid [expr](/expr/intro.md) expression that return a string to apply the pattern on.


#### `cidr`

```yaml
whitelist:
  cidr:
    - "192.168.0.0/16"
    - "10.0.0.0/8"
    - "172.16.0.0/12"
```

A valid [expr](/expr/intro.md) expression that return a string to apply the pattern on.


#### `expression`

```yaml
whitelist:
  expression:
  #beware, this one will work *only* if you enabled the reverse dns (crowdsecurity/rdns) enrichment postoverflow parser
    - evt.Enriched.reverse_dns endsWith ".mycoolorg.com."
  #this one will work *only* if you enabled the geoip (crowdsecurity/geoip-enrich) enrichment parser
    - evt.Enriched.IsoCode == 'FR'
```

A valid [expr](/expr/intro.md) expression that return a string to apply the pattern on.


### `data`

```yaml
data:
  - source_url: https://URL/TO/FILE
    dest_file: LOCAL_FILENAME
    type: (regexp|string)
```

`data` allows user to specify an external source of data.
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
