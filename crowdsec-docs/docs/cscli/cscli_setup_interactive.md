---
id: cscli_setup_interactive
title: cscli setup interactive
---
Interactive setup

### Synopsis

Detect services and generate configuration, with user prompts

```
cscli setup interactive [flags]
```

### Examples

```
# Detect running services, install the appropriate collections and acquisition configuration.
# prompt the user for confirmation at each step
cscli setup interactive

# write acquisition files to a specific directory
cscli setup interactive --acquis-dir /path/to/acquis.d

# use a different set of detection rules
cscli setup interactive --detect-config /path/to/detact.yaml

```

### Options

```
      --detect-config string   path to service detection configuration, will use $CROWDSEC_SETUP_DETECT_CONFIG if defined (default "/var/lib/crowdsec/data/detect.yaml")
      --ignore strings         ignore a detected service (can be repeated)
      --force strings          force the detection of a service (can be repeated)
      --skip-systemd           don't use systemd, even if available
      --acquis-dir string      Directory for the acquisition configuration
      --dry-run                simulate the installation without making any changes
  -h, --help                   help for interactive
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

* [cscli setup](/cscli/cscli_setup.md)	 - Tools to configure crowdsec

