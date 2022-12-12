---
id: cscli_console_status
title: cscli console status
---
## cscli console status

Shows status of one or all feature flags

```
cscli console status [feature-flag] [flags]
```

### Examples

```
sudo cscli console status
+-------------+-----------+---------------------------------------------------+
| Option Name | Activated | Description                                       |
+-------------+-----------+---------------------------------------------------+
| custom      | ✅        | Send alerts from custom scenarios to the console  |
| manual      | ❌        | Send manual decisions to the console              |
| tainted     | ✅        | Send alerts from tainted scenarios to the console |
| context     | ✅        | Send context with alerts to the console           |
+-------------+-----------+---------------------------------------------------+
```

### Options

```
  -h, --help   help for status
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

* [cscli console](/cscli/cscli_console.md)	 - Manage interaction with Crowdsec console (https://app.crowdsec.net)

