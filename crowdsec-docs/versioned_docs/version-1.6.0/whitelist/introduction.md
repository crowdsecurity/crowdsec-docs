---
id: intro
title: Introduction
sidebar_position: 1
---


Whitelists are special parsers that allow you to "discard" events, and can exist at two different steps :

 - *Parser whitelists* : Allows you to discard an event at parse time, so that it never hits the buckets.
    - Linux: `/etc/crowdsec/parsers/s02-enrich/`
    - Freebsd: `/usr/local/etc/crowdsec/parsers/s02-enrich/`
    - Windows: `c:/programdata/crowdsec/config/parsers/s02-enrich/`


 - *PostOverflow whitelists* : Those are whitelists that are checked *after* the overflow happens. It is usually best for whitelisting process that can be expensive (such as performing reverse DNS on an IP address, or performing a `whois` of an IP address).
    - Linux: `/etc/crowdsec/postoverflows/s01-whitelist/`
    - Freebsd: `/usr/local/etc/crowdsec/postoverflows/s01-whitelist/`
    - Windows: `c:/programdata/crowdsec/config/postoverflows/s01-whitelist/`

*Postoverflow whitelist folders do not exist by default so you **MUST** manually create them*

The whitelist can be based on several criteria:

 - specific IP address : if the event/overflow IP is the same, event is whitelisted
 - IP ranges : if the event/overflow IP address belongs to this range, event is whitelisted
 - a list of [expr](https://github.com/antonmedv/expr) expressions : if any expression returns true, event is whitelisted

:::info

While the whitelists are the same for parser or postoverflows, beware that field names might change.

Source ip is usually in `evt.Meta.source_ip` when it's a log, but `evt.Overflow.Alert.Source.IP` when it's an overflow

:::



