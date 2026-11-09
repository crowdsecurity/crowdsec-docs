---
id: cscli_bot_match
title: cscli bot match
---
## cscli bot match

Check if a request would be recognized as a known bot

### Synopsis

Run the MatchKnownBot() expr helper against the 'bots' data files declared by
the given appsec-configs (all installed ones by default). Reverse DNS is resolved at
runtime, so the result depends on what the local resolver answers.

```
cscli bot match [appsec-config]... [flags]
```

### Examples

```
cscli bot match --ip 66.249.66.1 --user-agent "Googlebot/2.1"
cscli bot match --ip 1.2.3.4 --path /robots.txt crowdsecurity/appsec-default
```

### Options

```
  -h, --help                help for match
      --ip string           Source IP address of the request
      --path string         URI path of the request
      --user-agent string   User-Agent header of the request
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

* [cscli bot](/cscli/cscli_bot.md)	 - Inspect bot detection: known-bot matching and fingerprint ids

