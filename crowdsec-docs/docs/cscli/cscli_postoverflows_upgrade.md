---
id: cscli_postoverflows_upgrade
title: cscli postoverflows upgrade
---
## cscli postoverflows upgrade

Upgrade given postoverflow(s)

### Synopsis

Fetch and upgrade one or more postoverflows from the hub

```
cscli postoverflows upgrade [item]... [flags]
```

### Examples

```
# Upgrade some postoverflows. If they are not currently installed, they are downloaded but not installed.
cscli postoverflows upgrade crowdsecurity/cdn-whitelist crowdsecurity/rdnss

# Show the execution plan without changing anything - compact output sorted by type and name.
cscli postoverflows upgrade crowdsecurity/cdn-whitelist crowdsecurity/rdnss --dry-run

# Show the execution plan without changing anything - verbose output sorted by execution order.
cscli postoverflows upgrade crowdsecurity/cdn-whitelist crowdsecurity/rdnss --dry-run -o raw

# Upgrade over tainted items. Can be used to restore or repair after local modifications or missing dependencies.
cscli postoverflows upgrade crowdsecurity/cdn-whitelist crowdsecurity/rdnss --force

# Prompt for confirmation if running in an interactive terminal; otherwise, the option is ignored.
cscli postoverflows upgrade crowdsecurity/cdn-whitelist crowdsecurity/rdnss -i
cscli postoverflows upgrade crowdsecurity/cdn-whitelist crowdsecurity/rdnss --interactive
```

### Options

```
  -a, --all           Upgrade all the postoverflows
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

* [cscli postoverflows](/cscli/cscli_postoverflows.md)	 - Manage hub postoverflows

