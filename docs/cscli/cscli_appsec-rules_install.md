---
id: cscli_appsec-rules_install
title: cscli appsec-rules install
---
## cscli appsec-rules install

Install given appsec-rule(s)

### Synopsis

Fetch and install one or more appsec-rules from the hub

```
cscli appsec-rules install [item]... [flags]
```

### Examples

```
cscli appsec-rules install crowdsecurity/crs
```

### Options

```
  -d, --download-only   Only download packages, don't enable
      --force           Force install: overwrite tainted and outdated files
  -h, --help            help for install
      --ignore          Ignore errors when installing multiple appsec-rules
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

