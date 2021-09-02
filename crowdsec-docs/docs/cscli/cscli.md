---
id: cscli
title: cscli
---
## cscli

cscli allows you to manage crowdsec

### Synopsis

cscli is the main command to interact with your crowdsec service, scenarios & db.
It is meant to allow you to manage bans, parsers/scenarios/etc, api and generally manage you crowdsec setup.

### Options

```
  -c, --config string   path to crowdsec config file (default "/etc/crowdsec/config.yaml")
  -o, --output string   Output format : human, json, raw.
      --debug           Set logging to debug.
      --info            Set logging to info.
      --warning         Set logging to warning.
      --error           Set logging to error.
      --trace           Set logging to trace.
  -h, --help            help for cscli
```

### SEE ALSO

* [cscli alerts](/cscli/cscli_alerts.md)	 - Manage alerts
* [cscli bouncers](/cscli/cscli_bouncers.md)	 - Manage bouncers [requires local API]
* [cscli capi](/cscli/cscli_capi)	 - Manage interaction with Central API (CAPI.md)
* [cscli collections](/cscli/cscli_collections.md)	 - Manage collections from hub
* [cscli completion](/cscli/cscli_completion.md)	 - Generate completion script
* [cscli config](/cscli/cscli_config.md)	 - Allows to view current config
* [cscli console](/cscli/cscli_console)	 - Manage interaction with Crowdsec console (https://app.crowdsec.net.md)
* [cscli dashboard](/cscli/cscli_dashboard.md)	 - Manage your metabase dashboard container [requires local API]
* [cscli decisions](/cscli/cscli_decisions.md)	 - Manage decisions
* [cscli hub](/cscli/cscli_hub.md)	 - Manage Hub
* [cscli lapi](/cscli/cscli_lapi)	 - Manage interaction with Local API (LAPI.md)
* [cscli machines](/cscli/cscli_machines.md)	 - Manage local API machines [requires local API]
* [cscli metrics](/cscli/cscli_metrics.md)	 - Display crowdsec prometheus metrics.
* [cscli parsers](/cscli/cscli_parsers)	 - Install/Remove/Upgrade/Inspect parser(s.md) from hub
* [cscli postoverflows](/cscli/cscli_postoverflows)	 - Install/Remove/Upgrade/Inspect postoverflow(s.md) from hub
* [cscli scenarios](/cscli/cscli_scenarios)	 - Install/Remove/Upgrade/Inspect scenario(s.md) from hub
* [cscli simulation](/cscli/cscli_simulation.md)	 - Manage simulation status of scenarios
* [cscli version](/cscli/cscli_version.md)	 - Display version and exit.

