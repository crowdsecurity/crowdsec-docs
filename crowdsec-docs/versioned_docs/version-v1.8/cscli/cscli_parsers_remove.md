---
id: cscli_parsers_remove
title: cscli parsers remove
---
## cscli parsers remove

Remove given parser(s)

### Synopsis

Remove one or more parsers

```
cscli parsers remove [item]... [flags]
```

### Examples

```
# Uninstall some parsers.
cscli parsers remove crowdsecurity/caddy-logs crowdsecurity/sshd-logs

# Show the execution plan without changing anything - compact output sorted by type and name.
cscli parsers remove crowdsecurity/caddy-logs crowdsecurity/sshd-logs --dry-run

# Show the execution plan without changing anything - verbose output sorted by execution order.
cscli parsers remove crowdsecurity/caddy-logs crowdsecurity/sshd-logs --dry-run -o raw

# Uninstall and also remove the downloaded files.
cscli parsers remove crowdsecurity/caddy-logs crowdsecurity/sshd-logs --purge

# Remove tainted items.
cscli parsers remove crowdsecurity/caddy-logs crowdsecurity/sshd-logs --force

# Prompt for confirmation if running in an interactive terminal; otherwise, the option is ignored.
cscli parsers remove crowdsecurity/caddy-logs crowdsecurity/sshd-logs -i
cscli parsers remove crowdsecurity/caddy-logs crowdsecurity/sshd-logs --interactive
```

### Options

```
      --all           Remove all the parsers
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

* [cscli parsers](/cscli/cscli_parsers.md)	 - Manage hub parsers

