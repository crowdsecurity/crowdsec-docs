---
id: cscli_hubtest_run
title: cscli hubtest run
---
## cscli hubtest run

run [test_name]

```
cscli hubtest run [flags]
```

### Options

```
      --all        Run all tests
      --clean      Clean runtime environment if test fail
  -h, --help       help for run
      --no-clean   Don't clean runtime environment if test succeed
```

### Options inherited from parent commands

```
      --color string      Output color: yes, no, auto (default "auto")
  -c, --config string     path to crowdsec config file (default "/etc/crowdsec/config.yaml")
      --crowdsec string   Path to crowdsec (default "crowdsec")
      --cscli string      Path to cscli (default "cscli")
      --debug             Set logging to debug
      --error             Set logging to error
      --hub string        Path to hub folder (default ".")
      --info              Set logging to info
  -o, --output string     Output format: human, json, raw
      --trace             Set logging to trace
      --warning           Set logging to warning
```

### SEE ALSO

* [cscli hubtest](/cscli/cscli_hubtest.md)	 - Run functional tests on hub configurations

