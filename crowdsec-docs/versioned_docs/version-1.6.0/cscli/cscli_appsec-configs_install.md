---
id: cscli_appsec-configs_install
title: cscli appsec-configs install
---
## cscli appsec-configs install

Install given appsec-config(s)

### Synopsis

Fetch and install one or more appsec-configs from the hub

```
cscli appsec-configs install [item]... [flags]
```

### Examples

```
cscli appsec-configs install crowdsecurity/vpatch
```

### Options

```
  -d, --download-only   Only download packages, don't enable
      --force           Force install: overwrite tainted and outdated files
  -h, --help            help for install
      --ignore          Ignore errors when installing multiple appsec-configs
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

