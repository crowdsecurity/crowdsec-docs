---
id: cscli_bouncers_prune
title: cscli bouncers prune
---
## cscli bouncers prune

prune multiple bouncers from the database

```
cscli bouncers prune [flags]
```

### Examples

```
cscli bouncers prune -d 45m
cscli bouncers prune -d 45m --force
```

### Options

```
  -d, --duration duration   duration of time since last pull (default 1h0m0s)
      --force               force prune without asking for confirmation
  -h, --help                help for prune
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

* [cscli bouncers](/cscli/cscli_bouncers.md)	 - Manage bouncers [requires local API]

