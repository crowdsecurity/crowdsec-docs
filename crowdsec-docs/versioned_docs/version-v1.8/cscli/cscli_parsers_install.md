---
id: cscli_parsers_install
title: cscli parsers install
---
## cscli parsers install

Install given parser(s)

### Synopsis

Fetch and install one or more parsers from the hub

```
cscli parsers install [item]... [flags]
```

### Examples

```
# Install some parsers.
cscli parsers install crowdsecurity/caddy-logs crowdsecurity/sshd-logs

# Show the execution plan without changing anything - compact output sorted by type and name.
cscli parsers install crowdsecurity/caddy-logs crowdsecurity/sshd-logs --dry-run

# Show the execution plan without changing anything - verbose output sorted by execution order.
cscli parsers install crowdsecurity/caddy-logs crowdsecurity/sshd-logs --dry-run -o raw

# Download only, to be installed later.
cscli parsers install crowdsecurity/caddy-logs crowdsecurity/sshd-logs --download-only

# Install over tainted items. Can be used to restore or repair after local modifications or missing dependencies.
cscli parsers install crowdsecurity/caddy-logs crowdsecurity/sshd-logs --force

# Prompt for confirmation if running in an interactive terminal; otherwise, the option is ignored.
cscli parsers install crowdsecurity/caddy-logs crowdsecurity/sshd-logs -i
cscli parsers install crowdsecurity/caddy-logs crowdsecurity/sshd-logs --interactive
```

### Options

```
  -d, --download-only   Only download packages, don't enable
      --dry-run         Don't install or remove anything; print the execution plan
      --force           Force install: overwrite tainted and outdated files
  -h, --help            help for install
      --ignore          Ignore errors when installing multiple parsers
  -i, --interactive     Ask for confirmation before proceeding
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

