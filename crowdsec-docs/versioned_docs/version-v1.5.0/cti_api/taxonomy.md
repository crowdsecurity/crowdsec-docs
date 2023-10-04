---
id: taxonomy
title: Taxonomy
sidebar_position: 3
---
## Scoring



 - `scores`: Indicators of malevolence associated with an IP address, computed over several periods of time : 1 day, 1 week, 1 month and overall. For a given period, the indicator of malevolence is summarized under the `total` key with a value ranging from **0** (no reports) to **5** (high malevolence). This value is a summary based on 4 components (see below) also ranging from **0** (Not Applicable/ Missing) to **5** (High), comparing to all the the signals reported by the community.

| indicator | explaination |
|-----------|--------------|
|Aggressiveness | _What is the intensity of the attack?_ This component measures the number of attacks reported over a period of time. |
|Threat Level | _How serious is the type of threats reported?_ The category of attacks reported by the community defines the danger induced by the attacks. An IP known for crawling and scanning will have a lower threat level than an IP reported for brute-force and exploits. This score ranges from 1 (mainly crawling) to 5 (exploit). 0 is the default for unknown scenarios |
|Trust| _What is the level of confidence in the actors which reported the IP address?_ This component is based on the reputation (age, number of reports) and the diversity (number of IP ranges, AS Numbers) of all the actors reporting the IP. It ranges from **0** (low\_confidence) to **5** (high confidence). |
| Anomaly |  _What are the red flags associated with this IP address?_ It analyses the static description of the reported IP address and checks for red flags which can be linked to evidence of malicious activities |
| Total | Aggregation of 4 component calculated on threats reported by the community and described below. |


 - `ip_range_score`: Score of malevolence associated with an IP range, ranging from *0* (No IP reported) to *5* (massively reported). It is calculated based on the number of IPs belonging to this range that were reported by the community as malicious

 - `behaviors`: One or more attack categories and behaviors associated with the IP. The category names and the associated labels should be self-explanatory. For example, `sip:bruteforce` would refer to an IP performing brute force attacks on the SIP protocol, while `http:exploit` would refer to an IP attempting to exploit known vulnerabilities on HTTP services. [An exhaustive list](#list-of-common-behaviors) is availabe bellow.


## Fields Documentation

 - `state` : Only present for the "fire" route: `validated` means IP is currently part of community blocklist. `refused` means it was part of the community blocklist, but was manually purged (ie. false positive)
 - `expiration`: Only present for the "fire" route: Date at which the IP address expire from the community blocklist.
 - `ip_range_score`: the malevolence score of the IP range the IP belongs to. 0 is unknown, 1 is a couple of IP reported, 5 is the highest level for the most aggressive range. See "scoring" above
 - `ip_range`: the range to which the IP belongs
 - `ip`: the IP requested
 - `as_name`, `as_num`: The autonomous system name and number to which the IP belongs
 - `location` dictionary with the genreric localisation information:
   - `country`: the two letters country code of the IP following  ISO 3166 format, when available
   - `city`: the associated city name of the IP, when available
   - `latitude`, `longitude`: floating points coordinates of the IP, when available
 - `reverse_dns`: reverse DNS lookup of the IP, when available
 - `behaviors`: A list of the attack categories for which the IP was reported. Each list item contains :
   - `name`: category of the attack, often in the form "protocol-or-scope:attack_type". See "categories" for a non-exhaustive listing
   - `label`, `description`: Human-friendly description of the category
 - `history` :
    - `first_seen`: date of the first time this IP was reported. Please note that due to "progressive data degradation" this date might be later than the first time the IP was actually seen.
    - `last_seen`: date of the last time this IP was reported.
    - `full_age`: delta in days between first seen and today.
    - `days_age`: delta in days between first and last seen timestamps.
 - `classifications`:
   - `false_positive`: A list of false positives tags associated with the IP. Any IP with `known_false_positive` tags shouldn't be considered as malicious
   - `classifications`: A list of categories associated with the IP. Those data can be sourced from 3rd parties (i.e. tor exit nodes list). [An exhaustive list](#list-of-common-classifications) is available bellow,
 - `attack details`: A more exhaustive list of the scenarios for which a given IP was reported. Each entry contains the following information :
   - `name`: name of the scenario (see [hub.crowdsec.net](https://hub.crowdsec.net/))
   - `label`, `description`: Human-friendly descriptions of said scenarios
 - `target_countries`: The top 10 reports repartition by country about the IP, as a percentage
 - `background_noise_score`: Evaluate the noisiness of an IP address, from a scale of 0 (not noisy) to 10 (extremely noisy)
 - `scores`: Indicators of Malevolence computed on different time periods
    - `overall`: Malevolence score over the total period (3 months)
      - `total`: The aggregated malevolence score
      - `aggressiveness`: The score of the *aggressiveness* component (see above)
      - `threat`: The score of the *threat* component (see above)
      - `trust`: The score of the *trust* component (see above)
      - `anomaly`: The score of the *anomaly* component (see above)
    - `last_month`: Malevolence score over the last month
      - `total`: The aggregated malevolence score
      - `aggressiveness`: The score of the *aggressiveness* component (see above)
      - `threat`: The score of the *threat* component (see above)
      - `trust`: The score of the *trust* component (see above)
      - `anomaly`: The score of the *anomaly* component (see above)
    - `last_week`: Malevolence score over the last week
      - `total`: The aggregated malevolence score
      - `aggressiveness`: The score of the *aggressiveness* component (see above)
      - `threat`: The score of the *threat* component (see above)
      - `trust`: The score of the *trust* component (see above)
      - `anomaly`: The score of the *anomaly* component (see above)
    - `last_day`:  Malevolence score over the last day
      - `total`: The aggregated malevolence score
      - `aggressiveness`: The score of the *aggressiveness* component (see above)
      - `threat`: The score of the *threat* component (see above)
      - `trust`: The score of the *trust* component (see above)
      - `anomaly`: The score of the *anomaly* component (see above)
  - `references` : A more open data field used to track 3rd parties referencing this IP as well. A common usage would be public / external lists in which this IP is present.


## Behaviors

| Name | Label | Description | 
|------|-------|-------------|
| database:bruteforce | Database Bruteforce | IP has been reported for performing brute force on databases. |
| ftp:bruteforce | FTP Bruteforce | IP has been reported for performing brute force on FTP services. |
| generic:exploit | Exploitation attempt | IP has been reported trying to exploit known vulnerability/CVE on unspecified protocol. |
| http:bruteforce | HTTP Bruteforce | IP has been reported for performing a HTTP brute force attack (either generic http probing or applicative related brute force). |
| http:crawl | HTTP Crawl | IP has been reported for performing aggressive crawling of web applications. |
| http:exploit | HTTP Exploit | IP has been reported for attempting to exploit a vulnerability in a web application. |
| http:scan | HTTP Scan | IP has been reported for performing actions related to HTTP vulnerability scanning and discovery. |
| http:spam | Web form spam | IP has been reported trying to perform spam via web forms/forums. |
| iot:bruteforce | IOT Bruteforce | IP has been reported for performing brute force on IOT management interfaces. |
| ldap:bruteforce | LDAP Bruteforce | IP has been reported for performing brute force on ldap services. |
| pop3/imap:bruteforce | POP3/IMAP Bruteforce | IP has been reported for performing a POP3/IMAP brute force attack. |
| sip:bruteforce | SIP Bruteforce | IP has been reported for performing a SIP (VOIP) brute force attack. |
| smb:bruteforce | SMB Bruteforce | IP has been reported for performing brute force on samba services. |
| smtp:spam | SMTP spam | IP has been reported trying to perform spam SMTP service. |
| ssh:bruteforce | SSH Bruteforce | IP has been reported for performing brute force on ssh services. |
| tcp:scan | TCP Scan | IP has been reported for performing TCP port scanning. |
| telnet:bruteforce | TELNET Bruteforce | IP has been reported for performing brute force on telnet services. |
| vm-management:bruteforce | VM Management Bruteforce | IP has been reported for performing brute force on virtual environement management applications. |
| windows:bruteforce | SMB/RDP bruteforce | IP has been reported for performing brute force on Windows (samba, remote desktop) services. |

## False positives

| Name | Label | Description | 
|------|-------|-------------|
| cdn:cloudflare_exit_node | Cloudflare CDN | IP is a Cloudflare CDN exit IP and should not be flagged as a threat. |
| cdn:exit_node | CDN exit node | IP is a CDN exit IP and should not be flagged as a threat. |
| ip:private_range | Private IP address range | This IP address is in a private IP range |
| msp:scanner | Legitimate Scanner | IP belongs to a known 'legitimate' scanner (MSP) and should not be flagged as a threat. |
| seo:crawler | SEO crawler | IP belongs to a known SEO crawler and should not be flagged as a threat. |
| seo:duckduckbot | Duckduckbot SEO crawler | IP belongs to Duckduckbot SEO crawler and should not be flagged as a threat. |
| seo:pinterest | Pinterest crawler | IP belongs to Pinterest crawler and should not be flagged as a threat. |
| seo:crawler | SEO crawler | IP belongs to a known SEO crawler and should not be flagged as a threat. |

## Classifications

| Name | Label | Description | 
|------|-------|-------------|
| community-blocklist | CrowdSec Community Blocklist | IP belong to the CrowdSec Community Blocklist |
| profile:insecure_services | Dangerous Services Exposed | IP exposes dangerous services (vnc, telnet, rdp), possibly due to a misconfiguration or because it's a honeypot. |
| profile:many_services | Many Services Exposed | IP exposes many open port, possibly due to a misconfiguration or because it's a honeypot. |
| proxy:tor | TOR exit node | IP is being flagged as a TOR exit node. |
| proxy:vpn | VPN | IP exposes a VPN service or is being flagged as one. |
| range:data_center | Data Center | IP is known to be hosted in a data center. |
| scanner:alphastrike | Known Security Company | IP belongs to a company that scans internet : AlphaSrike. |
| scanner:binaryedge | Known Security Company | IP belongs to a company that scans internet : binaryedge. |
| scanner:censys | Known Security Company | IP belongs to a company that scans internet : Censys. |
| scanner:cert.ssi.gouv.fr | Known CERT | IP belongs to an entity that scans internet : cert.ssi.gouv.fr. |
| scanner:cisa.dhs.gov | Known CERT | IP belongs to an entity that scans internet : cisa.dhs.gov. |
| scanner:internet-census | Known Security Company | IP belongs to a company that scans internet : internet-census. |
| scanner:leakix | Known Security Company | IP belongs to a company that scans internet : leakix. |
| scanner:legit | Legit scanner | IP belongs to a company that scans internet |
| scanner:shadowserver.org | Known Security Company | IP belongs to an entity that scans internet : www.shadowserver.org. |
| scanner:shodan | Known Security Company | IP belongs to a company that scans internet : Shodan. |
| scanner:stretchoid | Known Security Company | IP belongs to an entity that scans internet : stretchoid. |
| profile:fake_rdns | Fake RDNS | IP is using a fake RDNS |
| profile:nxdomain | NXDOMAIN | RDNS doesn't exist |
| profile:router | Router | IP belongs to a router exping services on the internet |
| profile:proxy | Proxy | IP exposes services that are commonly used by proxies |
| profile:jupiter-vpn | JupiterVPN | IP belongs to a jupiter vpn |
| device:cyberoam | Cyberoam | IP belongs to a Cyberoam router |
| device:microtik | Mikrotik | IP belongs to a Mikrotik router |
| device:asuswrt | AsusWRT | IP belongs to a AsusWRT router |
| device:hikvision | Hikvision | IP belongs to a Hikvision camera |
| device:ipcam | IpCamera | IP belongs to a IP camera |
| profile:likely_botnet | Likely Botnet | IP is likely to belong to a botnet (based on behaviour and/or characteristics) |
