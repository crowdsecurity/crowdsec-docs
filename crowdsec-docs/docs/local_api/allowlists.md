---
id: centralized_allowlists
title: Allowlists
sidebar_position: 7
---

# AllowLists

The AllowLists feature in CrowdSec lets users manage IP-based allowlists at the LAPI level, affecting both local decisions and blocklist pulls. [Paying customers can also control AllowLists directly from the console for added convenience](/u/console/allowlists). This ensures greater flexibility in managing trusted IPs while maintaining CrowdSec’s robust security measures.


The AllowLists affect local decision and blocklist pulls in different ways:

| Area | Action | Real Time |
|-------|------|------| 
| Local alerts | Alert is dropped, action logged. | ✅ |
| Blocklists | IP is removed before database insertion | ✅ |
| WAF (AppSec) | Request not blocked, action logged. | Refreshed every minute |
| cscli | Decision is blocked unless special flag is provided | ✅ |


AllowLists are limited to IP/Range based rules. If you need rules that rely on log elements such as URL and so on, [Parser Whitelists](/log_processor/whitelist/introduction.md) or [Profile Rules](/local_api/profiles/format.md) might more relevant.


### Creating an allowlist

Allowlists creation is done with `cscli allowlists create`, for example: `cscli allowlists create my_allowlistd -d safe_ips`.

The `-d` parameter is mandatory, it's a description for the allowlist for future reference:
```bash
$ cscli allowlists create my_allowlist --description "test allowlist"
allowlist 'my_allowlist' created successfully
```

This command must be run on the LAPI.

### Adding entries to an allowlist

Adding new entries to an allowlist is done with `cscli allowlists add <allowlist_name> value_1 value_2 ...`.

The allowlist must exist.

By default, allowlist entries have no expiration, but you can specify one with the `-e` flag:

```bash
$ cscli allowlist add my_allowlist 1.2.3.4 -e 7d
added 1 values to allowlist my_allowlist
```

Values can be either IPs or ranges.

You can add an optional description for each entry with the `-d` flag:

```bash
$ cscli allowlists add my_allowlist 1.2.3.4 -e 7d -d "pentest IPs"
added 1 values to allowlist my_allowlist
```

You cannot add the same values twice to an allowlist: if you want to edit an entry, you'll need to remove it first then add it again.

This command must be run on the LAPI.


### Removing entries from an allowlist

Removing entries from an allowlist is done with `cscli allowlists remove <allowlist_name> value_1 value_2 ...`:
```bash
$ cscli allowlists remove my_allowlist 1.2.3.4
removed 1 values from allowlist my_allowlist
```

This command must be run on the LAPI.


### Viewing the content of an allowlist

Allowlists can be inspected with `cscli allowlists inspect <allowlist_name>`:

```bash
$ cscli allowlist inspect my_allowlist

──────────────────────────────────────────────
 Allowlist: my_allowlist                      
──────────────────────────────────────────────
 Name                my_allowlist             
 Description         test allowlist           
 Created at          2025-03-06T13:14:42.957Z 
 Updated at          2025-03-06T13:15:13.684Z 
 Managed by Console  no                       
──────────────────────────────────────────────

──────────────────────────────────────────────────────────────────────────────────
 Value    Comment              Expiration                Created at               
──────────────────────────────────────────────────────────────────────────────────
 1.2.3.4  example description  2025-03-13T13:15:05.046Z  2025-03-06T13:14:42.957Z 
 5.4.3.2                       never                     2025-03-06T13:14:42.957Z 
──────────────────────────────────────────────────────────────────────────────────
```

This command can be run on the LAPI or any log processor machine.

### Deleting an allowlist

Allowlists can be deleted with `cscli allowlists delete <allowlist_name>`:

```bash
$ cscli allowlists delete my_allowlist 
allowlist 'my_allowlist' deleted successfully
```

The allowlist and all of its content will be deleted.

This command must be run on the LAPI.
