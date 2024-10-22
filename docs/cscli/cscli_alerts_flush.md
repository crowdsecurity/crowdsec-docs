---
id: cscli_alerts_flush
title: cscli alerts flush
---
## cscli alerts flush

Flush alerts
/!\ This command can be used only on the same machine than the local API

```
cscli alerts flush [flags]
```

### Examples

```
cscli alerts flush --max-items 1000 --max-age 7d
```

### Options

```
      --max-items int    Maximum number of alert items to keep in the database (default 5000)
      --max-age string   Maximum age of alert items to keep in the database (default "7d")
  -h, --help             help for flush
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

* [cscli alerts](/cscli/cscli_alerts.md)	 - Manage alerts

