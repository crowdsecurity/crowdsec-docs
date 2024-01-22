---
id: cscli_scenarios_install
title: cscli scenarios install
---
## cscli scenarios install

Install given scenario(s)

### Synopsis

Fetch and install one or more scenarios from the hub

```
cscli scenarios install [item]... [flags]
```

### Examples

```
cscli scenarios install crowdsecurity/ssh-bf crowdsecurity/http-probing
```

### Options

```
  -d, --download-only   Only download packages, don't enable
      --force           Force install: overwrite tainted and outdated files
  -h, --help            help for install
      --ignore          Ignore errors when installing multiple scenarios
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

