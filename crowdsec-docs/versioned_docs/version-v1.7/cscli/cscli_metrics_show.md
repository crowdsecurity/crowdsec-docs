---
id: cscli_metrics_show
title: cscli metrics show
---
## cscli metrics show

Display all or part of the available metrics.

### Synopsis

Fetch metrics from a Local API server and display them, optionally filtering on specific types.

```
cscli metrics show [type]... [flags]
```

### Examples

```
# Show all Metrics, skip empty tables
cscli metrics show

# Use an alias: "engine", "lapi" or "appsec" to show a group of metrics
cscli metrics show engine

# Show some specific metrics, show empty tables, connect to a different url
cscli metrics show acquisition parsers scenarios stash --url http://lapi.local:6060/metrics

# To list available metric types, use "cscli metrics list"
cscli metrics list; cscli metrics list -o json

# Show metrics in json format
cscli metrics show acquisition parsers scenarios stash -o json
```

### Options

```
  -h, --help         help for show
      --no-unit      Show the real number instead of formatted with units
  -u, --url string   Metrics url (http://<ip>:<port>/metrics)
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

* [cscli metrics](/cscli/cscli_metrics.md)	 - Display crowdsec prometheus metrics.

