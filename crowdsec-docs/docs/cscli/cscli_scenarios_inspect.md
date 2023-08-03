---
id: cscli_scenarios_inspect
title: cscli scenarios inspect
---
## cscli scenarios inspect

Inspect given scenario

### Synopsis

Inspect given scenario

```
cscli scenarios inspect [config] [flags]
```

### Examples

```
cscli scenarios inspect crowdsec/xxx
```

### Options

```
  -h, --help         help for inspect
  -u, --url string   Prometheus url
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

* [cscli scenarios](/cscli/cscli_scenarios.md)	 - Install/Remove/Upgrade/Inspect scenario(s) from hub

