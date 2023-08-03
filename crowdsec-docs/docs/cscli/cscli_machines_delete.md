---
id: cscli_machines_delete
title: cscli machines delete
---
## cscli machines delete

delete machine(s) by name

```
cscli machines delete [machine_name]... [flags]
```

### Examples

```
cscli machines delete "machine1" "machine2"
```

### Options

```
  -h, --help   help for delete
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

