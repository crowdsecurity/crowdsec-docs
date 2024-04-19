---
id: cscli_appsec-configs_remove
title: cscli appsec-configs remove
---
## cscli appsec-configs remove

Remove given appsec-config(s)

### Synopsis

Remove one or more appsec-configs

```
cscli appsec-configs remove [item]... [flags]
```

### Examples

```
cscli appsec-configs remove crowdsecurity/vpatch
```

### Options

```
      --all     Remove all the appsec-configs
      --force   Force remove: remove tainted and outdated files
  -h, --help    help for remove
      --purge   Delete source file too
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

