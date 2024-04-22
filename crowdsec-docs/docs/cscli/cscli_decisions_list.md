---
id: cscli_decisions_list
title: cscli decisions list
---
## cscli decisions list

List decisions from LAPI

```
cscli decisions list [options] [flags]
```

### Examples

```
cscli decisions list -i 1.2.3.4
cscli decisions list -r 1.2.3.0/24
cscli decisions list -s crowdsecurity/ssh-bf
cscli decisions list --origin lists --scenario list_name

```

### Options

```
  -a, --all               Include decisions from Central API
      --since string      restrict to alerts newer than since (ie. 4h, 30d)
      --until string      restrict to alerts older than until (ie. 4h, 30d)
  -t, --type string       restrict to this decision type (ie. ban,captcha)
      --scope string      restrict to this scope (ie. ip,range,session)
      --origin string     the value to match for the specified origin (cscli,crowdsec,console,cscli-import,lists,CAPI ...)
  -v, --value string      restrict to this value (ie. 1.2.3.4,userName)
  -s, --scenario string   restrict to this scenario (ie. crowdsecurity/ssh-bf)
  -i, --ip string         restrict to alerts from this source ip (shorthand for --scope ip --value <IP>)
  -r, --range string      restrict to alerts from this source range (shorthand for --scope range --value <RANGE>)
  -l, --limit int         number of alerts to get (use 0 to remove the limit) (default 100)
      --no-simu           exclude decisions in simulation mode
  -m, --machine           print machines that triggered decisions
      --contained         query decisions contained by range
  -h, --help              help for list
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

