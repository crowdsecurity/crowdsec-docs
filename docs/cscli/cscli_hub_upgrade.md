---
id: cscli_hub_upgrade
title: cscli hub upgrade
---
## cscli hub upgrade

Upgrade all configurations to their latest version

### Synopsis


Upgrade all configs installed from Crowdsec Hub. Run 'sudo cscli hub update' if you want the latest versions available.


```
cscli hub upgrade [flags]
```

### Options

```
      --force   Force upgrade: overwrite tainted and outdated files
  -h, --help    help for upgrade
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

* [cscli hub](/cscli/cscli_hub.md)	 - Manage hub index

