---
id: intro
title: CrowdSec Blocklists - Proactively defend your perimeter
sidebar_position: 2
---

CrowdSec's Blocklist regroup IPs and ranges that have been **validated** as performing **malicious behaviors** on **exposed endpoints**.   
Those blocklists are kept up to date and are currated to ensure they don't contain false positives.   
Their are meant to be directly actionable to protect your perimeter from thousands of known attackers.   
The unique nature of CrowdSec's network, by its diversity and size brings unmatched exclusivity and quality.   


This section will help you understand the nature of our different blocklists, how they work, and how you can use them to protect your systems.

## What are CrowdSec Blocklists?

Blocklists are lists of IP addresses that are known to be malicious. These lists are curated by CrowdSec and empower you to block malicious IP addresses from accessing your systems with zero false positives. We outlined in our [CrowdSec Data](https://www.crowdsec.net/our-data) page how we collect and curate these IP addresses to ensure that the data is fresh and free from false positives.

In most cases you will use these lists to block malicious IP addresses from accessing your systems. However, since it is a feed of IP addresses that are known to be malicious, you can also use it to enrich your SIEM, threat intelligence platform, or any other security tool that you use.

## How do CrowdSec Blocklists work?

CrowdSec Blocklists are updated in real time and are available in various formats. We provide Blocklists in different categories such as Industry, Technology (Wordpress, VPN / Proxy) and Threat Intelligence (Botnet, Malware, etc.).

### CrowdSec Blocklist Tiers

CrowdSec Blocklists are available in three tiers:

- Community:
    - Limited number of Blocklists (Third-party and Free).
    - You are limited to 3 Blocklists across [Integrations](integrations/intro.mdx) and [Security Engines](getting_started/introduction.md).
- Premium (Included in paid plans):
    - Includes free tier
    - Removes the limit on the number of Blocklists you can use.
    - Includes additional Blocklists that are not available in the Community tier (Premium Blocklists).
- Platinum (Additional paid tier):
    - Includes Premium tier
    - Includes additional Blocklists that are not available in the Premium tier (Platinum Blocklists).

> Question: Why is platinum tier an additional paid tier?

The Platinum tier offers additional Blocklists that are meticulously curated and tailored for specific purposes. The extra cost covers the curation and maintenance of these Blocklists, as we utilize AI and ML models to identify malicious IP addresses.

## Next Steps

Now that you have an understanding of what CrowdSec Blocklists are, you can proceed to the [Getting Started](getting_started.mdx) guide to learn how to start using Blocklists. If you are unsure where to start, feel free to browse our [main website for more information](https://www.crowdsec.net/).
