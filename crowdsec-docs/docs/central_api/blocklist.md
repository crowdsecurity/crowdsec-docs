---
id: community_blocklist
title: Community Blocklist
sidebar_position: 3
---

# Introduction

The "Community Blocklist" is a curated list of IP addresses identified as malicious by CrowdSec. CrowdSec proactively block the IP addresses of this blocklist, preventing malevolent IPs from reaching your systems.


# Community Blocklist Variation and Eligibility

The rules are different for free and paying users:
 - Free users that **do not** contribute get the `Community Blocklist (Lite)`
 - Free users that **do** contribute get access to the `Community Blocklist`
 - Paying users get access to the `Community Blocklist (Premium)`, even if they don't contribute

Regardless of the blocklist "tier" you have access to (`Lite`, `Community`, `Premium`), each Security Engine gets a tailored blocklist based on the kind of behavior you're trying to detect.

# Community Blocklist

Free users that are actively contributing to the network (sending signal on a regular basis) have their Security Engines automatically subscribed to the *Community Blocklist*.

The content of the blocklist is unique to each Security Engine, as it mirrors the behaviours they report. For example, suppose you're running the Security Engine on a web server with WordPress. In that case, you will receive IPs performing generic attacks against web servers *and* IPs engaging in wordpress-specific attacks.

The *Community Blocklist* contains 15 thousand malicious IP's based on your reported scenarios.

# Community Blocklist (Premium)

Paying users' Security Engine are automatically subscribed to the *Community Blocklist (Premium)*, which contains IPs that mirror their installed scenarios.
Paying users' do not need to contribute to the network to be eligible to the blocklist.

The *Community Blocklist (Premium)* blocklist content has no size limit, unlike free users.

# Community Blocklist (Lite)

Free users that are not actively contributing to the network or that have been flagged as cheating/abusing the system will receive the *Community Blocklist (Lite)*.

This Blocklist is capped at 3 thousand IPs.
