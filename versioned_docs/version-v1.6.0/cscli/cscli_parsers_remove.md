---
id: cscli_parsers_remove
title: cscli parsers remove
---
## cscli parsers remove

Remove given parser(s)

### Synopsis

Remove one or more parsers

```
cscli parsers remove [item]... [flags]
```

### Examples

```
cscli parsers remove crowdsecurity/caddy-logs crowdsecurity/sshd-logs
```

### Options

```
      --all     Remove all the parsers
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

* [cscli parsers](/cscli/cscli_parsers.md)	 - Manage hub parsers

