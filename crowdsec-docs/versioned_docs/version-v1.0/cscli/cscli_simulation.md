---
id: cscli_simulation
title: cscli simulation
---
## cscli simulation

Manage simulation status of scenarios

### Examples

```
cscli simulation status
cscli simulation enable crowdsecurity/ssh-bf
cscli simulation disable crowdsecurity/ssh-bf
```

### Options

```
  -h, --help   help for simulation
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
* [cscli simulation disable](/docs/v1.0/cscli/cscli_simulation_disable)	 - Disable the simulation mode. Disable only specified scenarios
* [cscli simulation enable](/docs/v1.0/cscli/cscli_simulation_enable)	 - Enable the simulation, globally or on specified scenarios
* [cscli simulation status](/docs/v1.0/cscli/cscli_simulation_status)	 - Show simulation mode status

