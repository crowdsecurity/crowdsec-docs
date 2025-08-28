---
id: cscli_collections_remove
title: cscli collections remove
---
Remove given collection(s)

### Synopsis

Remove one or more collections

```
cscli collections remove [item]... [flags]
```

### Examples

```
# Uninstall some collections.
cscli collections remove crowdsecurity/http-cve crowdsecurity/iptables

# Show the execution plan without changing anything - compact output sorted by type and name.
cscli collections remove crowdsecurity/http-cve crowdsecurity/iptables --dry-run

# Show the execution plan without changing anything - verbose output sorted by execution order.
cscli collections remove crowdsecurity/http-cve crowdsecurity/iptables --dry-run -o raw

# Uninstall and also remove the downloaded files.
cscli collections remove crowdsecurity/http-cve crowdsecurity/iptables --purge

# Remove tainted items.
cscli collections remove crowdsecurity/http-cve crowdsecurity/iptables --force

# Prompt for confirmation if running in an interactive terminal; otherwise, the option is ignored.
cscli collections remove crowdsecurity/http-cve crowdsecurity/iptables -i
cscli collections remove crowdsecurity/http-cve crowdsecurity/iptables --interactive
```

### Options

```
      --all           Remove all the collections
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

* [cscli collections](/cscli/cscli_collections.md)	 - Manage hub collections

