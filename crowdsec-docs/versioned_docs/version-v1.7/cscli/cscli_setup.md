---
id: cscli_setup
title: cscli setup
---
## cscli setup

Tools to configure crowdsec

### Synopsis

Manage service detection and hub/acquisition configuration

```
cscli setup [flags]
```

### Examples

```
# Call one of detect, install-hub, etc.
cscli setup [command]
# With no explicit command, will run as "cscli setup interactive"
# and pass through any flags.

```

### Options

```
      --detect-config string   path to service detection configuration, will use $CROWDSEC_SETUP_DETECT_CONFIG if defined (default "/var/lib/crowdsec/data/detect.yaml")
      --ignore strings         ignore a detected service (can be repeated)
      --force strings          force the detection of a service (can be repeated)
      --skip-systemd           don't use systemd, even if available
      --acquis-dir string      Directory for the acquisition configuration
      --dry-run                simulate the installation without making any changes
  -h, --help                   help for setup
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

* [cscli](/cscli/cscli.md)	 - cscli allows you to manage crowdsec
* [cscli setup detect](/cscli/cscli_setup_detect.md)	 - Detect installed services and generate a setup file
* [cscli setup install-acquisition](/cscli/cscli_setup_install-acquisition.md)	 - Generate acquisition configuration from a setup file
* [cscli setup install-hub](/cscli/cscli_setup_install-hub.md)	 - Install recommended hub items from a setup file
* [cscli setup interactive](/cscli/cscli_setup_interactive.md)	 - Interactive setup
* [cscli setup unattended](/cscli/cscli_setup_unattended.md)	 - Unattended setup
* [cscli setup validate](/cscli/cscli_setup_validate.md)	 - Validate a setup file

