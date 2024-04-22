---
id: cscli_appsec-rules_upgrade
title: cscli appsec-rules upgrade
---
## cscli appsec-rules upgrade

Upgrade given appsec-rule(s)

### Synopsis

Fetch and upgrade one or more appsec-rules from the hub

```
cscli appsec-rules upgrade [item]... [flags]
```

### Examples

```
cscli appsec-rules upgrade crowdsecurity/crs
```

### Options

```
  -a, --all     Upgrade all the appsec-rules
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

* [cscli appsec-rules](/cscli/cscli_appsec-rules.md)	 - Manage hub appsec-rules

