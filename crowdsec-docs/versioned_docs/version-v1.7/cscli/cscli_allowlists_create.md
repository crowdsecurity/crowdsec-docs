---
id: cscli_allowlists_create
title: cscli allowlists create
---
Create a new allowlist

```
cscli allowlists create [allowlist_name] [flags]
```

### Examples

```
cscli allowlists create my_allowlist -d 'my allowlist description'
```

### Options

```
  -d, --description string   description of the allowlist
  -h, --help                 help for create
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

