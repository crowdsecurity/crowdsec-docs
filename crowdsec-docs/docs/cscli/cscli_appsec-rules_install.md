---
id: cscli_appsec-rules_install
title: cscli appsec-rules install
---
Install given appsec-rule(s)

### Synopsis

Fetch and install one or more appsec-rules from the hub

```
cscli appsec-rules install [item]... [flags]
```

### Examples

```
# Install some appsec-rules.
cscli appsec-rules install crowdsecurity/crs

# Show the execution plan without changing anything - compact output sorted by type and name.
cscli appsec-rules install crowdsecurity/crs --dry-run

# Show the execution plan without changing anything - verbose output sorted by execution order.
cscli appsec-rules install crowdsecurity/crs --dry-run -o raw

# Download only, to be installed later.
cscli appsec-rules install crowdsecurity/crs --download-only

# Install over tainted items. Can be used to restore or repair after local modifications or missing dependencies.
cscli appsec-rules install crowdsecurity/crs --force

# Prompt for confirmation if running in an interactive terminal; otherwise, the option is ignored.
cscli appsec-rules install crowdsecurity/crs -i
cscli appsec-rules install crowdsecurity/crs --interactive
```

### Options

```
  -d, --download-only   Only download packages, don't enable
      --dry-run         Don't install or remove anything; print the execution plan
      --force           Force install: overwrite tainted and outdated files
  -h, --help            help for install
      --ignore          Ignore errors when installing multiple appsec-rules
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

* [cscli appsec-rules](/cscli/cscli_appsec-rules.md)	 - Manage hub appsec-rules

