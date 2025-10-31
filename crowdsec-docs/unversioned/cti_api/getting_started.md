---
id: getting_started
title: Getting Started
description: Get started with CrowdSec's Cyber Threat Intelligence (CTI) platform.
---

Welcome to **CrowdSec’s Cyber Threat Intelligence (CTI)**!   
This guide will help you navigate the **CTI Web UI** and make the most of its features, from searching for IP details to exploring real-time threat insights. Let’s get started!

> You can access CrowdSec's CTI via our **Web UI** on the [**CTI Home page** ↗️](https://app.crowdsec.net/cti)
> Or [Create a **CTI API key** and use our **CTI API**](/u/cti_api/api_getting_started)

## Features on the CTI Web UI

The **CTI home page** is designed to give you instant access to valuable **threat intelligence**. There’s what you’ll find:
<!-- Not using bullet points to avoid VS annoying auto table of content "fix" -->
[An IP or Query search bar](#search-bar)
[A shortcut to search your own IP](#check-your-own-ip)
[Predefined query to explore our CTI](#predefined-searches)
[A top 10 of the most agressive IPs](#top-10-most-aggressive-ips)

### Search Bar

A powerful search bar at the top of the page allows you to:

-   Search for any IP address to see detailed information about its activity, risk level, and geolocation. (Example: `192.168.0.0`)
-   Use Lucene queries for more advanced searches to filter data based on specific criteria, such as threat type or country. _Example queries:_
    -   `reputation:malicious`
    -   `behaviors.label:"HTTP Bruteforce" AND location.country:"FR"`

![CTI Search Bar](/img/console/cti/searchbar.png)

### Check Your Own IP

A dedicated button lets you check the details of your own IP address with one click.
When clicked, this feature automatically redirects you to your IP detail page.

![Search Check own IP button](/img/console/cti/searchbar_check_ip_button.png)

### Predefined Searches

To save time, the home page offers predefined searches showcasing typical use cases. These searches are built with Lucene queries and allow you to explore. Each predefined query is clickable, leading to a results page where you can further refine or explore the data.

![CTI Featured Searches](/img/console/cti/featured_searches.png)

### Top 10 Most Aggressive IPs

A dynamic leaderboard displays the top 10 most aggressive IPs observed by CrowdSec in the last 24 hours. Each entry includes:

-   The IP address.
-   The attack type (e.g., brute force, DDoS).
-   The geographical location of the IP.
-   The IP range
-   The AS
-   The background noise level (More info [here](https://doc.crowdsec.net/u/console/alerts/background_noise))

Clicking on an IP in the list takes you to its detail page, where you can explore its full profile.

![Top 10 IPs](/img/console/cti/top_ten_ips.png)

> Start exploring the CTI home page [here](https://app.crowdsec.net/cti) and discover the latest threat intelligence to protect your infrastructure.
