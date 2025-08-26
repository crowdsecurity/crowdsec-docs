---
id: cscli_support_dump
title: cscli support dump
---
Dump all your configuration to a zip file for easier support

### Synopsis

Dump the following information:
- Crowdsec version
- OS version
- Enabled feature flags
- Latest Crowdsec logs (log processor, LAPI, remediation components)
- Installed collections, parsers, scenarios...
- Bouncers and machines list
- CAPI/LAPI status
- Crowdsec config (sensitive information like username and password are redacted)
- Crowdsec metrics
- Stack trace in case of process crash

```
cscli support dump [flags]
```

### Examples

```
cscli support dump
cscli support dump -f /tmp/crowdsec-support.zip

```

### Options

```
  -h, --help             help for dump
  -f, --outFile string   File to dump the information to
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

* [cscli support](/cscli/cscli_support.md)	 - Provide commands to help during support

