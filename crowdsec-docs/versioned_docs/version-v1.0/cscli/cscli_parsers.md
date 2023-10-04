---
id: cscli_parsers
title: cscli parsers
---
## cscli parsers

Install/Remove/Upgrade/Inspect parser(s) from hub

### Examples

```
cscli parsers install crowdsecurity/sshd-logs
cscli parsers inspect crowdsecurity/sshd-logs
cscli parsers upgrade crowdsecurity/sshd-logs
cscli parsers list
cscli parsers remove crowdsecurity/sshd-logs

```

### Options

```
  -h, --help   help for parsers
```

### Options inherited from parent commands

```
  -c, --config string   path to crowdsec config file (default "/etc/crowdsec/config.yaml")
      --debug           Set logging to debug.
      --error           Set logging to error.
      --info            Set logging to info.
  -o, --output string   Output format : human, json, raw.
      --trace           Set logging to trace.
      --warning         Set logging to warning.
```

### SEE ALSO

* [cscli](/docs/v1.0/cscli/)	 - cscli allows you to manage crowdsec
* [cscli parsers inspect](/docs/v1.0/cscli/cscli_parsers_inspect)	 - Inspect given parser
* [cscli parsers install](/docs/v1.0/cscli/cscli_parsers_install)	 - Install given parser(s)
* [cscli parsers list](/docs/v1.0/cscli/cscli_parsers_list)	 - List all parsers or given one
* [cscli parsers remove](/docs/v1.0/cscli/cscli_parsers_remove)	 - Remove given parser(s)
* [cscli parsers upgrade](/docs/v1.0/cscli/cscli_parsers_upgrade)	 - Upgrade given parser(s)

