---
id: centralized_allowlists
title: Allowlists
sidebar_position: 7
---

# Allowlists

LAPI supports simple allowlists (based on IP or range) and automatically applies them to:
 - Local alerts
 - Decisions pulled from CAPI (community blocklist, 3rd party blocklists, private blocklists)
 - Appsec

The allowlists have specific behaviors depending on where they are applied:
 - For local alerts, the alert will be dropped by LAPI, and the action will be logged.
 - For CAPI decisions (blocklists), decisions matching an allowlist will be removed before the insertion in the database
 - For the appsec, allowlists will be checked only if a rule has matched, the match will be logged, but no event or alert will be generated.

Allowlists are checked in real-time against the database when handling local alerts and blocklists.
In the case of the appsec, allowlists are refreshed every minute: this means it can take up to a minute for an allowlist to be effective for the appsec.


### Differences with existing allowlisting systems

#### `capi_whitelists_path`




## Configuration

:::info

If you are on a paid plan on the Crowdsec Console, you can configure allowlists directly from the console. Please refer to this [documentation](FIXME).

Allowlists managed through the console are *not* editable with `cscli`.

If a console allowlist has the same name as a local allowlist, the content will be replace with the one from the console.

Allowlists managed with `cscli` will not be shown in the console.

:::


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
