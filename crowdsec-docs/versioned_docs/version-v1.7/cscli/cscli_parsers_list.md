---
id: cscli_parsers_list
title: cscli parsers list
---
List parser(s)

### Synopsis

List of installed/available/specified parsers

```
cscli parsers list [item... | -a] [flags]
```

### Examples

```
# List enabled (installed) parsers.
cscli parsers list

# List all available parsers (installed or not).
cscli parsers list -a

# List specific parsers (installed or not).
cscli parsers list crowdsecurity/caddy-logs crowdsecurity/sshd-logs
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

* [cscli parsers](/cscli/cscli_parsers.md)	 - Manage hub parsers

