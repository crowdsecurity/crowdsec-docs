---
id: cscli_appsec-rules_upgrade
title: cscli appsec-rules upgrade
---
Upgrade given appsec-rule(s)

### Synopsis

Fetch and upgrade one or more appsec-rules from the hub

```
cscli appsec-rules upgrade [item]... [flags]
```

### Examples

```
# Upgrade some appsec-rules. If they are not currently installed, they are downloaded but not installed.
cscli appsec-rules upgrade crowdsecurity/crs

# Show the execution plan without changing anything - compact output sorted by type and name.
cscli appsec-rules upgrade crowdsecurity/crs --dry-run

# Show the execution plan without changing anything - verbose output sorted by execution order.
cscli appsec-rules upgrade crowdsecurity/crs --dry-run -o raw

# Upgrade over tainted items. Can be used to restore or repair after local modifications or missing dependencies.
cscli appsec-rules upgrade crowdsecurity/crs --force

# Prompt for confirmation if running in an interactive terminal; otherwise, the option is ignored.
cscli appsec-rules upgrade crowdsecurity/crs -i
cscli appsec-rules upgrade crowdsecurity/crs --interactive
```

### Options

```
  -a, --all           Upgrade all the appsec-rules
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

* [cscli appsec-rules](/cscli/cscli_appsec-rules.md)	 - Manage hub appsec-rules

