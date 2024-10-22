---
id: cscli_machines_list
title: cscli machines list
---
## cscli machines list

list all machines in the database

### Synopsis

list all machines in the database with their status and last heartbeat

```
cscli machines list [flags]
```

### Examples

```
cscli machines list
```

### Options

```
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

* [cscli machines](/cscli/cscli_machines.md)	 - Manage local API machines [requires local API]

