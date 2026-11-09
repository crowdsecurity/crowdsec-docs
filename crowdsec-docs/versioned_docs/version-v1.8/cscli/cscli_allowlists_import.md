---
id: cscli_allowlists_import
title: cscli allowlists import
---
## cscli allowlists import

Import values to an allowlist from a CSV file

### Synopsis

Import values to an allowlist from a CSV file.

The CSV file must have a header line with at least a 'value' column.
Optional columns: 'expiration' (duration like 1h, 1d), 'comment'.

```
cscli allowlists import [allowlist_name] -i <file> [flags]
```

### Examples

```
csv file:
value,expiration,comment
1.2.3.4,24h,my comment
2.3.4.5,,another comment
10.0.0.0/8,1d,

$ cscli allowlists import my_allowlist -i allowlist.csv

From standard input:

$ cat allowlist.csv | cscli allowlists import my_allowlist -i -
```

### Options

```
  -h, --help           help for import
  -i, --input string   Input file (use - for stdin)
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

* [cscli allowlists](/cscli/cscli_allowlists.md)	 - Manage centralized allowlists

