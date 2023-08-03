---
id: cscli_scenarios_list
title: cscli scenarios list
---
## cscli scenarios list

List all scenario(s) or given one

### Synopsis

List all scenario(s) or given one

```
cscli scenarios list [config] [flags]
```

### Examples

```
cscli scenarios list
cscli scenarios list crowdsecurity/xxx
```

### Options

```
  -a, --all    List disabled items as well
  -h, --help   help for list
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

