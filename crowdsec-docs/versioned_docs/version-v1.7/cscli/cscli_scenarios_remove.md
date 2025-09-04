---
id: cscli_scenarios_remove
title: cscli scenarios remove
---
Remove given scenario(s)

### Synopsis

Remove one or more scenarios

```
cscli scenarios remove [item]... [flags]
```

### Examples

```
# Uninstall some scenarios.
cscli scenarios remove crowdsecurity/ssh-bf crowdsecurity/http-probing

# Show the execution plan without changing anything - compact output sorted by type and name.
cscli scenarios remove crowdsecurity/ssh-bf crowdsecurity/http-probing --dry-run

# Show the execution plan without changing anything - verbose output sorted by execution order.
cscli scenarios remove crowdsecurity/ssh-bf crowdsecurity/http-probing --dry-run -o raw

# Uninstall and also remove the downloaded files.
cscli scenarios remove crowdsecurity/ssh-bf crowdsecurity/http-probing --purge

# Remove tainted items.
cscli scenarios remove crowdsecurity/ssh-bf crowdsecurity/http-probing --force

# Prompt for confirmation if running in an interactive terminal; otherwise, the option is ignored.
cscli scenarios remove crowdsecurity/ssh-bf crowdsecurity/http-probing -i
cscli scenarios remove crowdsecurity/ssh-bf crowdsecurity/http-probing --interactive
```

### Options

```
      --all           Remove all the scenarios
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

* [cscli scenarios](/cscli/cscli_scenarios.md)	 - Manage hub scenarios

