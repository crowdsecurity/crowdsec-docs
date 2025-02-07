---
id: cscli_appsec-rules_list
title: cscli appsec-rules list
---
## cscli appsec-rules list

List appsec-rule(s)

### Synopsis

List of installed/available/specified appsec-rules

```
cscli appsec-rules list [item... | -a] [flags]
```

### Examples

```
# List enabled (installed) appsec-rules.
cscli appsec-rules list

# List all available appsec-rules (installed or not).
cscli appsec-rules list -a

# List specific appsec-rules (installed or not).
cscli appsec-rules list crowdsecurity/crs crowdsecurity/vpatch-git-config
```

### Options

```
  -a, --all    List disabled items as well
  -h, --help   help for list
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

* [cscli appsec-rules](/cscli/cscli_appsec-rules.md)	 - Manage hub appsec-rules

