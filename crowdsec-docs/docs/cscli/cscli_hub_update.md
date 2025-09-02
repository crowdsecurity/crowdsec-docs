---
id: cscli_hub_update
title: cscli hub update
---
Download the latest index (catalog of available configurations)

### Synopsis


Fetches the .index.json file from the hub, containing the list of available configs.


```
cscli hub update [flags]
```

### Examples

```
# Download the last version of the index file.
cscli hub update

# Download a 4x bigger version with all item contents (effectively pre-caching item downloads, but not data files).
cscli hub update --with-content
```

### Options

```
  -h, --help           help for update
      --with-content   Download index with embedded item content
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

