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

* [cscli](/docs/v1.0/cscli/)	 - cscli allows you to manage crowdsec
* [cscli scenarios inspect](/docs/v1.0/cscli/cscli_scenarios_inspect)	 - Inspect given scenario
* [cscli scenarios install](/docs/v1.0/cscli/cscli_scenarios_install)	 - Install given scenario(s)
* [cscli scenarios list](/docs/v1.0/cscli/cscli_scenarios_list)	 - List all scenario(s) or given one
* [cscli scenarios remove](/docs/v1.0/cscli/cscli_scenarios_remove)	 - Remove given scenario(s)
* [cscli scenarios upgrade](/docs/v1.0/cscli/cscli_scenarios_upgrade)	 - Upgrade given scenario(s)

