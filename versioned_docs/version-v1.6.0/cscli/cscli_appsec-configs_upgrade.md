---
id: cscli_appsec-configs_upgrade
title: cscli appsec-configs upgrade
---
## cscli appsec-configs upgrade

Upgrade given appsec-config(s)

### Synopsis

Fetch and upgrade one or more appsec-configs from the hub

```
cscli appsec-configs upgrade [item]... [flags]
```

### Examples

```
cscli appsec-configs upgrade crowdsecurity/vpatch
```

### Options

```
  -a, --all     Upgrade all the appsec-configs
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

* [cscli appsec-configs](/cscli/cscli_appsec-configs.md)	 - Manage hub appsec-configs

