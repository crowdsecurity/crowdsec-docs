---
id: cscli_parsers_remove
title: cscli parsers remove
---
## cscli parsers remove

Remove given parser(s)

### Synopsis

Remove given parse(s) from hub

```
cscli parsers remove [config] [flags]
```

### Examples

```
cscli parsers remove crowdsec/xxx crowdsec/xyz
```

### Options

```
      --all     Delete all the parsers
      --force   Force remove : Remove tainted and outdated files
  -h, --help    help for remove
      --purge   Delete source file too
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

* [cscli parsers](/docs/v1.0/cscli/cscli_parsers)	 - Install/Remove/Upgrade/Inspect parser(s) from hub

