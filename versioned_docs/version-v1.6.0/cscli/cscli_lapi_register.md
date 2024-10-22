---
id: cscli_lapi_register
title: cscli lapi register
---
## cscli lapi register

Register a machine to Local API (LAPI)

### Synopsis

Register your machine to the Local API (LAPI).
Keep in mind the machine needs to be validated by an administrator on LAPI side to be effective.

```
cscli lapi register [flags]
```

### Options

```
  -f, --file string      output file destination
  -h, --help             help for register
      --machine string   Name of the machine to register with
  -u, --url string       URL of the API (ie. http://127.0.0.1)
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

* [cscli lapi](/cscli/cscli_lapi.md)	 - Manage interaction with Local API (LAPI)

