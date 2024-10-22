---
id: cscli_console_enable
title: cscli console enable
---
## cscli console enable

Enable a console option

### Synopsis


Enable given information push to the central API. Allows to empower the console

```
cscli console enable [option] [flags]
```

### Examples

```
sudo cscli console enable tainted
```

### Options

```
  -a, --all    Enable all console options
  -h, --help   help for enable
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

