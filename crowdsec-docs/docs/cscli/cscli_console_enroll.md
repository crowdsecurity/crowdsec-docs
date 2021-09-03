---
id: cscli_console_enroll
title: cscli console enroll
---
## cscli console enroll

Enroll this instance to https://app.crowdsec.net [requires local API]

### Synopsis


Enroll this instance to https://app.crowdsec.net
		
You can get your enrollment key by creating an account on https://app.crowdsec.net.
After running this command your will need to validate the enrollment in the webapp.

```
cscli console enroll [enroll-key] [flags]
```

### Examples

```
cscli console enroll YOUR-ENROLL-KEY
```

### Options

```
  -h, --help   help for enroll
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

* [cscli console](/cscli/cscli_console.md)	 - Manage interaction with Crowdsec console (https://app.crowdsec.net)

