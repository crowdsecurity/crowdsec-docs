---
id: cscli_bouncers_add
title: cscli bouncers add
---
## cscli bouncers add

add bouncer

### Synopsis

add bouncer

```
cscli bouncers add MyBouncerName [--length 16] [flags]
```

### Examples

```
cscli bouncers add MyBouncerName
cscli bouncers add MyBouncerName -l 24
cscli bouncers add MyBouncerName -k <random-key>
```

### Options

```
  -h, --help         help for add
  -k, --key string   api key for the bouncer
  -l, --length int   length of the api key (default 16)
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

* [cscli bouncers](/cscli/cscli_bouncers.md)	 - Manage bouncers [requires local API]

