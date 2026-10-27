---
id: cscli_bot
title: cscli bot
---
## cscli bot

Inspect bot detection: known-bot matching and fingerprint ids

```
cscli bot <action> [flags]
```

### Options

```
  -h, --help   help for bot
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
* [cscli bot fsid](/cscli/cscli_bot_fsid.md)	 - Decode a fingerprint id (FSID) back into a fingerprint
* [cscli bot match](/cscli/cscli_bot_match.md)	 - Check if a request would be recognized as a known bot

