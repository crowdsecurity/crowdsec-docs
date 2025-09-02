---
id: cscli_setup_unattended
title: cscli setup unattended
---
Unattended setup

### Synopsis

Automatically detect services and generate configuration

```
cscli setup unattended [flags]
```

### Examples

```
# Detect running services, install the appropriate collections and acquisition configuration.
# never prompt for confirmation. stop running if there are manually created acquisition files
cscli setup unattended

# write acquisition files to a specific directory
cscli setup unattended --acquis-dir /path/to/acquis.d

# use a different detection configuration file.
cscli setup unattended --detect-config /path/to/detact.yaml

CROWDSEC_SETUP_UNATTENDED_DISABLE
    If this variable is set to a non-empty value, unattended setup will be skipped.
    This can be useful with ansible or other automation tools.

```

### Options

```
      --detect-config string   path to service detection configuration, will use $CROWDSEC_SETUP_DETECT_CONFIG if defined (default "/var/lib/crowdsec/data/detect.yaml")
      --ignore strings         ignore a detected service (can be repeated)
      --force strings          force the detection of a service (can be repeated)
      --skip-systemd           don't use systemd, even if available
      --acquis-dir string      Directory for the acquisition configuration
      --dry-run                simulate the installation without making any changes
  -h, --help                   help for unattended
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

