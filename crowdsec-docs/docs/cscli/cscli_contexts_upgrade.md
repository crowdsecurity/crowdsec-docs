---
id: cscli_contexts_upgrade
title: cscli contexts upgrade
---
Upgrade given context(s)

### Synopsis

Fetch and upgrade one or more contexts from the hub

```
cscli contexts upgrade [item]... [flags]
```

### Examples

```
# Upgrade some contexts. If they are not currently installed, they are downloaded but not installed.
cscli contexts upgrade crowdsecurity/bf_base crowdsecurity/fortinet

# Show the execution plan without changing anything - compact output sorted by type and name.
cscli contexts upgrade crowdsecurity/bf_base crowdsecurity/fortinet --dry-run

# Show the execution plan without changing anything - verbose output sorted by execution order.
cscli contexts upgrade crowdsecurity/bf_base crowdsecurity/fortinet --dry-run -o raw

# Upgrade over tainted items. Can be used to restore or repair after local modifications or missing dependencies.
cscli contexts upgrade crowdsecurity/bf_base crowdsecurity/fortinet --force

# Prompt for confirmation if running in an interactive terminal; otherwise, the option is ignored.
cscli contexts upgrade crowdsecurity/bf_base crowdsecurity/fortinet -i
cscli contexts upgrade crowdsecurity/bf_base crowdsecurity/fortinet --interactive
```

### Options

```
  -a, --all           Upgrade all the contexts
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

* [cscli contexts](/cscli/cscli_contexts.md)	 - Manage hub contexts

