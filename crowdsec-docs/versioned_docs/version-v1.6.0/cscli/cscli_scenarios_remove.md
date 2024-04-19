---
id: cscli_scenarios_remove
title: cscli scenarios remove
---
## cscli scenarios remove

Remove given scenario(s)

### Synopsis

Remove one or more scenarios

```
cscli scenarios remove [item]... [flags]
```

### Examples

```
cscli scenarios remove crowdsecurity/ssh-bf crowdsecurity/http-probing
```

### Options

```
      --all     Remove all the scenarios
      --force   Force remove: remove tainted and outdated files
  -h, --help    help for remove
      --purge   Delete source file too
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

