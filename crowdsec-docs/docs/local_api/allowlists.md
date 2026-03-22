---
id: centralized_allowlists
title: Allowlists
sidebar_position: 7
---

# AllowLists

The AllowLists feature in CrowdSec lets you manage IP-based allowlists at the LAPI level. It affects both local decisions and blocklist pulls, giving you more flexibility to trust specific IPs while keeping CrowdSec security controls in place.

:::tip CrowdSec Premium: Centralized Console Management

Premium users can manage AllowLists directly from the [CrowdSec Console](/u/console/allowlists), enabling centralized management across multiple Security Engines and Integrations. Console-managed allowlists require subscribing entities (Security Engines, Integrations, or Organizations) after creation.

:::


AllowLists affect local decisions and blocklist pulls in different ways:

| Area | Action | Real Time |
|-------|------|------| 
| Local alerts | Alert is dropped, action logged. | ✅ |
| Blocklists | IP is removed before database insertion | ✅ |
| WAF (AppSec) | Request not blocked, action logged. | Refreshed every minute |
| cscli | Decision is blocked unless special flag is provided | ✅ |


AllowLists are limited to IP/range-based rules. If you need rules based on log elements (such as URLs), [Parser Whitelists](/log_processor/whitelist/introduction.md) or [Profile Rules](/local_api/profiles/format.md) might be more relevant.


## Creating an allowlist

Create an allowlist with `cscli allowlists create`, for example: `cscli allowlists create my_allowlist -d safe_ips`.

The `-d` flag is mandatory. It sets a description for future reference:
```bash
$ cscli allowlists create my_allowlist --description "test allowlist"
allowlist 'my_allowlist' created successfully
```

This command must be run on the LAPI.

## Adding entries to an allowlist

Add entries with `cscli allowlists add <allowlist_name> value_1 value_2 ...`.

The allowlist must exist.

By default, allowlist entries have no expiration, but you can specify one with the `-e` flag:

```bash
$ cscli allowlists add my_allowlist 1.2.3.4 -e 7d
added 1 values to allowlist my_allowlist
```

Values can be IPs or ranges.

You can add an optional description for each entry with the `-d` flag:

```bash
$ cscli allowlists add my_allowlist 1.2.3.4 -e 7d -d "pentest IPs"
added 1 values to allowlist my_allowlist
```

You cannot add the same value twice to an allowlist. To edit an entry, remove it first, then add it again.

This command must be run on the LAPI.


## Removing entries from an allowlist

Remove entries with `cscli allowlists remove <allowlist_name> value_1 value_2 ...`:
```bash
$ cscli allowlists remove my_allowlist 1.2.3.4
removed 1 values from allowlist my_allowlist
```

This command must be run on the LAPI.


## Viewing the contents of an allowlist

Inspect an allowlist with `cscli allowlists inspect <allowlist_name>`:

```bash
$ cscli allowlists inspect my_allowlist

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

## Deleting an allowlist

Delete an allowlist with `cscli allowlists delete <allowlist_name>`:

```bash
$ cscli allowlists delete my_allowlist 
allowlist 'my_allowlist' deleted successfully
```

The allowlist and all of its content will be deleted.

This command must be run on the LAPI.
