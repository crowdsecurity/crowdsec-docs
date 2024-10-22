---
id: cscli_postoverflows_inspect
title: cscli postoverflows inspect
---
## cscli postoverflows inspect

Inspect given postoverflow(s)

### Synopsis

Inspect the state of one or more postoverflows

```
cscli postoverflows inspect [item]... [flags]
```

### Examples

```
cscli postoverflows inspect crowdsecurity/cdn-whitelist crowdsecurity/rdns
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

* [cscli postoverflows](/cscli/cscli_postoverflows.md)	 - Manage hub postoverflows

