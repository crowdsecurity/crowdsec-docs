---
id: community_blocklist
title: Community Blocklist
sidebar_position: 3
---

# Introduction

The "Community Blocklist" is a curated list of IP addresses identified as malicious by CrowdSec. CrowdSec proactively block the IP addresses of this blocklist, preventing malevolent IPs from reaching their systems.


# Community Blocklist Variation and Eligibility

The rules are different for free and paying users:
 - Free users that **do** contribute get access to the `free blocklist`
 - Paying users get access to the `pro blocklist`, even if they don't contribute
 - Free users that **do not** contribute get the `degraded blocklist`

Regardless of the "tier" of blocklist you have access to (`degraded`, `free`, `pro`), each Security Engine gets a tailored blocklist based on the kind of signal they share with the network.

# Free Blocklist

Free users that are actively contributing to the network (sending signal on a regular basis) have their Security Engines automatically subscribed to the "free blocklist".

The content of the blocklist is unique to each Security Engine, as it mirrors the behaviours they report. For example, suppose you're running the Security Engine on a web server with WordPress. In that case, you will receive IPs performing generic attacks against web servers *and* IPs engaging in wordpress-specific attacks.

The `free` blocklist content is capped at 15 thousand IPs at once.

# Pro Blocklist

Paying users' blocklist contains IPs that mirror their installed scenarios, regardless of whether they report attacks for those.

The `pro` blocklist content has no size limit, unlike free users.

# Degraded Blocklist

Free users that are not actively contributing to the network or that have been flagged as cheating/abusing the system will receive a `degraded blocklist`. This Blocklist is capped at 3 thousand IPs.





