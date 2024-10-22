---
id: cscli_contexts_list
title: cscli contexts list
---
## cscli contexts list

List context(s)

### Synopsis

List of installed/available/specified contexts

```
cscli contexts list [item... | -a] [flags]
```

### Examples

```
cscli contexts list
cscli contexts list -a
cscli contexts list crowdsecurity/yyy crowdsecurity/zzz

List only enabled contexts unless "-a" or names are specified.
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

* [cscli contexts](/cscli/cscli_contexts.md)	 - Manage hub contexts

