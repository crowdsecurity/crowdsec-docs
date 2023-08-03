---
id: cscli_bouncers
title: cscli bouncers
---
## cscli bouncers

Manage bouncers [requires local API]

### Synopsis

To list/add/delete/prune bouncers.
Note: This command requires database direct access, so is intended to be run on Local API/master.


### Options

```
  -h, --help   help for bouncers
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
* [cscli bouncers add](/cscli/cscli_bouncers_add.md)	 - add a single bouncer to the database
* [cscli bouncers delete](/cscli/cscli_bouncers_delete.md)	 - delete bouncer(s) from the database
* [cscli bouncers list](/cscli/cscli_bouncers_list.md)	 - list all bouncers within the database
* [cscli bouncers prune](/cscli/cscli_bouncers_prune.md)	 - prune multiple bouncers from the database

