---
id: cscli_postoverflows_remove
title: cscli postoverflows remove
---
Remove given postoverflow(s)

### Synopsis

Remove one or more postoverflows

```
cscli postoverflows remove [item]... [flags]
```

### Examples

```
# Uninstall some postoverflows.
cscli postoverflows remove crowdsecurity/cdn-whitelist crowdsecurity/rdns

# Show the execution plan without changing anything - compact output sorted by type and name.
cscli postoverflows remove crowdsecurity/cdn-whitelist crowdsecurity/rdns --dry-run

# Show the execution plan without changing anything - verbose output sorted by execution order.
cscli postoverflows remove crowdsecurity/cdn-whitelist crowdsecurity/rdns --dry-run -o raw

# Uninstall and also remove the downloaded files.
cscli postoverflows remove crowdsecurity/cdn-whitelist crowdsecurity/rdns --purge

# Remove tainted items.
cscli postoverflows remove crowdsecurity/cdn-whitelist crowdsecurity/rdns --force

# Prompt for confirmation if running in an interactive terminal; otherwise, the option is ignored.
cscli postoverflows remove crowdsecurity/cdn-whitelist crowdsecurity/rdns -i
cscli postoverflows remove crowdsecurity/cdn-whitelist crowdsecurity/rdns --interactive
```

### Options

```
      --all           Remove all the postoverflows
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

* [cscli postoverflows](/cscli/cscli_postoverflows.md)	 - Manage hub postoverflows

