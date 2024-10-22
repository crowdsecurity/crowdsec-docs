---
id: cscli_appsec-configs
title: cscli appsec-configs
---
## cscli appsec-configs

Manage hub appsec-configs

### Examples

```
cscli appsec-configs list -a
cscli appsec-configs install crowdsecurity/vpatch
cscli appsec-configs inspect crowdsecurity/vpatch
cscli appsec-configs upgrade crowdsecurity/vpatch
cscli appsec-configs remove crowdsecurity/vpatch

```

### Options

```
  -h, --help   help for appsec-configs
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
* [cscli appsec-configs inspect](/cscli/cscli_appsec-configs_inspect.md)	 - Inspect given appsec-config(s)
* [cscli appsec-configs install](/cscli/cscli_appsec-configs_install.md)	 - Install given appsec-config(s)
* [cscli appsec-configs list](/cscli/cscli_appsec-configs_list.md)	 - List appsec-config(s)
* [cscli appsec-configs remove](/cscli/cscli_appsec-configs_remove.md)	 - Remove given appsec-config(s)
* [cscli appsec-configs upgrade](/cscli/cscli_appsec-configs_upgrade.md)	 - Upgrade given appsec-config(s)

