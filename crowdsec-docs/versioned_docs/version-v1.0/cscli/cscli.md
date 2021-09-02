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

* [cscli alerts](/docs/v1.0/cscli/cscli_alerts)	 - Manage alerts
* [cscli bouncers](/docs/v1.0/cscli/cscli_bouncers)	 - Manage bouncers [requires local API]
* [cscli capi](/docs/v1.0/cscli/cscli_capi)	 - Manage interaction with Central API (CAPI)
* [cscli collections](/docs/v1.0/cscli/cscli_collections)	 - Manage collections from hub
* [cscli completion](/docs/v1.0/cscli/cscli_completion)	 - Generate completion script
* [cscli config](/docs/v1.0/cscli/cscli_config)	 - Allows to view current config
* [cscli console](/docs/v1.0/cscli/cscli_console)	 - Manage interaction with Crowdsec console (https://app.crowdsec.net)
* [cscli dashboard](/docs/v1.0/cscli/cscli_dashboard)	 - Manage your metabase dashboard container [requires local API]
* [cscli decisions](/docs/v1.0/cscli/cscli_decisions)	 - Manage decisions
* [cscli hub](/docs/v1.0/cscli/cscli_hub)	 - Manage Hub
* [cscli lapi](/docs/v1.0/cscli/cscli_lapi)	 - Manage interaction with Local API (LAPI)
* [cscli machines](/docs/v1.0/cscli/cscli_machines)	 - Manage local API machines [requires local API]
* [cscli metrics](/docs/v1.0/cscli/cscli_metrics)	 - Display crowdsec prometheus metrics.
* [cscli parsers](/docs/v1.0/cscli/cscli_parsers)	 - Install/Remove/Upgrade/Inspect parser(s) from hub
* [cscli postoverflows](/docs/v1.0/cscli/cscli_postoverflows)	 - Install/Remove/Upgrade/Inspect postoverflow(s) from hub
* [cscli scenarios](/docs/v1.0/cscli/cscli_scenarios)	 - Install/Remove/Upgrade/Inspect scenario(s) from hub
* [cscli simulation](/docs/v1.0/cscli/cscli_simulation)	 - Manage simulation status of scenarios
* [cscli version](/docs/v1.0/cscli/cscli_version)	 - Display version and exit.

