---
id: cscli_contexts_install
title: cscli contexts install
---
## cscli contexts install

Install given context(s)

### Synopsis

Fetch and install one or more contexts from the hub

```
cscli contexts install [item]... [flags]
```

### Examples

```
cscli contexts install crowdsecurity/yyy crowdsecurity/zzz
```

### Options

```
  -d, --download-only   Only download packages, don't enable
      --force           Force install: overwrite tainted and outdated files
  -h, --help            help for install
      --ignore          Ignore errors when installing multiple contexts
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

* [cscli contexts](/cscli/cscli_contexts.md)	 - Manage hub contexts

