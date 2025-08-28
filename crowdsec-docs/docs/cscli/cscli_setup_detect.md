---
id: cscli_setup_detect
title: cscli setup detect
---
Detect installed services and generate a setup file

### Synopsis

Detects the services installed on the machine and builds a specification
to be used with the "setup install-*" commands.

```
cscli setup detect [flags]
```

### Examples

```
# detect services and print the setup plan
cscli setup detect

# force yaml instead of json (easier to edit)
cscli setup detect --yaml

# detect and skip certain services
cscli setup detect --ignore whitelists

```

### Options

```
      --detect-config string      path to service detection configuration, will use $CROWDSEC_SETUP_DETECT_CONFIG if defined (default "/var/lib/crowdsec/data/detect.yaml")
      --ignore strings            ignore a detected service (can be repeated)
      --force strings             force the detection of a service (can be repeated)
      --skip-systemd              don't use systemd, even if available
      --yaml                      output yaml, not json
      --list-supported-services   do not detect; only print supported services
  -h, --help                      help for detect
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

