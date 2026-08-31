---
id: cscli_bouncers_add
title: cscli bouncers add
---
## cscli bouncers add

add a single bouncer to the database

```
cscli bouncers add MyBouncerName [flags]
```

### Examples

```
cscli bouncers add MyBouncerName
cscli bouncers add MyBouncerName --key <random-key>
```

### Options

```
  -h, --help         help for add
  -k, --key string   api key for the bouncer
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

