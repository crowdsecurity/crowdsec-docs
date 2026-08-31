---
id: cscli_lapi_context_detect
title: cscli lapi context detect
---
## cscli lapi context detect

Detect available fields from the installed parsers

```
cscli lapi context detect [flags]
```

### Examples

```
cscli lapi context detect --all
cscli lapi context detect crowdsecurity/sshd-logs
		
```

### Options

```
  -a, --all    Detect evt field for all installed parser
  -h, --help   help for detect
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

