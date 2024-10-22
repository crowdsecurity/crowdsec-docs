---
id: cscli_appsec-rules_remove
title: cscli appsec-rules remove
---
## cscli appsec-rules remove

Remove given appsec-rule(s)

### Synopsis

Remove one or more appsec-rules

```
cscli appsec-rules remove [item]... [flags]
```

### Examples

```
cscli appsec-rules remove crowdsecurity/crs
```

### Options

```
      --all     Remove all the appsec-rules
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

* [cscli appsec-rules](/cscli/cscli_appsec-rules.md)	 - Manage hub appsec-rules

