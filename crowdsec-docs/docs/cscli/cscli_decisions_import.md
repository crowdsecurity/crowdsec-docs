---
id: cscli_decisions_import
title: cscli decisions import
---
## cscli decisions import

Import decisions from json or csv file

### Synopsis

expected format :
csv  : any of duration,origin,reason,scope,type,value, with a header line
json : {"duration" : "24h", "origin" : "my-list", "reason" : "my_scenario", "scope" : "ip", "type" : "ban", "value" : "x.y.z.z"}

```
cscli decisions import [options] [flags]
```

### Examples

```
decisions.csv :
duration,scope,value
24h,ip,1.2.3.4

cscsli decisions import -i decisions.csv

decisions.json :
[{"duration" : "4h", "scope" : "ip", "type" : "ban", "value" : "1.2.3.4"}]

```

### Options

```
  -i, --input string      Input file
  -d, --duration string   Decision duration (ie. 1h,4h,30m)
      --scope string      Decision scope (ie. ip,range,username) (default "Ip")
  -R, --reason string     Decision reason (ie. scenario-name)
  -t, --type string       Decision type (ie. ban,captcha,throttle)
  -h, --help              help for import
```

### Options inherited from parent commands

```
      --color string    Output color: yes, no, auto. (default "auto")
  -c, --config string   path to crowdsec config file (default "/etc/crowdsec/config.yaml")
      --debug           Set logging to debug.
      --error           Set logging to error.
      --info            Set logging to info.
  -o, --output string   Output format: human, json, raw.
      --trace           Set logging to trace.
      --warning         Set logging to warning.
```

### SEE ALSO

* [cscli decisions](/cscli/cscli_decisions.md)	 - Manage decisions

