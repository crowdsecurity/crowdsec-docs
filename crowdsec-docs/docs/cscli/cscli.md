---
id: cscli
title: cscli
---
cscli allows you to manage crowdsec

### Synopsis

cscli is the main command to interact with your crowdsec service, scenarios & db.
It is meant to allow you to manage bans, parsers/scenarios/etc, api and generally manage your crowdsec setup.

### Options

```
  -c, --config string   path to crowdsec config file (default "/etc/crowdsec/config.yaml")
  -o, --output string   Output format: human, json, raw
      --color string    Output color: yes, no, auto (default "auto")
      --debug           Set logging to debug
      --info            Set logging to info
      --warning         Set logging to warning
      --error           Set logging to error
      --trace           Set logging to trace
  -h, --help            help for cscli
```

### SEE ALSO

* [cscli alerts](/cscli/cscli_alerts.md)	 - Manage alerts
* [cscli allowlists](/cscli/cscli_allowlists.md)	 - Manage centralized allowlists
* [cscli appsec-configs](/cscli/cscli_appsec-configs.md)	 - Manage hub appsec-configs
* [cscli appsec-rules](/cscli/cscli_appsec-rules.md)	 - Manage hub appsec-rules
* [cscli bouncers](/cscli/cscli_bouncers.md)	 - Manage bouncers [requires local API]
* [cscli capi](/cscli/cscli_capi.md)	 - Manage interaction with Central API (CAPI)
* [cscli collections](/cscli/cscli_collections.md)	 - Manage hub collections
* [cscli completion](/cscli/cscli_completion.md)	 - Generate completion script
* [cscli config](/cscli/cscli_config.md)	 - Allows to view current config
* [cscli console](/cscli/cscli_console.md)	 - Manage interaction with Crowdsec console (https://app.crowdsec.net)
* [cscli contexts](/cscli/cscli_contexts.md)	 - Manage hub contexts
* [cscli decisions](/cscli/cscli_decisions.md)	 - Manage decisions
* [cscli explain](/cscli/cscli_explain.md)	 - Explain log pipeline
* [cscli hub](/cscli/cscli_hub.md)	 - Manage hub index
* [cscli hubtest](/cscli/cscli_hubtest.md)	 - Run functional tests on hub configurations
* [cscli lapi](/cscli/cscli_lapi.md)	 - Manage interaction with Local API (LAPI)
* [cscli machines](/cscli/cscli_machines.md)	 - Manage local API machines [requires local API]
* [cscli metrics](/cscli/cscli_metrics.md)	 - Display crowdsec prometheus metrics.
* [cscli notifications](/cscli/cscli_notifications.md)	 - Helper for notification plugin configuration
* [cscli papi](/cscli/cscli_papi.md)	 - Manage interaction with Polling API (PAPI)
* [cscli parsers](/cscli/cscli_parsers.md)	 - Manage hub parsers
* [cscli postoverflows](/cscli/cscli_postoverflows.md)	 - Manage hub postoverflows
* [cscli scenarios](/cscli/cscli_scenarios.md)	 - Manage hub scenarios
* [cscli setup](/cscli/cscli_setup.md)	 - Tools to configure crowdsec
* [cscli simulation](/cscli/cscli_simulation.md)	 - Manage simulation status of scenarios
* [cscli support](/cscli/cscli_support.md)	 - Provide commands to help during support
* [cscli version](/cscli/cscli_version.md)	 - Display version

