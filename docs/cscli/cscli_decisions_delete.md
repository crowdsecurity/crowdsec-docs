---
id: cscli_decisions_delete
title: cscli decisions delete
---
## cscli decisions delete

Delete decisions

```
cscli decisions delete [options] [flags]
```

### Examples

```
cscli decisions delete -r 1.2.3.0/24
cscli decisions delete -i 1.2.3.4
cscli decisions delete --id 42
cscli decisions delete --type captcha
cscli decisions delete --origin lists  --scenario list_name

```

### Options

```
  -i, --ip string         Source ip (shorthand for --scope ip --value <IP>)
  -r, --range string      Range source ip (shorthand for --scope range --value <RANGE>)
  -t, --type string       the decision type (ie. ban,captcha)
  -v, --value string      the value to match for in the specified scope
  -s, --scenario string   the scenario name (ie. crowdsecurity/ssh-bf)
      --origin string     the value to match for the specified origin (cscli,crowdsec,console,cscli-import,lists,CAPI ...)
      --id string         decision id
      --all               delete all decisions
      --contained         query decisions contained by range
  -h, --help              help for delete
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

* [cscli decisions](/cscli/cscli_decisions.md)	 - Manage decisions

