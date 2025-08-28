---
id: cscli_collections_install
title: cscli collections install
---
Install given collection(s)

### Synopsis

Fetch and install one or more collections from the hub

```
cscli collections install [item]... [flags]
```

### Examples

```
# Install some collections.
cscli collections install crowdsecurity/http-cve crowdsecurity/iptables

# Show the execution plan without changing anything - compact output sorted by type and name.
cscli collections install crowdsecurity/http-cve crowdsecurity/iptables --dry-run

# Show the execution plan without changing anything - verbose output sorted by execution order.
cscli collections install crowdsecurity/http-cve crowdsecurity/iptables --dry-run -o raw

# Download only, to be installed later.
cscli collections install crowdsecurity/http-cve crowdsecurity/iptables --download-only

# Install over tainted items. Can be used to restore or repair after local modifications or missing dependencies.
cscli collections install crowdsecurity/http-cve crowdsecurity/iptables --force

# Prompt for confirmation if running in an interactive terminal; otherwise, the option is ignored.
cscli collections install crowdsecurity/http-cve crowdsecurity/iptables -i
cscli collections install crowdsecurity/http-cve crowdsecurity/iptables --interactive
```

### Options

```
  -d, --download-only   Only download packages, don't enable
      --dry-run         Don't install or remove anything; print the execution plan
      --force           Force install: overwrite tainted and outdated files
  -h, --help            help for install
      --ignore          Ignore errors when installing multiple collections
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

* [cscli collections](/cscli/cscli_collections.md)	 - Manage hub collections

