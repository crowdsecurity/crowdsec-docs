---
id: cscli_parsers_inspect
title: cscli parsers inspect
---
Inspect given parser(s)

### Synopsis

Inspect the state of one or more parsers

```
cscli parsers inspect [item]... [flags]
```

### Examples

```
# Display metadata, state and ancestor collections of parsers (installed or not).
cscli parsers inspect crowdsecurity/httpd-logs crowdsecurity/sshd-logs

# If the parser is installed, its metrics are collected and shown as well (with an error if crowdsec is not running).
# To avoid this, use --no-metrics.
cscli parsers inspect crowdsecurity/httpd-logs --no-metrics

# Display difference between a tainted item and the latest one.
cscli parsers inspect crowdsecurity/httpd-logs --diff

# Reverse the above diff
cscli parsers inspect crowdsecurity/httpd-logs --diff --rev
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

* [cscli parsers](/cscli/cscli_parsers.md)	 - Manage hub parsers

