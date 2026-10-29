---
id: cscli_notifications_reinject
title: cscli notifications reinject
---
## cscli notifications reinject

reinject an alert into profiles to trigger notifications

### Synopsis

reinject an alert into profiles to be evaluated by the filter and sent to matched notifications plugins

```
cscli notifications reinject [flags]
```

### Examples

```

cscli notifications reinject <alert_id>
cscli notifications reinject <alert_id> -a '{"remediation": false,"scenario":"notification/test"}'
cscli notifications reinject <alert_id> -a '{"remediation": true,"scenario":"notification/test"}'

```

### Options

```
  -a, --alert string   JSON string used to override alert fields in the reinjected alert (see crowdsec/pkg/models/alert.go in the source tree for the full definition of the object)
  -h, --help           help for reinject
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

* [cscli notifications](/cscli/cscli_notifications.md)	 - Helper for notification plugin configuration

