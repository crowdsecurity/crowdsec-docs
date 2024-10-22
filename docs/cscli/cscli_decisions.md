---
id: cscli_decisions
title: cscli decisions
---
## cscli decisions

Manage decisions

### Synopsis

Add/List/Delete/Import decisions from LAPI

### Examples

```
cscli decisions [action] [filter]
```

### Options

```
  -h, --help   help for decisions
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

* [cscli](/cscli/cscli.md)	 - cscli allows you to manage crowdsec
* [cscli decisions add](/cscli/cscli_decisions_add.md)	 - Add decision to LAPI
* [cscli decisions delete](/cscli/cscli_decisions_delete.md)	 - Delete decisions
* [cscli decisions import](/cscli/cscli_decisions_import.md)	 - Import decisions from a file or pipe
* [cscli decisions list](/cscli/cscli_decisions_list.md)	 - List decisions from LAPI

