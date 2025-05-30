---
id: format
title: Format
sidebar_position: 2
---

## Scenario configuration example

A way to detect a http scanner might be to track the number of distinct non-existing pages it's requesting. The scenario might look like this:

```yaml
type: leaky
name: crowdsecurity/http-scan-uniques_404
description: "Detect multiple unique 404 from a single ip"
filter: "evt.Meta.service == 'http' && evt.Meta.http_status in ['404', '403', '400']"
groupby: "evt.Meta.source_ip"
distinct: "evt.Meta.http_path"
capacity: 5
leakspeed: "10s"
blackhole: 5m
labels:
 service: http
 type: scan
 remediation: true
```

## Scenario directives


### `type`


```yaml
type: leaky|trigger|counter|conditional
```

Defines the type of the bucket. Currently three types are supported :

 - `leaky` : a [leaky bucket](https://en.wikipedia.org/wiki/Leaky_bucket) that must be configured with a [capacity](#capacity) and a [leakspeed](#leakspeed)
 - `trigger` : a bucket that overflows as soon as an event is poured (it is like a leaky bucket is a capacity of 0)
 - `counter` : a bucket that only overflows every [duration](#duration). It is especially useful to count things.
 - `conditional`: a bucket that overflows when the expression given in `condition` returns true. Useful if you want to look back at previous events that were poured to the bucket (to detect impossible travel or more behavioral patterns for example). If the capacity is not set to `-1`, it can overflow like a standard `leaky` bucket.

---
### `name`

```yaml
name: github_account_name/my_scenario_name
```
or

```yaml
name: my_author_name/my_scenario_name
```

The `name` is mandatory. 

It must be unique. This will define the scenario's name in the hub. 

---
### `description`

```yaml
description: A scenario that detect XXXX behavior
```

The `description` is mandatory.

It is a short description, probably one sentence, describing what it detects.

---
### `references`

```yaml
references: 
  - A reference to third party documents. 
```

The `references` is optional.

A reference to third party documents. This is a list of string.

---
### `filter`

```yaml
filter: expression
```

`filter` must be a valid [expr](/expr/helpers.md) expression that will be evaluated against the event.

If `filter` evaluation returns true or is absent, event will be pour in the bucket.

If `filter` returns `false` or a non-boolean, the event will be skipped for this bucket.

Here is the [expr documentation](https://github.com/antonmedv/expr/tree/master/docs).

Examples :

  - `evt.Meta.log_type == 'telnet_new_session'`
  - `evt.Meta.log_type in ['http_access-log', 'http_error-log'] && evt.Parsed.static_ressource == 'false'`
  - `evt.Meta.log_type == 'ssh_failed-auth'`


---
### `duration`

```yaml
duration: 45s
duration: 10m
```

Only applies to `counter` buckets.

A duration after which the bucket will overflow.
The format must be compatible with [golang ParseDuration format](https://golang.org/pkg/time/#ParseDuration)

Examples :

```yaml
type: counter
name: crowdsecurity/ban-reports-ssh_bf_report
description: "Count unique ips performing ssh bruteforce"
filter: "evt.Overflow.Scenario == 'ssh_bruteforce'"
distinct: "evt.Overflow.Source_ip"
capacity: -1
duration: 10m
labels:
  service: ssh
```

---
### `groupby`

```yaml
groupby: evt.Meta.source_ip
```


An [expression](/expr/helpers.md) that must return a string. This string will be used as a partition for the buckets.


#### Examples

Here, each `source_ip` will get its own bucket.
```yaml
type: leaky
...
groupby: evt.Meta.source_ip
...
```

Here, each unique combo of `source_ip` + `target_username` will get its own bucket.
```yaml
type: leaky
...
groupby: evt.Meta.source_ip + '--' + evt.Parsed.target_username
...
```


---
### `distinct`


```yaml
distinct: evt.Meta.http_path
```


An [expression](/expr/helpers.md) that must return a string. The event will be poured **only** if the string is not already present in the bucket.

#### Examples

This will ensure that events that keep triggering the same `.Meta.http_path` will be poured only once.

```yaml
type: leaky
...
distinct: "evt.Meta.http_path"
...
```

Assuming we received the 3 following events :
 - `evt.Meta.http_path = /`
 - `evt.Meta.http_path = /test`
 - `evt.Meta.http_path = /`

Only the first 2 events will be poured to the bucket.

The 3rd one will not be poured as the bucket already contains an event with `evt.Meta.http_path == /`

---
### `capacity`

```yaml
capacity: 5
```

Only applies to `leaky` buckets.

A positive integer representing the bucket capacity.
If there are more than `capacity` item in the bucket, it will overflow.
Should be set to `-1` in most situations for `conditional` buckets.

---
### `leakspeed`

```yaml
leakspeed: "10s"
```

Only applies to `leaky` buckets.

A duration that represent how often an event will be leaking from the bucket.

Must be compatible with [golang ParseDuration format](https://golang.org/pkg/time/#ParseDuration).

### `condition`
```yaml
condition: |
  len(queue.Queue) >= 2 
  and Distance(queue.Queue[-1].Enriched.Latitude, queue.Queue[-1].Enriched.Longitude,
  queue.Queue[-2].Enriched.Latitude, queue.Queue[-2].Enriched.Longitude) > 100
```

Only applies to `conditional` buckets.

Make the bucket overflow when it returns true.
The expression is evaluated each time an event is poured to the bucket.


#### Example

The bucket will leak one item every 10 seconds, and can hold up to 5 items before overflowing.

```yaml
type: leaky
...
leakspeed: "10s"
capacity: 5
...
```

![timeline](/img/leakspeed-schema.png)

 - The bucket is created at `t+0s`
 - _E0_ is poured at `t+2s`, bucket is at 1/5 capacity
 - _E1_ is poured at `t+4s`, bucket is at 2/5 capacity
 - At `t+10s` the bucket leaks one item, is now at 1/5 capacity
 - _E2_ is poured at `t+11s`, bucket is at 2/5 capacity
 - _E3_ and _E4_ are poured around `t+16s`, bucket is at 4/5 capacity
 - At `t+20s` the bucket leaks one item, is now at 3/5 capacity
 - _E5_ and _E6_ are poured at `t+23s`, bucket is at 5/5 capacity
 - when _E7_ is poured at `t+24s`, the bucket is at 6/5 capacity and overflows


---
### `labels`

```yaml
labels:
 service: ssh
 type: bruteforce
 remediation: true
```

Labels is a list of `label: values` that provide context to an overflow.
The labels are (currently) not stored in the database, nor they are sent to the API.

##### Special labels :

 - The **remediation** label, if set to `true` indicate the the originating IP should be banned.

#### Example

The IP address that triggered the overflow (`.Meta.source_ip`) will be banned.
```yaml
type: leaky
...
labels:
 service: ssh
 type: bruteforce
 remediation: true
```

---
### `blackhole`

```yaml
blackhole: 10m
```

A duration for which a bucket will be "silenced" after overflowing.
This is intended to limit / avoid spam of buckets that might be very rapidly triggered.

The blackhole only applies to the individual bucket rather than the whole scenario.

Must be compatible with [golang ParseDuration format](https://golang.org/pkg/time/#ParseDuration).

#### Example

The same `source_ip` won't be able to trigger this overflow more than once every 10 minutes.
The potential overflows in the meanwhile will be discarded (but will still appear in logs as being blackholed).

```yaml
type: trigger
...
blackhole: 10m
groupby: evt.Meta.source_ip
```

---
### `debug`

```yaml
debug: true|false
```

_default: false_


If set to to `true`, enabled scenario level debugging.
It is meant to help understanding scenario  behavior by providing contextual logging :

<details>
<summary>debug of filters and expression results</summary>
<div>

```log
DEBU[31-07-2020 16:34:58] eval(evt.Meta.log_type in ["http_access-log", "http_error-log"] && any(File("bad_user_agents.txt"), {evt.Parsed.http_user_agent contains #})) = TRUE  cfg=still-feather file=config/scenarios/http-bad-user-agent.yaml name=crowdsecurity/http-bad-user-agent
DEBU[31-07-2020 16:34:58] eval variables:                               cfg=still-feather file=config/scenarios/http-bad-user-agent.yaml name=crowdsecurity/http-bad-user-agent
DEBU[31-07-2020 16:34:58]        evt.Meta.log_type = 'http_access-log'  cfg=still-feather file=config/scenarios/http-bad-user-agent.yaml name=crowdsecurity/http-bad-user-agent
DEBU[31-07-2020 16:34:58]        evt.Parsed.http_user_agent = 'Mozilla/5.00 (Nikto/2.1.5) (Evasions:None) (Test:002810)'  cfg=still-feather file=config/scenarios/http-bad-user-agent.yaml name=crowdsecurity/http-bad-user-agent
```

</div>
</details>

---
### `reprocess`

```yaml
reprocess: true|false
```

_default: false_

If set to `true`, the resulting overflow will be sent again in the scenario/parsing pipeline.
It is useful when you want to have further scenarios that will rely on past-overflows to take decisions.

---
### `cache_size`

```yaml
cache_size: 5
```

By default, a bucket holds [capacity](format#capacity) events "in memory".
However, for a number of cases, you don't want this, as it might lead to excessive memory consumption.

By setting `cache_size` to a positive integer, we can control the maximum in-memory cache size of the bucket, without changing its capacity and such. It is useful when buckets are likely to stay alive for a long time or ingest a lot of events to avoid storing a lot of events in memory.

---
### `overflow_filter`

```yaml
overflow_filter: any(queue.Queue, { .Enriched.IsInEU  == "true" })
```

`overflow_filter` is an [expression](/expr/helpers.md) that is run when the bucket overflows.
If this expression is present and returns false, the overflow will be discarded.

---
### `cancel_on`

```yaml
cancel_on: evt.Parsed.something == 'somevalue'
```

`cancel_on` is an [expression](/expr/helpers.md) that runs on each event poured to the bucket.
If the `cancel_on` expression returns true, the bucket is immediately destroyed (and doesn't overflow).


---
### `data`

```yaml
data:
  - source_url: https://URL/TO/FILE
    dest_file: LOCAL_FILENAME
    [type: (regexp|string)]    
```

`data` allows to specify an external source of data.

This section is only relevant when `cscli` is used to install scenario from hub, as it will download the `source_url` and store it to `dest_file`. 

When the scenario is not installed from the hub, CrowdSec won't download the URL, but the file must exist for the scenario to be loaded correctly.

The `type` is mandatory if you want to evaluate the data in the file, and should be `regex` for valid (re2) regular expression per line or `string` for string per line.

The regexps will be compiled, the strings will be loaded into a list and both will be kept in memory.
Without specifying a `type`, the file will be downloaded and stored as file and not in memory.

You can refer to the content of the downloaded file(s) by using either the `File()` or `RegexpInFile()` function in an expression:

```yaml
filter: 'evt.Meta.log_type in ["http_access-log", "http_error-log"] and any(File("backdoors.txt"), { evt.Parsed.request contains #})'
```

#### Example

```yaml
name: crowdsecurity/cdn-whitelist
...
data:
  - source_url: https://www.cloudflare.com/ips-v4
    dest_file: cloudflare_ips.txt
    type: string
```

#### Caching feature

Since 1.5, it is possible to configure additional cache for `RegexpInFile()` :

 - input data (hashed with [xxhash](https://github.com/cespare/xxhash))
 - associated result (true or false)

[Cache behavior](https://pkg.go.dev/github.com/bluele/gcache) can be configured:
 - strategy: LRU, LFU or ARC
 - size: maximum size of cache
 - ttl: expiration of elements
 - cache: boolean (true by default if one of the fields is set)

This is typically useful for scenarios that needs to check on a lot of regexps.

Example configuration:

```yaml
type: leaky
#...
data:
  - source_url: https://raw.githubusercontent.com/crowdsecurity/sec-lists/master/web/bad_user_agents.regex.txt
    dest_file: bad_user_agents.regex.txt
    type: regexp
    strategy: LRU
    size: 40
    ttl: 5s
```

---
### `format`

```yaml
format: 2.0
```

CrowdSec has a notion of format support for parsers and scenarios for compatibility management.
Running `cscli version` will show you such compatibility matrix :

```bash
sudo cscli version
2020/11/05 09:35:05 version: v0.3.6-183e34c966c475e0d2cdb3c60d0b7426499aa573
2020/11/05 09:35:05 Codename: beta
2020/11/05 09:35:05 BuildDate: 2020-11-04_17:56:46
2020/11/05 09:35:05 GoVersion: 1.13
2020/11/05 09:35:05 Constraint_parser: >= 1.0, < 2.0
2020/11/05 09:35:05 Constraint_scenario: >= 1.0, < 3.0
2020/11/05 09:35:05 Constraint_api: v1
2020/11/05 09:35:05 Constraint_acquis: >= 1.0, < 2.0
```

---
### `scope`

```yaml
scope:
  type: Range
  expression: evt.Parsed.mySourceRange
```

While most scenarios might focus on IP addresses, CrowdSec and Bouncers can work with any scope.
The `scope` directive allows you to override the default scope :

 - `type` is a string representing the scope name
 - `expression` is an `expr` expression that will be evaluated to fetch the value


let's imagine a scenario such as :

```yaml
# ssh bruteforce
type: leaky
name: crowdsecurity/ssh-enforce-mfa
description: "Enforce mfa on users that have been bruteforced"
filter: "evt.Meta.log_type == 'ssh_failed-auth'"
leakspeed: "10s"
capacity: 5
groupby: evt.Meta.source_ip
blackhole: 1m
labels:
 service: ssh
 type: bruteforce
 remediation: true
scope:
 type: username
 expression: evt.Meta.target_user
```

and a profile such as :

```yaml
name: enforce_mfa
filters:
 - 'Alert.Remediation == true && Alert.GetScope() == "username"'
decisions:
 - type: enforce_mfa
   scope: "username"
   duration: 1h
on_success: continue
```

the resulting overflow will be :

```bash
$ ./cscli -c dev.yaml decisions list
+----+----------+---------------+-------------------------------+-------------+---------+----+--------+------------------+
| ID |  SOURCE  |  SCOPE:VALUE  |            REASON             |   ACTION    | COUNTRY | AS | EVENTS |    EXPIRATION    |
+----+----------+---------------+-------------------------------+-------------+---------+----+--------+------------------+
|  2 | crowdsec | username:rura | crowdsecurity/ssh-enforce-mfa | enforce_mfa |         |    |      6 | 59m46.121840343s |
```

