---
id: cscli_contexts_upgrade
title: cscli contexts upgrade
---
## cscli contexts upgrade

Upgrade given context(s)

### Synopsis

Fetch and upgrade one or more contexts from the hub

```
cscli contexts upgrade [item]... [flags]
```

### Examples

```
cscli contexts upgrade crowdsecurity/yyy crowdsecurity/zzz
```

### Options

```
  -a, --all     Upgrade all the contexts
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

* [cscli contexts](/cscli/cscli_contexts.md)	 - Manage hub contexts

