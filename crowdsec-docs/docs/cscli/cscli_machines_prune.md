---
id: cscli_machines_prune
title: cscli machines prune
---
## cscli machines prune

prune multiple machines from the database

### Synopsis

prune multiple machines that are not validated or have not connected to the local API in a given duration.

```
cscli machines prune [flags]
```

### Examples

```
cscli machines prune
cscli machines prune --duration 1h
cscli machines prune --not-validated-only --force
```

### Options

```
  -d, --duration duration    duration of time since validated machine last heartbeat (default 10m0s)
      --force                force prune without asking for confirmation
  -h, --help                 help for prune
      --not-validated-only   only prune machines that are not validated
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

