---
id: cscli_appsec-configs_upgrade
title: cscli appsec-configs upgrade
---
Upgrade given appsec-config(s)

### Synopsis

Fetch and upgrade one or more appsec-configs from the hub

```
cscli appsec-configs upgrade [item]... [flags]
```

### Examples

```
# Upgrade some appsec-configs. If they are not currently installed, they are downloaded but not installed.
cscli appsec-configs upgrade crowdsecurity/virtual-patching

# Show the execution plan without changing anything - compact output sorted by type and name.
cscli appsec-configs upgrade crowdsecurity/virtual-patching --dry-run

# Show the execution plan without changing anything - verbose output sorted by execution order.
cscli appsec-configs upgrade crowdsecurity/virtual-patching --dry-run -o raw

# Upgrade over tainted items. Can be used to restore or repair after local modifications or missing dependencies.
cscli appsec-configs upgrade crowdsecurity/virtual-patching --force

# Prompt for confirmation if running in an interactive terminal; otherwise, the option is ignored.
cscli appsec-configs upgrade crowdsecurity/virtual-patching -i
cscli appsec-configs upgrade crowdsecurity/virtual-patching --interactive
```

### Options

```
  -a, --all           Upgrade all the appsec-configs
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

* [cscli appsec-configs](/cscli/cscli_appsec-configs.md)	 - Manage hub appsec-configs

