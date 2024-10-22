---
id: cscli_appsec-rules
title: cscli appsec-rules
---
## cscli appsec-rules

Manage hub appsec-rules

### Examples

```
cscli appsec-rules list -a
cscli appsec-rules install crowdsecurity/crs
cscli appsec-rules inspect crowdsecurity/crs
cscli appsec-rules upgrade crowdsecurity/crs
cscli appsec-rules remove crowdsecurity/crs

```

### Options

```
  -h, --help   help for appsec-rules
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
* [cscli appsec-rules inspect](/cscli/cscli_appsec-rules_inspect.md)	 - Inspect given appsec-rule(s)
* [cscli appsec-rules install](/cscli/cscli_appsec-rules_install.md)	 - Install given appsec-rule(s)
* [cscli appsec-rules list](/cscli/cscli_appsec-rules_list.md)	 - List appsec-rule(s)
* [cscli appsec-rules remove](/cscli/cscli_appsec-rules_remove.md)	 - Remove given appsec-rule(s)
* [cscli appsec-rules upgrade](/cscli/cscli_appsec-rules_upgrade.md)	 - Upgrade given appsec-rule(s)

