---
id: cscli_lapi_context_add
title: cscli lapi context add
---
## cscli lapi context add

Add context to send with alerts. You must specify the output key with the expr value you want

```
cscli lapi context add [flags]
```

### Examples

```
cscli lapi context add --key source_ip --value evt.Meta.source_ip
cscli lapi context add --key file_source --value evt.Line.Src
cscli lapi context add --value evt.Meta.source_ip --value evt.Meta.target_user 
		
```

### Options

```
  -h, --help            help for add
  -k, --key string      The key of the different values to send
      --value strings   The expr fields to associate with the key
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

* [cscli lapi context](/cscli/cscli_lapi_context.md)	 - Manage context to send with alerts

