---
id: cscli_postoverflows
title: cscli postoverflows
---
## cscli postoverflows

Install/Remove/Upgrade/Inspect postoverflow(s) from hub

### Examples

```
cscli postoverflows install crowdsecurity/cdn-whitelist
		cscli postoverflows inspect crowdsecurity/cdn-whitelist
		cscli postoverflows upgrade crowdsecurity/cdn-whitelist
		cscli postoverflows list
		cscli postoverflows remove crowdsecurity/cdn-whitelist
```

### Options

```
  -h, --help   help for postoverflows
```

### Options inherited from parent commands

```
      --color string    Output color: yes, no, auto. (default "auto")
  -c, --config string   path to crowdsec config file (default "/etc/crowdsec/config.yaml")
      --debug           Set logging to debug.
      --error           Set logging to error.
      --info            Set logging to info.
  -o, --output string   Output format: human, json, raw.
      --trace           Set logging to trace.
      --warning         Set logging to warning.
```

### SEE ALSO

* [cscli](/cscli/cscli.md)	 - cscli allows you to manage crowdsec
* [cscli postoverflows inspect](/cscli/cscli_postoverflows_inspect.md)	 - Inspect given postoverflow
* [cscli postoverflows install](/cscli/cscli_postoverflows_install.md)	 - Install given postoverflow(s)
* [cscli postoverflows list](/cscli/cscli_postoverflows_list.md)	 - List all postoverflows or given one
* [cscli postoverflows remove](/cscli/cscli_postoverflows_remove.md)	 - Remove given postoverflow(s)
* [cscli postoverflows upgrade](/cscli/cscli_postoverflows_upgrade.md)	 - Upgrade given postoverflow(s)

