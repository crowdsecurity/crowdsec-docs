---
id: cscli_scenarios_upgrade
title: cscli scenarios upgrade
---
## cscli scenarios upgrade

Upgrade given scenario(s)

### Synopsis

Fetch and upgrade one or more scenarios from the hub

```
cscli scenarios upgrade [item]... [flags]
```

### Examples

```
cscli scenarios upgrade crowdsecurity/ssh-bf crowdsecurity/http-probing
```

### Options

```
  -a, --all     Upgrade all the scenarios
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

* [cscli scenarios](/cscli/cscli_scenarios.md)	 - Manage hub scenarios

