---
id: cscli_parsers_install
title: cscli parsers install
---
## cscli parsers install

Install given parser(s)

### Synopsis

Fetch and install one or more parsers from the hub

```
cscli parsers install [item]... [flags]
```

### Examples

```
cscli parsers install crowdsecurity/caddy-logs crowdsecurity/sshd-logs
```

### Options

```
  -d, --download-only   Only download packages, don't enable
      --force           Force install: overwrite tainted and outdated files
  -h, --help            help for install
      --ignore          Ignore errors when installing multiple parsers
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

* [cscli parsers](/cscli/cscli_parsers.md)	 - Manage hub parsers

