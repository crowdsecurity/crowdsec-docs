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
      --color string    Output color: yes, no, auto. (default "auto")
  -c, --config string   path to crowdsec config file (default "/etc/crowdsec/config.yaml")
      --debug           Set logging to debug.
      --error           Set logging to error.
      --info            Set logging to info.
  -o, --output string   Output format: human, json, raw.
      --trace           Set logging to trace.
      --warning         Set logging to warning.
```

### SEE ALSO

* [cscli](/cscli/cscli.md)	 - cscli allows you to manage crowdsec
* [cscli parsers inspect](/cscli/cscli_parsers_inspect.md)	 - Inspect given parser
* [cscli parsers install](/cscli/cscli_parsers_install.md)	 - Install given parser(s)
* [cscli parsers list](/cscli/cscli_parsers_list.md)	 - List all parsers or given one
* [cscli parsers remove](/cscli/cscli_parsers_remove.md)	 - Remove given parser(s)
* [cscli parsers upgrade](/cscli/cscli_parsers_upgrade.md)	 - Upgrade given parser(s)

