---
id: cscli_hub
title: cscli hub
---
## cscli hub

Manage Hub

### Synopsis


Hub management

List/update parsers/scenarios/postoverflows/collections from [Crowdsec Hub](https://hub.crowdsec.net).
Hub is managed by cscli, to get latest hub files from [Crowdsec Hub](https://hub.crowdsec.net), you need to update.
		

### Examples

```

cscli hub list   # List all installed configurations
cscli hub update # Download list of available configurations from the hub
		
```

### Options

```
  -h, --help   help for hub
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
* [cscli hub list](/docs/v1.0/cscli/cscli_hub_list)	 - List installed configs
* [cscli hub update](/docs/v1.0/cscli/cscli_hub_update)	 - Fetch available configs from hub
* [cscli hub upgrade](/docs/v1.0/cscli/cscli_hub_upgrade)	 - Upgrade all configs installed from hub

