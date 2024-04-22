---
id: cscli_appsec-configs_list
title: cscli appsec-configs list
---
## cscli appsec-configs list

List appsec-config(s)

### Synopsis

List of installed/available/specified appsec-configs

```
cscli appsec-configs list [item... | -a] [flags]
```

### Examples

```
cscli appsec-configs list
cscli appsec-configs list -a
cscli appsec-configs list crowdsecurity/vpatch
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

* [cscli appsec-configs](/cscli/cscli_appsec-configs.md)	 - Manage hub appsec-configs

