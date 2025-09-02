---
id: cscli_allowlists_remove
title: cscli allowlists remove
---
Remove content from an allowlist

```
cscli allowlists remove [allowlist_name] [value] [flags]
```

### Examples

```
cscli allowlists remove my_allowlist 1.2.3.4 2.3.4.5
```

### Options

```
  -h, --help   help for remove
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

