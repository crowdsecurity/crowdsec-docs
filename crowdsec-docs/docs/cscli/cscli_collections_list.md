---
id: cscli_collections_list
title: cscli collections list
---
## cscli collections list

List collection(s)

### Synopsis

List of installed/available/specified collections

```
cscli collections list [item... | -a] [flags]
```

### Examples

```
# List enabled (installed) collections.
cscli collections list

# List all available collections (installed or not).
cscli collections list -a

# List specific collections (installed or not).
cscli collections list crowdsecurity/http-cve crowdsecurity/iptables
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

* [cscli collections](/cscli/cscli_collections.md)	 - Manage hub collections

