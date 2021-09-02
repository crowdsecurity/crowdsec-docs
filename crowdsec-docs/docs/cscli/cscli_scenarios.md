---
id: cscli_scenarios
title: cscli scenarios
---
## cscli scenarios

Install/Remove/Upgrade/Inspect scenario(s) from hub

### Examples

```
cscli scenarios list [-a]
cscli scenarios install crowdsecurity/ssh-bf
cscli scenarios inspect crowdsecurity/ssh-bf
cscli scenarios upgrade crowdsecurity/ssh-bf
cscli scenarios remove crowdsecurity/ssh-bf

```

### Options

```
  -h, --help   help for scenarios
```

### Options inherited from parent commands

```
  -c, --config string   path to crowdsec config file (default "/etc/crowdsec/config.yaml")
      --debug           Set logging to debug.
      --error           Set logging to error.
      --info            Set logging to info.
  -o, --output string   Output format : human, json, raw.
      --trace           Set logging to trace.
      --warning         Set logging to warning.
```

### SEE ALSO

* [cscli](/cscli/cscli.md)	 - cscli allows you to manage crowdsec
* [cscli scenarios inspect](/cscli/cscli_scenarios_inspect.md)	 - Inspect given scenario
* [cscli scenarios install](/cscli/cscli_scenarios_install)	 - Install given scenario(s.md)
* [cscli scenarios list](/cscli/cscli_scenarios_list)	 - List all scenario(s.md) or given one
* [cscli scenarios remove](/cscli/cscli_scenarios_remove)	 - Remove given scenario(s.md)
* [cscli scenarios upgrade](/cscli/cscli_scenarios_upgrade)	 - Upgrade given scenario(s.md)

