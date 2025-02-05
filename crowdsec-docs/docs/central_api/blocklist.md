---
id: community_blocklist
title: Community Blocklist
sidebar_position: 3
---

# Introduction

The "Community Blocklist" is a curated list of IP addresses identified as malicious by CrowdSec. CrowdSec proactively block the IP addresses of this blocklist, preventing malevolent IPs from reaching your systems.


# Community Blocklist Variation and Eligibility

The rules are different for free and paying users:
 - Free users that **do not regularly** contribute get the `Community Blocklist (Lite)`
 - Free users that **do regularly** contribute get access to the `Community Blocklist`
 - Paying users get access to the `Community Blocklist (Premium)`, even if they don't contribute

Regardless of the blocklist "tier" you have access to (`Lite`, `Community`, `Premium`), each Security Engine gets a tailored blocklist based on the kind of behavior you're trying to detect.

## Community Blocklist

Free users that are actively contributing to the network (sending signal on a regular basis) have their Security Engines automatically subscribed to the *Community Blocklist*.

The content of the blocklist is unique to each Security Engine, as it mirrors the behaviours they report. For example, suppose you're running the Security Engine on a web server with WordPress. In that case, you will receive IPs performing generic attacks against web servers *and* IPs engaging in wordpress-specific attacks.

The *Community Blocklist* contains 15 thousand malicious IP's based on your reported scenarios.

## Community Blocklist (Premium)

Paying users' Security Engine are automatically subscribed to the *Community Blocklist (Premium)*, which contains IPs that mirror their installed scenarios.
Paying users' do not need to contribute to the network to be eligible to the blocklist.

The *Community Blocklist (Premium)* blocklist content has no size limit, unlike free users.

## Community Blocklist (Lite)

Free users that are not actively contributing to the network or that have been flagged as cheating/abusing the system will receive the *Community Blocklist (Lite)*.

This Blocklist is capped at 3 thousand IPs.

## Why is my Security Engine on the Lite Blocklist?

This can vary from engine to engine, but the most common reasons are:

1. Your services are designed for self-hosting (videos, pictures, etc.) and are intended to be accessed only by a small group of people.

In this case, your services may not be well known to the internet at large, so you may see less malicious traffic than a more public service such as a blog or ecommerce site.

2. You already have a comprehensive security setup that reduces the need for the Community Blocklist. These measures can include:
    - Geoblocking (restricting access to specific countries or your country of origin)
    - IP whitelisting with a default deny-all policy
    - VPN-only access
    - Requiring authentication via an OAuth provider (e.g., Authentik, Authelia, Keycloak)

This simply a result of your security model and access requirements, its neither an issue with your setup nor a limitation on our end.

3. Your CrowdSec installation may not be configured to monitor all your services.

If you suspect this might be the case, refer to our [post-installation guide](/u/getting_started/next_steps) to ensure full coverage.
