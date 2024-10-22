---
id: cscli_scenarios_list
title: cscli scenarios list
---
## cscli scenarios list

List scenario(s)

### Synopsis

List of installed/available/specified scenarios

```
cscli scenarios list [item... | -a] [flags]
```

### Examples

```
cscli scenarios list
cscli scenarios list -a
cscli scenarios list crowdsecurity/ssh-bf crowdsecurity/http-probing

List only enabled scenarios unless "-a" or names are specified.
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

* [cscli scenarios](/cscli/cscli_scenarios.md)	 - Manage hub scenarios

