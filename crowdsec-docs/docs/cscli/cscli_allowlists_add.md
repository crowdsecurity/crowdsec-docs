---
id: cscli_allowlists_add
title: cscli allowlists add
---
## cscli allowlists add

Add content to an allowlist

```
cscli allowlists add [allowlist_name] [value...] [-e expiration] [-d comment] [flags]
```

### Examples

```
cscli allowlists add my_allowlist 1.2.3.4 2.3.4.5 -e 1h -d "my comment"
```

### Options

```
  -d, --comment string      comment for the value
  -e, --expiration string   expiration duration
  -h, --help                help for add
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

