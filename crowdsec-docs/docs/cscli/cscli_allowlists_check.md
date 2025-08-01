---
id: cscli_allowlists_check
title: cscli allowlists check
---
## cscli allowlists check

Check if a value is in an allowlist

```
cscli allowlists check [value...] [flags]
```

### Examples

```
cscli allowlists check 1.2.3.4
```

### Options

```
  -h, --help   help for check
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

* [cscli allowlists](/cscli/cscli_allowlists.md)	 - Manage centralized allowlists

