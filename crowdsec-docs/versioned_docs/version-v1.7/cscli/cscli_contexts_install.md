---
id: cscli_contexts_install
title: cscli contexts install
---
Install given context(s)

### Synopsis

Fetch and install one or more contexts from the hub

```
cscli contexts install [item]... [flags]
```

### Examples

```
# Install some contexts.
cscli contexts install crowdsecurity/bf_base crowdsecurity/fortinet

# Show the execution plan without changing anything - compact output sorted by type and name.
cscli contexts install crowdsecurity/bf_base crowdsecurity/fortinet --dry-run

# Show the execution plan without changing anything - verbose output sorted by execution order.
cscli contexts install crowdsecurity/bf_base crowdsecurity/fortinet --dry-run -o raw

# Download only, to be installed later.
cscli contexts install crowdsecurity/bf_base crowdsecurity/fortinet --download-only

# Install over tainted items. Can be used to restore or repair after local modifications or missing dependencies.
cscli contexts install crowdsecurity/bf_base crowdsecurity/fortinet --force

# Prompt for confirmation if running in an interactive terminal; otherwise, the option is ignored.
cscli contexts install crowdsecurity/bf_base crowdsecurity/fortinet -i
cscli contexts install crowdsecurity/bf_base crowdsecurity/fortinet --interactive
```

### Options

```
  -d, --download-only   Only download packages, don't enable
      --dry-run         Don't install or remove anything; print the execution plan
      --force           Force install: overwrite tainted and outdated files
  -h, --help            help for install
      --ignore          Ignore errors when installing multiple contexts
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

* [cscli contexts](/cscli/cscli_contexts.md)	 - Manage hub contexts

