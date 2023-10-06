---
id: cscli_dashboard
title: cscli dashboard
---
## cscli dashboard

Manage your metabase dashboard container [requires local API]

### Synopsis

Install/Start/Stop/Remove a metabase container exposing dashboard and metrics.
Note: This command requires database direct access, so is intended to be run on Local API/master.
		

### Examples

```

cscli dashboard setup
cscli dashboard start
cscli dashboard stop
cscli dashboard remove

```

### Options

```
  -h, --help   help for dashboard
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
* [cscli dashboard remove](/docs/v1.0/cscli/cscli_dashboard_remove)	 - removes the metabase container.
* [cscli dashboard setup](/docs/v1.0/cscli/cscli_dashboard_setup)	 - Setup a metabase container.
* [cscli dashboard start](/docs/v1.0/cscli/cscli_dashboard_start)	 - Start the metabase container.
* [cscli dashboard stop](/docs/v1.0/cscli/cscli_dashboard_stop)	 - Stops the metabase container.

