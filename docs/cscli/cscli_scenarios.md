---
id: cscli_scenarios
title: cscli scenarios
---
## cscli scenarios

Manage hub scenarios

### Examples

```
cscli scenarios list -a
cscli scenarios install crowdsecurity/ssh-bf crowdsecurity/http-probing
cscli scenarios inspect crowdsecurity/ssh-bf crowdsecurity/http-probing
cscli scenarios upgrade crowdsecurity/ssh-bf crowdsecurity/http-probing
cscli scenarios remove crowdsecurity/ssh-bf crowdsecurity/http-probing

```

### Options

```
  -h, --help   help for scenarios
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
* [cscli scenarios inspect](/cscli/cscli_scenarios_inspect.md)	 - Inspect given scenario(s)
* [cscli scenarios install](/cscli/cscli_scenarios_install.md)	 - Install given scenario(s)
* [cscli scenarios list](/cscli/cscli_scenarios_list.md)	 - List scenario(s)
* [cscli scenarios remove](/cscli/cscli_scenarios_remove.md)	 - Remove given scenario(s)
* [cscli scenarios upgrade](/cscli/cscli_scenarios_upgrade.md)	 - Upgrade given scenario(s)

