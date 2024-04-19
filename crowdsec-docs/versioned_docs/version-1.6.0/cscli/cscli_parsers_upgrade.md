---
id: cscli_parsers_upgrade
title: cscli parsers upgrade
---
## cscli parsers upgrade

Upgrade given parser(s)

### Synopsis

Fetch and upgrade one or more parsers from the hub

```
cscli parsers upgrade [item]... [flags]
```

### Examples

```
cscli parsers upgrade crowdsecurity/caddy-logs crowdsecurity/sshd-logs
```

### Options

```
  -a, --all     Upgrade all the parsers
      --force   Force upgrade: overwrite tainted and outdated files
  -h, --help    help for upgrade
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

