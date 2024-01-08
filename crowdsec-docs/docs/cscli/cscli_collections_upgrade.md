---
id: cscli_collections_upgrade
title: cscli collections upgrade
---
## cscli collections upgrade

Upgrade given collection(s)

### Synopsis

Fetch and upgrade one or more collections from the hub

```
cscli collections upgrade [item]... [flags]
```

### Examples

```
cscli collections upgrade crowdsecurity/http-cve crowdsecurity/iptables
```

### Options

```
  -a, --all     Upgrade all the collections
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

* [cscli collections](/cscli/cscli_collections.md)	 - Manage hub collections

