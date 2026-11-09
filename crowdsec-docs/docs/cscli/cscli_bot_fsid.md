---
id: cscli_bot_fsid
title: cscli bot fsid
---
## cscli bot fsid

Decode a fingerprint id (FSID) back into a fingerprint

### Synopsis

Decode the FSID a challenged browser reports and rebuild the fingerprint object
from it. Only what the FSID encodes can be recovered: bitmasks, screen geometry,
cpu/memory, language and timezone. The remaining signals were folded into
truncated hashes and are shown as such.

Use '-' to read the FSID from stdin. With -o json the reconstructed fingerprint
is printed instead of the summary.

```
cscli bot fsid <fsid> [flags]
```

### Examples

```
cscli bot fsid FS1_000000000000000000000_00000h1f2e_1920x1080c8m8b1000h-3ab1_f...
cscli bot fsid -o json FS1_...
echo 'FS1_...' | cscli bot fsid -
```

### Options

```
  -h, --help   help for fsid
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

