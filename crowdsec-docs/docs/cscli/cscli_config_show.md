---
id: cscli_config_show
title: cscli config show
---
## cscli config show

Displays current config

### Synopsis

Displays the current cli configuration.

```
cscli config show [flags]
```

### Options

```
  -h, --help         help for show
      --key string   Display only this value (Config.API.Server.ListenURI)
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

* [cscli config](/cscli/cscli_config.md)	 - Allows to view current config

