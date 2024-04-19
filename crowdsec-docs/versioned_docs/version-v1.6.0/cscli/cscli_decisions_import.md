---
id: cscli_decisions_import
title: cscli decisions import
---
## cscli decisions import

Import decisions from a file or pipe

### Synopsis

expected format:
csv  : any of duration,reason,scope,type,value, with a header line
json :`{"duration" : "24h", "reason" : "my_scenario", "scope" : "ip", "type" : "ban", "value" : "x.y.z.z"}`

```
cscli decisions import [options] [flags]
```

### Examples

```
decisions.csv:
duration,scope,value
24h,ip,1.2.3.4

$ cscli decisions import -i decisions.csv

decisions.json:
[{"duration" : "4h", "scope" : "ip", "type" : "ban", "value" : "1.2.3.4"}]

The file format is detected from the extension, but can be forced with the --format option
which is required when reading from standard input.

Raw values, standard input:

$ echo "1.2.3.4" | cscli decisions import -i - --format values

```

### Options

```
  -i, --input string      Input file
  -d, --duration string   Decision duration: 1h,4h,30m (default "4h")
      --scope string      Decision scope: ip,range,username (default "Ip")
  -R, --reason string     Decision reason: <scenario-name> (default "manual")
  -t, --type string       Decision type: ban,captcha,throttle (default "ban")
      --batch int         Split import in batches of N decisions
      --format string     Input format: 'json', 'csv' or 'values' (each line is a value, no headers)
  -h, --help              help for import
```

### Options inherited from parent commands

```
      --color string    Output color: yes, no, auto (default "auto")
  -c, --config string   path to crowdsec config file (default "/etc/crowdsec/config.yaml")
      --debug           Set logging to debug
      --error           Set logging to error
      --info            Set logging to info
  -o, --output string   Output format: human, json, raw
      --trace           Set logging to trace
      --warning         Set logging to warning
```

### SEE ALSO

* [cscli decisions](/cscli/cscli_decisions.md)	 - Manage decisions

