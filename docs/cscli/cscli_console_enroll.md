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
		cscli console enroll --name [instance_name] YOUR-ENROLL-KEY
		cscli console enroll --name [instance_name] --tags [tag_1] --tags [tag_2] YOUR-ENROLL-KEY
		cscli console enroll --enable context,manual YOUR-ENROLL-KEY

		valid options are : custom,manual,tainted,context,console_management,all (see 'cscli console status' for details)
```

### Options

```
  -e, --enable strings   Enable console options
  -h, --help             help for enroll
  -n, --name string      Name to display in the console
      --overwrite        Force enroll the instance
  -t, --tags strings     Tags to display in the console
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

* [cscli console](/cscli/cscli_console.md)	 - Manage interaction with Crowdsec console (https://app.crowdsec.net)

