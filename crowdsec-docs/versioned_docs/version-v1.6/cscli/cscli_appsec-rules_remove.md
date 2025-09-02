---
id: cscli_appsec-rules_remove
title: cscli appsec-rules remove
---
## cscli appsec-rules remove

Remove given appsec-rule(s)

### Synopsis

Remove one or more appsec-rules

```
cscli appsec-rules remove [item]... [flags]
```

### Examples

```
# Uninstall some appsec-rules.
cscli appsec-rules remove crowdsecurity/crs

# Show the execution plan without changing anything - compact output sorted by type and name.
cscli appsec-rules remove crowdsecurity/crs --dry-run

# Show the execution plan without changing anything - verbose output sorted by execution order.
cscli appsec-rules remove crowdsecurity/crs --dry-run -o raw

# Uninstall and also remove the downloaded files.
cscli appsec-rules remove crowdsecurity/crs --purge

# Remove tainted items.
cscli appsec-rules remove crowdsecurity/crs --force

# Prompt for confirmation if running in an interactive terminal; otherwise, the option is ignored.
cscli appsec-rules remove crowdsecurity/crs -i
cscli appsec-rules remove crowdsecurity/crs --interactive
```

### Options

```
      --all           Remove all the appsec-rules
      --dry-run       Don't install or remove anything; print the execution plan
      --force         Force remove: remove tainted and outdated files
  -h, --help          help for remove
  -i, --interactive   Ask for confirmation before proceeding
      --purge         Delete source file too
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

* [cscli appsec-rules](/cscli/cscli_appsec-rules.md)	 - Manage hub appsec-rules

