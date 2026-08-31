---
id: cscli_hub_search
title: cscli hub search
---
## cscli hub search

Search the local hub index by name and description

### Synopsis

Search the local hub index.
An item matches when its name or description contains all the given terms.

```
cscli hub search <term>... [flags]
```

### Examples

```
cscli hub search nginx
cscli hub search http cve
cscli hub search ssh --status installed
```

### Options

```
  -h, --help             help for search
      --status strings   Filter by status (installed, not-installed, up-to-date, outdated, tainted, local)
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

* [cscli hub](/cscli/cscli_hub.md)	 - Manage hub index

