---
id: cscli_parsers_upgrade
title: cscli parsers upgrade
---
Upgrade given parser(s)

### Synopsis

Fetch and upgrade one or more parsers from the hub

```
cscli parsers upgrade [item]... [flags]
```

### Examples

```
# Upgrade some parsers. If they are not currently installed, they are downloaded but not installed.
cscli parsers upgrade crowdsecurity/caddy-logs crowdsecurity/sshd-logs

# Show the execution plan without changing anything - compact output sorted by type and name.
cscli parsers upgrade crowdsecurity/caddy-logs crowdsecurity/sshd-logs --dry-run

# Show the execution plan without changing anything - verbose output sorted by execution order.
cscli parsers upgrade crowdsecurity/caddy-logs crowdsecurity/sshd-logs --dry-run -o raw

# Upgrade over tainted items. Can be used to restore or repair after local modifications or missing dependencies.
cscli parsers upgrade crowdsecurity/caddy-logs crowdsecurity/sshd-logs --force

# Prompt for confirmation if running in an interactive terminal; otherwise, the option is ignored.
cscli parsers upgrade crowdsecurity/caddy-logs crowdsecurity/sshd-logs -i
cscli parsers upgrade crowdsecurity/caddy-logs crowdsecurity/sshd-logs --interactive
```

### Options

```
  -a, --all           Upgrade all the parsers
      --dry-run       Don't install or remove anything; print the execution plan
      --force         Force upgrade: overwrite tainted and outdated files
  -h, --help          help for upgrade
  -i, --interactive   Ask for confirmation before proceeding
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

