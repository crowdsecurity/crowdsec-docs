---
id: intro
title: Introduction
sidebar_position: 1
---


Whitelists are special parsers that allow you to "discard" events, and can exist at two different steps :

 - *Parser whitelists* : Allows you to discard an event at parse time, so that it never hits the buckets.
 - *PostOverflow whitelists* : Those are whitelists that are checked *after* the overflow happens. It is usually best for whitelisting process that can be expensive (such as performing reverse DNS on an IP, or performing a `whois` of an IP).

:::info

While the whitelists are the same for parser or postoverflows, beware that field names might change.

Source ip is usually in `evt.Meta.source_ip` when it's a log, but `evt.Overflow.Source_ip` when it's an overflow

:::

The whitelist can be based on several criteria :

 - specific ip address : if the event/overflow IP is the same, event is whitelisted
 - ip ranges : if the event/overflow IP belongs to this range, event is whitelisted
 - a list of [expr](https://github.com/antonmedv/expr) expressions : if any expression returns true, event is whitelisted



