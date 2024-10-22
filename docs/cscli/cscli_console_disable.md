---
id: cscli_console_disable
title: cscli console disable
---
## cscli console disable

Disable a console option

### Synopsis


Disable given information push to the central API.

```
cscli console disable [option] [flags]
```

### Examples

```
sudo cscli console disable tainted
```

### Options

```
  -a, --all    Disable all console options
  -h, --help   help for disable
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

* [cscli console](/cscli/cscli_console.md)	 - Manage interaction with Crowdsec console (https://app.crowdsec.net)

