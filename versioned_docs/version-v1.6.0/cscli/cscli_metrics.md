---
id: cscli_metrics
title: cscli metrics
---
## cscli metrics

Display crowdsec prometheus metrics.

### Synopsis

Fetch metrics from the prometheus server and display them in a human-friendly way

```
cscli metrics [flags]
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

