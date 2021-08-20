---
id: create
title: Creating parsers
sidebar_position: 4
---

:::note
The guide assume you're writting the parser from the [test environment](/docs/user_guides/test_env)
:::

## Base parser file

A simple parser can be defined as :

```yaml
filter: 1 == 1
debug: true
onsuccess: next_stage
name: me/myparser
description: a cool parser for my service
grok:
#our grok pattern : capture .*
  pattern: ^%{DATA:some_data}$
#the field to which we apply the grok pattern : the log message itself
  apply_on: message
statics:
  - parsed: is_my_service
    value: yes
```

 - a [filter](format#filter) : if the expression is `true`, the event will enter the parser, otherwise, it won't
 - a [onsuccess](format#onsuccess) : defines what happens when the event was successfully parsed : shall we continue ? shall we move to next stage ? etc.
 - a `name` & a `description`
 - some [statics](format#statics) that will modify the event
 - a `debug` flag that allows to enable local debugging information
 - a `grok` pattern to capture some data in logs

We are going to use to following sample log as an example (`x.out`) :
```bash
May 11 16:23:43 sd-126005 kernel: [47615895.771900] IN=enp1s0 OUT= MAC=00:08:a2:0c:1f:12:00:c8:8b:e2:d6:87:08:00 SRC=99.99.99.99 DST=127.0.0.1 LEN=40 TOS=0x00 PREC=0x00 TTL=245 ID=51006 PROTO=TCP SPT=45225 DPT=8888 WINDOW=1024 RES=0x00 SYN URGP=0 
May 11 16:23:50 sd-126005 kernel: [47615902.763137] IN=enp1s0 OUT= MAC=00:08:a2:0c:1f:12:00:c8:8b:e2:d6:87:08:00 SRC=44.44.44.44 DST=127.0.0.1 LEN=60 TOS=0x00 PREC=0x00 TTL=49 ID=17451 DF PROTO=TCP SPT=53668 DPT=80 WINDOW=14600 RES=0x00 SYN URGP=0 
```

## Trying our mock parser

:::caution
Your parser yaml file must be in the `config/parsers/s01-parse/` directory. The stage directory might not exist, and then you must create it.

:::

Let's try it:

```bash             
./crowdsec -c ./dev.yaml -dsn file://x.log -type foobar
```

<details>
  <summary>Expected output</summary>

```bash
INFO[20-08-2021 17:18:20] Crowdsec v1.1.1-linux-73e0bbaf93070f4a640eb5a22212b5dcf26699de 
INFO[20-08-2021 17:18:21] reading x.log at once                         type="file://x.log"
DEBU[20-08-2021 17:18:21] + Grok '^%{DA...' returned 1 entries to merge in Parsed  id=billowing-flower name=me/myparser stage=s01-parse
DEBU[20-08-2021 17:18:21] 	.Parsed['some_data'] = 'May 11 16:23:43 sd-126005 kernel: [47615895.771900] IN=enp1s0 OUT= MAC=00:08:a2:0c:1f:12:00:c8:8b:e2:d6:87:08:00 SRC=99.99.99.99 DST=127.0.0.1 LEN=40 TOS=0x00 PREC=0x00 TTL=245 ID=51006 PROTO=TCP SPT=45225 DPT=8888 WINDOW=1024 RES=0x00 SYN URGP=0 '  id=billowing-flower name=me/myparser stage=s01-parse
DEBU[20-08-2021 17:18:21] + Processing 1 statics                        id=billowing-flower name=me/myparser stage=s01-parse
DEBU[20-08-2021 17:18:21] .Parsed[is_my_service] = 'yes'                id=billowing-flower name=me/myparser stage=s01-parse
DEBU[20-08-2021 17:18:21] Event leaving node : ok                       id=billowing-flower name=me/myparser stage=s01-parse
DEBU[20-08-2021 17:18:21] move Event from stage s01-parse to s02-enrich  id=billowing-flower name=me/myparser stage=s01-parse
DEBU[20-08-2021 17:18:21] + Grok '^%{DA...' returned 1 entries to merge in Parsed  id=billowing-flower name=me/myparser stage=s01-parse
DEBU[20-08-2021 17:18:21] 	.Parsed['some_data'] = 'May 11 16:23:50 sd-126005 kernel: [47615902.763137] IN=enp1s0 OUT= MAC=00:08:a2:0c:1f:12:00:c8:8b:e2:d6:87:08:00 SRC=44.44.44.44 DST=127.0.0.1 LEN=60 TOS=0x00 PREC=0x00 TTL=49 ID=17451 DF PROTO=TCP SPT=53668 DPT=80 WINDOW=14600 RES=0x00 SYN URGP=0'  id=billowing-flower name=me/myparser stage=s01-parse
DEBU[20-08-2021 17:18:21] + Processing 1 statics                        id=billowing-flower name=me/myparser stage=s01-parse
DEBU[20-08-2021 17:18:21] .Parsed[is_my_service] = 'yes'                id=billowing-flower name=me/myparser stage=s01-parse
DEBU[20-08-2021 17:18:21] Event leaving node : ok                       id=billowing-flower name=me/myparser stage=s01-parse
DEBU[20-08-2021 17:18:21] move Event from stage s01-parse to s02-enrich  id=billowing-flower name=me/myparser stage=s01-parse
...
```
</details>


We can see our "mock" parser is working, let's see what happened :

 - The event enter the node
 - The `filter` returned true (`1 == 1`) so the event will be processed
 - Our grok pattern (just a `.*` capture) "worked" and captured data (the whole line actually)
 - The grok captures (under the name `some_data`) are merged into the `.Parsed` map of the event
 - The `statics` section is processed, and `.Parsed[is_my_service]` is set to `yes`
 - The event leaves the parser successfully, and because `onsuccess` is set to `next_stage`, the event moves to the next stage

## Writing the GROK pattern

We are going to write a parser for `iptables` logs, they look like this :

```
May 11 16:23:43 sd-126005 kernel: [47615895.771900] IN=enp1s0 OUT= MAC=00:08:a2:0c:1f:12:00:c8:8b:e2:d6:87:08:00 SRC=99.99.99.99 DST=127.0.0.1 LEN=40 TOS=0x00 PREC=0x00 TTL=245 ID=51006 PROTO=TCP SPT=45225 DPT=8888 WINDOW=1024 RES=0x00 SYN URGP=0 
May 11 16:23:50 sd-126005 kernel: [47615902.763137] IN=enp1s0 OUT= MAC=00:08:a2:0c:1f:12:00:c8:8b:e2:d6:87:08:00 SRC=44.44.44.44 DST=127.0.0.1 LEN=60 TOS=0x00 PREC=0x00 TTL=49 ID=17451 DF PROTO=TCP SPT=53668 DPT=80 WINDOW=14600 RES=0x00 SYN URGP=0 

```

Using an [online grok debugger](https://grokdebug.herokuapp.com/) or an [online regex debugger](https://www.debuggex.com/), we come up with the following grok pattern :

```
\[%{DATA}\]+.*(%{WORD:action})? IN=%{WORD:int_eth} OUT= MAC=%{IP}:%{MAC} SRC=%{IP:src_ip} DST=%{IP:dst_ip} LEN=%{INT:length}.*PROTO=%{WORD:proto} SPT=%{INT:src_port} DPT=%{INT:dst_port}.*
```

:::warning
Check if the pattern you are looking for is not already present in [patterns configuration](https://github.com/crowdsecurity/crowdsec/tree/master/config/patterns).
:::

## Test our new pattern

Now, let's integrate our GROK pattern within our YAML :

```yaml
#let's set onsuccess to "next_stage" : if the log is parsed, we can consider it has been dealt with
onsuccess: next_stage
#debug, for reasons (don't do this in production)
debug: true
#as seen in our sample log, those logs are processed by the system and have a progname set to 'kernel'
filter: "1 == 1"
#name and description:
name: crowdsecurity/iptables-logs
description: "Parse iptables drop logs"
grok:
#our grok pattern
  pattern: \[%{DATA}\]+.*(%{WORD:action})? IN=%{WORD:int_eth} OUT= MAC=%{IP}:%{MAC} SRC=%{IP:src_ip} DST=%{IP:dst_ip} LEN=%{INT:length}.*PROTO=%{WORD:proto} SPT=%{INT:src_port} DPT=%{INT:dst_port}.*
#the field to which we apply the grok pattern : the log message itself
  apply_on: message
statics:
  - parsed: is_my_service
    value: yes
```


```bash
./crowdsec -c ./dev.yaml -dsn file://x.log -type foobar
```


<details>
  <summary>Expected output</summary>



 
```bash
INFO[20-08-2021 17:47:46] reading x.log at once                         type="file://x.log"
DEBU[20-08-2021 17:47:46] + Grok '[%{D...' returned 8 entries to merge in Parsed  id=summer-snowflake name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:47:46] 	.Parsed['proto'] = 'TCP'                     id=summer-snowflake name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:47:46] 	.Parsed['src_port'] = '45225'                id=summer-snowflake name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:47:46] 	.Parsed['dst_port'] = '8888'                 id=summer-snowflake name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:47:46] 	.Parsed['action'] = ''                       id=summer-snowflake name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:47:46] 	.Parsed['int_eth'] = 'enp1s0'                id=summer-snowflake name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:47:46] 	.Parsed['src_ip'] = '99.99.99.99'            id=summer-snowflake name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:47:46] 	.Parsed['dst_ip'] = '127.0.0.1'              id=summer-snowflake name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:47:46] 	.Parsed['length'] = '40'                     id=summer-snowflake name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:47:46] + Processing 1 statics                        id=summer-snowflake name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:47:46] .Parsed[is_my_service] = 'yes'                id=summer-snowflake name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:47:46] Event leaving node : ok                       id=summer-snowflake name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:47:46] move Event from stage s01-parse to s02-enrich  id=summer-snowflake name=crowdsecurity/iptables-logs stage=s01-parse
WARN[20-08-2021 17:47:46] Acquisition is finished, shutting down       
DEBU[20-08-2021 17:47:46] + Grok '\[%{D...' returned 8 entries to merge in Parsed  id=summer-snowflake name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:47:46] 	.Parsed['length'] = '60'                     id=summer-snowflake name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:47:46] 	.Parsed['proto'] = 'TCP'                     id=summer-snowflake name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:47:46] 	.Parsed['src_port'] = '53668'                id=summer-snowflake name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:47:46] 	.Parsed['dst_port'] = '80'                   id=summer-snowflake name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:47:46] 	.Parsed['action'] = ''                       id=summer-snowflake name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:47:46] 	.Parsed['int_eth'] = 'enp1s0'                id=summer-snowflake name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:47:46] 	.Parsed['src_ip'] = '44.44.44.44'            id=summer-snowflake name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:47:46] 	.Parsed['dst_ip'] = '127.0.0.1'              id=summer-snowflake name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:47:46] + Processing 1 statics                        id=summer-snowflake name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:47:46] .Parsed[is_my_service] = 'yes'                id=summer-snowflake name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:47:46] Event leaving node : ok                       id=summer-snowflake name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:47:46] move Event from stage s01-parse to s02-enrich  id=summer-snowflake name=crowdsecurity/iptables-logs stage=s01-parse
...
```


</details>

What changed ? We can now see that the fragment captured by the GROK pattern are merged in the `Parsed` array !
We now have parsed data, only a few more changes and we will be done :)

## Finalizing our parser

```yaml
#let's set onsuccess to "next_stage" : if the log is parsed, we can consider it has been dealt with
onsuccess: next_stage
#debug, for reasons (don't do this in production)
debug: true
#as seen in our sample log, those logs are processed by the system and have a progname set to 'kernel'
filter: "evt.Parsed.program == 'kernel'"
#name and description:
name: crowdsecurity/iptables-logs
description: "Parse iptables drop logs"
grok:
#our grok pattern
  pattern: \[%{DATA}\]+.*(%{WORD:action})? IN=%{WORD:int_eth} OUT= MAC=%{IP}:%{MAC} SRC=%{IP:src_ip} DST=%{IP:dst_ip} LEN=%{INT:length}.*PROTO=%{WORD:proto} SPT=%{INT:src_port} DPT=%{INT:dst_port}.*
#the field to which we apply the grok pattern : the log message itself
  apply_on: message
statics:
    - meta: log_type
      value: iptables_drop
    - meta: service
      expression: "evt.Parsed.proto == 'TCP' ? 'tcp' : 'unknown'"
    - meta: source_ip
      expression: "evt.Parsed.src_ip"
```

### filter

We changed the filter to correctly filter on the program name.
In the current example, our logs are produced by the kernel (netfilter), and thus the program is `kernel` :

```bash
tail -f /var/log/kern.log
May 11 16:23:50 sd-126005 kernel: [47615902.763137] IN=enp1s0 OUT= MAC=00:08:a2:0c:1f:12:00:c8:8b:e2:d6:87:08:00 SRC=44.44.44.44 DST=127.0.0.1 LEN=60 TOS=0x00 PREC=0x00 TTL=49 ID=17451 DF PROTO=TCP SPT=53668 DPT=80 WINDOW=14600 RES=0x00 SYN URGP=0 
```

### statics

We are setting various entries to static or dynamic values to give "context" to the log :

  - `.Meta.log_type` is set to `iptables_drop` (so that we later can filter events coming from this)
  - `.Meta.source_ip` is set the the source ip captured  `.Parsed.src_ip`
  - `.Meta.service` is set the the result of an expression that relies on the GROK output (`proto` field)
  
Look into dedicated {{v1X.statics.htmlname}} documentation to know more about its possibilities.


### Testing our finalized parser


```bash
./crowdsec -c ./dev.yaml -dsn file://x.log -type kernel
```

<details>
  <summary>Expected output</summary>

```bash
...
INFO[20-08-2021 17:49:02] reading x.log at once                         type="file://x.log"
DEBU[20-08-2021 17:49:02] eval(evt.Parsed.program == 'kernel') = TRUE   id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] eval variables:                               id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02]        evt.Parsed.program = 'kernel'          id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] + Grok '[%{D...' returned 8 entries to merge in Parsed  id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] 	.Parsed['proto'] = 'TCP'                     id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] 	.Parsed['src_port'] = '45225'                id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] 	.Parsed['dst_port'] = '8888'                 id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] 	.Parsed['action'] = ''                       id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] 	.Parsed['int_eth'] = 'enp1s0'                id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] 	.Parsed['src_ip'] = '99.99.99.99'            id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] 	.Parsed['dst_ip'] = '127.0.0.1'              id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] 	.Parsed['length'] = '40'                     id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] + Processing 3 statics                        id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] .Meta[log_type] = 'iptables_drop'             id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] .Meta[service] = 'tcp'                        id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] .Meta[source_ip] = '99.99.99.99'              id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] Event leaving node : ok                       id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] move Event from stage s01-parse to s02-enrich  id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
WARN[20-08-2021 17:49:02] Acquisition is finished, shutting down       
DEBU[20-08-2021 17:49:02] eval(evt.Parsed.program == 'kernel') = TRUE   id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] eval variables:                               id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02]        evt.Parsed.program = 'kernel'          id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] + Grok '\[%{D...' returned 8 entries to merge in Parsed  id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] 	.Parsed['src_ip'] = '44.44.44.44'            id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] 	.Parsed['dst_ip'] = '127.0.0.1'              id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] 	.Parsed['length'] = '60'                     id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] 	.Parsed['proto'] = 'TCP'                     id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] 	.Parsed['src_port'] = '53668'                id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] 	.Parsed['dst_port'] = '80'                   id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] 	.Parsed['action'] = ''                       id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] 	.Parsed['int_eth'] = 'enp1s0'                id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] + Processing 3 statics                        id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] .Meta[log_type] = 'iptables_drop'             id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] .Meta[service] = 'tcp'                        id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] .Meta[source_ip] = '44.44.44.44'              id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] Event leaving node : ok                       id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
DEBU[20-08-2021 17:49:02] move Event from stage s01-parse to s02-enrich  id=withered-sun name=crowdsecurity/iptables-logs stage=s01-parse
...
```
</details>

## Closing word

We have now a fully functional parser for iptables logs !
We can either deploy it to our production systems to do stuff, or even better, contribute to the hub !

If you want to know more about directives and possibilities, take a look at [the parser reference documentation]({{TBD}}) !

