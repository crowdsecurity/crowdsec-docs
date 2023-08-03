---
id: cscli_machines
title: cscli machines
---
## cscli machines

Manage local API machines [requires local API]

### Synopsis

To list/add/delete/validate/prune machines.
Note: This command requires database direct access, so is intended to be run on the local API machine.


### Examples

```
cscli machines [action]
```

### Options

```
  -h, --help   help for machines
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
* [cscli machines add](/cscli/cscli_machines_add.md)	 - add a single machine to the database
* [cscli machines delete](/cscli/cscli_machines_delete.md)	 - delete machine(s) by name
* [cscli machines list](/cscli/cscli_machines_list.md)	 - list all machines in the database
* [cscli machines prune](/cscli/cscli_machines_prune.md)	 - prune multiple machines from the database
* [cscli machines validate](/cscli/cscli_machines_validate.md)	 - validate a machine to access the local API

