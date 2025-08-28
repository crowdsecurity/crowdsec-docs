---
id: cscli_bouncers_inspect
title: cscli bouncers inspect
---
inspect a bouncer by name

```
cscli bouncers inspect [bouncer_name] [flags]
```

### Examples

```
cscli bouncers inspect "bouncer1"
```

### Options

```
  -h, --help   help for inspect
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

