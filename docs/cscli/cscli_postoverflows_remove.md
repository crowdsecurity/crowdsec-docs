---
id: cscli_postoverflows_remove
title: cscli postoverflows remove
---
## cscli postoverflows remove

Remove given postoverflow(s)

### Synopsis

Remove one or more postoverflows

```
cscli postoverflows remove [item]... [flags]
```

### Examples

```
cscli postoverflows remove crowdsecurity/cdn-whitelist crowdsecurity/rdns
```

### Options

```
      --all     Remove all the postoverflows
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

* [cscli postoverflows](/cscli/cscli_postoverflows.md)	 - Manage hub postoverflows

