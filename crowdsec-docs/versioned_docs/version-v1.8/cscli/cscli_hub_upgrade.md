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

### Examples

```
# Upgrade all the collections, scenarios etc. to the latest version in the downloaded index. Update data files too.
cscli hub upgrade

# Upgrade tainted items as well; force re-download of data files.
cscli hub upgrade --force

# Prompt for confirmation if running in an interactive terminal; otherwise, the option is ignored.
cscli hub upgrade --interactive
cscli hub upgrade -i
```

### Options

```
      --dry-run       Don't install or remove anything; print the execution plan
      --force         Force upgrade: overwrite tainted and outdated items; always update data files
  -h, --help          help for upgrade
  -i, --interactive   Ask for confirmation before proceeding
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

