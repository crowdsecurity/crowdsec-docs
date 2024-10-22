---
id: cscli_postoverflows_upgrade
title: cscli postoverflows upgrade
---
## cscli postoverflows upgrade

Upgrade given postoverflow(s)

### Synopsis

Fetch and upgrade one or more postoverflows from the hub

```
cscli postoverflows upgrade [item]... [flags]
```

### Examples

```
cscli postoverflows upgrade crowdsecurity/cdn-whitelist crowdsecurity/rdns
```

### Options

```
  -a, --all     Upgrade all the postoverflows
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

* [cscli postoverflows](/cscli/cscli_postoverflows.md)	 - Manage hub postoverflows

