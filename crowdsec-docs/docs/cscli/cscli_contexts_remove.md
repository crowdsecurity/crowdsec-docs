---
id: cscli_contexts_remove
title: cscli contexts remove
---
Remove given context(s)

### Synopsis

Remove one or more contexts

```
cscli contexts remove [item]... [flags]
```

### Examples

```
# Uninstall some contexts.
cscli contexts remove crowdsecurity/bf_base crowdsecurity/fortinet

# Show the execution plan without changing anything - compact output sorted by type and name.
cscli contexts remove crowdsecurity/bf_base crowdsecurity/fortinet --dry-run

# Show the execution plan without changing anything - verbose output sorted by execution order.
cscli contexts remove crowdsecurity/bf_base crowdsecurity/fortinet --dry-run -o raw

# Uninstall and also remove the downloaded files.
cscli contexts remove crowdsecurity/bf_base crowdsecurity/fortinet --purge

# Remove tainted items.
cscli contexts remove crowdsecurity/bf_base crowdsecurity/fortinet --force

# Prompt for confirmation if running in an interactive terminal; otherwise, the option is ignored.
cscli contexts remove crowdsecurity/bf_base crowdsecurity/fortinet -i
cscli contexts remove crowdsecurity/bf_base crowdsecurity/fortinet --interactive
```

### Options

```
      --all           Remove all the contexts
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

* [cscli contexts](/cscli/cscli_contexts.md)	 - Manage hub contexts

