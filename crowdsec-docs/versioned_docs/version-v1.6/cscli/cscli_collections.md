---
id: cscli_collections
title: cscli collections
---
## cscli collections

Manage hub collections

### Examples

```
cscli collections list -a
cscli collections install crowdsecurity/http-cve crowdsecurity/iptables
cscli collections inspect crowdsecurity/http-cve crowdsecurity/iptables
cscli collections upgrade crowdsecurity/http-cve crowdsecurity/iptables
cscli collections remove crowdsecurity/http-cve crowdsecurity/iptables

```

### Options

```
  -h, --help   help for collections
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
* [cscli collections inspect](/cscli/cscli_collections_inspect.md)	 - Inspect given collection(s)
* [cscli collections install](/cscli/cscli_collections_install.md)	 - Install given collection(s)
* [cscli collections list](/cscli/cscli_collections_list.md)	 - List collection(s)
* [cscli collections remove](/cscli/cscli_collections_remove.md)	 - Remove given collection(s)
* [cscli collections upgrade](/cscli/cscli_collections_upgrade.md)	 - Upgrade given collection(s)

