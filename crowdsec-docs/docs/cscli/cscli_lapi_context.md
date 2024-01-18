---
id: cscli_lapi_context
title: cscli lapi context
---
## cscli lapi context

Manage context to send with alerts

```
cscli lapi context [command] [flags]
```

### Options

```
  -h, --help   help for context
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

* [cscli lapi](/cscli/cscli_lapi.md)	 - Manage interaction with Local API (LAPI)
* [cscli lapi context add](/cscli/cscli_lapi_context_add.md)	 - Add context to send with alerts. You must specify the output key with the expr value you want
* [cscli lapi context delete](/cscli/cscli_lapi_context_delete.md)	 - 
* [cscli lapi context detect](/cscli/cscli_lapi_context_detect.md)	 - Detect available fields from the installed parsers
* [cscli lapi context status](/cscli/cscli_lapi_context_status.md)	 - List context to send with alerts

