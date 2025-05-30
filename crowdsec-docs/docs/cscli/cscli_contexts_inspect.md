---
id: cscli_contexts_inspect
title: cscli contexts inspect
---
## cscli contexts inspect

Inspect given context(s)

### Synopsis

Inspect the state of one or more contexts

```
cscli contexts inspect [item]... [flags]
```

### Examples

```
# Display metadata, state and ancestor collections of contexts (installed or not).
cscli contexts inspect crowdsecurity/bf_base crowdsecurity/fortinet

# Display difference between a tainted item and the latest one.
cscli contexts inspect crowdsecurity/bf_base --diff

# Reverse the above diff
cscli contexts inspect crowdsecurity/bf_base --diff --rev
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

* [cscli contexts](/cscli/cscli_contexts.md)	 - Manage hub contexts

