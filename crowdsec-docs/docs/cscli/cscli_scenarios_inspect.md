---
id: cscli_scenarios_inspect
title: cscli scenarios inspect
---
## cscli scenarios inspect

Inspect given scenario(s)

### Synopsis

Inspect the state of one or more scenarios

```
cscli scenarios inspect [item]... [flags]
```

### Examples

```
# Display metadata, state, metrics and ancestor collections of scenarios (installed or not).
cscli scenarios inspect crowdsecurity/ssh-bf crowdsecurity/http-probing

# Don't collect metrics (avoid error if crowdsec is not running).
cscli scenarios inspect crowdsecurity/ssh-bf --no-metrics

# Display difference between a tainted item and the latest one.
cscli scenarios inspect crowdsecurity/ssh-bf --diff

# Reverse the above diff
cscli scenarios inspect crowdsecurity/ssh-bf --diff --rev
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

* [cscli scenarios](/cscli/cscli_scenarios.md)	 - Manage hub scenarios

