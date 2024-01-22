---
id: cscli_hubtest
title: cscli hubtest
---
## cscli hubtest

Run functional tests on hub configurations

### Synopsis

Run functional tests on hub configurations (parsers, scenarios, collections...)

### Options

```
      --appsec            Command relates to appsec tests
      --crowdsec string   Path to crowdsec (default "crowdsec")
      --cscli string      Path to cscli (default "cscli")
  -h, --help              help for hubtest
      --hub string        Path to hub folder (default ".")
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
* [cscli hubtest clean](/cscli/cscli_hubtest_clean.md)	 - clean [test_name]
* [cscli hubtest coverage](/cscli/cscli_hubtest_coverage.md)	 - coverage
* [cscli hubtest create](/cscli/cscli_hubtest_create.md)	 - create [test_name]
* [cscli hubtest eval](/cscli/cscli_hubtest_eval.md)	 - eval [test_name]
* [cscli hubtest explain](/cscli/cscli_hubtest_explain.md)	 - explain [test_name]
* [cscli hubtest info](/cscli/cscli_hubtest_info.md)	 - info [test_name]
* [cscli hubtest list](/cscli/cscli_hubtest_list.md)	 - list
* [cscli hubtest run](/cscli/cscli_hubtest_run.md)	 - run [test_name]

