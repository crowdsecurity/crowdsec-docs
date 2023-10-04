---
id: cscli_hub
title: cscli hub
---
## cscli hub

Manage Hub

### Synopsis


Hub management

List/update parsers/scenarios/postoverflows/collections from [Crowdsec Hub](https://hub.crowdsec.net).
The Hub is managed by cscli, to get the latest hub files from [Crowdsec Hub](https://hub.crowdsec.net), you need to update.
		

### Examples

```

cscli hub list   # List all installed configurations
cscli hub update # Download list of available configurations from the hub
		
```

### Options

```
  -b, --branch string   Use given branch from hub
  -h, --help            help for hub
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
* [cscli hub list](/cscli/cscli_hub_list.md)	 - List installed configs
* [cscli hub update](/cscli/cscli_hub_update.md)	 - Fetch available configs from hub
* [cscli hub upgrade](/cscli/cscli_hub_upgrade.md)	 - Upgrade all configs installed from hub

