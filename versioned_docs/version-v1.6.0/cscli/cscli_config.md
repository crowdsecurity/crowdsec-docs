---
id: cscli_config
title: cscli config
---
## cscli config

Allows to view current config

### Options

```
  -h, --help   help for config
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
* [cscli config backup](/cscli/cscli_config_backup.md)	 - Backup current config
* [cscli config feature-flags](/cscli/cscli_config_feature-flags.md)	 - Displays feature flag status
* [cscli config restore](/cscli/cscli_config_restore.md)	 - Restore config in backup "directory"
* [cscli config show](/cscli/cscli_config_show.md)	 - Displays current config
* [cscli config show-yaml](/cscli/cscli_config_show-yaml.md)	 - Displays merged config.yaml + config.yaml.local

