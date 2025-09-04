---
id: cscli_contexts
title: cscli contexts
---
Manage hub contexts

### Examples

```
cscli contexts list -a
cscli contexts install crowdsecurity/bf_base crowdsecurity/fortinet
cscli contexts inspect crowdsecurity/bf_base crowdsecurity/fortinet
cscli contexts upgrade crowdsecurity/bf_base crowdsecurity/fortinet
cscli contexts remove crowdsecurity/bf_base crowdsecurity/fortinet

```

### Options

```
  -h, --help   help for contexts
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

* [cscli](/cscli/cscli.md)	 - cscli allows you to manage crowdsec
* [cscli contexts inspect](/cscli/cscli_contexts_inspect.md)	 - Inspect given context(s)
* [cscli contexts install](/cscli/cscli_contexts_install.md)	 - Install given context(s)
* [cscli contexts list](/cscli/cscli_contexts_list.md)	 - List context(s)
* [cscli contexts remove](/cscli/cscli_contexts_remove.md)	 - Remove given context(s)
* [cscli contexts upgrade](/cscli/cscli_contexts_upgrade.md)	 - Upgrade given context(s)

