---
id: cscli_notifications
title: cscli notifications
---
## cscli notifications

Helper for notification plugin configuration

### Synopsis

To list/inspect/test notification template

### Options

```
  -h, --help   help for notifications
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
* [cscli notifications inspect](/cscli/cscli_notifications_inspect.md)	 - Inspect active notifications plugin configuration
* [cscli notifications list](/cscli/cscli_notifications_list.md)	 - list active notifications plugins
* [cscli notifications reinject](/cscli/cscli_notifications_reinject.md)	 - reinject an alert into profiles to trigger notifications
* [cscli notifications test](/cscli/cscli_notifications_test.md)	 - send a generic test alert to notification plugin

