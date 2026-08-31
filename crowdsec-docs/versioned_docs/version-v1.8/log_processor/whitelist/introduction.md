---
id: intro
title: Introduction
sidebar_position: 1
---

:::tip Recommended for IP/CIDR Allowlisting

For simple IP and CIDR-based allowlisting, we recommend using [**Centralized AllowLists**](/local_api/allowlists.md) instead of parser whitelists. AllowLists are easier to manage and also affect blocklist pulls. The parser whitelists documented below are best suited for complex expression-based rules that rely on log elements.

:::

Whitelists are special parsers that let you discard events. They can exist at different stages:

- *Parser whitelists*: Discard an event at parse time, so it never reaches buckets.
    - Linux: `/etc/crowdsec/parsers/s02-enrich/`
    - Freebsd: `/usr/local/etc/crowdsec/parsers/s02-enrich/`
    - Windows: `c:/programdata/crowdsec/config/parsers/s02-enrich/`

- *LAPI AllowLists*: Centralized at the LAPI level. They discard decisions and alerts while still generating log entries. They support IP/range (CIDR) rules. See [LAPI AllowLists](/local_api/allowlists.md).

- *PostOverflow whitelists*: Checked *after* overflow. Best for expensive checks (for example reverse DNS or `whois` lookups on IPs).
    - Linux: `/etc/crowdsec/postoverflows/s01-whitelist/`
    - Freebsd: `/usr/local/etc/crowdsec/postoverflows/s01-whitelist/`
    - Windows: `c:/programdata/crowdsec/config/postoverflows/s01-whitelist/`

*Postoverflow whitelist folders do not exist by default, so you **MUST** create them manually.*

Whitelists can be based on:

- Specific IP addresses: if the event/overflow IP matches, the event is whitelisted.
- IP ranges: if the event/overflow IP is in a range, the event is whitelisted.
- A list of [expr](https://github.com/antonmedv/expr) expressions: if any expression returns true, the event is whitelisted.

:::info

Parser and postoverflow whitelists use the same format, but field names can differ.

Source IP is usually `evt.Meta.source_ip` for logs, but `evt.Overflow.Alert.Source.IP` for overflows.

:::


