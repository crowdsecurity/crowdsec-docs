---
id: cscli_explain
title: cscli explain
---
## cscli explain

Explain log pipeline

### Synopsis


Explain log pipeline 
		

```
cscli explain [flags]
```

### Examples

```

cscli explain --file ./myfile.log --type nginx 
cscli explain --log "Sep 19 18:33:22 scw-d95986 sshd[24347]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=1.2.3.4" --type syslog
cscli explain -dsn "file://myfile.log" --type nginx

```

Hint: if your are creating/collecting data on the fly (over a network, for example) and want to avoid temporary files, you can use `cscli explain --file /dev/fd/0` or `cscli explain -dsn "file://dev/fd/0"` to refer to standard input.

### Options

```
  -d, --dsn string    DSN to test
  -f, --file string   Log file to test
  -h, --help          help for explain
  -l, --log string    Lgg line to test
  -t, --type string   Type of the acquisition to test
  -v, --verbose       Display individual changes
```

### Options inherited from parent commands

```
  -c, --config string   path to crowdsec config file (default "/etc/crowdsec/config.yaml")
      --debug           Set logging to debug.
      --error           Set logging to error.
      --info            Set logging to info.
  -o, --output string   Output format : human, json, raw.
      --trace           Set logging to trace.
      --warning         Set logging to warning.
```

### SEE ALSO

* [cscli](/cscli/cscli.md)	 - cscli allows you to manage crowdsec

