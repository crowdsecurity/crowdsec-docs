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
   - `name`: name of the scenario (see [hub.crowdsec.net](hub.crowdsec.net))
   - `label`, `description`: Human-friendly descriptions of said scenarios
 - `target_countries`: The top 10 reports repartition by country about the IP, as a percentage
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


## List of common behaviors

| Name | Label | Description | 
|------|-------|-------------|
| http:exploit | HTTP Exploit | IP has been reported for attempting to exploit a vulnerability in a web application. |
| sip:bruteforce | SIP Bruteforce | IP has been reported for performing a SIP (VOIP) brute force attack. |
| http:bruteforce | HTTP Bruteforce | IP has been reported for performing a HTTP brute force attack (either generic http probing or applicative related brute force). |
| pop3/imap:bruteforce | POP3/IMAP Bruteforce | IP has been reported for performing a POP3/IMAP brute force attack. |
| http:scan | HTTP Scan | IP has been reported for performing actions related to HTTP vulnerability scanning and discovery. |
| http:crawl | HTTP Crawl | IP has been reported for performing aggressive crawling of web applications. |
| tcp:scan | TCP Scan | IP has been reported for performing TCP port scanning. |
| database:bruteforce | Database Bruteforce | IP has been reported for performing brute force on databases. |
| ftp:bruteforce | FTP Bruteforce | IP has been reported for performing brute force on FTP services. |
| smb:bruteforce | SMB Bruteforce | IP has been reported for performing brute force on samba services. |
| ssh:bruteforce | SSH Bruteforce | IP has been reported for performing brute force on ssh services. |
| telnet:bruteforce | TELNET Bruteforce | IP has been reported for performing brute force on telnet services. |
| ldap:bruteforce | LDAP Bruteforce | IP has been reported for performing brute force on ldap services. |
| windows:bruteforce | SMB/RDP bruteforce | IP has been reported for performing brute force on Windows (samba, remote desktop) services. |
| vm-management:bruteforce | VM Management Bruteforce | IP has been reported for performing brute force on virtual environement management applications. |
| iot:bruteforce | IOT Bruteforce | IP has been reported for performing brute force on IOT management interfaces. |


## List of common classifications

