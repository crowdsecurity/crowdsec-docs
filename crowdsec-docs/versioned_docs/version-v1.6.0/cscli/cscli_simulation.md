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
* [cscli simulation disable](/cscli/cscli_simulation_disable.md)	 - Disable the simulation mode. Disable only specified scenarios
* [cscli simulation enable](/cscli/cscli_simulation_enable.md)	 - Enable the simulation, globally or on specified scenarios
* [cscli simulation status](/cscli/cscli_simulation_status.md)	 - Show simulation mode status

