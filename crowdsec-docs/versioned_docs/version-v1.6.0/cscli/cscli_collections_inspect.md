---
id: cscli_collections_inspect
title: cscli collections inspect
---
## cscli collections inspect

Inspect given collection(s)

### Synopsis

Inspect the state of one or more collections

```
cscli collections inspect [item]... [flags]
```

### Examples

```
cscli collections inspect crowdsecurity/http-cve crowdsecurity/iptables
```

### Options

```
      --diff         Show diff with latest version (for tainted items)
  -h, --help         help for inspect
      --no-metrics   Don't show metrics (when cscli.output=human)
      --rev          Reverse diff output
  -u, --url string   Prometheus url
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

