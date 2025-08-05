# CVE Explorer

The CVE Explorer is essentially a threat‑intelligence dashboard for CVEs. By combining CVE metadata with CrowdSec’s detection data, it lets users see which vulnerabilities attackers are actively exploiting, track emerging trends, examine exploitation timelines, and obtain actionable indicators (malicious IPs and Blocklists). Searching or filtering quickly narrows the list, while the detailed pages give insight into attack behavior and mitigation steps.


> **Try it now** → [https://app.crowdsec.net/cti/cve-explorer](https://app.crowdsec.net/cti/cve-explorer)

  <div align="center">
    <img src="/img/console/cti/cve-explorer/cve-home.png" alt="Screenshot — CVE Explorer home" width="70%" />
  </div>

---

## CVEs Exploration

### Search Bar
  <div align="center">
    <img src="/img/console/cti/cve-explorer/cve-search.png" alt="Screenshot — CVE Explorer search" width="50%" />
  </div>


At the top of the CVE Explorer sits a unified search field where you can instantly filter the entire CVE catalog by:

* **CVE ID** (e.g. `CVE-2021-44228`)
* **Product or Vendor** (e.g. Apache, Cisco)
* **Attack Type** (e.g. RCE, XSS)

Type your query, hit **Search**, and the list below updates in real-time.

---

### Quick-Filter Cards

  <div align="center">
    <img src="/img/console/cti/cve-explorer/cve-shortcuts.png" alt="Screenshot — CVE Explorer shortcuts" width="70%" />
  </div>

Directly under the search bar are three actionable buttons that sort all CVEs in the database:

1. **Trending CVEs**

   * Vulnerabilities with the fastest week-over-week growth in exploit detections.
2. **Recently Tracked CVEs**

   * Newly observed by CrowdSec for catching zero-day or freshly published ones.
3. **Most Exploited CVEs**

   * Ranked by total unique attacking IPs, showing the biggest exploits first.

---

### CVE Result List

  <div align="center">
    <img src="/img/console/cti/cve-explorer/cve-list-item.png" alt="Screenshot — CVE Explorer list" width="70%" />
  </div>


Beneath the filters, CVEs are presented as concise “cards” with these key data points:

* **Title & ID** (click anywhere on the card to drill down)
* **CrowdSec Score** (0–10 risk rating)
* **Sparkline** of exploit volume over the last 7 days
* **First Detection** date in CrowdSec’s network
* **# of Exploiting IPs** badge on the right
* **Product/Vendor** tags


## CVE Details Page


  <div align="center">
    <img src="/img/console/cti/cve-explorer/cve-details-head.png" alt="Screenshot — CVE Details" width="70%" />
  </div>

The header zone tells you, at a glance, how dangerous the vulnerability is for your stack:


* **CrowdSec Score** – CrowdSec proprietary risk rating (0-10)
* **CVSS Base Score** – industry-standard severity
* **Published / First Seen** – NVD publication date and the first time CrowdSec witnessed exploitation in the wild
* **Exploiting IPs** – unique IPs detected attacking with this CVE
* **Products / Vendors** – affected software stack

> **Pro tip:** The *CrowdSec score* represents the calculation of how dangerous a given vulnerability is based on the attacks seen by our network. It is designed to help defenders weigh how serious an alert from their security system should be treated and whether they should prioritize the vulnerability in patch management.
> The score is based on two key factors:
> - Attacker Focus
> - Vulnerability Trendiness  
>
> *Attacker Focus* scores the behaivor of the attackers that target this vulnerability. If the attackers consist mainly of automated bots that opportunistically scan the whole internet, the vulnerability gets a lower score as the attacks will be mostly noise. If a vulnerability sees mainly sophisticated targeted exploits it gets a high score, encouraging defenders to check the details of their alert to make sure its not part of a campaign against their perimeter. \
> *Vulnerability Trendiness* scores how the signals received by the CrowdSec network have evolved over time. Vulnerabilities that see high week-on-week growth in exploit volume are scored higher than ones where the exploit volume is on a decline. This score helps put vulnerabilities back into focus of defenders if some external factor (such as a related vulnerability) causes attacks to pick up.
> In addition to the two factors above, an additional flat bonus is given to recently published vulnerabilities to account for uncertainties and missing data.


---

### Key Information




  <div align="center">
    <img src="/img/console/cti/cve-explorer/cve-description.png" alt="Screenshot — CVE Description" width="70%" />
  </div>

* **NIST Description** – 
Standard CVE description originating from the NIST database.



* **CrowdSec Analysis** – 
The CrowdSec analysis is a threat-report written by security experts at CrowdSec.
It generally starts by identifying the CVE technical impact, then goes on to characterize attacker behavior (broad, automated scans), summarizes telemetry trends (steady, sustained exploitation), and can pinpointing specific attack vectors in use.


---

### Exploitation Timeline

Understand momentum at a glance.


  <div align="center">
    <img src="/img/console/cti/cve-explorer/cve-timeline.png" alt="Screenshot — CVE Timeline" width="70%" />
  </div>

*Interactive chart* displays exploit attempts per hour/day.

> **Pro tip:** Switch the drop-down (Last 24 h / 7 days / 30 days) to zoom in on surges.


Some CVEs can also display an **Event Log** records milestones:


  <div align="center">
    <img src="/img/console/cti/cve-explorer/cve-events.png" alt="Screenshot — CVE events" width="70%" />
  </div>

---

### Detected IPs

CrowdSec correlates every exploit hit with the attacking source.



  <div align="center">
    <img src="/img/console/cti/cve-explorer/cve-ips.png" alt="Screenshot — CVE Detected IPs" width="70%" />
  </div>

* **Classification** – Malicious / Suspicious / Benign
* **Country & ASN** – geolocation and network owner
* **Behaviours** – brute-force, aggressive crawling, etc.
* **Pivot** – click any IP to open its full CrowdSec **IP Report** (see the IP-level doc).

Need more? Click **“See more IPs”** to expand to the full list.

---

### Blocklist



  <div align="center">
    <img src="/img/console/cti/cve-explorer/cve-blocklist-modal.png" alt="Screenshot — CVE Blocklist wishlist" width="50%" />
  </div>

At the moment, per-CVE blocklists aren’t yet available. However, you can add any CVE to your Blocklist Wishlist.
Once CrowdSec generates and publishes the dedicated Blocklist for that vulnerability, you’ll automatically receive a notification and be able to install it. This way, you can queue up your highest-priority CVEs now and be ready to deploy protection the moment the feeds go live.



## Why This CVE Monitoring Matters

* **Instant prioritization**: See at a glance, the vulnerabilities most threatening to your perimeter.
* **Unified search**: No need to switch between NVD, vendor advisories or SIEM, logs—everything’s right here.
* **Trend visibility**: Sparkline + “Trending” filter lets you jump on surging exploits before they go mainstream.
* **Actionable**: Each detail page links directly IP details—so you can pivot from insight to action in few clicks.

With this dashboard as your starting point, you’ll always know *which* CVEs deserve your attention first, and have the tools to rapidly investigate and block the threats exploiting them.

> Ready to out-pace the exploiters? **Start exploring now** → [https://app.crowdsec.net/cti/cve-explorer](https://app.crowdsec.net/cti/cve-explorer)

*(Documentation last updated : 31 July 2025)*
