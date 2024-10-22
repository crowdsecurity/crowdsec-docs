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
cscli explain --dsn "file://myfile.log" --type nginx
tail -n 5 myfile.log | cscli explain --type nginx -f -
		
```

### Options

```
      --crowdsec string           Path to crowdsec (default "crowdsec")
  -d, --dsn string                DSN to test
      --failures                  Only show failed lines
  -f, --file string               Log file to test
  -h, --help                      help for explain
      --labels string             Additional labels to add to the acquisition format (key:value,key2:value2)
  -l, --log string                Log line to test
      --no-clean                  Don't clean runtime environment after tests
      --only-successful-parsers   Only show successful parsers
  -t, --type string               Type of the acquisition to test
  -v, --verbose                   Display individual changes
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

