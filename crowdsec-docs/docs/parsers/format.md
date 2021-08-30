---
id: format
title: Format
sidebar_position: 2
---

## Parser configuration example

A parser might look like:

```yaml
onsuccess: next_stage
debug: true
filter: "evt.Parsed.program == 'kernel'"
name: crowdsecurity/demo-iptables
description: "Parse iptables drop logs"
pattern_syntax:
  MYCAP: ".*"
grok:
  pattern: ^xxheader %{MYCAP:extracted_value} trailing stuff$
  apply_on: evt.Parsed.some_field
statics:
  - parsed: something
    expression: JsonExtract(evt.Event.extracted_value, "nested.an_array[0]")
  - meta: log_type
    value: parsed_testlog
  - meta: source_ip
    expression: "evt.Parsed.src_ip"
```

The parser nodes are processed sequentially based on the alphabetical order of [stages](/docs/parsers/intro#stages) and subsequent files.
If the node is considered successful (grok is present and returned data or no grok is present) and "onsuccess" equals to `next_stage`, then the event is moved to the next stage.

## Parser trees

A parser node can contain sub-nodes, to provide proper branching (on top of stages).
It can be useful when you want to apply different parsing based on different criterias, or when you have a set of candidates parsers that you want to apply to an event :

```yaml
#This first node will capture/extract some value
filter: "evt.Line.Labels.type == 'type1'"
name: tests/base-grok-root
pattern_syntax:
  MYCAP: ".*"
grok:
  pattern: ^... %{MYCAP:extracted_value} ...$
  apply_on: Line.Raw
statics:
  - meta: state
    value: root-done
  - meta: state_sub
    expression: evt.Parsed.extracted_value
---
#and this node will apply different patterns to it
filter: "evt.Line.Labels.type == 'type1' && evt.Meta.state == 'root-done'"
name: tests/base-grok-leafs
onsuccess: next_stage
#the sub-nodes will process the result of the master node
nodes:
  - filter: "evt.Parsed.extracted_value == 'VALUE1'"
    debug: true
    statics:
      - meta: final_state
        value: leaf1
  - filter: "evt.Parsed.extracted_value == 'VALUE2'"
    debug: true
    statics:
      - meta: final_state
        value: leaf2
```

The `tests/base-grok-root` node will be processed first and will alter the event (here mostly by extracting some text from the `Line.Raw` field into `Parsed` thanks to the `grok` pattern and the `statics` directive).

The event will then be parsed by the the following `tests/base-grok-leafs` node.
This node has `onsuccess` set to `next_stage` which means that if the node is successful, the event will be moved to the next stage.

A real-life example can be seen when it comes to parsing HTTP logs.
HTTP ACCESS and ERROR logs often have different formats, and thus our "nginx" parser needs to handle both formats
<details>
  <summary>Nginx parser</summary>

```yaml
filter: "evt.Parsed.program == 'nginx'"
onsuccess: next_stage
name: crowdsecurity/nginx-logs
nodes:
  - grok:
      #this is the access log
      name: NGINXACCESS
      apply_on: message
      statics:
        - meta: log_type
          value: http_access-log
        - target: evt.StrTime
          expression: evt.Parsed.time_local
  - grok:
        # and this one the error log
        name: NGINXERROR
        apply_on: message
        statics:
          - meta: log_type
            value: http_error-log
          - target: evt.StrTime
            expression: evt.Parsed.time
# these ones apply for both grok patterns
statics:
  - meta: service
    value: http
  - meta: source_ip
    expression: "evt.Parsed.remote_addr"
  - meta: http_status
    expression: "evt.Parsed.status"
  - meta: http_path
    expression: "evt.Parsed.request"
```
</details>

## Parser directives

### `debug`

```yaml
debug: true|false
```
_default: false_

If set to to `true`, enabled node level debugging.
It is meant to help understanding parser node behavior by providing contextual logging :
  
<details>
  <summary>assignments made by statics</summary>

```bash
DEBU[31-07-2020 16:36:28] + Processing 4 statics                        id=withered-rain name=crowdsecurity/nginx-logs stage=s01-parse
DEBU[31-07-2020 16:36:28] .Meta[service] = 'http'                       id=withered-rain name=crowdsecurity/nginx-logs stage=s01-parse
DEBU[31-07-2020 16:36:28] .Meta[source_ip] = '127.0.0.1'                id=withered-rain name=crowdsecurity/nginx-logs stage=s01-parse
DEBU[31-07-2020 16:36:28] .Meta[http_status] = '200'                    id=withered-rain name=crowdsecurity/nginx-logs stage=s01-parse
DEBU[31-07-2020 16:36:28] .Meta[http_path] = '/'                        id=withered-rain name=crowdsecurity/nginx-logs stage=s01-parse
```
</details>


<details>
  <summary>assignments made by grok pattern</summary>

```
DEBU[31-07-2020 16:36:28] + Grok 'NGINXACCESS' returned 10 entries to merge in Parsed  id=dark-glitter name=child-crowdsecurity/nginx-logs stage=s01-parse
DEBU[31-07-2020 16:36:28] 	.Parsed['time_local'] = '21/Jul/2020:16:13:05 +0200'  id=dark-glitter name=child-crowdsecurity/nginx-logs stage=s01-parse
DEBU[31-07-2020 16:36:28] 	.Parsed['method'] = 'GET'                    id=dark-glitter name=child-crowdsecurity/nginx-logs stage=s01-parse
DEBU[31-07-2020 16:36:28] 	.Parsed['request'] = '/'                     id=dark-glitter name=child-crowdsecurity/nginx-logs stage=s01-parse
DEBU[31-07-2020 16:36:28] 	.Parsed['http_user_agent'] = 'curl/7.58.0'   id=dark-glitter name=child-crowdsecurity/nginx-logs stage=s01-parse
DEBU[31-07-2020 16:36:28] 	.Parsed['remote_addr'] = '127.0.0.1'         id=dark-glitter name=child-crowdsecurity/nginx-logs stage=s01-parse
```
</details>

<details>
  <summary>debug of filters and expression results</summary>

```
DEBU[31-07-2020 16:36:28] eval(evt.Parsed.program == 'nginx') = TRUE    id=withered-rain name=crowdsecurity/nginx-logs stage=s01-parse
DEBU[31-07-2020 16:36:28] eval variables:                               id=withered-rain name=crowdsecurity/nginx-logs stage=s01-parse
DEBU[31-07-2020 16:36:28]        evt.Parsed.program = 'nginx'           id=withered-rain name=crowdsecurity/nginx-logs stage=s01-parse
```
</details>

-----

### `filter`

```yaml
filter: expression
```

`filter` must be a valid [expr](/docs/expr/helpers) expression that will be evaluated against the [event](/docs/expr/event).

If `filter` evaluation returns true or is absent, node will be processed.

If `filter` returns `false` or a non-boolean, node won't be processed.

Here is the [expr documentation](https://github.com/antonmedv/expr/tree/master/docs).

Examples :

 - `filter: "evt.Meta.foo == 'test'"`
 - `filter: "evt.Meta.bar == 'test' && evt.Meta.foo == 'test2'`

-----

### `grok`

#### `pattern`

A valid grok pattern

#### `expression`

A valid [expr](/docs/expr/helpers) expression that return a string to apply the pattern on.

#### `apply_on`

The field to apply the pattern on.

#### Examples

```yaml
grok:
  name: NAMED_EXISTING_PATTERN
  apply_on: source_field
```

```yaml
grok:
  pattern: ^a valid RE2 expression with %{CAPTURE:field}$
  expression: JsonExtract(evt.Line.Raw, "field.example")
```

```yaml
grok:
  pattern: ^a valid RE2 expression with %{CAPTURE:field}$
  apply_on: source_field
```

The `grok` structure in a node represent a regular expression with capture group (grok pattern) that must be applied on a field of event.

The pattern can : 

 - be imported by name (if present within the core of CrowdSec)
 - defined in place

In both case, the pattern must be a valid RE2 expression.
The field(s) returned by the regular expression are going to be merged into the `Parsed` associative array of the `Event`.


-----

### `name`

```yaml
name: explicit_string
```

The *mandatory* name of the node. If not present, node will be skipped at runtime.
It is used for example in debug log to help you track things.

-----

### `nodes`

```yaml
nodes:
 - filter: ...
   grok: ...
```

`nodes` is a list of parser nodes, allowing you to build trees.
Each subnode must be valid, and if any of the subnodes succeed, the whole node is considered successful. 

-----

### `onsuccess`

```yaml
onsuccess: next_stage|continue
```

_default: continue_

if set to `next_stage` and the node is considered successful, the {{v1X.event.name}} will be moved directly to the next stage without processing other nodes in the current stage. 

:::info

if it's a parser tree, and a "leaf" node succeeds, it is the parent's "onsuccess" that is evaluated.

:::

-----

### `pattern_syntax`

```yaml
pattern_syntax:
  CAPTURE_NAME: VALID_RE2_EXPRESSION
```

`pattern_syntax` allows user to define named capture group expressions for future use in grok patterns.
Regexp must be a valid RE2 expression.

```yaml
pattern_syntax:
  MYCAP: ".*"
grok:
  pattern: ^xxheader %{MYCAP:extracted_value} trailing stuff$
  apply_on: Line.Raw
```

-----

### `statics`

`statics` is a list of directives that will be evaluated when the node is considered successful.
Each entry of the list is composed of a `target` (where to write) and a `source` (what data to write).

#### `target`

The target can be defined by pointing directly a key in a dictionary (`Parsed`, `Enriched` or `Meta`), or by providing direct a `target` expression :

```yaml
meta: target_field
```

> `meta: source_ip` will set the value in `evt.Meta.source_ip`

```yaml
parsed: target_field
```

> `parsed: remote_addr` will set the value in `evt.Parsed.remote_addr`

```yaml
enriched: target_field
```

> `enriched: extra_info` will set the value in `evt.Enriched.extra_info`

```yaml
target: evt.Parsed.foobar
```

> `target: evt.Meta.foobar` will set the value in the `Meta[foobar]` entry

#### `source`

```yaml
value: <string_value_to_assign>
```

A static value.

```yaml
expression: <expr>
```

A valid [`expr`](https://github.com/antonmedv/expr) expression to eval. 
The result of the evaluation will be set in the target field.

#### Example

```yaml
statics:
 - target: evt.Meta.target_field
   value: static_value
 - meta: target_field
   expression: evt.Meta.target_field + ' this_is' + ' a dynamic expression'
 - enriched: target_field
   value: static_value
```

```yaml
statics:
  - meta: target_field
    value: static_value
  - meta: target_field
    expression: evt.Meta.another_field
  - meta: target_field
    expression: evt.Meta.target_field + ' this_is' + ' a dynamic expression'
```

-----

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
Without specifying a `type`, the file will be downloaded and stored as file and not in memory.


```yaml
name: crowdsecurity/cdn-whitelist
...
data:
  - source_url: https://www.cloudflare.com/ips-v4
    dest_file: cloudflare_ips.txt
    type: string
```


## Notes

A parser is considered "successful" if :

 - A grok pattern was present and successfully matched
 - No grok pattern was present
 
  
### Patterns documentation

You can find [exhaustive patterns documentation here](/docs/parsers/patterns).
