---
id: cscli_scenarios_upgrade
title: cscli scenarios upgrade
---
## cscli scenarios upgrade

Upgrade given scenario(s)

### Synopsis

Fetch and upgrade one or more scenarios from the hub

```
cscli scenarios upgrade [item]... [flags]
```

### Examples

```
# Upgrade some scenarios. If they are not currently installed, they are downloaded but not installed.
cscli scenarios upgrade crowdsecurity/ssh-bf crowdsecurity/http-probing

# Show the execution plan without changing anything - compact output sorted by type and name.
cscli scenarios upgrade crowdsecurity/ssh-bf crowdsecurity/http-probing --dry-run

# Show the execution plan without changing anything - verbose output sorted by execution order.
cscli scenarios upgrade crowdsecurity/ssh-bf crowdsecurity/http-probing --dry-run -o raw

# Upgrade over tainted items. Can be used to restore or repair after local modifications or missing dependencies.
cscli scenarios upgrade crowdsecurity/ssh-bf crowdsecurity/http-probing --force

# Prompt for confirmation if running in an interactive terminal; otherwise, the option is ignored.
cscli scenarios upgrade crowdsecurity/ssh-bf crowdsecurity/http-probing -i
cscli scenarios upgrade crowdsecurity/ssh-bf crowdsecurity/http-probing --interactive
```

### Options

```
  -a, --all           Upgrade all the scenarios
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

* [cscli scenarios](/cscli/cscli_scenarios.md)	 - Manage hub scenarios

