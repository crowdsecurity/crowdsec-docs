---
id: cscli_collections_list
title: cscli collections list
---
## cscli collections list

List all collections

### Synopsis

List all collections

```
cscli collections list collection [-a] [flags]
```

### Examples

```
cscli collections list
```

### Options

```
  -a, --all    List disabled items as well
  -h, --help   help for list
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

* [cscli collections](/cscli/cscli_collections.md)	 - Manage collections from hub

