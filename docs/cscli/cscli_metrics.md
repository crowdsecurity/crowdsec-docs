---
id: cscli_metrics
title: cscli metrics
---
## cscli metrics

Display crowdsec prometheus metrics.

### Synopsis

Fetch metrics from a Local API server and display them

```
cscli metrics [flags]
```

### Examples

```
# Show all Metrics, skip empty tables (same as "cecli metrics show")
cscli metrics

# Show only some metrics, connect to a different url
cscli metrics --url http://lapi.local:6060/metrics show acquisition parsers

# List available metric types
cscli metrics list
```

### Options

```
  -h, --help         help for metrics
      --no-unit      Show the real number instead of formatted with units
  -u, --url string   Prometheus url (http://<ip>:<port>/metrics)
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

* [cscli](/cscli/cscli.md)	 - cscli allows you to manage crowdsec
* [cscli metrics list](/cscli/cscli_metrics_list.md)	 - List available types of metrics.
* [cscli metrics show](/cscli/cscli_metrics_show.md)	 - Display all or part of the available metrics.

