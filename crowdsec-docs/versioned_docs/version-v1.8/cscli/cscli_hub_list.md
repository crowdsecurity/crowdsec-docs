---
id: cscli_hub_list
title: cscli hub list
---
## cscli hub list

List relevant installed items

### Synopsis

List installed relevant items (collections, standalone items) and shows their status.
Use --all to list all items, including those not installed.
Use --full to list every installed item individually, instead of summarizing collection contents.

```
cscli hub list [-a] [flags]
```

### Options

```
  -a, --all              List all available items, including those not installed
      --full             List every installed item individually instead of summarizing collection contents
  -h, --help             help for list
      --status strings   Filter by status (installed, not-installed, up-to-date, outdated, tainted, local)
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

* [cscli hub](/cscli/cscli_hub.md)	 - Manage hub index

