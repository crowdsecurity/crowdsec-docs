---
id: cscli_notifications_test
title: cscli notifications test
---
## cscli notifications test

send a generic test alert to notification plugin

### Synopsis

send a generic test alert to a notification plugin to test configuration even if is not active

```
cscli notifications test [plugin name] [flags]
```

### Examples

```
cscli notifications test [plugin_name]
```

### Options

```
  -a, --alert string   JSON string used to override alert fields in the generic alert (see crowdsec/pkg/models/alert.go in the source tree for the full definition of the object)
  -h, --help           help for test
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

