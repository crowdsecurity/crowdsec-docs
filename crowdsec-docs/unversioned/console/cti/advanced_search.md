---
title: Advanced Search
description: Learn how to use advanced search features in CrowdSec's Cyber Threat Intelligence (CTI) platform.
---

# Advanced Search

The **Advanced Search Page** in **CrowdSec CTI** allows you to dynamically and precisely explore CrowdSec’s threat intelligence database. You will be able to refine your searches, analyze specific IPs, and discover detailed information using **Lucene queries**.

![CTI Advanced Search](/img/console/cti/advanced_search/page.png)

> Example in the screenshot: [`classifications.classifications.name:"crowdsec:ai_vpn_proxy" AND (reputation:malicious OR reputation:suspicious)](<https://app.crowdsec.net/cti?q=classifications.classifications.name:%22crowdsec:ai_vpn_proxy%22+AND+(reputation:malicious+OR+reputation:suspicious)&page=1>)

## **Key Features**

#### 1. Faceted Search

On the left side of the page, you will find a **dynamic filter panel**. These filters adapt based on your search query. You will be able to:

-   Filter results by **reputation** (malicious, suspicious, safe, etc.).
-   Select specific **Autonomous Systems (AS)** to view IPs associated with particular providers or network operators.
-   Refine your results by **country**
-   And more metadata depending on your current search query (Behaviors, Classifications, etc.).

#### 2. Results in Card Format

The main section of the page displays results as individual cards. You will be able to see:

-   The **IP address**.
-   Its **status** (e.g., malicious, suspicious, safe).
-   Its **classifications** (e.g., brute force attacker, port scanner).
-   The **country** associated with the IP.
-   The last time the IP was **seen**.
-   Additional metadata to support your analysis.

#### 3. Real-Time Updates

As you adjust filters or modify your Lucene query, the results and facets dynamically update, providing a seamless and intuitive experience.

---

## **How to Use the Advanced Search**

1. **Perform a Lucene Query**  
   Enter a query in the search bar on the home page (e.g., [`reputation:malicious AND location.country:"FR"`](https://app.crowdsec.net/cti?q=reputation:malicious+AND+location.country:%22FR%22&page=1)) and press Enter.
   You can find more information about Lucene queries [here](https://docs.crowdsec.net/u/cti_api/search_queries/).

2. **Use Faceted Filters**  
   Once on the Advanced Search Page, apply filters via the left-hand panel to refine your results.

3. **Analyze Results**  
   Click on a card to view detailed information about a specific IP.

4. **Explore Future Features**  
   Be prepared to use your queries to create custom blocklists in upcoming versions.

---

This page enables you to leverage CrowdSec’s extensive database for tailored searches, offering real-time insights and control over your cybersecurity strategy.

> Start exploring the Advanced Search Page [here](https://app.crowdsec.net/cti?q=reputation:malicious+AND+location.country:%22FR%22).
