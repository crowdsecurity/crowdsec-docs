---
id: cscli_collections_upgrade
title: cscli collections upgrade
---
Upgrade given collection(s)

### Synopsis

Fetch and upgrade one or more collections from the hub

```
cscli collections upgrade [item]... [flags]
```

### Examples

```
# Upgrade some collections. If they are not currently installed, they are downloaded but not installed.
cscli collections upgrade crowdsecurity/http-cve crowdsecurity/iptables

# Show the execution plan without changing anything - compact output sorted by type and name.
cscli collections upgrade crowdsecurity/http-cve crowdsecurity/iptables --dry-run

# Show the execution plan without changing anything - verbose output sorted by execution order.
cscli collections upgrade crowdsecurity/http-cve crowdsecurity/iptables --dry-run -o raw

# Upgrade over tainted items. Can be used to restore or repair after local modifications or missing dependencies.
cscli collections upgrade crowdsecurity/http-cve crowdsecurity/iptables --force

# Prompt for confirmation if running in an interactive terminal; otherwise, the option is ignored.
cscli collections upgrade crowdsecurity/http-cve crowdsecurity/iptables -i
cscli collections upgrade crowdsecurity/http-cve crowdsecurity/iptables --interactive
```

### Options

```
  -a, --all           Upgrade all the collections
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

* [cscli collections](/cscli/cscli_collections.md)	 - Manage hub collections

