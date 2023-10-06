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
* [cscli postoverflows inspect](/docs/v1.0/cscli/cscli_postoverflows_inspect)	 - Inspect given postoverflow
* [cscli postoverflows install](/docs/v1.0/cscli/cscli_postoverflows_install)	 - Install given postoverflow(s)
* [cscli postoverflows list](/docs/v1.0/cscli/cscli_postoverflows_list)	 - List all postoverflows or given one
* [cscli postoverflows remove](/docs/v1.0/cscli/cscli_postoverflows_remove)	 - Remove given postoverflow(s)
* [cscli postoverflows upgrade](/docs/v1.0/cscli/cscli_postoverflows_upgrade)	 - Upgrade given postoverflow(s)

