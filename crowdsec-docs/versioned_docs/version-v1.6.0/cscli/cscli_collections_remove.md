---
id: cscli_collections_remove
title: cscli collections remove
---
## cscli collections remove

Remove given collection(s)

### Synopsis

Remove one or more collections

```
cscli collections remove [item]... [flags]
```

### Examples

```
cscli collections remove crowdsecurity/http-cve crowdsecurity/iptables
```

### Options

```
      --all     Remove all the collections
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

* [cscli collections](/cscli/cscli_collections.md)	 - Manage hub collections

